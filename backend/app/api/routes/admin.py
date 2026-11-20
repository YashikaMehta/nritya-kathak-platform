from typing import List, Optional
from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile
from sqlalchemy.orm import Session, joinedload
from app.auth.dependencies import get_current_user, require_admin
from app.database.session import get_db
from app.models.models import Artist, CommunitySubmission, Composition, Event, Gharana, GlossaryTerm, HistoricalArticle, LearningResource, MediaRecord, Role, Taal, User
from app.schemas.schemas import CommunitySubmissionOut, CommunitySubmissionReview, GlobalSearchResponse, UserOut, UserRoleUpdate
from app.services.search_service import search_platform
from app.services.storage import storage_service

router = APIRouter(tags=["Search, Media & Admin"])

@router.get("/search", response_model=GlobalSearchResponse)
def global_search(q: str = Query(..., min_length=1), category: Optional[str] = Query("all"), db: Session = Depends(get_db)):
    return search_platform(db=db, q=q, category=category)

@router.post("/media/upload")
async def upload_media(file: UploadFile = File(...), credit_attribution: Optional[str] = Form(None), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        file_url = await storage_service.save_upload(file)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    rec = MediaRecord(filename=file.filename or "upload", file_url=file_url, content_type=file.content_type or "application/octet-stream", credit_attribution=credit_attribution, uploaded_by_id=current_user.id)
    db.add(rec); db.commit(); db.refresh(rec)
    return {"id": rec.id, "filename": rec.filename, "file_url": rec.file_url, "credit_attribution": rec.credit_attribution}

@router.get("/admin/stats")
def get_admin_stats(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return {"users": db.query(User).count(), "pending_submissions": db.query(CommunitySubmission).filter(CommunitySubmission.status == "pending").count(), "approved_submissions": db.query(CommunitySubmission).filter(CommunitySubmission.status == "approved").count(), "history_articles": db.query(HistoricalArticle).count(), "gharanas": db.query(Gharana).count(), "artists": db.query(Artist).count(), "taals": db.query(Taal).count(), "glossary_terms": db.query(GlossaryTerm).count(), "compositions": db.query(Composition).count(), "resources": db.query(LearningResource).count(), "events": db.query(Event).count()}

@router.get("/admin/submissions", response_model=List[CommunitySubmissionOut])
def admin_list_submissions(status_filter: Optional[str] = Query(None), db: Session = Depends(get_db), _: User = Depends(require_admin)):
    query = db.query(CommunitySubmission).options(joinedload(CommunitySubmission.submitted_by))
    if status_filter and status_filter.lower() != "all": query = query.filter(CommunitySubmission.status == status_filter)
    out = []
    for sub in query.order_by(CommunitySubmission.created_at.desc()).all():
        dto = CommunitySubmissionOut.model_validate(sub); dto.submitter_name = sub.submitted_by.full_name if sub.submitted_by else "User"; out.append(dto)
    return out

@router.put("/admin/submissions/{submission_id}", response_model=CommunitySubmissionOut)
def admin_review_submission(submission_id: int, payload: CommunitySubmissionReview, db: Session = Depends(get_db), admin_user: User = Depends(require_admin)):
    sub = db.query(CommunitySubmission).options(joinedload(CommunitySubmission.submitted_by)).filter(CommunitySubmission.id == submission_id).first()
    if not sub: raise HTTPException(status_code=404, detail="Not found.")
    sub.status = payload.status; sub.reviewed_by_id = admin_user.id
    for field in ("reviewer_notes", "title", "summary", "content_body", "source_references"):
        val = getattr(payload, field)
        if val is not None: setattr(sub, field, val)
    db.commit(); db.refresh(sub)
    dto = CommunitySubmissionOut.model_validate(sub); dto.submitter_name = sub.submitted_by.full_name if sub.submitted_by else "User"; return dto

@router.get("/admin/users", response_model=List[UserOut])
def admin_list_users(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return db.query(User).options(joinedload(User.role), joinedload(User.profile)).order_by(User.id.asc()).all()

@router.put("/admin/users/{user_id}/role", response_model=UserOut)
def admin_update_user_role(user_id: int, payload: UserRoleUpdate, db: Session = Depends(get_db), admin_user: User = Depends(require_admin)):
    user = db.query(User).options(joinedload(User.role), joinedload(User.profile)).filter(User.id == user_id).first()
    if not user: raise HTTPException(status_code=404, detail="Not found.")
    if user.id == admin_user.id and payload.role_name != "admin": raise HTTPException(status_code=400, detail="Cannot remove own admin privileges.")
    role = db.query(Role).filter(Role.name == payload.role_name).first()
    if not role: raise HTTPException(status_code=400, detail="Invalid role.")
    user.role_id = role.id
    if payload.is_active is not None: user.is_active = payload.is_active
    db.commit(); db.refresh(user); return user
