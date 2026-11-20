from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from app.auth.dependencies import get_current_user
from app.database.session import get_db
from app.models.models import Bookmark, CommunitySubmission, StudentProfile, User
from app.schemas.schemas import BookmarkCreate, BookmarkOut, CommunitySubmissionCreate, CommunitySubmissionOut, StudentProfileOut, StudentProfileUpdate

router = APIRouter(tags=["Community, Profile & Bookmarks"])

@router.get("/community/approved", response_model=List[CommunitySubmissionOut])
def list_approved_contributions(db: Session = Depends(get_db)):
    items = db.query(CommunitySubmission).options(joinedload(CommunitySubmission.submitted_by)).filter(CommunitySubmission.status == "approved").order_by(CommunitySubmission.updated_at.desc()).all()
    out = []
    for sub in items:
        dto = CommunitySubmissionOut.model_validate(sub); dto.submitter_name = sub.submitted_by.full_name if sub.submitted_by else "Community Contributor"; out.append(dto)
    return out

@router.get("/community/my-submissions", response_model=List[CommunitySubmissionOut])
def list_my_submissions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = db.query(CommunitySubmission).filter(CommunitySubmission.submitted_by_id == current_user.id).order_by(CommunitySubmission.created_at.desc()).all()
    out = []
    for sub in items:
        dto = CommunitySubmissionOut.model_validate(sub); dto.submitter_name = current_user.full_name; out.append(dto)
    return out

@router.post("/community/submissions", response_model=CommunitySubmissionOut, status_code=status.HTTP_201_CREATED)
def submit_contribution(payload: CommunitySubmissionCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not payload.rights_confirmed: raise HTTPException(status_code=400, detail="Rights confirmation required.")
    sub = CommunitySubmission(submitted_by_id=current_user.id, submission_type=payload.submission_type, title=payload.title.strip(), summary=payload.summary.strip(), content_body=payload.content_body.strip(), gharana_or_category=payload.gharana_or_category, source_references=payload.source_references.strip(), media_url=payload.media_url, rights_confirmed=payload.rights_confirmed, status="pending")
    db.add(sub); db.commit(); db.refresh(sub)
    dto = CommunitySubmissionOut.model_validate(sub); dto.submitter_name = current_user.full_name; return dto

@router.get("/community/learners", response_model=List[StudentProfileOut])
def list_public_learners(db: Session = Depends(get_db)):
    profiles = db.query(StudentProfile).filter(StudentProfile.is_public.is_(True)).order_by(StudentProfile.updated_at.desc()).all()
    sanitized = []
    for p in profiles:
        dto = StudentProfileOut.model_validate(p)
        if not p.show_location: dto.location = None
        if not p.show_achievements: dto.achievements = None
        sanitized.append(dto)
    return sanitized

@router.get("/profile/me", response_model=StudentProfileOut)
def get_my_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        profile = StudentProfile(user_id=current_user.id, display_name=current_user.full_name, is_public=True, show_location=True, show_achievements=True)
        db.add(profile); db.commit(); db.refresh(profile)
    return profile

@router.put("/profile/me", response_model=StudentProfileOut)
def update_my_profile(payload: StudentProfileUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        profile = StudentProfile(user_id=current_user.id, display_name=current_user.full_name); db.add(profile); db.flush()
    for k, v in payload.model_dump(exclude_unset=True).items(): setattr(profile, k, v)
    db.commit(); db.refresh(profile); return profile

@router.get("/bookmarks", response_model=List[BookmarkOut])
def list_bookmarks(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Bookmark).filter(Bookmark.user_id == current_user.id).order_by(Bookmark.created_at.desc()).all()

@router.post("/bookmarks", response_model=BookmarkOut, status_code=status.HTTP_201_CREATED)
def add_bookmark(payload: BookmarkCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    existing = db.query(Bookmark).filter(Bookmark.user_id == current_user.id, Bookmark.entity_type == payload.entity_type, Bookmark.entity_id == payload.entity_id).first()
    if existing: return existing
    bm = Bookmark(user_id=current_user.id, entity_type=payload.entity_type, entity_id=payload.entity_id, entity_title=payload.entity_title, entity_url=payload.entity_url)
    db.add(bm); db.commit(); db.refresh(bm); return bm

@router.delete("/bookmarks/{bookmark_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_bookmark(bookmark_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    bm = db.query(Bookmark).filter(Bookmark.id == bookmark_id, Bookmark.user_id == current_user.id).first()
    if not bm: raise HTTPException(status_code=404, detail="Not found.")
    db.delete(bm); db.commit()
