from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select, col

from database import get_session
from models import (
    User, Provider, Booking, UserRegister, UserLogin, TokenResponse, UserResponse,
    UserProfileResponse, UserProfileUpdate, ProviderResponse, BookingCreate, BookingResponse,
    OrchestrateRequest, OrchestrateResponse
)
from auth import hash_password, verify_password, create_access_token, get_current_user
from orchestrator import orchestrate

app = FastAPI(title="Smart Local Service Orchestrator - Phase 5 Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserRegister, session: Session = Depends(get_session)):
    existing_user = session.exec(select(User).where(User.email == user_data.email)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hash_password(user_data.password)
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user

@app.post("/login", response_model=TokenResponse)
def login(login_data: UserLogin, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == login_data.email)).first()
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    token = create_access_token(data={"sub": str(user.user_id)})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/users/me", response_model=UserProfileResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@app.put("/users/me", response_model=UserProfileResponse)
def update_profile(
    update_data: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    if update_data.name is not None:
        current_user.name = update_data.name
    if update_data.phone is not None:
        current_user.phone = update_data.phone
    if update_data.avatar_url is not None:
        current_user.avatar_url = update_data.avatar_url
        
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return current_user

@app.get("/providers", response_model=List[ProviderResponse])
def get_providers(
    category: Optional[str] = Query(None),
    zone: Optional[str] = Query(None),
    sort: Optional[str] = Query(None),
    available_now: Optional[bool] = Query(None),
    limit: int = Query(20, le=100),
    session: Session = Depends(get_session)
):
    statement = select(Provider)
    filters = []
    if category:
        filters.append(col(Provider.category).ilike(category))
    if zone:
        filters.append(col(Provider.neighborhood_zone).ilike(zone))
    if available_now is not None:
        filters.append(Provider.available_now == available_now)
        
    if filters:
        statement = statement.where(*filters)
        
    if sort == "rating":
        statement = statement.order_by(col(Provider.rating).desc())
    else:
        statement = statement.order_by(col(Provider.provider_id).asc())
        
    statement = statement.limit(limit)
    providers = session.exec(statement).all()
    return [ProviderResponse.from_orm_provider(p) for p in providers]

@app.get("/providers/{provider_id}", response_model=ProviderResponse)
def get_provider(provider_id: int, session: Session = Depends(get_session)):
    provider = session.get(Provider, provider_id)
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    return ProviderResponse.from_orm_provider(provider)

@app.post("/bookings", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(
    booking_data: BookingCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    provider = session.get(Provider, booking_data.provider_id)
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")
        
    booking = Booking(
        user_id=current_user.user_id,
        provider_id=provider.provider_id,
        booking_time=booking_data.booking_time,
        status="Pending"
    )
    session.add(booking)
    session.commit()
    session.refresh(booking)
    
    return BookingResponse(
        booking_id=booking.booking_id,
        user_id=current_user.user_id,
        user_name=current_user.name,
        provider=ProviderResponse.from_orm_provider(provider),
        booking_time=booking.booking_time,
        status=booking.status
    )

@app.get("/bookings/me", response_model=List[BookingResponse])
def get_my_bookings(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    bookings = session.exec(
        select(Booking).where(Booking.user_id == current_user.user_id)
    ).all()
    
    responses = []
    for b in bookings:
        provider = session.get(Provider, b.provider_id)
        if provider:
            responses.append(BookingResponse(
                booking_id=b.booking_id,
                user_id=b.user_id,
                user_name=current_user.name,
                provider=ProviderResponse.from_orm_provider(provider),
                booking_time=b.booking_time,
                status=b.status
            ))
    return responses

@app.delete("/bookings/{booking_id}")
def cancel_booking(
    booking_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    booking = session.get(Booking, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    if booking.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: You do not have permission to manage this booking"
        )

    booking.status = "Cancelled"
    session.add(booking)
    session.commit()
    return {"message": f"Booking {booking_id} cancelled successfully"}


@app.patch("/bookings/{booking_id}/complete", response_model=BookingResponse)
def complete_booking(
    booking_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    booking = session.get(Booking, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    if booking.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: You do not have permission to manage this booking"
        )

    booking.status = "Completed"
    session.add(booking)
    session.commit()
    session.refresh(booking)

    provider = session.get(Provider, booking.provider_id)
    return BookingResponse(
        booking_id=booking.booking_id,
        user_id=booking.user_id,
        user_name=current_user.name,
        provider=ProviderResponse.from_orm_provider(provider),
        booking_time=booking.booking_time,
        status=booking.status
    )


@app.post("/api/orchestrate", response_model=OrchestrateResponse)
def orchestrate_endpoint(
    request: OrchestrateRequest,
    session: Session = Depends(get_session)
):
    """Phase 5 Intent Extraction & Reasoning Endpoint."""
    if not request.prompt or not request.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt must not be empty.")
    try:
        return orchestrate(request.prompt, session)
    except RuntimeError as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
