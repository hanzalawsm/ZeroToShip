import json
from typing import Optional, List
from sqlmodel import SQLModel, Field
from pydantic import BaseModel

# --- DATABASE MODELS ---

class User(SQLModel, table=True):
    __tablename__ = "users"
    
    user_id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str = Field(unique=True, index=True)
    password_hash: str
    phone: Optional[str] = None
    avatar_url: Optional[str] = None


class Provider(SQLModel, table=True):
    __tablename__ = "providers"
    
    provider_id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    category: str
    neighborhood_zone: str
    rating: float = Field(default=5.0)
    review_count: int = Field(default=0)
    response_time: Optional[str] = None
    completion_rate: float = Field(default=1.0)
    hourly_rate: Optional[str] = None
    experience_years: Optional[int] = None
    verified: bool = Field(default=False)
    avatar_url: Optional[str] = None
    specialities: str = Field(default="[]")
    phone: Optional[str] = None
    available_now: bool = Field(default=True)


class Booking(SQLModel, table=True):
    __tablename__ = "bookings"
    
    booking_id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.user_id")
    provider_id: int = Field(foreign_key="providers.provider_id")
    booking_time: str
    status: str = Field(default="Pending")


# --- DTOs / REQUEST MODELS ---

class UserRegister(BaseModel):
    name: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    user_id: int
    name: str
    email: str


class UserProfileResponse(UserResponse):
    phone: Optional[str]
    avatar_url: Optional[str]


class ProviderResponse(BaseModel):
    provider_id: int
    name: str
    category: str
    neighborhood_zone: str
    rating: float
    review_count: int
    response_time: Optional[str]
    completion_rate: float
    hourly_rate: Optional[str]
    experience_years: Optional[int]
    verified: bool
    avatar_url: Optional[str]
    specialities: List[str]
    phone: Optional[str]
    available_now: bool

    @classmethod
    def from_orm_provider(cls, provider: Provider):
        specialities_list = []
        if provider.specialities:
            try:
                specialities_list = json.loads(provider.specialities)
            except Exception:
                specialities_list = []
        
        return cls(
            provider_id=provider.provider_id,
            name=provider.name,
            category=provider.category,
            neighborhood_zone=provider.neighborhood_zone,
            rating=provider.rating,
            review_count=provider.review_count,
            response_time=provider.response_time,
            completion_rate=provider.completion_rate,
            hourly_rate=provider.hourly_rate,
            experience_years=provider.experience_years,
            verified=provider.verified,
            avatar_url=provider.avatar_url,
            specialities=specialities_list,
            phone=provider.phone,
            available_now=provider.available_now
        )


class BookingCreate(BaseModel):
    provider_id: int
    booking_time: str


class BookingResponse(BaseModel):
    booking_id: int
    user_id: int
    user_name: str
    provider: ProviderResponse
    booking_time: str
    status: str


# --- PHASE 5 SCHEMAS (ORCHESTRATOR) ---

class OrchestrateRequest(BaseModel):
    prompt: str


class ExtractedIntent(BaseModel):
    service: Optional[str] = Field(default=None, description="The requested service/category")
    location: Optional[str] = Field(default=None, description="The neighborhood or zone requested")
    time: Optional[str] = Field(default=None, description="Extracted time or urgency")
    confidence: float = Field(default=1.0, description="Confidence score from 0.0 to 1.0")
    is_service_request: bool = Field(default=True, description="Whether the prompt expresses an intent to search for or book a service")
    raw_prompt: str = Field(default="", description="The original raw prompt")


class AIReasoning(BaseModel):
    top_provider_id: Optional[int]
    summary: str
    key_factors: List[str]
    alternative_count: int


class OrchestrateResponse(BaseModel):
    intent: ExtractedIntent
    top_provider: Optional[ProviderResponse]
    all_matches: List[ProviderResponse]
    aiReasoning: AIReasoning