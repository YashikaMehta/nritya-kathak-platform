from typing import List, Optional
from sqlalchemy import or_
from sqlalchemy.orm import Session
from app.models.models import Artist, Composition, Event, Gharana, GlossaryTerm, HistoricalArticle, LearningResource, Taal
from app.schemas.schemas import GlobalSearchResponse, SearchResultItem

def _make_snippet(text_val: Optional[str], max_len: int = 160) -> str:
    if not text_val:
        return ""
    clean = " ".join(text_val.split())
    return clean if len(clean) <= max_len else clean[: max_len - 3].rstrip() + "..."

def search_platform(db: Session, q: str, category: Optional[str] = None, limit: int = 40) -> GlobalSearchResponse:
    query_str = (q or "").strip()
    if not query_str:
        return GlobalSearchResponse(query=query_str, category=category, total=0, results=[])
    pattern = f"%{query_str}%"
    results: List[SearchResultItem] = []
    cat = (category or "all").lower()

    if cat in ("all", "history"):
        for r in db.query(HistoricalArticle).filter(or_(HistoricalArticle.title.ilike(pattern), HistoricalArticle.era.ilike(pattern), HistoricalArticle.summary.ilike(pattern), HistoricalArticle.content.ilike(pattern))).limit(limit).all():
            results.append(SearchResultItem(entity_type="history", id=r.id, slug_or_id=r.slug, title=r.title, subtitle=r.era, snippet=_make_snippet(r.summary), url=f"/history#{r.slug}", badge="History"))

    if cat in ("all", "gharana", "gharanas"):
        for r in db.query(Gharana).filter(or_(Gharana.name.ilike(pattern), Gharana.origin_region.ilike(pattern), Gharana.historical_background.ilike(pattern), Gharana.stylistic_characteristics.ilike(pattern), Gharana.prominent_exponents.ilike(pattern))).limit(limit).all():
            results.append(SearchResultItem(entity_type="gharana", id=r.id, slug_or_id=r.slug, title=r.name, subtitle=f"Origin: {r.origin_region}", snippet=_make_snippet(r.historical_background), url=f"/gharanas/{r.slug}", badge="Gharana"))

    if cat in ("all", "artist", "artists"):
        for r in db.query(Artist).filter(or_(Artist.name.ilike(pattern), Artist.gharana_label.ilike(pattern), Artist.short_bio.ilike(pattern), Artist.contributions.ilike(pattern), Artist.location.ilike(pattern))).limit(limit).all():
            display = f"{r.honorific} {r.name}".strip() if r.honorific else r.name
            results.append(SearchResultItem(entity_type="artist", id=r.id, slug_or_id=r.slug, title=display, subtitle=r.gharana_label or r.artist_type, snippet=_make_snippet(r.short_bio), url=f"/artists/{r.slug}", badge="Artist & Guru"))

    if cat in ("all", "taal"):
        for r in db.query(Taal).filter(or_(Taal.name.ilike(pattern), Taal.theka_bols.ilike(pattern), Taal.explanation.ilike(pattern))).limit(limit).all():
            results.append(SearchResultItem(entity_type="taal", id=r.id, slug_or_id=r.slug, title=f"{r.name} ({r.matras} Matras)", subtitle=f"Vibhag: {r.vibhag_structure}", snippet=_make_snippet(r.explanation), url=f"/taal-terminology?taal={r.slug}", badge="Taal"))

    if cat in ("all", "glossary", "terminology"):
        for r in db.query(GlossaryTerm).filter(or_(GlossaryTerm.term.ilike(pattern), GlossaryTerm.hindi_term.ilike(pattern), GlossaryTerm.short_definition.ilike(pattern), GlossaryTerm.detailed_explanation.ilike(pattern))).limit(limit).all():
            results.append(SearchResultItem(entity_type="glossary", id=r.id, slug_or_id=r.slug, title=r.term, subtitle=r.category, snippet=_make_snippet(r.short_definition), url=f"/taal-terminology?term={r.slug}", badge="Terminology"))

    if cat in ("all", "composition", "compositions"):
        for r in db.query(Composition).filter(or_(Composition.title.ilike(pattern), Composition.composition_type.ilike(pattern), Composition.associated_taal.ilike(pattern), Composition.bol_notation.ilike(pattern), Composition.explanation.ilike(pattern))).limit(limit).all():
            results.append(SearchResultItem(entity_type="composition", id=r.id, slug_or_id=r.slug, title=r.title, subtitle=f"{r.composition_type} • {r.associated_taal}", snippet=_make_snippet(r.explanation), url=f"/compositions?item={r.slug}", badge="Composition"))

    if cat in ("all", "resource", "resources"):
        for r in db.query(LearningResource).filter(or_(LearningResource.title.ilike(pattern), LearningResource.creator_or_institution.ilike(pattern), LearningResource.description.ilike(pattern))).limit(limit).all():
            results.append(SearchResultItem(entity_type="resource", id=r.id, slug_or_id=str(r.id), title=r.title, subtitle=f"{r.category} • {r.creator_or_institution}", snippet=_make_snippet(r.description), url="/explore#resources", badge="Resource"))

    if cat in ("all", "event", "events"):
        for r in db.query(Event).filter(Event.status == "published", or_(Event.title.ilike(pattern), Event.location.ilike(pattern), Event.description.ilike(pattern), Event.organiser.ilike(pattern), Event.featured_artists.ilike(pattern))).limit(limit).all():
            results.append(SearchResultItem(entity_type="event", id=r.id, slug_or_id=str(r.id), title=r.title, subtitle=f"{r.event_date} • {r.location}", snippet=_make_snippet(r.description), url=f"/events?event={r.id}", badge="Event"))

    return GlobalSearchResponse(query=query_str, category=category, total=len(results), results=results[:limit])
