# Phase-2/backend/models.py
from typing import Optional, List
from datetime import datetime
from sqlmodel import SQLModel, Field
from pydantic import BaseModel

# --- DATABASE MODELS ---

class User(SQLModel, table=True):
    __tablename__ = "users"
    
    user_id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str = Field(unique=True, index=True)
    password_hash: str


class Provider(SQLModel, table=True):
    __tablename__ = "providers"
    
    provider_id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    category: str
    neighborhood_zone: str
    rating: float = Field(default=5.0)


class Booking(SQLModel, table=True):
    __tablename__ = "bookings"
    
    booking_id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.user_id")
    provider_id: int = Field(foreign_key="providers.provider_id")
    booking_time: datetime
    status: str = Field(default="Pending")


# --- DTOs / REQUEST MODELS ---

class UserRegister(SQLModel):
    name: str
    email: str
    password: str


class UserLogin(SQLModel):
    email: str
    password: str


class TokenResponse(SQLModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(SQLModel):
    user_id: int
    name: str
    email: str

# --- PHASE 3 SCHEMAS ---

class OrchestrateRequest(BaseModel):
    prompt: str  # Supports English, Urdu, Roman Urdu

class ExtractedIntent(BaseModel):
    service: Optional[str] = Field(description="The requested service/category, e.g., Electrician, Plumber")
    location: Optional[str] = Field(description="The neighborhood or zone requested")
    time: Optional[str] = Field(description="Extracted time or urgency, e.g., Tomorrow at 3 PM, Urgent")

class OrchestrateResponse(BaseModel):
    intent: ExtractedIntent
    top_provider: Optional[Provider]
    all_matches: List[Provider]
    explanation: str