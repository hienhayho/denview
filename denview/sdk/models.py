from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from typing import Optional


class TaskStatus(str, Enum):
    running = "running"
    done = "done"
    failed = "failed"


class AgentStatus(str, Enum):
    working = "working"
    idle = "idle"


class WorkStatus(str, Enum):
    processing = "processing"
    completed = "completed"
    failed = "failed"


@dataclass
class AgentInfo:
    name: str
    role: str
    color: str


@dataclass
class TaskData:
    id: int
    user_id: int
    name: str
    description: Optional[str]
    status: TaskStatus
    agent_count: int
    view_token: str
    created_at: datetime
    finished_at: Optional[datetime]


@dataclass
class AgentData:
    id: int
    task_id: int
    name: str
    role: str
    color: str
    status: AgentStatus
    created_at: datetime
    note: Optional[str] = None


@dataclass
class WorkData:
    id: int
    agent_id: int
    task_id: int
    label: str
    status: WorkStatus
    started_at: datetime
    ended_at: Optional[datetime]
