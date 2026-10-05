from typing import Optional
from pydantic import BaseModel
from datetime import datetime, date

# ── Session ──────────────────────────────────────────────
class SessionCreate(BaseModel):
    session_id: Optional[str] = None
    user_agent: Optional[str] = None

class SessionOut(BaseModel):
    session_id: str

# ── Task ─────────────────────────────────────────────────
class TaskCreate(BaseModel):
    session_id: str
    title: str
    description: Optional[str] = None
    subject: Optional[str] = None
    category: str = "custom"
    deadline: datetime

class TaskOut(BaseModel):
    id: str
    title: str
    subject: Optional[str]
    deadline: datetime
    is_completed: bool
    progress_percent: int
    subtasks_total: int
    subtasks_done: int

class TaskPatch(BaseModel):
    is_completed: bool

# ── Subtask ───────────────────────────────────────────────
class SubtaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    duration_minutes: Optional[int] = 25
    target_date: Optional[date] = None

class SubtaskPatch(BaseModel):
    is_completed: Optional[bool] = None
    title: Optional[str] = None
    description: Optional[str] = None
    duration_minutes: Optional[int] = None

class SubtaskOut(BaseModel):
    id: str
    step_number: int
    title: str
    description: Optional[str]
    duration_minutes: int
    target_date: Optional[date]
    is_completed: bool
    source: str

# ── AI Breakdown ──────────────────────────────────────────
class BreakdownRequest(BaseModel):
    task_id: str
    title: str
    description: str
    category: str
    deadline: datetime
    subtasks_count: Optional[int] = None

class SubtaskItem(BaseModel):
    step: int
    title: str
    description: str
    duration_minutes: int
    target_day_offset: int

class BreakdownOut(BaseModel):
    success: bool
    source: str
    data: list[SubtaskItem]
