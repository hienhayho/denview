from fastapi import APIRouter, HTTPException, Query
from denview.apis.deps import SessionDep, APIKeyUser, CurrentUser
from denview.models.schemas import (
    TaskCreate, TaskRead, TaskStatusUpdate,
    AgentWorkSummary, AgentState, TaskState,
)
from denview.crud.task import create_task, get_task, list_tasks, update_task_status, get_task_by_token
from denview.crud.agent import list_agents_by_task
from denview.crud.agent_work import get_current_work, list_works_by_agent

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.post("", response_model=TaskRead)
def create(data: TaskCreate, session: SessionDep, user: APIKeyUser):
    return create_task(session, user_id=user.id, data=data)


@router.get("", response_model=list[TaskRead])
def get_all(session: SessionDep, user: CurrentUser):
    return list_tasks(session, user_id=user.id)


@router.get("/{task_id}", response_model=TaskRead)
def get_one(task_id: int, session: SessionDep, user: CurrentUser):
    task = get_task(session, task_id)
    if not task or task.user_id != user.id:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.patch("/{task_id}/status", response_model=TaskRead)
def set_status(task_id: int, data: TaskStatusUpdate, session: SessionDep, user: APIKeyUser):
    task = get_task(session, task_id)
    if not task or task.user_id != user.id:
        raise HTTPException(status_code=404, detail="Task not found")
    return update_task_status(session, task, data)


@router.get("/{task_id}/state", response_model=TaskState)
def get_state(
    task_id: int,
    session: SessionDep,
    token: str = Query(..., description="view_token issued at task creation"),
):
    task = get_task(session, task_id)
    if not task or task.view_token != token:
        raise HTTPException(status_code=403, detail="Invalid or missing token")

    agents = list_agents_by_task(session, task_id)
    agent_states = []
    for agent in agents:
        current = get_current_work(session, agent.id)
        recent = list_works_by_agent(session, agent.id, limit=10)

        current_summary = AgentWorkSummary(
            id=current.id,
            label=current.label,
            status=current.status,
            started_at=current.started_at,
            ended_at=current.ended_at,
        ) if current else None

        recent_summaries = [
            AgentWorkSummary(
                id=w.id,
                label=w.label,
                status=w.status,
                started_at=w.started_at,
                ended_at=w.ended_at,
            )
            for w in recent
        ]

        agent_states.append(AgentState(
            id=agent.id,
            name=agent.name,
            role=agent.role,
            color=agent.color,
            status=agent.status,
            current_work=current_summary,
            recent_works=recent_summaries,
        ))

    return TaskState(
        task_id=task.id,
        task_name=task.name,
        task_status=task.status,
        agents=agent_states,
    )
