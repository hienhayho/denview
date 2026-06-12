import secrets
from datetime import datetime
from typing import Optional
from sqlmodel import Session, select
from denview.models.task import Task, TaskStatus
from denview.models.schemas import TaskCreate, TaskStatusUpdate
from denview.crud.agent import create_agent


def create_task(session: Session, user_id: int, data: TaskCreate) -> Task:
    task = Task(
        user_id=user_id,
        name=data.name,
        description=data.description,
        agent_count=len(data.agents),
        view_token=secrets.token_urlsafe(32),
    )
    session.add(task)
    session.flush()

    for agent_data in data.agents:
        create_agent(session, task_id=task.id, data=agent_data)

    session.commit()
    session.refresh(task)
    return task


def get_task(session: Session, task_id: int) -> Optional[Task]:
    return session.get(Task, task_id)


def get_task_by_token(session: Session, view_token: str) -> Optional[Task]:
    return session.exec(select(Task).where(Task.view_token == view_token)).first()


def list_tasks(session: Session, user_id: int) -> list[Task]:
    return list(
        session.exec(select(Task).where(Task.user_id == user_id).order_by(Task.created_at.desc())).all()
    )


def update_task_status(session: Session, task: Task, data: TaskStatusUpdate) -> Task:
    task.status = data.status
    if data.status in (TaskStatus.done, TaskStatus.failed):
        task.finished_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)
    return task
