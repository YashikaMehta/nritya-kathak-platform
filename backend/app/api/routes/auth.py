from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from app.auth.dependencies import get_current_user
from app.auth.security import create_access_token, get_password_hash, verify_password
from app.database.session import get_db
from app.models.models import Role, StudentProfile, User
from app.schemas.schemas import TokenResponse, UserLogin, UserOut, UserRegister

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register_user(payload: UserRegister, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email.lower().strip()).first():
        raise HTTPException(status_code=400, detail="An account with this email already exists.")
    user_role = db.query(Role).filter(Role.name == "user").first()
    if not user_role:
        user_role = Role(name="user", description="Registered member")
        db.add(user_role)
        db.flush()
    new_user = User(email=payload.email.lower().strip(), hashed_password=get_password_hash(payload.password), full_name=payload.full_name.strip(), role_id=user_role.id, is_active=True)
    db.add(new_user)
    db.flush()
    db.add(StudentProfile(user_id=new_user.id, display_name=payload.full_name.strip(), experience_level="Learner", is_public=True, show_location=True, show_achievements=True))
    db.commit()
    created_user = db.query(User).options(joinedload(User.role), joinedload(User.profile)).filter(User.id == new_user.id).first()
    return TokenResponse(access_token=create_access_token({"sub": str(created_user.id), "role": created_user.role.name}), user=created_user)

@router.post("/login", response_model=TokenResponse)
def login_user(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).options(joinedload(User.role), joinedload(User.profile)).filter(User.email == payload.email.lower().strip()).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account deactivated.")
    return TokenResponse(access_token=create_access_token({"sub": str(user.id), "role": user.role.name}), user=user)

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
