from pydantic import BaseModel, EmailStr
from datetime import datetime

# Token schemas
class Token(BaseModel):
    status: str
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

# User schemas
class UserCreate(BaseModel):
    username: str
    password: str
    email: str | None = None

class UserInDb(BaseModel):
    id: int
    username: str
    email: str | None = None
    hashed_password: str

    model_config = {"from_attributes": True}  # allows .model_validate(sqlalchemy_obj)

class UserRead(BaseModel):
    id: int
    username: str
    email: str | None = None

    model_config = {"from_attributes": True}