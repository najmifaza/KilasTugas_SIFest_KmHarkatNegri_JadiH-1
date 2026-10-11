from fastapi import APIRouter, HTTPException
from config.db import get_db
from config.ai import ai_client, AI_MODEL
from models.schemas import TaskCreate, TaskOut, TaskPatch, SyncBatchRequest, MutationItem
from datetime import datetime
import json
import logging
import uuid

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["tasks"])

@router.post("/tasks", status_code=201)
async def create_task(body: TaskCreate):
    tid = str(uuid.uuid4())
    async with get_db() as db:
        # Guarantee session exists to prevent foreign key error
        await db.execute(
            """INSERT IGNORE INTO sessions (id, user_agent) VALUES (%s, %s)""",
            (body.session_id, "Guest Auto-Init"),
        )
        await db.execute(
            """INSERT INTO tasks (id, session_id, title, description, subject, category, deadline)
               VALUES (%s, %s, %s, %s, %s, %s, %s)""",
            (tid, body.session_id, body.title, body.description,
             body.subject, body.category, body.deadline),
        )
    return {"success": True, "task_id": tid}

@router.get("/tasks/{session_id}")
async def get_tasks(session_id: str):
    async with get_db() as db:
        await db.execute(
            """SELECT t.id, t.title, t.subject, t.deadline, t.is_completed,
                      COUNT(s.id) AS subtasks_total,
                      SUM(s.is_completed) AS subtasks_done
               FROM tasks t
               LEFT JOIN subtasks s ON s.task_id = t.id
               WHERE t.session_id = %s
               GROUP BY t.id
               ORDER BY t.deadline ASC""",
            (session_id,),
        )
        rows = await db.fetchall()

    result = []
    for r in rows:
        total = r["subtasks_total"] or 0
        done = int(r["subtasks_done"] or 0)
        pct = int((done / total * 100)) if total else 0
        is_done = bool(r["is_completed"]) or (total > 0 and done == total)
        result.append({
            "id": r["id"],
            "title": r["title"],
            "subject": r["subject"],
            "deadline": r["deadline"],
            "is_completed": is_done,
            "progress_percent": pct,
            "subtasks_total": total,
            "subtasks_done": done,
        })
    return {"success": True, "data": result}

@router.patch("/tasks/{task_id}")
async def patch_task(task_id: str, body: TaskPatch):
    fields = []
    values = []
    if body.title is not None:
        fields.append("title = %s")
        values.append(body.title)
    if body.description is not None:
        fields.append("description = %s")
        values.append(body.description)
    if body.subject is not None:
        fields.append("subject = %s")
        values.append(body.subject)
    if body.category is not None:
        fields.append("category = %s")
        values.append(body.category)
    if body.deadline is not None:
        fields.append("deadline = %s")
        values.append(body.deadline)
    if body.is_completed is not None:
        fields.append("is_completed = %s")
        values.append(body.is_completed)

    if not fields:
        return {"success": True, "message": "Tidak ada kolom yang diubah"}

    values.append(task_id)
    async with get_db() as db:
        await db.execute(
            f"UPDATE tasks SET {', '.join(fields)} WHERE id = %s",
            tuple(values),
        )
        await db.execute(
            """SELECT t.id, t.session_id, t.title, t.description, t.subject, t.category,
                      t.deadline, t.is_completed, t.progress_percent,
                      COUNT(s.id) as subtasks_total,
                      SUM(CASE WHEN s.is_completed THEN 1 ELSE 0 END) as subtasks_done
               FROM tasks t
               LEFT JOIN subtasks s ON t.id = s.task_id
               WHERE t.id = %s
               GROUP BY t.id""",
            (task_id,),
        )
        task = await db.fetchone()
        if not task:
            raise HTTPException(status_code=404, detail="Task tidak ditemukan")

    return {"success": True, "data": task}

@router.delete("/tasks/{task_id}")
async def delete_task(task_id: str):
    async with get_db() as db:
        await db.execute("DELETE FROM tasks WHERE id = %s", (task_id,))
    return {"success": True}

@router.post("/tasks/{task_id}/rebalance")
async def rebalance_task_pacing(task_id: str):
    async with get_db() as db:
        await db.execute(
            "SELECT id, title, deadline, is_completed FROM tasks WHERE id = %s",
            (task_id,),
        )
        task = await db.fetchone()
        if not task:
            raise HTTPException(status_code=404, detail="Tugas tidak ditemukan")

        # Ambil seluruh sub-tugas terurut
        await db.execute(
            """SELECT id, step_number, title, duration_minutes, target_date, is_completed
               FROM subtasks WHERE task_id = %s
               ORDER BY step_number ASC""",
            (task_id,),
        )
        all_subtasks = await db.fetchall()

        uncompleted = [s for s in all_subtasks if not s["is_completed"]]
        if not uncompleted:
            return {
                "success": True,
                "message": "Semua sub-tugas sudah selesai, tidak perlu rebalancing",
                "rebalanced_count": 0,
                "data": all_subtasks,
            }

        now_naive = datetime.now()
        deadline = task["deadline"]
        deadline_naive = deadline.replace(tzinfo=None) if hasattr(deadline, "tzinfo") and deadline.tzinfo else deadline

        days_left = max((deadline_naive.date() - now_naive.date()).days, 0)
        num_uncompleted = len(uncompleted)

        # Hitung sisa menit riil menuju deadline
        seconds_left = (deadline_naive - now_naive).total_seconds()
        minutes_left = int(seconds_left / 60)
        total_current_duration = sum(int(st.get("duration_minutes") or 25) for st in uncompleted)

        # Kompresi durasi adaptif jika deadline mepet (sisa menit < total durasi langkah tersisa)
        should_compress = (minutes_left > 0 and minutes_left < total_current_duration) or (minutes_left <= 0)

        # Re-scoping tugas jika deadline mepet (Emergency Micro-Pacing)
        rescoped_map = {}
        if should_compress and num_uncompleted > 0:
            # 1. Coba AI Re-scoping
            try:
                ai_prompt = f"""Kamu adalah perencana tugas darurat mahasiswa KilasTugas.
Tugas: '{task['title']}'
Tenggat waktu sangat mepet: tersisa {max(1, minutes_left)} menit!
Ada {num_uncompleted} sub-tugas yang belum selesai:
"""
                for s in uncompleted:
                    ai_prompt += f"- ID: {s['id']} | Judul Lama: {s['title']}\n"

                ai_prompt += f"""
Rombak dan sederhanakan {num_uncompleted} langkah kerja di atas agar fokus pada 'Minimum Viable Submission' yang realistis dituntaskan dalam sisa waktu {max(1, minutes_left)} menit (pangkas yang tidak perlu, prioritaskan poin penilaian inti, langkah terakhir wajib untuk submit).
Format HANYA JSON array:
[
  {{"id": "ID subtask sama persis", "title": "[Sprint Kilat / Fokus Inti / Submit] Judul aksi konkret (max 60 karakter)", "description": "Arahan aksi darurat 1 kalimat"}}
]"""

                response = await ai_client.chat.completions.create(
                    model=AI_MODEL,
                    messages=[
                        {"role": "system", "content": "Kamu adalah asisten dekomposisi tugas darurat. Keluarkan HANYA JSON array murni."},
                        {"role": "user", "content": ai_prompt},
                    ],
                    temperature=0.2,
                    max_tokens=600,
                )
                raw = (response.choices[0].message.content or "").strip()
                if "```" in raw:
                    parts = raw.split("```")
                    raw = parts[1]
                    if raw.startswith("json"):
                        raw = raw[4:]
                raw = raw.strip()
                parsed = json.loads(raw)
                if isinstance(parsed, list):
                    for item in parsed:
                        if isinstance(item, dict) and "id" in item and "title" in item:
                            rescoped_map[item["id"]] = {
                                "title": str(item["title"])[:250],
                                "description": str(item.get("description") or ""),
                            }
            except Exception as e:
                logger.warning(f"AI task re-scoping fallback to heuristics: {e}")

            # 2. Heuristik fallback jika AI tidak merespon / gagal
            if not rescoped_map:
                for idx, s in enumerate(uncompleted):
                    orig_t = s["title"]
                    clean_t = orig_t.split("] ", 1)[-1] if orig_t.startswith("[") else orig_t
                    if idx == num_uncompleted - 1:
                        new_t = f"[Finalisasi & Submit] {clean_t}"
                        desc = "Rapikan format berkas esensial dan kumpulkan sebelum batas waktu."
                    elif idx == 0:
                        new_t = f"[Fokus Inti] {clean_t}"
                        desc = "Prioritaskan poin penilaian paling berbobot, pangkas bagian opsional."
                    else:
                        new_t = f"[Sprint Ringkas] {clean_t}"
                        desc = "Selesaikan draf minimum yang dapat dinilai tanpa menunda."
                    rescoped_map[s["id"]] = {"title": new_t[:250], "description": desc}

        # Distribusikan tanggal target dan sesuaikan durasi secara proporsional
        for idx, st in enumerate(uncompleted):
            if days_left == 0 or num_uncompleted == 1:
                day_offset = 0
            else:
                day_offset = int(round((idx / max(1, num_uncompleted - 1)) * days_left))

            orig_dur = int(st.get("duration_minutes") or 25)
            if should_compress:
                if minutes_left <= 0:
                    new_dur = 15
                else:
                    usable_minutes = max(minutes_left, num_uncompleted * 10)
                    prop_dur = int(round((orig_dur / max(1, total_current_duration)) * usable_minutes))
                    min_floor = max(10, min(15, usable_minutes // num_uncompleted))
                    new_dur = max(min_floor, min(orig_dur, prop_dur))
            else:
                new_dur = orig_dur

            update_sets = [
                "target_date = DATE_ADD(CURDATE(), INTERVAL %s DAY)",
                "duration_minutes = %s",
            ]
            update_vals = [day_offset, new_dur]

            if st["id"] in rescoped_map:
                update_sets.append("title = %s")
                update_vals.append(rescoped_map[st["id"]]["title"])
                update_sets.append("description = %s")
                update_vals.append(rescoped_map[st["id"]]["description"])

            update_vals.append(st["id"])
            await db.execute(
                f"UPDATE subtasks SET {', '.join(update_sets)} WHERE id = %s",
                tuple(update_vals),
            )

        # Ambil data subtasks terbaru setelah rebalance
        await db.execute(
            """SELECT id, step_number, title, description, duration_minutes,
                      target_date, is_completed, source
               FROM subtasks WHERE task_id = %s ORDER BY step_number ASC""",
            (task_id,),
        )
        updated_subtasks = await db.fetchall()

        msg = (
            f"Mode Sprint Darurat aktif! {len(uncompleted)} langkah disederhanakan agar selesai dalam sisa {max(1, minutes_left)} menit."
            if should_compress
            else "Jadwal dan ritme kerja berhasil diseimbangkan kembali."
        )

        return {
            "success": True,
            "rebalanced_count": len(uncompleted),
            "days_left": days_left,
            "minutes_left": minutes_left,
            "is_emergency_sprint": should_compress,
            "message": msg,
            "data": updated_subtasks,
        }

@router.post("/tasks/sync-batch")
async def sync_batch_mutations(body: SyncBatchRequest):
    processed_ids = []
    async with get_db() as db:
        for m in body.mutations:
            c_time = m.client_timestamp.replace(tzinfo=None) if m.client_timestamp.tzinfo else m.client_timestamp
            
            if m.entity_type == "subtask":
                await db.execute(
                    "SELECT updated_at FROM subtasks WHERE id = %s",
                    (m.entity_id,),
                )
                row = await db.fetchone()
                if row:
                    server_updated = row["updated_at"]
                    # Last-Write-Wins check
                    if not server_updated or c_time >= server_updated:
                        sets, vals = [], []
                        if "is_completed" in m.data:
                            sets.append("is_completed = %s")
                            vals.append(bool(m.data["is_completed"]))
                            if m.data["is_completed"]:
                                sets.append("completed_at = %s")
                                vals.append(c_time)
                            else:
                                sets.append("completed_at = NULL")
                        if "title" in m.data:
                            sets.append("title = %s")
                            vals.append(str(m.data["title"]))
                        if "duration_minutes" in m.data:
                            sets.append("duration_minutes = %s")
                            vals.append(int(m.data["duration_minutes"]))
                        if "target_date" in m.data:
                            sets.append("target_date = %s")
                            vals.append(m.data["target_date"])

                        if sets:
                            sets.append("updated_at = %s")
                            vals.append(c_time)
                            vals.append(m.entity_id)
                            await db.execute(
                                f"UPDATE subtasks SET {', '.join(sets)} WHERE id = %s",
                                vals,
                            )
                            if "is_completed" in m.data:
                                await db.execute(
                                    """UPDATE tasks
                                       SET is_completed = (
                                           SELECT IF(COUNT(id) > 0 AND SUM(is_completed) = COUNT(id), 1, 0)
                                           FROM (SELECT * FROM subtasks) AS s
                                           WHERE s.task_id = (SELECT task_id FROM (SELECT * FROM subtasks) AS s2 WHERE s2.id = %s)
                                       )
                                       WHERE id = (SELECT task_id FROM (SELECT * FROM subtasks) AS s3 WHERE s3.id = %s)""",
                                    (m.entity_id, m.entity_id),
                                )
                processed_ids.append(m.id)

            elif m.entity_type == "task":
                await db.execute(
                    "SELECT updated_at FROM tasks WHERE id = %s",
                    (m.entity_id,),
                )
                row = await db.fetchone()
                if row:
                    server_updated = row["updated_at"]
                    if not server_updated or c_time >= server_updated:
                        sets, vals = [], []
                        if "is_completed" in m.data:
                            sets.append("is_completed = %s")
                            vals.append(bool(m.data["is_completed"]))
                        if "title" in m.data:
                            sets.append("title = %s")
                            vals.append(str(m.data["title"]))
                        if sets:
                            sets.append("updated_at = %s")
                            vals.append(c_time)
                            vals.append(m.entity_id)
                            await db.execute(
                                f"UPDATE tasks SET {', '.join(sets)} WHERE id = %s",
                                vals,
                            )
                processed_ids.append(m.id)

    return {
        "success": True,
        "synced_count": len(processed_ids),
        "processed_ids": processed_ids,
    }


