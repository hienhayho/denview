from datetime import datetime
from typing import Optional
from sqlmodel import Session, select
from denview.models.task import AgentWork, WorkStatus
from denview.models.schemas import AgentWorkCreate, AgentWorkUpdate


def create_agent_work(session: Session, agent_id: int, task_id: int, data: AgentWorkCreate) -> AgentWork:
    work = AgentWork(agent_id=agent_id, task_id=task_id, label=data.label)
    session.add(work)
    session.commit()
    session.refresh(work)
    return work


def get_agent_work(session: Session, work_id: int) -> Optional[AgentWork]:
    return session.get(AgentWork, work_id)


def list_works_by_agent(session: Session, agent_id: int, limit: int = 20) -> list[AgentWork]:
    return list(
        session.exec(
            select(AgentWork)
            .where(AgentWork.agent_id == agent_id)
            .order_by(AgentWork.started_at.desc())
            .limit(limit)
        ).all()
    )


def get_current_work(session: Session, agent_id: int) -> Optional[AgentWork]:
    return session.exec(
        select(AgentWork)
        .where(AgentWork.agent_id == agent_id, AgentWork.status == WorkStatus.processing)
        .order_by(AgentWork.started_at.desc())
    ).first()


def update_agent_work(session: Session, work: AgentWork, data: AgentWorkUpdate) -> AgentWork:
    work.status = data.status
    if data.status in (WorkStatus.completed, WorkStatus.failed):
        work.ended_at = datetime.utcnow()
    session.add(work)
    session.commit()
    session.refresh(work)
    return work
