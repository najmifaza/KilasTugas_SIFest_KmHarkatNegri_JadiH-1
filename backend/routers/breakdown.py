from fastapi import APIRouter
from datetime import datetime
import json

from config.ai import ai_client, AI_MODEL
from config.db import get_db
from models.schemas import BreakdownRequest
from templates.presets import get_template_by_category

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
    days_left = max((req.deadline - datetime.now()).days + 1, 1)

    user_prompt = f"""Judul Tugas: {req.title}
Kategori: {req.category}
Instruksi/Deskripsi: {req.description}
Sisa Hari Menuju Deadline: {days_left} hari
Tanggal Deadline: {req.deadline.strftime('%A, %d %B %Y')}""".strip()

    source = "ai"
    subtasks = []

    try:
        response = await ai_client.chat.completions.create(
            model=AI_MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,
            max_tokens=1500,
        )
        raw = (response.choices[0].message.content or "").strip()
        # strip markdown fences jika ada
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        subtasks = json.loads(raw)
        if not isinstance(subtasks, list) or len(subtasks) == 0:
            raise ValueError("empty or invalid AI response")
    except Exception:
        source = "template"
        subtasks = get_template_by_category(req.category, days_left)

    # simpan ke DB
    async with get_db() as db:
        for s in subtasks:
            await db.execute(
                """INSERT INTO subtasks
                   (id, task_id, step_number, title, description,
                    duration_minutes, target_date, source)
                   VALUES (UUID(), %s, %s, %s, %s, %s,
                   DATE_ADD(CURDATE(), INTERVAL %s DAY), %s)""",
                (req.task_id, s["step"], s["title"], s["description"],
                 s["duration_minutes"], s["target_day_offset"], source),
            )

    return {"success": True, "source": source, "data": subtasks}
