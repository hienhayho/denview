from datetime import datetime
from enum import Enum
from typing import Optional
from sqlmodel import Field, SQLModel


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


class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(index=True)
    name: str
    description: Optional[str] = None
    status: TaskStatus = TaskStatus.running
    agent_count: int
    view_token: str = Field(unique=True, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    finished_at: Optional[datetime] = None


class Agent(SQLModel, table=True):
    __tablename__ = "agents"

    id: Optional[int] = Field(default=None, primary_key=True)
    task_id: int = Field(index=True)
    name: str
    role: str
    color: str
    status: AgentStatus = AgentStatus.idle
    note: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class AgentWork(SQLModel, table=True):
    __tablename__ = "agent_works"

    id: Optional[int] = Field(default=None, primary_key=True)
    agent_id: int = Field(index=True)
    task_id: int = Field(index=True)
    label: str
    status: WorkStatus = WorkStatus.processing
    started_at: datetime = Field(default_factory=datetime.utcnow)
    ended_at: Optional[datetime] = None
