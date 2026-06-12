from typing import Optional
from sqlmodel import Session, select
from src.models.task import Agent
from src.models.schemas import AgentCreate, AgentStatusUpdate


def create_agent(session: Session, task_id: int, data: AgentCreate) -> Agent:
    agent = Agent(task_id=task_id, name=data.name, role=data.role, color=data.color)
    session.add(agent)
    return agent


def get_agent(session: Session, agent_id: int) -> Optional[Agent]:
    return session.get(Agent, agent_id)


def list_agents_by_task(session: Session, task_id: int) -> list[Agent]:
    return list(session.exec(select(Agent).where(Agent.task_id == task_id)).all())


def update_agent_status(session: Session, agent: Agent, data: AgentStatusUpdate) -> Agent:
    agent.status = data.status
    session.add(agent)
    session.commit()
    session.refresh(agent)
    return agent
