# DenView

A real-time multi-agent office visualizer. Run a task with multiple AI agents and watch them work in an animated office — each agent is a fox character at their own desk, switching between screens and idle activities as their status changes.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)

---

## Overview

DenView has three parts:

- **Python SDK** — instrument your agent code with a few async calls to report task and work state.
- **FastAPI server** — stores tasks, agents, and work items; serves a state API for the frontend.
- **Next.js UI** — admin dashboard (tasks, API keys) and an embeddable office view per task.

Each task gets a shareable iframe URL (`/view/<task_id>?token=<view_token>`) that can be embedded anywhere without authentication.

---

## Architecture

```
your agent code
    |
    | Python SDK (httpx, async)
    v
FastAPI server  <-->  SQLite (SQLModel)
    |
    | proxied via Next.js route handlers
    v
Next.js UI
    |- /login, /register
    |- /dashboard
    |- /tasks          (table + embedded office view)
    |- /api-keys
    |- /view/[task_id] (embeddable, no auth — view token only)
```

**Auth model**

- Admin UI: JWT in httpOnly cookie (`/login`)
- SDK calls: `X-API-Key` header
- Embedded view: `?token=<view_token>` query param (per-task, read-only)

**Office view**

- Polls `/tasks/<id>/state` every 3 seconds
- Each agent has a randomized screen (code, chat, charts, files, terminal, kanban, ...) that rotates every 3–6 seconds while working
- Idle agents cycle through short animations (sleep, stretch, doodle, ...) every 1–2 seconds
- Agents going away (coffee, sofa, window) fade out of their desk

---

## Installation

### From PyPI (recommended)

**Requirements:** Python 3.11+

```bash
pip install denview
denview serve --port 8000
```

On first boot the server creates an `admin` user with password `admin`. Change it immediately.

The UI is bundled separately. Run it via Docker (recommended) or clone the repo and run `pnpm dev`.

### Docker (quickstart)

```bash
docker compose up
```

Backend on `http://localhost:8004`, frontend on `http://localhost:3009`.

### From source

**Requirements:** Python 3.11+, Node.js 22+, pnpm

```bash
git clone https://github.com/your-org/denview
cd denview

# backend
uv sync
denview serve --port 8000

# frontend (separate terminal)
cd ui
pnpm install
pnpm dev
```

Set the backend URL in `ui/.env.local`:

```
BACKEND_URL=http://localhost:8000
```

---

## Usage

### 1. Create an API key

Log in at `http://localhost:3009`, go to **API Keys**, and create a key.

### 2. Instrument your agents

```bash
pip install denview
```

```python
from denview.sdk import DenView

dv = DenView(
    api_key="your-api-key",
    backend_url="http://localhost:8004",
    frontend_url="http://localhost:3009",
)

task = await dv.start_task(
    name="My Task",
    description="Optional description",
    agents=[
        {"name": "Alice", "role": "Researcher", "color": "#d95f12"},
        {"name": "Bob",   "role": "Coder",      "color": "#3b82f6"},
    ],
)

print(task.embed_url)  # shareable iframe URL

agent = await task.agent(name="Alice")

# set a markdown note — visible when clicking the agent in the office view
await agent.set_note("""
## Alice — Researcher

Scanning papers and summarizing findings.

- 12 papers in queue
- Flagging contradictions
""")

async with agent.working("refactoring auth module"):
    await do_work()   # marks work failed automatically on exception

await task.finish()
await dv.aclose()
```

### 3. Resume an existing task

`task_id` is returned when you call `start_task`. Persist it (DB, env var, file) to resume later:

```python
# first run — save the id
task = await dv.start_task(name="My Task", agents=[...])
saved_task_id = task.id          # store this
print(task.embed_url)

# later run — reload by id
task = await dv.get_task(task_id=saved_task_id)
print(task.embed_url)
print(task.data.status)          # 'running' | 'done' | 'failed'
```

You can also find task IDs in the admin UI at `/tasks` or via `GET /tasks` with your API key.

### 4. Embed the office view

```html
<iframe src="<task.embed_url>" width="100%" height="500"></iframe>
```

The embed URL works without login — authenticated by the per-task `view_token`.

### CLI reference

```
denview serve [--host HOST] [--port PORT] [--reload]
```

| flag | default | description |
|------|---------|-------------|
| `--host` | `0.0.0.0` | bind address |
| `--port` | `8000` | port |
| `--reload` | `false` | auto-reload on file change (dev only) |
