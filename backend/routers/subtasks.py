from fastapi import APIRouter
from config.db import get_db
from models.schemas import SubtaskPatch

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
    if not sets:
        return {"success": True, "message": "nothing to update"}
    vals.append(subtask_id)
    async with get_db() as db:
        await db.execute(
            f"UPDATE subtasks SET {', '.join(sets)} WHERE id = %s", vals
        )
    return {"success": True, "message": "subtask updated"}
