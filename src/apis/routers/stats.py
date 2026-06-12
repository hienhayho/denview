from datetime import date
from fastapi import APIRouter, HTTPException, Query
from sqlmodel import select, func
from pydantic import BaseModel
from src.apis.deps import SessionDep, CurrentUser
from src.models.task import Task
from src.models.user import User

router = APIRouter(prefix="/stats", tags=["stats"])


class DayStat(BaseModel):
    date: str
    task_count: int
    avg_agents: float


class UserDayStat(BaseModel):
    date: str
    user_id: int
    username: str
    task_count: int
    avg_agents: float


def _build_stmt(from_date: date, to_date: date):
    return (
        func.date(Task.created_at).label("date"),
        Task.created_at >= str(from_date),
        Task.created_at <= str(to_date) + " 23:59:59",
    )


@router.get("/me", response_model=list[DayStat])
def my_stats(
    session: SessionDep,
    user: CurrentUser,
    from_date: date = Query(default=None),
    to_date: date = Query(default=None),
):
    today = date.today()
    from_date = from_date or today
    to_date = to_date or today

    stmt = (
        select(
            func.date(Task.created_at).label("date"),
            func.count(Task.id).label("task_count"),
            func.avg(Task.agent_count).label("avg_agents"),
        )
        .where(
            Task.user_id == user.id,
            Task.created_at >= str(from_date),
            Task.created_at <= str(to_date) + " 23:59:59",
        )
        .group_by(func.date(Task.created_at))
        .order_by(func.date(Task.created_at))
    )

    rows = session.exec(stmt).all()
    return [
        DayStat(date=row.date, task_count=row.task_count, avg_agents=round(row.avg_agents or 0, 2))
        for row in rows
    ]


@router.get("/users", response_model=list[UserDayStat])
def all_users_stats(
    session: SessionDep,
    user: CurrentUser,
    from_date: date = Query(default=None),
    to_date: date = Query(default=None),
):
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin only")

    today = date.today()
    from_date = from_date or today
    to_date = to_date or today

    stmt = (
        select(
            func.date(Task.created_at).label("date"),
            Task.user_id,
            func.count(Task.id).label("task_count"),
            func.avg(Task.agent_count).label("avg_agents"),
        )
        .where(
            Task.created_at >= str(from_date),
            Task.created_at <= str(to_date) + " 23:59:59",
        )
        .group_by(func.date(Task.created_at), Task.user_id)
        .order_by(func.date(Task.created_at))
    )

    rows = session.exec(stmt).all()
    user_ids = {r.user_id for r in rows}
    users = {u.id: u.username for u in session.exec(select(User).where(User.id.in_(user_ids))).all()}

    return [
        UserDayStat(
            date=row.date,
            user_id=row.user_id,
            username=users.get(row.user_id, f"user_{row.user_id}"),
            task_count=row.task_count,
            avg_agents=round(row.avg_agents or 0, 2),
        )
        for row in rows
    ]
