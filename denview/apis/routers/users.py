from fastapi import APIRouter, HTTPException
from denview.apis.deps import SessionDep, CurrentUser
from denview.models.user_schemas import (
    UserCreate, UserRead, UserUpdate,
    APIKeyCreate, APIKeyRead, APIKeyReadSafe,
)
from denview.crud.user import (
    create_user, get_user, list_users, update_user,
    create_api_key, get_api_key, list_api_keys, revoke_api_key,
)

router = APIRouter(prefix="/users", tags=["users"])


@router.post("", response_model=UserRead)
def create(data: UserCreate, session: SessionDep, caller: CurrentUser):
    if not caller.is_admin:
        raise HTTPException(status_code=403, detail="Admin only")
    return create_user(session, data)


@router.get("", response_model=list[UserRead])
def get_all(session: SessionDep, caller: CurrentUser):
    if not caller.is_admin:
        raise HTTPException(status_code=403, detail="Admin only")
    return list_users(session)


@router.get("/{user_id}", response_model=UserRead)
def get_one(user_id: int, session: SessionDep, caller: CurrentUser):
    if not caller.is_admin and caller.id != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    user = get_user(session, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.patch("/{user_id}", response_model=UserRead)
def update(user_id: int, data: UserUpdate, session: SessionDep, caller: CurrentUser):
    if not caller.is_admin:
        raise HTTPException(status_code=403, detail="Admin only")
    user = get_user(session, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return update_user(session, user, data)


@router.post("/{user_id}/api-keys", response_model=APIKeyRead)
def add_api_key(user_id: int, data: APIKeyCreate, session: SessionDep, caller: CurrentUser):
    if not caller.is_admin and caller.id != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    user = get_user(session, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return create_api_key(session, user_id=user_id, data=data)


@router.get("/{user_id}/api-keys", response_model=list[APIKeyReadSafe])
def get_api_keys(user_id: int, session: SessionDep, caller: CurrentUser):
    if not caller.is_admin and caller.id != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    user = get_user(session, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return list_api_keys(session, user_id)


@router.delete("/{user_id}/api-keys/{key_id}", response_model=APIKeyReadSafe)
def revoke(user_id: int, key_id: int, session: SessionDep, caller: CurrentUser):
    if not caller.is_admin and caller.id != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    key = get_api_key(session, key_id)
    if not key or key.user_id != user_id:
        raise HTTPException(status_code=404, detail="API key not found")
    return revoke_api_key(session, key)
