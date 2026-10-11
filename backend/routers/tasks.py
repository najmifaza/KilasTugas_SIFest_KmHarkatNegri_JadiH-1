from fastapi import APIRouter, HTTPException
from config.db import get_db
from models.schemas import TaskCreate, TaskOut, TaskPatch, SyncBatchRequest, MutationItem
from datetime import datetime
import uuid

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
    async with get_db() as db:
        await db.execute(
            "UPDATE tasks SET is_completed = %s WHERE id = %s",
            (body.is_completed, task_id),
        )
    return {"success": True}

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

            await db.execute(
                """UPDATE subtasks
                   SET target_date = DATE_ADD(CURDATE(), INTERVAL %s DAY),
                       duration_minutes = %s
                   WHERE id = %s""",
                (day_offset, new_dur, st["id"]),
            )

        # Ambil data subtasks terbaru setelah rebalance
        await db.execute(
            """SELECT id, step_number, title, description, duration_minutes,
                      target_date, is_completed, source
               FROM subtasks WHERE task_id = %s ORDER BY step_number ASC""",
            (task_id,),
        )
        updated_subtasks = await db.fetchall()

        return {
            "success": True,
            "rebalanced_count": len(uncompleted),
            "days_left": days_left,
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


