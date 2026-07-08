from __future__ import annotations

from typing import TYPE_CHECKING

from .exceptions import APIError
from .models import AgentData, AgentStatus, WorkData, WorkStatus
from .work_context import WorkContext

if TYPE_CHECKING:
    import httpx


class Agent:
    def __init__(self, *, http: "httpx.AsyncClient", task_id: int, data: AgentData) -> None:
        self._http = http
        self._task_id = task_id
        self._data = data

    @property
    def id(self) -> int:
        return self._data.id

    @property
    def name(self) -> str:
        return self._data.name

    @property
    def data(self) -> AgentData:
        return self._data

    async def start_work(self, *, label: str) -> WorkContext:
        res = await self._http.post(
            f"/tasks/{self._task_id}/agents/{self._data.id}/works",
            json={"label": label},
        )
        if not res.is_success:
            raise APIError(res.status_code, res.text)
        work = _parse_work(res.json())
        await self._set_status(status=AgentStatus.working)
        return WorkContext(agent=self, work=work)

    def working(self, label: str) -> WorkContext:
        """Async context manager shorthand: `async with agent.working("label"):`"""
        return _LazyWorkContext(agent=self, label=label)

    async def _update_work(self, *, work_id: int, status: WorkStatus) -> WorkData:
        res = await self._http.patch(
            f"/tasks/{self._task_id}/agents/{self._data.id}/works/{work_id}",
            json={"status": status.value},
        )
        if not res.is_success:
            raise APIError(res.status_code, res.text)
        work = _parse_work(res.json())
        if status in (WorkStatus.completed, WorkStatus.failed):
            await self._set_status(status=AgentStatus.idle)
        return work

    async def set_note(self, note: str | None) -> None:
        res = await self._http.patch(
            f"/tasks/{self._task_id}/agents/{self._data.id}/note",
            json={"note": note},
        )
        if not res.is_success:
            raise APIError(res.status_code, res.text)

    async def _set_status(self, *, status: AgentStatus) -> None:
        res = await self._http.patch(
            f"/tasks/{self._task_id}/agents/{self._data.id}/status",
            json={"status": status.value},
        )
        if not res.is_success:
            raise APIError(res.status_code, res.text)


class _LazyWorkContext:
    """Defers `start_work` until __aenter__ so `working()` itself is sync."""

    def __init__(self, *, agent: Agent, label: str) -> None:
        self._agent = agent
        self._label = label
        self._ctx: WorkContext | None = None

    async def __aenter__(self) -> WorkContext:
        self._ctx = await self._agent.start_work(label=self._label)
        return self._ctx

    async def __aexit__(self, exc_type, exc_val, exc_tb) -> None:
        if self._ctx:
            await self._ctx.__aexit__(exc_type, exc_val, exc_tb)


def _parse_work(d: dict) -> WorkData:
    from datetime import datetime
    from .models import WorkStatus

    return WorkData(
        id=d["id"],
        agent_id=d["agent_id"],
        task_id=d["task_id"],
        label=d["label"],
        status=WorkStatus(d["status"]),
        started_at=datetime.fromisoformat(d["started_at"]),
        ended_at=datetime.fromisoformat(d["ended_at"]) if d.get("ended_at") else None,
    )
