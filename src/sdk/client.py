from __future__ import annotations

from datetime import datetime

import httpx

from .agent import Agent
from .exceptions import APIError
from .models import AgentData, AgentInfo, AgentStatus, TaskData, TaskStatus
from .task import Task


class DenView:
    def __init__(
        self,
        *,
        api_key: str,
        backend_url: str = "http://localhost:8000",
        frontend_url: str = "http://localhost:3000",
    ) -> None:
        self._backend_url = backend_url.rstrip("/")
        self._frontend_url = frontend_url.rstrip("/")
        self._http = httpx.AsyncClient(
            base_url=self._backend_url,
            headers={"X-API-Key": api_key},
            timeout=30.0,
        )

    async def start_task(
        self,
        *,
        name: str,
        agents: list[AgentInfo | dict],
        description: str | None = None,
    ) -> Task:
        normalized = [
            a if isinstance(a, dict) else {"name": a.name, "role": a.role, "color": a.color}
            for a in agents
        ]
        res = await self._http.post(
            "/tasks",
            json={"name": name, "description": description, "agents": normalized},
        )
        if not res.is_success:
            raise APIError(res.status_code, res.text)

        d = res.json()
        task_data = TaskData(
            id=d["id"],
            user_id=d["user_id"],
            name=d["name"],
            description=d.get("description"),
            status=TaskStatus(d["status"]),
            agent_count=d["agent_count"],
            view_token=d["view_token"],
            created_at=datetime.fromisoformat(d["created_at"]),
            finished_at=datetime.fromisoformat(d["finished_at"]) if d.get("finished_at") else None,
        )

        agents_res = await self._http.get(f"/tasks/{task_data.id}/agents")
        if not agents_res.is_success:
            raise APIError(agents_res.status_code, agents_res.text)

        agent_objects = [
            Agent(
                http=self._http,
                task_id=task_data.id,
                data=AgentData(
                    id=a["id"],
                    task_id=a["task_id"],
                    name=a["name"],
                    role=a["role"],
                    color=a["color"],
                    status=AgentStatus(a["status"]),
                    created_at=datetime.fromisoformat(a["created_at"]),
                ),
            )
            for a in agents_res.json()
        ]

        return Task(
            http=self._http,
            frontend_url=self._frontend_url,
            data=task_data,
            agents=agent_objects,
        )

    async def aclose(self) -> None:
        await self._http.aclose()
