from fastapi import APIRouter, HTTPException
from config.db import get_db
from models.schemas import TaskCreate, TaskOut, TaskPatch
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

        # Distribusikan tanggal target secara proporsional mulai hari ini (offset 0) hingga sisa hari
        for idx, st in enumerate(uncompleted):
            if days_left == 0 or num_uncompleted == 1:
                day_offset = 0
            else:
                day_offset = int(round((idx / max(1, num_uncompleted - 1)) * days_left))

            await db.execute(
                """UPDATE subtasks
                   SET target_date = DATE_ADD(CURDATE(), INTERVAL %s DAY)
                   WHERE id = %s""",
                (day_offset, st["id"]),
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

