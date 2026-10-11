from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from config.push import (
    VAPID_PUBLIC_KEY,
    schedule_push_notification,
    cancel_scheduled_push,
    send_web_push,
)

router = APIRouter(prefix="/api/push", tags=["push"])

class PushScheduleRequest(BaseModel):
    session_id: str
    duration_seconds: int
    subtask_title: Optional[str] = "Langkah Fokus"
    is_break: bool = False
    subscription: dict

class PushCancelRequest(BaseModel):
    session_id: str

class PushTestRequest(BaseModel):
    subscription: dict
    title: Optional[str] = "KilasTugas Focus Engine"
    body: Optional[str] = "Web Push notification terhubung."

@router.get("/vapid-public-key")
async def get_vapid_public_key():
    return {"success": True, "public_key": VAPID_PUBLIC_KEY}

@router.post("/schedule-timer")
async def schedule_timer_push(body: PushScheduleRequest):
    if not body.subscription or not isinstance(body.subscription, dict):
        raise HTTPException(status_code=400, detail="Subscription data required")

    title = "Istirahat Selesai! 🔔" if body.is_break else "Sesi Fokus Selesai! 🎉"
    work_mins = max(1, int(body.duration_seconds // 60))
    break_mins = min(15, max(5, round(work_mins * 0.2)))
    desc = (
        "Waktu istirahat habis. Siap untuk target langkah berikutnya?"
        if body.is_break
        else f'Langkah "{body.subtask_title}" tuntas! Istirahat adaptif {break_mins} menit.'
    )

    payload = {
        "title": title,
        "body": desc,
        "is_break": body.is_break,
        "subtask_title": body.subtask_title,
    }

    schedule_push_notification(
        session_id=body.session_id,
        delay_seconds=body.duration_seconds,
        subscription_info=body.subscription,
        payload=payload,
    )

    return {
        "success": True,
        "message": f"Push scheduled in {body.duration_seconds} seconds",
    }

@router.post("/cancel-timer")
async def cancel_timer_push(body: PushCancelRequest):
    cancel_scheduled_push(body.session_id)
    return {"success": True, "message": "Scheduled push cancelled"}

@router.post("/test")
async def test_push(body: PushTestRequest):
    success = send_web_push(
        subscription_info=body.subscription,
        payload={"title": body.title, "body": body.body},
    )
    return {"success": success}
