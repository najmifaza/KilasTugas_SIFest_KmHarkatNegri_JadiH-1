from fastapi import APIRouter, HTTPException
from config.db import get_db
from models.schemas import TaskCreate, TaskOut, TaskPatch
import uuid

router = APIRouter(prefix="/api", tags=["tasks"])

@router.post("/tasks", status_code=201)
async def create_task(body: TaskCreate):
    tid = str(uuid.uuid4())
    async with get_db() as db:
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
        result.append({
            "id": r["id"],
            "title": r["title"],
            "subject": r["subject"],
            "deadline": r["deadline"],
            "is_completed": bool(r["is_completed"]),
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
