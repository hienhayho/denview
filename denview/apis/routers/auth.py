from fastapi import APIRouter, HTTPException, Response
from denview.apis.deps import SessionDep, CurrentUser
from denview.models.user_schemas import LoginRequest, TokenResponse, UserRead, UserCreate
from denview.crud.user import get_user_by_username, create_user
from denview.core.security import verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, response: Response, session: SessionDep):
    user = get_user_by_username(session, data.username)
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account disabled")

    token = create_access_token(user.id)
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        samesite="lax",
        max_age=60 * 60 * 24,
    )
    return TokenResponse(access_token=token)


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    return {"ok": True}


@router.get("/me", response_model=UserRead)
def me(current_user: CurrentUser):
    return current_user


@router.post("/register", response_model=UserRead, status_code=201)
def register(data: UserCreate, session: SessionDep):
    if get_user_by_username(session, data.username):
        raise HTTPException(status_code=409, detail="Username already taken")
    return create_user(session, data)
