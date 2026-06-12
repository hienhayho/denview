import os
from sqlmodel import Session
from src.crud.user import get_user_by_username, create_user
from src.models.user_schemas import UserCreate
from src.core.logging import get_logger

log = get_logger(__name__)


def seed_admin(session: Session) -> None:
    username = os.getenv("ADMIN_USERNAME", "admin")
    password = os.getenv("ADMIN_PASSWORD", "admin")

    if get_user_by_username(session, username):
        log.info("admin already exists, skipping seed", username=username)
        return

    create_user(session, UserCreate(username=username, password=password, is_admin=True))
    log.info("admin user created", username=username)
