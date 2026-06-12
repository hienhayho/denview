from contextlib import asynccontextmanager
from dotenv import load_dotenv

from src.apis.routers import agents, auth, tasks, users, demo

load_dotenv()

from fastapi import FastAPI
from src.database.engine import init_db, engine
import src.models.task  # noqa: F401 — register SQLModel tables
import src.models.user  # noqa: F401
from src.apis.routers import stats
from src.core.bootstrap import seed_admin
from src.core.logging import get_logger
from sqlmodel import Session

log = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    log.info("starting up")
    init_db()
    with Session(engine) as session:
        seed_admin(session)
    yield
    log.info("shutting down")


app = FastAPI(title="Multi-Agents View", lifespan=lifespan)

app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(agents.router)
app.include_router(users.router)
app.include_router(stats.router)
app.include_router(demo.router)
