from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session
from app.auth.dependencies import require_admin
from app.database.session import get_db
from app.models.models import Event, User
from app.schemas.schemas import EventCreate, EventOut, EventUpdate

router = APIRouter(prefix="/events", tags=["Events & Workshops"])

@router.get("", response_model=List[EventOut])
def list_events(q: Optional[str] = Query(None), category: Optional[str] = Query(None), location: Optional[str] = Query(None), date_from: Optional[str] = Query(None), include_all: bool = Query(False), db: Session = Depends(get_db)):
    query = db.query(Event)
    if not include_all: query = query.filter(Event.status == "published")
    if category and category.lower() != "all": query = query.filter(Event.category == category)
    if location and location.strip(): query = query.filter(Event.location.ilike(f"%{location.strip()}%"))
    if date_from and date_from.strip(): query = query.filter(Event.event_date >= date_from.strip())
    if q and q.strip():
        pat = f"%{q.strip()}%"
        query = query.filter(or_(Event.title.ilike(pat), Event.description.ilike(pat), Event.organiser.ilike(pat), Event.featured_artists.ilike(pat)))
    return query.order_by(Event.event_date.asc()).all()

@router.post("", response_model=EventOut, status_code=status.HTTP_201_CREATED)
def create_event(payload: EventCreate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    obj = Event(**payload.model_dump()); db.add(obj); db.commit(); db.refresh(obj); return obj

@router.put("/{event_id}", response_model=EventOut)
def update_event(event_id: int, payload: EventUpdate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    obj = db.query(Event).filter(Event.id == event_id).first()
    if not obj: raise HTTPException(status_code=404, detail="Not found.")
    for k, v in payload.model_dump(exclude_unset=True).items(): setattr(obj, k, v)
    db.commit(); db.refresh(obj); return obj

@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(event_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    obj = db.query(Event).filter(Event.id == event_id).first()
    if not obj: raise HTTPException(status_code=404, detail="Not found.")
    db.delete(obj); db.commit()
