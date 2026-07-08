import asyncio
import random

from fastapi import APIRouter, BackgroundTasks, Security
from fastapi.security import APIKeyHeader
from pydantic import BaseModel
from denview.apis.deps import SessionDep, APIKeyUser
from denview.models.schemas import TaskCreate, AgentCreate
from denview.crud.task import create_task
from denview.sdk.client import DenView

router = APIRouter(prefix="/demo", tags=["demo"])

_api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

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


class DemoRequest(BaseModel):
    backend_url: str = "http://localhost:8000"
    frontend_url: str = "http://localhost:3000"


class DemoResponse(BaseModel):
    task_id: int
    view_token: str
    embed_url: str


async def _run_demo(task_id: int, api_key: str, backend_url: str) -> None:
    dv = DenView(api_key=api_key, backend_url=backend_url)
    try:
        task = await dv.get_task(task_id)

        # set notes on all agents
        for agent_name, note in DEMO_NOTES.items():
            try:
                agent = await task.agent(name=agent_name)
                await agent.set_note(note)
            except Exception:
                pass

        async def run_agent(agent_name: str, delay: float) -> None:
            await asyncio.sleep(delay)
            agent = await task.agent(name=agent_name)
            for _ in range(random.randint(3, 7)):
                label = random.choice(WORK_ITEMS)
                async with agent.working(label):
                    await asyncio.sleep(random.uniform(2.0, 6.0))
                await asyncio.sleep(random.uniform(0.5, 2.0))

        agent_names = [a["name"] for a in DEMO_AGENTS]
        await asyncio.gather(*[
            run_agent(name, i * 0.8)
            for i, name in enumerate(agent_names)
        ])

        await task.finish()
    finally:
        await dv.aclose()


@router.post("/run", response_model=DemoResponse)
def run_demo(
    body: DemoRequest,
    background_tasks: BackgroundTasks,
    session: SessionDep,
    user: APIKeyUser,
    api_key: str = Security(_api_key_header),
):
    task = create_task(session, user_id=user.id, data=TaskCreate(
        name="Demo Run",
        description="Simulated agents — triggered from demo page",
        agents=[AgentCreate(**a) for a in DEMO_AGENTS],
    ))
    background_tasks.add_task(_run_demo, task.id, api_key, body.backend_url)
    embed_url = f"{body.frontend_url}/view/{task.id}?token={task.view_token}"
    return DemoResponse(task_id=task.id, view_token=task.view_token, embed_url=embed_url)
