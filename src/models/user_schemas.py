from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class UserCreate(BaseModel):
    username: str
    password: str
    is_admin: bool = False


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserRead(BaseModel):
    id: int
    username: str
    is_admin: bool
    is_active: bool
    created_at: datetime


class UserUpdate(BaseModel):
    is_admin: Optional[bool] = None
    is_active: Optional[bool] = None


class APIKeyCreate(BaseModel):
    name: str


class APIKeyRead(BaseModel):
    id: int
    user_id: int
    name: str
    key: str
    is_active: bool
    created_at: datetime
    last_used_at: Optional[datetime]


class APIKeyReadSafe(BaseModel):
    id: int
    user_id: int
    name: str
    is_active: bool
    created_at: datetime
    last_used_at: Optional[datetime]
