from typing import Annotated
from fastapi import Depends, HTTPException, Cookie, Security
from fastapi.security import APIKeyHeader
from sqlmodel import Session
from denview.database.engine import get_session
from denview.core.security import decode_access_token
from denview.crud.user import get_user, get_api_key_by_value, touch_api_key
from denview.models.user import User, APIKey

SessionDep = Annotated[Session, Depends(get_session)]

_api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)


def _get_current_user(
    session: Session = Depends(get_session),
    access_token: str | None = Cookie(default=None),
) -> User:
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user_id = decode_access_token(access_token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = get_user(session, user_id)
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User inactive or not found")
    return user


def _get_api_key_user(
    session: Session = Depends(get_session),
    api_key: str | None = Security(_api_key_header),
) -> User:
    if not api_key:
        raise HTTPException(status_code=401, detail="X-API-Key header missing")
    key_obj = get_api_key_by_value(session, api_key)
    if not key_obj:
        raise HTTPException(status_code=401, detail="Invalid or revoked API key")
    touch_api_key(session, key_obj)
    user = get_user(session, key_obj.user_id)
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User inactive")
    return user


CurrentUser = Annotated[User, Depends(_get_current_user)]
APIKeyUser = Annotated[User, Depends(_get_api_key_user)]
