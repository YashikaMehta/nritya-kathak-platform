from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session
from app.auth.dependencies import require_admin
from app.database.session import get_db
from app.models.models import Artist, SourceReference, User
from app.schemas.schemas import ArtistCreate, ArtistOut, ArtistUpdate, SourceReferenceOut

router = APIRouter(prefix="/artists", tags=["Artists & Gurus"])

def _attach_artist_refs(db: Session, slug: str) -> List[SourceReferenceOut]:
    refs = db.query(SourceReference).filter(SourceReference.entity_type == "artist", SourceReference.entity_slug == slug).all()
    return [SourceReferenceOut.model_validate(r) for r in refs]

@router.get("", response_model=List[ArtistOut])
def list_artists(q: Optional[str] = Query(None), gharana: Optional[str] = Query(None), artist_type: Optional[str] = Query(None), location: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(Artist)
    if gharana and gharana.lower() != "all": query = query.filter(Artist.gharana_label.ilike(f"%{gharana}%"))
    if artist_type and artist_type.lower() != "all": query = query.filter(Artist.artist_type == artist_type)
    if location and location.strip(): query = query.filter(Artist.location.ilike(f"%{location.strip()}%"))
    if q and q.strip():
        pat = f"%{q.strip()}%"
        query = query.filter(or_(Artist.name.ilike(pat), Artist.short_bio.ilike(pat), Artist.contributions.ilike(pat), Artist.institution.ilike(pat)))
    out = []
    for a in query.order_by(Artist.id.asc()).all():
        dto = ArtistOut.model_validate(a); dto.references = _attach_artist_refs(db, a.slug); out.append(dto)
    return out

@router.get("/{slug}", response_model=ArtistOut)
def get_artist(slug: str, db: Session = Depends(get_db)):
    artist = db.query(Artist).filter(Artist.slug == slug).first()
    if not artist: raise HTTPException(status_code=404, detail="Not found.")
    dto = ArtistOut.model_validate(artist); dto.references = _attach_artist_refs(db, artist.slug); return dto

@router.post("", response_model=ArtistOut, status_code=status.HTTP_201_CREATED)
def create_artist(payload: ArtistCreate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    if db.query(Artist).filter(Artist.slug == payload.slug).first(): raise HTTPException(status_code=400, detail="Slug exists.")
    obj = Artist(**payload.model_dump()); db.add(obj); db.commit(); db.refresh(obj)
    dto = ArtistOut.model_validate(obj); dto.references = _attach_artist_refs(db, obj.slug); return dto

@router.put("/{artist_id}", response_model=ArtistOut)
def update_artist(artist_id: int, payload: ArtistUpdate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    obj = db.query(Artist).filter(Artist.id == artist_id).first()
    if not obj: raise HTTPException(status_code=404, detail="Not found.")
    for k, v in payload.model_dump(exclude_unset=True).items(): setattr(obj, k, v)
    db.commit(); db.refresh(obj)
    dto = ArtistOut.model_validate(obj); dto.references = _attach_artist_refs(db, obj.slug); return dto

@router.delete("/{artist_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_artist(artist_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    obj = db.query(Artist).filter(Artist.id == artist_id).first()
    if not obj: raise HTTPException(status_code=404, detail="Not found.")
    db.delete(obj); db.commit()
