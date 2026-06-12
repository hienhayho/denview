from __future__ import annotations

from typing import TYPE_CHECKING

from .models import WorkData, WorkStatus

if TYPE_CHECKING:
    from .agent import Agent


class WorkContext:
    def __init__(self, *, agent: "Agent", work: WorkData) -> None:
        self._agent = agent
        self._work = work

    @property
    def id(self) -> int:
        return self._work.id

    @property
    def data(self) -> WorkData:
        return self._work

    async def done(self) -> WorkData:
        self._work = await self._agent._update_work(
            work_id=self._work.id,
            status=WorkStatus.completed,
        )
        return self._work

    async def fail(self) -> WorkData:
        self._work = await self._agent._update_work(
            work_id=self._work.id,
            status=WorkStatus.failed,
        )
        return self._work

    async def __aenter__(self) -> "WorkContext":
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb) -> None:
        if exc_type is not None:
            await self.fail()
        else:
            await self.done()
