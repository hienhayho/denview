from fastapi import APIRouter, HTTPException
from denview.apis.deps import SessionDep, APIKeyUser
from denview.models.schemas import AgentRead, AgentStatusUpdate, AgentWorkCreate, AgentWorkRead, AgentWorkUpdate
from denview.crud.agent import get_agent, list_agents_by_task, update_agent_status
from denview.crud.agent_work import create_agent_work, get_agent_work, list_works_by_agent, update_agent_work
from denview.crud.task import get_task

router = APIRouter(prefix="/tasks/{task_id}/agents", tags=["agents"])


def _resolve_agent(session, task_id: int, agent_id: int, user_id: int):
    task = get_task(session, task_id)
    if not task or task.user_id != user_id:
        raise HTTPException(status_code=404, detail="Task not found")
    agent = get_agent(session, agent_id)
    if not agent or agent.task_id != task_id:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent


@router.get("/{agent_id}", response_model=AgentRead)
def get_one_agent(task_id: int, agent_id: int, session: SessionDep, user: APIKeyUser):
    return _resolve_agent(session, task_id, agent_id, user.id)


@router.get("", response_model=list[AgentRead])
def list_agents(task_id: int, session: SessionDep, user: APIKeyUser):
    task = get_task(session, task_id)
    if not task or task.user_id != user.id:
        raise HTTPException(status_code=404, detail="Task not found")
    return list_agents_by_task(session, task_id)


@router.patch("/{agent_id}/status", response_model=AgentRead)
def set_agent_status(task_id: int, agent_id: int, data: AgentStatusUpdate, session: SessionDep, user: APIKeyUser):
    agent = _resolve_agent(session, task_id, agent_id, user.id)
    return update_agent_status(session, agent, data)


@router.post("/{agent_id}/works", response_model=AgentWorkRead)
def add_work(task_id: int, agent_id: int, data: AgentWorkCreate, session: SessionDep, user: APIKeyUser):
    agent = _resolve_agent(session, task_id, agent_id, user.id)
    return create_agent_work(session, agent_id=agent.id, task_id=task_id, data=data)


@router.get("/{agent_id}/works", response_model=list[AgentWorkRead])
def list_works(task_id: int, agent_id: int, session: SessionDep, user: APIKeyUser):
    agent = _resolve_agent(session, task_id, agent_id, user.id)
    return list_works_by_agent(session, agent.id)


@router.patch("/{agent_id}/works/{work_id}", response_model=AgentWorkRead)
def update_work(task_id: int, agent_id: int, work_id: int, data: AgentWorkUpdate, session: SessionDep, user: APIKeyUser):
    agent = _resolve_agent(session, task_id, agent_id, user.id)
    work = get_agent_work(session, work_id)
    if not work or work.agent_id != agent.id or work.task_id != task_id:
        raise HTTPException(status_code=404, detail="Work not found")
    return update_agent_work(session, work, data)
