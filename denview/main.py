from contextlib import asynccontextmanager
from dotenv import load_dotenv

from denview.apis.routers import agents, auth, tasks, users, demo

load_dotenv()

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from denview.database.engine import init_db, engine
import denview.models.task  # noqa: F401 — register SQLModel tables
import denview.models.user  # noqa: F401
from denview.apis.routers import stats
from denview.core.bootstrap import seed_admin
from denview.core.logging import get_logger
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

_cors_origins = [o.strip() for o in os.getenv("CORS_ORIGINS", "*").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=_cors_origins != ["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(agents.router)
app.include_router(users.router)
app.include_router(stats.router)
app.include_router(demo.router)
