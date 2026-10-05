import uuid
from fastapi import APIRouter, HTTPException
from config.db import get_db
from models.schemas import SubtaskCreate, SubtaskPatch

router = APIRouter(prefix="/api", tags=["subtasks"])

@router.get("/tasks/{task_id}/subtasks")
async def get_subtasks(task_id: str):
    async with get_db() as db:
        await db.execute(
            """SELECT id, step_number, title, description, duration_minutes,
                      target_date, is_completed, source
               FROM subtasks WHERE task_id = %s ORDER BY step_number ASC""",
            (task_id,),
        )
        rows = await db.fetchall()
    return {"success": True, "data": rows}

@router.post("/tasks/{task_id}/subtasks", status_code=201)
async def create_subtask(task_id: str, body: SubtaskCreate):
    async with get_db() as db:
        # Determine next step number
        await db.execute(
            "SELECT COALESCE(MAX(step_number), 0) + 1 AS next_step FROM subtasks WHERE task_id = %s",
            (task_id,),
        )
        row = await db.fetchone()
        next_step = row["next_step"] if row else 1

        subtask_id = str(uuid.uuid4())
        await db.execute(
            """INSERT INTO subtasks
               (id, task_id, step_number, title, description, duration_minutes, target_date, is_completed, source)
               VALUES (%s, %s, %s, %s, %s, %s, %s, FALSE, 'manual')""",
            (
                subtask_id,
                task_id,
                next_step,
                body.title,
                body.description or "",
                body.duration_minutes or 25,
                body.target_date,
            ),
        )
    return {
        "success": True,
        "data": {
            "id": subtask_id,
            "task_id": task_id,
            "step_number": next_step,
            "title": body.title,
            "description": body.description or "",
            "duration_minutes": body.duration_minutes or 25,
            "target_date": body.target_date,
            "is_completed": False,
            "source": "manual",
        },
    }

@router.patch("/subtasks/{subtask_id}")
async def patch_subtask(subtask_id: str, body: SubtaskPatch):
    sets, vals = [], []
    if body.is_completed is not None:
        sets.append("is_completed = %s")
        vals.append(body.is_completed)
        if body.is_completed:
            sets.append("completed_at = NOW()")
    if body.title is not None:
        sets.append("title = %s")
        vals.append(body.title)
    if body.description is not None:
        sets.append("description = %s")
        vals.append(body.description)
    if body.duration_minutes is not None:
        sets.append("duration_minutes = %s")
        vals.append(body.duration_minutes)
    if not sets:
        return {"success": True, "message": "nothing to update"}
    vals.append(subtask_id)
    async with get_db() as db:
        await db.execute(
            f"UPDATE subtasks SET {', '.join(sets)} WHERE id = %s", vals
        )
        if body.is_completed is not None:
            # Sync parent task is_completed based on all its subtasks
            await db.execute(
                """UPDATE tasks
                   SET is_completed = (
                       SELECT IF(COUNT(id) > 0 AND SUM(is_completed) = COUNT(id), 1, 0)
                       FROM (SELECT * FROM subtasks) AS s
                       WHERE s.task_id = (SELECT task_id FROM (SELECT * FROM subtasks) AS s2 WHERE s2.id = %s)
                   )
                   WHERE id = (SELECT task_id FROM (SELECT * FROM subtasks) AS s3 WHERE s3.id = %s)""",
                (subtask_id, subtask_id),
            )
    return {"success": True, "message": "subtask updated"}

@router.delete("/subtasks/{subtask_id}")
async def delete_subtask(subtask_id: str):
    async with get_db() as db:
        await db.execute("DELETE FROM subtasks WHERE id = %s", (subtask_id,))
    return {"success": True, "message": "subtask deleted"}
