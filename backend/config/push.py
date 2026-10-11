import os
import json
import logging
import asyncio
from typing import Optional
from pywebpush import webpush, WebPushException

from typing import Optional, Union

logger = logging.getLogger(__name__)

VAPID_PUBLIC_KEY = os.getenv(
    "VAPID_PUBLIC_KEY",
    "BI9pnsk00XUugwHc_WQZpU1-JMhlIe7Nk4hpUJs7zAWoBgR9AQ-or4jh45Mst1lsE_sPUcHxQU4NkvOWz5cgS28",
)

VAPID_PRIVATE_KEY = os.getenv(
    "VAPID_PRIVATE_KEY",
    "U_HXdaOxHWpzqj5gb4njR7nZWHrK8F_jtg8HZB0tI7g",
)

VAPID_CLAIMS: dict[str, Union[str, int]] = {
    "sub": os.getenv("VAPID_SUB", "mailto:najmifaza@gmail.com")
}

# In-memory dictionary to hold scheduled async push tasks by session_id
_scheduled_tasks: dict[str, asyncio.Task] = {}

def send_web_push(subscription_info: dict, payload: dict) -> bool:
    try:
        webpush(
            subscription_info=subscription_info,
            data=json.dumps(payload),
            vapid_private_key=VAPID_PRIVATE_KEY,
            vapid_claims=VAPID_CLAIMS,
        )
        logger.info("Web push notification delivered successfully.")
        return True
    except WebPushException as ex:
        logger.warning(f"Web push failed: {ex}")
        if ex.response and ex.response.status_code in [404, 410]:
            # Subscription has expired or unsubscribed
            return False
    except Exception as e:
        logger.error(f"Unexpected web push error: {e}")
    return False

async def _schedule_push_coroutine(
    session_id: str,
    delay_seconds: float,
    subscription_info: dict,
    payload: dict,
):
    try:
        await asyncio.sleep(max(0.5, delay_seconds))
        # Run blocking webpush call in default thread pool
        loop = asyncio.get_running_loop()
        await loop.run_in_executor(None, send_web_push, subscription_info, payload)
    except asyncio.CancelledError:
        logger.info(f"Scheduled push for session {session_id} cancelled.")
    finally:
        _scheduled_tasks.pop(session_id, None)

def schedule_push_notification(
    session_id: str,
    delay_seconds: float,
    subscription_info: dict,
    payload: dict,
):
    # Cancel existing task if already scheduled for this session
    cancel_scheduled_push(session_id)
    task = asyncio.create_task(
        _schedule_push_coroutine(session_id, delay_seconds, subscription_info, payload)
    )
    _scheduled_tasks[session_id] = task

def cancel_scheduled_push(session_id: str):
    task = _scheduled_tasks.pop(session_id, None)
    if task and not task.done():
        task.cancel()
