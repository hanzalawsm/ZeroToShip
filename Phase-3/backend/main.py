from typing import List
from fastapi import FastAPI, Depends, HTTPException, status
from sqlmodel import Session, select

from database import get_session
from models import User, Booking, UserRegister, UserLogin, TokenResponse, UserResponse, OrchestrateRequest, OrchestrateResponse
from auth import hash_password, verify_password, create_access_token, get_current_user
from orchestrator import orchestrate

app = FastAPI(title="Smart Local Service Orchestrator - Phase 3 Backend")

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

@app.get("/bookings/me", response_model=List[Booking])
def get_my_bookings(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """DATA INTEGRITY GUARD: Returns only bookings linked to current authenticated user_id."""
    return session.exec(
        select(Booking).where(Booking.user_id == current_user.user_id)
    ).all()

@app.delete("/bookings/{booking_id}")
def cancel_booking(
    booking_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """DATA INTEGRITY GUARD: Enforces that users can only delete their own booking."""
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


@app.post("/api/orchestrate", response_model=OrchestrateResponse)
def orchestrate_endpoint(
    request: OrchestrateRequest,
    session: Session = Depends(get_session)
):
    """Phase 3 Intent Extraction & Ranking Endpoint."""
    if not request.prompt or not request.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt must not be empty.")
    try:
        return orchestrate(request.prompt, session)
    except RuntimeError as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

