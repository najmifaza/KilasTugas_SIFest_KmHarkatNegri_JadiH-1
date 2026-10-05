from fastapi import APIRouter, HTTPException
from datetime import datetime
import json
import logging

from config.ai import ai_client, AI_MODEL
from config.db import get_db
from models.schemas import BreakdownRequest
from templates.presets import get_template_by_category

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["breakdown"])

SYSTEM_PROMPT = """Kamu adalah asisten perencana belajar mahasiswa Indonesia yang sangat memahami pola pengerjaan tugas kuliah.

Tugasmu HANYA satu: memecah instruksi tugas kuliah yang diberikan menjadi 4–6 sub-tugas harian yang:
1. Konkret dan spesifik (bukan sekadar label seperti "kerjakan tugas")
2. Berurutan secara logis (setiap sub-tugas adalah prasyarat sub-tugas berikutnya)
3. Realistis dalam estimasi waktu (25–120 menit per sub-tugas)
4. Berbahasa Indonesia yang santun dan mudah dipahami

Keluarkan output HANYA berupa JSON array murni tanpa teks tambahan apapun, tanpa markdown, tanpa backtick.
Format output:
[
  {
    "step": 1,
    "title": "Judul sub-tugas singkat (max 60 karakter)",
    "description": "Deskripsi aksi konkret yang harus dilakukan (1–3 kalimat)",
    "duration_minutes": 45,
    "target_day_offset": 0
  }
]

"target_day_offset" adalah berapa hari dari hari ini sub-tugas ini idealnya dikerjakan (0 = hari ini, 1 = besok, dst), distribusikan secara merata berdasarkan sisa hari menuju deadline."""

@router.post("/breakdown")
async def breakdown(req: BreakdownRequest):
    # Cegah crash offset-naive vs offset-aware datetime
    deadline_naive = req.deadline.replace(tzinfo=None) if req.deadline.tzinfo else req.deadline
    now_naive = datetime.now()
    days_left = max((deadline_naive - now_naive).days + 1, 1)

    target_count = req.subtasks_count if (req.subtasks_count and 2 <= req.subtasks_count <= 10) else None
    count_instruction = (
        f"PERSIS {target_count} sub-tugas harian"
        if target_count
        else "4–6 sub-tugas harian"
    )

    sys_prompt = f"""Kamu adalah asisten perencana belajar mahasiswa Indonesia yang sangat memahami pola pengerjaan tugas kuliah.

Tugasmu HANYA satu: memecah instruksi tugas kuliah yang diberikan menjadi {count_instruction} yang:
1. Konkret dan spesifik (bukan sekadar label seperti "kerjakan tugas")
2. Berurutan secara logis (setiap sub-tugas adalah prasyarat sub-tugas berikutnya)
3. Realistis dalam estimasi waktu (25–120 menit per sub-tugas)
4. Berbahasa Indonesia yang santun dan mudah dipahami

Keluarkan output HANYA berupa JSON array murni tanpa teks tambahan apapun, tanpa markdown, tanpa backtick.
Format output:
[
  {{
    "step": 1,
    "title": "Judul sub-tugas singkat (max 60 karakter)",
    "description": "Deskripsi aksi konkret yang harus dilakukan (1–3 kalimat)",
    "duration_minutes": 45,
    "target_day_offset": 0
  }}
]

"target_day_offset" adalah berapa hari dari hari ini sub-tugas ini idealnya dikerjakan (0 = hari ini, 1 = besok, dst), distribusikan secara merata berdasarkan sisa hari menuju deadline."""

    user_prompt = f"""Judul Tugas: {req.title}
Kategori: {req.category}
Instruksi/Deskripsi: {req.description}
Sisa Hari Menuju Deadline: {days_left} hari
Tanggal Deadline: {deadline_naive.strftime('%A, %d %B %Y')}"""

    if target_count:
        user_prompt += f"\nPermintaan Khusus Jumlah Langkah: Pecah tugas ini menjadi PERSIS {target_count} langkah kerja terurut (step 1 sampai {target_count})."

    source = "ai"
    raw_subtasks = []

    # ── Blueprint Smart Cache Check ────────────────────────────────
    # Jika tugas dengan judul & kategori serupa sudah pernah dipecah sebelumnya
    # langsung gunakan cetak biru yang ada (hemat kuota & waktu respons <20ms)
    cached_found = False
    try:
        async with get_db() as db:
            norm_title = req.title.strip().lower()
            await db.execute(
                """SELECT t.id FROM tasks t
                   JOIN subtasks s ON s.task_id = t.id
                   WHERE LOWER(TRIM(t.title)) = %s AND t.category = %s
                   GROUP BY t.id
                   HAVING COUNT(s.id) >= 2
                   ORDER BY t.created_at DESC LIMIT 1""",
                (norm_title, req.category),
            )
            matched_task = await db.fetchone()
            if matched_task:
                await db.execute(
                    """SELECT step_number, title, description, duration_minutes
                       FROM subtasks WHERE task_id = %s ORDER BY step_number ASC""",
                    (matched_task["id"],),
                )
                cached_rows = await db.fetchall()
                if cached_rows and (not target_count or len(cached_rows) == target_count):
                    raw_subtasks = [
                        {
                            "step": r["step_number"],
                            "title": r["title"],
                            "description": r["description"],
                            "duration_minutes": r["duration_minutes"],
                            "target_day_offset": int((idx / max(1, len(cached_rows) - 1)) * days_left) if len(cached_rows) > 1 else 0,
                        }
                        for idx, r in enumerate(cached_rows)
                    ]
                    source = "blueprint_cache"
                    cached_found = True
                    logger.info(f"Blueprint cache hit for '{req.title}' -> {len(raw_subtasks)} steps (0 tokens used)")
    except Exception as cache_err:
        logger.warning(f"Blueprint cache check skipped: {cache_err}")

    if not cached_found:
        try:
            response = await ai_client.chat.completions.create(
                model=AI_MODEL,
                messages=[
                    {"role": "system", "content": sys_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0.3,
                max_tokens=1500,
            )
            raw = (response.choices[0].message.content or "").strip()
            # strip markdown codeblocks jika model menyertakan ```
            if "```" in raw:
                parts = raw.split("```")
                raw = parts[1]
                if raw.startswith("json"):
                    raw = raw[4:]
            raw = raw.strip()
            parsed = json.loads(raw)
            if isinstance(parsed, list) and len(parsed) > 0:
                raw_subtasks = parsed
            else:
                raise ValueError("AI output is not a non-empty list")
        except Exception as e:
            logger.warning(f"AI breakdown failed ({type(e).__name__}: {e}), using template fallback")
            source = "template"
            raw_subtasks = get_template_by_category(req.category, days_left)

    # Sanitasi data subtask agar aman masuk DB
    clean_subtasks = []
    for idx, s in enumerate(raw_subtasks):
        if not isinstance(s, dict):
            continue
        clean_subtasks.append({
            "step": int(s.get("step") or s.get("step_number") or (idx + 1)),
            "title": str(s.get("title") or f"Sub-tugas {idx+1}")[:250],
            "description": str(s.get("description") or ""),
            "duration_minutes": int(s.get("duration_minutes") or 25),
            "target_day_offset": int(s.get("target_day_offset") or 0),
        })

    if not clean_subtasks:
        clean_subtasks = get_template_by_category(req.category, days_left)
        source = "template"

    # Simpan ke MariaDB
    db_source = "template" if source in ("template", "blueprint_cache", "blueprint") else "ai"
    try:
        async with get_db() as db:
            for s in clean_subtasks:
                await db.execute(
                    """INSERT INTO subtasks
                       (id, task_id, step_number, title, description,
                        duration_minutes, target_date, source)
                       VALUES (UUID(), %s, %s, %s, %s, %s,
                       DATE_ADD(CURDATE(), INTERVAL %s DAY), %s)""",
                    (req.task_id, s["step"], s["title"], s["description"],
                     s["duration_minutes"], s["target_day_offset"], db_source),
                )
    except Exception as db_err:
        logger.error(f"DB insert subtasks error: {db_err}")
        # Tetap kembalikan data ke frontend agar user tidak gagal di UI

    return {"success": True, "source": source, "data": clean_subtasks}
