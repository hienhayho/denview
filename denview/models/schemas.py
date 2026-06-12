from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from denview.models.task import AgentStatus, TaskStatus, WorkStatus


# ── Task ──────────────────────────────────────────────────────────────────────

class AgentCreate(BaseModel):
    name: str
    role: str
    color: str


class TaskCreate(BaseModel):
    name: str
    description: Optional[str] = None
    agents: list[AgentCreate]


class TaskRead(BaseModel):
    id: int
    user_id: int
    name: str
    description: Optional[str]
    status: TaskStatus
    agent_count: int
    view_token: str
    created_at: datetime
    finished_at: Optional[datetime]


class TaskStatusUpdate(BaseModel):
    status: TaskStatus


# ── Agent ─────────────────────────────────────────────────────────────────────

class AgentStatusUpdate(BaseModel):
    status: AgentStatus


class AgentRead(BaseModel):
    id: int
    task_id: int
    name: str
    role: str
    color: str
    status: AgentStatus
    created_at: datetime


# ── AgentWork ─────────────────────────────────────────────────────────────────

class AgentWorkCreate(BaseModel):
    label: str


class AgentWorkUpdate(BaseModel):
    status: WorkStatus


class AgentWorkRead(BaseModel):
    id: int
    agent_id: int
    task_id: int
    label: str
    status: WorkStatus
    started_at: datetime
    ended_at: Optional[datetime]


# ── DenView polling state ─────────────────────────────────────────────────────

class AgentWorkSummary(BaseModel):
    id: int
    label: str
    status: WorkStatus
    started_at: datetime
    ended_at: Optional[datetime]


class AgentState(BaseModel):
    id: int
    name: str
    role: str
    color: str
    status: AgentStatus
    current_work: Optional[AgentWorkSummary]
    recent_works: list[AgentWorkSummary]


class TaskState(BaseModel):
    task_id: int
    task_name: str
    task_status: TaskStatus
    agents: list[AgentState]
