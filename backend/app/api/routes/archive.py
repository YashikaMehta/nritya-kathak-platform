from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session
from app.auth.dependencies import require_admin
from app.database.session import get_db
from app.models.models import ArchiveCategory, Composition, Gharana, GlossaryTerm, HistoricalArticle, Institution, LearningResource, MovementVocabulary, SourceReference, Taal, User
from app.schemas.schemas import CompositionCreate, CompositionOut, CompositionUpdate, GharanaCreate, GharanaOut, GharanaUpdate, GlossaryTermCreate, GlossaryTermOut, GlossaryTermUpdate, HistoricalArticleCreate, HistoricalArticleOut, HistoricalArticleUpdate, InstitutionOut, LearningResourceCreate, LearningResourceOut, MovementVocabularyOut, SourceReferenceOut, TaalCreate, TaalOut

router = APIRouter(prefix="/archive", tags=["Kathak Archive"])

def _attach_refs(db: Session, entity_type: str, slug: str) -> List[SourceReferenceOut]:
    refs = db.query(SourceReference).filter(SourceReference.entity_type == entity_type, SourceReference.entity_slug == slug).all()
    return [SourceReferenceOut.model_validate(r) for r in refs]

@router.get("/overview")
def get_archive_overview(db: Session = Depends(get_db)):
    categories = db.query(ArchiveCategory).order_by(ArchiveCategory.display_order).all()
    featured_term = db.query(GlossaryTerm).filter(GlossaryTerm.is_featured_term.is_(True)).first() or db.query(GlossaryTerm).first()
    return {"categories": categories, "featured_term": GlossaryTermOut.model_validate(featured_term) if featured_term else None, "counts": {"history": db.query(HistoricalArticle).count(), "gharanas": db.query(Gharana).count(), "taals": db.query(Taal).count(), "glossary": db.query(GlossaryTerm).count(), "compositions": db.query(Composition).count(), "movements": db.query(MovementVocabulary).count(), "resources": db.query(LearningResource).count()}}

@router.get("/history", response_model=List[HistoricalArticleOut])
def list_history(db: Session = Depends(get_db)):
    out = []
    for art in db.query(HistoricalArticle).order_by(HistoricalArticle.timeline_order.asc()).all():
        item = HistoricalArticleOut.model_validate(art)
        item.references = _attach_refs(db, "history", art.slug)
        out.append(item)
    return out

@router.post("/history", response_model=HistoricalArticleOut, status_code=status.HTTP_201_CREATED)
def create_history(payload: HistoricalArticleCreate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    if db.query(HistoricalArticle).filter(HistoricalArticle.slug == payload.slug).first():
        raise HTTPException(status_code=400, detail="Slug exists.")
    obj = HistoricalArticle(**payload.model_dump())
    db.add(obj); db.commit(); db.refresh(obj)
    res = HistoricalArticleOut.model_validate(obj); res.references = _attach_refs(db, "history", obj.slug)
    return res

@router.put("/history/{article_id}", response_model=HistoricalArticleOut)
def update_history(article_id: int, payload: HistoricalArticleUpdate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    obj = db.query(HistoricalArticle).filter(HistoricalArticle.id == article_id).first()
    if not obj: raise HTTPException(status_code=404, detail="Not found.")
    for k, v in payload.model_dump(exclude_unset=True).items(): setattr(obj, k, v)
    db.commit(); db.refresh(obj)
    res = HistoricalArticleOut.model_validate(obj); res.references = _attach_refs(db, "history", obj.slug)
    return res

@router.delete("/history/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_history(article_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    obj = db.query(HistoricalArticle).filter(HistoricalArticle.id == article_id).first()
    if not obj: raise HTTPException(status_code=404, detail="Not found.")
    db.delete(obj); db.commit()

@router.get("/gharanas", response_model=List[GharanaOut])
def list_gharanas(db: Session = Depends(get_db)):
    out = []
    for g in db.query(Gharana).order_by(Gharana.id.asc()).all():
        dto = GharanaOut.model_validate(g); dto.references = _attach_refs(db, "gharana", g.slug); out.append(dto)
    return out

@router.get("/gharanas/{slug}", response_model=GharanaOut)
def get_gharana(slug: str, db: Session = Depends(get_db)):
    g = db.query(Gharana).filter(Gharana.slug == slug).first()
    if not g: raise HTTPException(status_code=404, detail="Not found.")
    dto = GharanaOut.model_validate(g); dto.references = _attach_refs(db, "gharana", g.slug)
    return dto

@router.post("/gharanas", response_model=GharanaOut, status_code=status.HTTP_201_CREATED)
def create_gharana(payload: GharanaCreate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    if db.query(Gharana).filter(Gharana.slug == payload.slug).first(): raise HTTPException(status_code=400, detail="Slug exists.")
    g = Gharana(**payload.model_dump()); db.add(g); db.commit(); db.refresh(g)
    dto = GharanaOut.model_validate(g); dto.references = _attach_refs(db, "gharana", g.slug)
    return dto

@router.put("/gharanas/{gharana_id}", response_model=GharanaOut)
def update_gharana(gharana_id: int, payload: GharanaUpdate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    g = db.query(Gharana).filter(Gharana.id == gharana_id).first()
    if not g: raise HTTPException(status_code=404, detail="Not found.")
    for k, v in payload.model_dump(exclude_unset=True).items(): setattr(g, k, v)
    db.commit(); db.refresh(g)
    dto = GharanaOut.model_validate(g); dto.references = _attach_refs(db, "gharana", g.slug)
    return dto

@router.get("/taals", response_model=List[TaalOut])
def list_taals(db: Session = Depends(get_db)):
    return db.query(Taal).order_by(Taal.matras.asc()).all()

@router.post("/taals", response_model=TaalOut, status_code=status.HTTP_201_CREATED)
def create_taal(payload: TaalCreate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    if db.query(Taal).filter(Taal.slug == payload.slug).first(): raise HTTPException(status_code=400, detail="Slug exists.")
    t = Taal(**payload.model_dump()); db.add(t); db.commit(); db.refresh(t)
    return t

@router.get("/glossary", response_model=List[GlossaryTermOut])
def list_glossary(q: Optional[str] = Query(None), category: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(GlossaryTerm)
    if category and category.lower() != "all": query = query.filter(GlossaryTerm.category == category)
    if q and q.strip():
        pat = f"%{q.strip()}%"
        query = query.filter(or_(GlossaryTerm.term.ilike(pat), GlossaryTerm.hindi_term.ilike(pat), GlossaryTerm.short_definition.ilike(pat), GlossaryTerm.detailed_explanation.ilike(pat)))
    return query.order_by(GlossaryTerm.term.asc()).all()

@router.post("/glossary", response_model=GlossaryTermOut, status_code=status.HTTP_201_CREATED)
def create_glossary_term(payload: GlossaryTermCreate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    if db.query(GlossaryTerm).filter(GlossaryTerm.slug == payload.slug).first(): raise HTTPException(status_code=400, detail="Slug exists.")
    obj = GlossaryTerm(**payload.model_dump()); db.add(obj); db.commit(); db.refresh(obj)
    return obj

@router.put("/glossary/{term_id}", response_model=GlossaryTermOut)
def update_glossary_term(term_id: int, payload: GlossaryTermUpdate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    obj = db.query(GlossaryTerm).filter(GlossaryTerm.id == term_id).first()
    if not obj: raise HTTPException(status_code=404, detail="Not found.")
    for k, v in payload.model_dump(exclude_unset=True).items(): setattr(obj, k, v)
    db.commit(); db.refresh(obj); return obj

@router.delete("/glossary/{term_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_glossary_term(term_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    obj = db.query(GlossaryTerm).filter(GlossaryTerm.id == term_id).first()
    if not obj: raise HTTPException(status_code=404, detail="Not found.")
    db.delete(obj); db.commit()

@router.get("/compositions", response_model=List[CompositionOut])
def list_compositions(composition_type: Optional[str] = Query(None), taal: Optional[str] = Query(None), q: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(Composition)
    if composition_type and composition_type.lower() != "all": query = query.filter(Composition.composition_type == composition_type)
    if taal and taal.lower() != "all": query = query.filter(Composition.associated_taal.ilike(f"%{taal}%"))
    if q and q.strip():
        pat = f"%{q.strip()}%"
        query = query.filter(or_(Composition.title.ilike(pat), Composition.explanation.ilike(pat), Composition.bol_notation.ilike(pat)))
    return query.order_by(Composition.id.asc()).all()

@router.post("/compositions", response_model=CompositionOut, status_code=status.HTTP_201_CREATED)
def create_composition(payload: CompositionCreate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    if db.query(Composition).filter(Composition.slug == payload.slug).first(): raise HTTPException(status_code=400, detail="Slug exists.")
    obj = Composition(**payload.model_dump()); db.add(obj); db.commit(); db.refresh(obj); return obj

@router.put("/compositions/{comp_id}", response_model=CompositionOut)
def update_composition(comp_id: int, payload: CompositionUpdate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    obj = db.query(Composition).filter(Composition.id == comp_id).first()
    if not obj: raise HTTPException(status_code=404, detail="Not found.")
    for k, v in payload.model_dump(exclude_unset=True).items(): setattr(obj, k, v)
    db.commit(); db.refresh(obj); return obj

@router.delete("/compositions/{comp_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_composition(comp_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    obj = db.query(Composition).filter(Composition.id == comp_id).first()
    if not obj: raise HTTPException(status_code=404, detail="Not found.")
    db.delete(obj); db.commit()

@router.get("/movements", response_model=List[MovementVocabularyOut])
def list_movements(category: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(MovementVocabulary)
    if category and category.lower() != "all": query = query.filter(MovementVocabulary.category == category)
    return query.order_by(MovementVocabulary.id.asc()).all()

@router.get("/resources", response_model=List[LearningResourceOut])
def list_resources(category: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(LearningResource)
    if category and category.lower() != "all": query = query.filter(LearningResource.category == category)
    return query.order_by(LearningResource.is_featured.desc(), LearningResource.id.asc()).all()

@router.post("/resources", response_model=LearningResourceOut, status_code=status.HTTP_201_CREATED)
def create_resource(payload: LearningResourceCreate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    obj = LearningResource(**payload.model_dump()); db.add(obj); db.commit(); db.refresh(obj); return obj

@router.delete("/resources/{resource_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resource(resource_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    obj = db.query(LearningResource).filter(LearningResource.id == resource_id).first()
    if not obj: raise HTTPException(status_code=404, detail="Not found.")
    db.delete(obj); db.commit()

@router.get("/institutions", response_model=List[InstitutionOut])
def list_institutions(city: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(Institution)
    if city and city.strip(): query = query.filter(Institution.city.ilike(f"%{city.strip()}%"))
    return query.order_by(Institution.name.asc()).all()
