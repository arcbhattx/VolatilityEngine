from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import timedelta

from app.core.database import get_async_session
from app.core.security import verify_password, get_password_hashed, create_access_token, ACCESS_TOKEN_EXPIRES_MINUTES
from app.dependencies.auth import get_current_active_user
from app.models.user import User
from app.schema.auth_models import Token, UserCreate, UserRead

router = APIRouter(prefix="/auth")

async def authenticate_user(username: str, password: str, session: AsyncSession):
    result = await session.execute(select(User).where(User.username == username))
    user = result.scalar_one_or_none()
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user

@router.post("/auth-user", tags=["auth"], response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: AsyncSession = Depends(get_async_session)
):
    user = await authenticate_user(form_data.username, form_data.password, session)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Incorrect username or password",
                            headers={"WWW-Authenticate": "Bearer"})
    access_token = create_access_token(
        {"sub": user.username},
        timedelta(minutes=ACCESS_TOKEN_EXPIRES_MINUTES)
    )
    return {"status": "success", "access_token": access_token, "token_type": "bearer"}

@router.post("/create-user", tags=["users"])
async def create_user(user: UserCreate, session: AsyncSession = Depends(get_async_session)):
    existing = await session.execute(select(User).where(User.username == user.username))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="User already exists")

    new_user = User(username=user.username, hashed_password=get_password_hashed(user.password))
    session.add(new_user)
    try:
        await session.commit()
        await session.refresh(new_user)
    except Exception:
        await session.rollback()
        raise HTTPException(status_code=500, detail="Failed to create user")

    return {"status": "success", "user": {"id": new_user.id, "username": new_user.username}}

@router.get("/user-info", tags=["users"], response_model=UserRead)
async def get_user_info(current_user: User = Depends(get_current_active_user)):
    return current_user