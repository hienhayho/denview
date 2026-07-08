import asyncio
import random

from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel
from denview.apis.deps import SessionDep, APIKeyUser
from denview.models.schemas import TaskCreate, AgentCreate, AgentWorkCreate, AgentWorkUpdate, TaskStatusUpdate
from denview.crud.task import create_task, get_task, update_task_status
from denview.crud.agent import list_agents_by_task, update_agent_note
from denview.models.schemas import AgentNoteUpdate
from denview.crud.agent_work import create_agent_work, update_agent_work, get_agent_work
from denview.database.engine import engine
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

DEMO_NOTES = {
    "Alice": "## Alice — Researcher\n\nFocused on **literature review** and gathering context.\n\n- Scanning 12 recent papers\n- Summarizing key findings\n- Flagging contradictions",
    "Bob":   "## Bob — Coder\n\nImplementing the core pipeline.\n\n```python\ndef process(data):\n    return transform(data)\n```\n\n- Auth module refactor in progress\n- 3 PRs open",
    "Carol": "## Carol — Reviewer\n\nCode review + QA pass.\n\n> No bugs found yet, but test coverage is low.\n\n- Reviewing Bob's PRs\n- Writing missing unit tests",
    "Dave":  "## Dave — Planner\n\nManaging sprint backlog and priorities.\n\n| Priority | Task |\n|----------|------|\n| High | Auth refactor |\n| Med  | Dashboard metrics |\n| Low  | Docs update |",
    "Eve":   "## Eve — Analyst\n\nRunning data analysis on cohort retention.\n\n- Cohort size: **4,200 users**\n- Retention D7: 62%\n- Identified drop-off at onboarding step 3",
    "Frank": "## Frank — Writer\n\nDrafting documentation and release notes.\n\n- API reference: 80% done\n- README updated\n- Changelog pending",
}

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
        for agent in agents:
            note = DEMO_NOTES.get(agent.name)
            if note:
                update_agent_note(session, agent, AgentNoteUpdate(note=note))

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
