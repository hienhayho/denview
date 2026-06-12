from __future__ import annotations

from typing import TYPE_CHECKING

from .agent import Agent
from .exceptions import AgentNotFoundError, APIError
from .models import AgentData, AgentStatus, TaskData, TaskStatus

if TYPE_CHECKING:
    import httpx


class Task:
    def __init__(self, *, http: "httpx.AsyncClient", frontend_url: str, data: TaskData, agents: list[Agent]) -> None:
        self._http = http
        self._frontend_url = frontend_url
        self._data = data
        self._agents: dict[str, Agent] = {a.name: a for a in agents}

    @property
    def id(self) -> int:
        return self._data.id

    @property
    def data(self) -> TaskData:
        return self._data

    @property
    def embed_url(self) -> str:
        return f"{self._frontend_url}/view/{self._data.id}?token={self._data.view_token}"

    async def agent(self, *, name: str) -> Agent:
        if name not in self._agents:
            raise AgentNotFoundError(f"Agent '{name}' not found in task {self._data.id}")
        res = await self._http.get(f"/tasks/{self._data.id}/agents/{self._agents[name].id}")
        if not res.is_success:
            raise APIError(res.status_code, res.text)
        d = res.json()
        refreshed = AgentData(
            id=d["id"],
            task_id=d["task_id"],
            name=d["name"],
            role=d["role"],
            color=d["color"],
            status=AgentStatus(d["status"]),
            created_at=d["created_at"],
        )
        self._agents[name] = Agent(http=self._http, task_id=self._data.id, data=refreshed)
        return self._agents[name]

    async def finish(self) -> TaskData:
        return await self._set_status(status=TaskStatus.done)

    async def fail(self) -> TaskData:
        return await self._set_status(status=TaskStatus.failed)

    async def _set_status(self, *, status: TaskStatus) -> TaskData:
        res = await self._http.patch(
            f"/tasks/{self._data.id}/status",
            json={"status": status.value},
        )
        if not res.is_success:
            raise APIError(res.status_code, res.text)
        d = res.json()
        from datetime import datetime
        self._data = TaskData(
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
        return self._data
