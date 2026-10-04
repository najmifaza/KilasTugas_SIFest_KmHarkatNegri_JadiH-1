from fastapi import APIRouter
from config.db import get_db
from models.schemas import SessionCreate, SessionOut
import uuid

router = APIRouter(prefix="/api", tags=["session"])

@router.post("/session", response_model=SessionOut, status_code=201)
async def create_session(body: SessionCreate):
    sid = body.session_id or str(uuid.uuid4())
    async with get_db() as db:
        await db.execute(
            """INSERT INTO sessions (id, user_agent) VALUES (%s, %s)
               ON DUPLICATE KEY UPDATE last_active = CURRENT_TIMESTAMP""",
            (sid, body.user_agent or "Guest Browser"),
        )
    return {"session_id": sid}
