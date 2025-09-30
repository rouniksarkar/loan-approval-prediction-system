from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

# Auth Models
class UserSignup(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    email: str

class TokenData(BaseModel):
    email: Optional[str] = None