import asyncio
import random

from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel
from src.apis.deps import SessionDep, APIKeyUser
from src.models.schemas import TaskCreate, AgentCreate, AgentWorkCreate, AgentWorkUpdate, TaskStatusUpdate
from src.crud.task import create_task, get_task, update_task_status
from src.crud.agent import list_agents_by_task
from src.crud.agent_work import create_agent_work, update_agent_work, get_agent_work
from src.database.engine import engine
from sqlmodel import Session

router = APIRouter(prefix="/demo", tags=["demo"])

DEMO_AGENTS = [
    {"name": "Alice", "role": "Researcher", "color": "#d95f12"},
    {"name": "Bob",   "role": "Coder",      "color": "#3b82f6"},
    {"name": "Carol", "role": "Reviewer",   "color": "#8b5cf6"},
    {"name": "Dave",  "role": "Planner",    "color": "#14b8a6"},
    {"name": "Eve",   "role": "Analyst",    "color": "#facc15"},
    {"name": "Frank", "role": "Writer",     "color": "#ef4444"},
]

WORK_ITEMS = [
    "refactoring auth module", "patching merge conflict", "writing migration script",
    "running unit tests", "reading stack trace", "drafting reply to PM",
    "reviewing pull request", "plotting cohort retention", "inspecting funnel data",
    "organizing artifacts", "composing brief", "running build pipeline",
    "training small model", "awaiting CI", "fetching dependencies",
    "planning sprint backlog", "auditing security logs", "tuning forecast model",
]


class DemoResponse(BaseModel):
    task_id: int
    view_token: str


async def _run_agent(task_id: int, agent_id: int, rounds: int) -> None:
    for _ in range(rounds):
        label = random.choice(WORK_ITEMS)
        with Session(engine) as session:
            work = create_agent_work(session, agent_id=agent_id, task_id=task_id, data=AgentWorkCreate(label=label))
            work_id = work.id

        await asyncio.sleep(random.uniform(2.0, 6.0))

        with Session(engine) as session:
            work = get_agent_work(session, work_id)
            if work:
                update_agent_work(session, work, AgentWorkUpdate(status="completed"))

        await asyncio.sleep(random.uniform(0.5, 2.0))


async def _run_demo(task_id: int, user_id: int) -> None:
    with Session(engine) as session:
        agents = list_agents_by_task(session, task_id)
        agent_ids = [(a.id, a.name) for a in agents]

    async def staggered(agent_id: int, delay: float) -> None:
        await asyncio.sleep(delay)
        await _run_agent(task_id, agent_id, rounds=random.randint(3, 7))

    await asyncio.gather(*[
        staggered(aid, i * 0.8)
        for i, (aid, _) in enumerate(agent_ids)
    ])

    with Session(engine) as session:
        task = get_task(session, task_id)
        if task:
            update_task_status(session, task, TaskStatusUpdate(status="done"))


@router.post("/run", response_model=DemoResponse)
def run_demo(
    background_tasks: BackgroundTasks,
    session: SessionDep,
    user: APIKeyUser,
):
    task = create_task(session, user_id=user.id, data=TaskCreate(
        name="Demo Run",
        description="Simulated agents — triggered from demo page",
        agents=[AgentCreate(**a) for a in DEMO_AGENTS],
    ))
    background_tasks.add_task(_run_demo, task.id, user.id)
    return DemoResponse(task_id=task.id, view_token=task.view_token)
