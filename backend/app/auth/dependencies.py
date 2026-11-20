from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session, joinedload
from app.auth.security import decode_access_token
from app.database.session import get_db
from app.models.models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

def get_current_user_optional(token: Optional[str] = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Optional[User]:
    if not token:
        return None
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        return None
    try:
        user_id = int(payload["sub"])
    except (ValueError, TypeError):
        return None
    user = db.query(User).options(joinedload(User.role), joinedload(User.profile)).filter(User.id == user_id).first()
    if not user or not user.is_active:
        return None
    return user

def get_current_user(current_user: Optional[User] = Depends(get_current_user_optional)) -> User:
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication credentials were not provided or are invalid.", headers={"WWW-Authenticate": "Bearer"})
    return current_user

def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.role or current_user.role.name != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Administrator privileges required.")
    return current_user
