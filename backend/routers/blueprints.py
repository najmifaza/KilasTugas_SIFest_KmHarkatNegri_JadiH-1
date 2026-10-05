import uuid
from typing import Optional
from datetime import datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from config.db import get_db

router = APIRouter(prefix="/api/blueprint", tags=["blueprint"])

class CloneRequest(BaseModel):
    session_id: str
    target_deadline: Optional[datetime] = None

@router.get("/{task_id}")
async def get_blueprint(task_id: str):
    async with get_db() as db:
        await db.execute(
            """SELECT id, title, subject, category, description, deadline, created_at
               FROM tasks WHERE id = %s""",
            (task_id,),
        )
        task = await db.fetchone()
        if not task:
            raise HTTPException(status_code=404, detail="Cetak biru tugas tidak ditemukan")

        await db.execute(
            """SELECT id, step_number, title, description, duration_minutes, source
               FROM subtasks WHERE task_id = %s ORDER BY step_number ASC""",
            (task_id,),
        )
        subtasks = await db.fetchall()

    return {
        "success": True,
        "data": {
            "id": task["id"],
            "title": task["title"],
            "subject": task["subject"],
            "category": task["category"],
            "description": task["description"],
            "deadline": task["deadline"].isoformat() if task["deadline"] else None,
            "subtasks_count": len(subtasks),
            "subtasks": subtasks,
        },
    }

@router.post("/{task_id}/clone")
async def clone_blueprint(task_id: str, body: CloneRequest):
    async with get_db() as db:
        # 1. Pastikan session tujuan ada
        await db.execute(
            "INSERT IGNORE INTO sessions (id, user_agent) VALUES (%s, %s)",
            (body.session_id, "KilasTugas Web Client (Blueprint Clone)"),
        )

        # 2. Ambil task sumber
        await db.execute(
            """SELECT title, subject, category, description, deadline
               FROM tasks WHERE id = %s""",
            (task_id,),
        )
        source_task = await db.fetchone()
        if not source_task:
            raise HTTPException(status_code=404, detail="Tugas sumber tidak ditemukan")

        await db.execute(
            """SELECT step_number, title, description, duration_minutes
               FROM subtasks WHERE task_id = %s ORDER BY step_number ASC""",
            (task_id,),
        )
        source_subtasks = await db.fetchall()
        if not source_subtasks:
            raise HTTPException(status_code=400, detail="Cetak biru belum memiliki langkah kerja")

        # 3. Hitung target deadline baru
        new_deadline = body.target_deadline or source_task["deadline"]
        if new_deadline and new_deadline.tzinfo:
            new_deadline = new_deadline.replace(tzinfo=None)

        # 4. Insert task baru
        new_task_id = str(uuid.uuid4())
        await db.execute(
            """INSERT INTO tasks (id, session_id, title, description, subject, category, deadline, is_completed)
               VALUES (%s, %s, %s, %s, %s, %s, %s, FALSE)""",
            (
                new_task_id,
                body.session_id,
                source_task["title"],
                source_task["description"],
                source_task["subject"],
                source_task["category"],
                new_deadline,
            ),
        )

        # 5. Insert subtasks baru dengan tanggal terdistribusi proporsional
        total_steps = len(source_subtasks)
        now_dt = datetime.now()
        days_span = max(1, (new_deadline - now_dt).days) if new_deadline else 3

        for idx, sub in enumerate(source_subtasks):
            offset = int((idx / max(1, total_steps - 1)) * days_span) if total_steps > 1 else 0
            sub_id = str(uuid.uuid4())
            await db.execute(
                """INSERT INTO subtasks
                   (id, task_id, step_number, title, description, duration_minutes, target_date, is_completed, source)
                   VALUES (%s, %s, %s, %s, %s, %s, DATE_ADD(CURDATE(), INTERVAL %s DAY), FALSE, 'template')""",
                (
                    sub_id,
                    new_task_id,
                    sub["step_number"],
                    sub["title"],
                    sub["description"],
                    sub["duration_minutes"],
                    offset,
                ),
            )

    return {
        "success": True,
        "message": "Cetak biru berhasil disalin ke jadwal Anda",
        "task_id": new_task_id,
        "subtasks_cloned": len(source_subtasks),
    }
