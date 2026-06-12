import secrets
from datetime import datetime
from typing import Optional
from sqlmodel import Session, select
from denview.models.user import User, APIKey
from denview.models.user_schemas import UserCreate, UserUpdate, APIKeyCreate
from denview.core.security import hash_password


def create_user(session: Session, data: UserCreate) -> User:
    user = User(
        username=data.username,
        hashed_password=hash_password(data.password),
        is_admin=data.is_admin,
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


def get_user(session: Session, user_id: int) -> Optional[User]:
    return session.get(User, user_id)


def get_user_by_username(session: Session, username: str) -> Optional[User]:
    return session.exec(select(User).where(User.username == username)).first()


def list_users(session: Session) -> list[User]:
    return list(session.exec(select(User).order_by(User.created_at.desc())).all())


def update_user(session: Session, user: User, data: UserUpdate) -> User:
    if data.is_admin is not None:
        user.is_admin = data.is_admin
    if data.is_active is not None:
        user.is_active = data.is_active
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


def create_api_key(session: Session, user_id: int, data: APIKeyCreate) -> APIKey:
    key = APIKey(
        user_id=user_id,
        name=data.name,
        key=secrets.token_urlsafe(32),
    )
    session.add(key)
    session.commit()
    session.refresh(key)
    return key


def get_api_key(session: Session, key_id: int) -> Optional[APIKey]:
    return session.get(APIKey, key_id)


def get_api_key_by_value(session: Session, key: str) -> Optional[APIKey]:
    return session.exec(select(APIKey).where(APIKey.key == key, APIKey.is_active == True)).first()


def list_api_keys(session: Session, user_id: int) -> list[APIKey]:
    return list(session.exec(select(APIKey).where(APIKey.user_id == user_id).order_by(APIKey.created_at.desc())).all())


def revoke_api_key(session: Session, api_key: APIKey) -> APIKey:
    api_key.is_active = False
    session.add(api_key)
    session.commit()
    session.refresh(api_key)
    return api_key


def touch_api_key(session: Session, api_key: APIKey) -> None:
    api_key.last_used_at = datetime.utcnow()
    session.add(api_key)
    session.commit()
