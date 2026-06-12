import asyncio
import random
from denview.sdk import DenView

API_KEY = ""

AGENTS = [
    {"name": "Alice", "role": "Researcher", "color": "#d95f12"},
    {"name": "Bob", "role": "Coder", "color": "#3b82f6"},
    {"name": "Carol", "role": "Reviewer", "color": "#8b5cf6"},
    {"name": "Dave", "role": "Planner", "color": "#14b8a6"},
    {"name": "Eve", "role": "Analyst", "color": "#facc15"},
    {"name": "Frank", "role": "Writer", "color": "#ef4444"},
]

WORK_ITEMS = [
    "refactoring auth module",
    "patching merge conflict",
    "writing migration script",
    "running unit tests",
    "reading stack trace",
    "drafting reply to PM",
    "reviewing pull request",
    "plotting cohort retention",
    "inspecting funnel data",
    "organizing artifacts",
    "composing brief",
    "running build pipeline",
    "training small model",
    "awaiting CI",
    "fetching dependencies",
    "planning sprint backlog",
    "auditing security logs",
    "tuning forecast model",
]


async def run_agent(task, agent_name: str, rounds: int = 5) -> None:
    for i in range(rounds):
        label = random.choice(WORK_ITEMS)
        print(f"  [{agent_name}] starting: {label}")

        agent = await task.agent(name=agent_name)
        try:
            async with agent.working(label):
                await asyncio.sleep(random.uniform(2.0, 6.0))
            print(f"  [{agent_name}] done: {label}")
        except Exception as e:
            print(f"  [{agent_name}] failed: {e}")

        # idle gap between work items
        await asyncio.sleep(random.uniform(0.5, 2.0))


async def main() -> None:
    dv = DenView(
        api_key=API_KEY,
        backend_url="http://localhost:8004",
        frontend_url="http://localhost:3009",
    )

    print("Creating task…")
    task = await dv.start_task(
        name="Multi-Agent Test Run",
        description="Simulated agents doing work with random sleep",
        agents=AGENTS,
    )
    print(f"Task ID : {task.id}")
    print(f"View URL: {task.embed_url}")
    print()

    # run all agents concurrently, staggered start so they don't all begin at once
    async def staggered(name: str, delay: float) -> None:
        await asyncio.sleep(delay)
        await run_agent(task, name, rounds=random.randint(3, 7))

    await asyncio.gather(*[staggered(a["name"], i * 0.8) for i, a in enumerate(AGENTS)])

    print("\nAll agents finished. Marking task done.")
    await task.finish()
    print("Done.")

    await dv.aclose()


if __name__ == "__main__":
    asyncio.run(main())
