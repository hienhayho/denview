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

**Requirements:** Python 3.11+, Node.js 18+, pnpm

### Backend

```bash
# from repo root
uv sync
denview serve --port 8000
```

On first boot the server creates an `admin` user with password `admin`. Change it immediately.

### Frontend

```bash
cd ui
pnpm install
pnpm dev                      # development
pnpm build && pnpm start      # production
```

Set the backend URL in `ui/.env.local`:

```
BACKEND_URL=http://localhost:8000
```

---

## Usage

### 1. Create an API key

Log in at `http://localhost:3000`, go to **API Keys**, and create a key.

### 2. Instrument your agents

```python
from src.sdk import DenView

dv = DenView(
    api_key="your-api-key",
    backend_url="http://localhost:8000",
    frontend_url="http://localhost:3000",
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
async with agent.working("refactoring auth module"):
    await do_work()   # marks work failed automatically on exception

await task.finish()
await dv.aclose()
```

### 3. Embed the office view

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
