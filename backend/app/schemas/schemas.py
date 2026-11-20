from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict

class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    full_name: str = Field(..., min_length=2, max_length=150)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class RoleOut(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class StudentProfileOut(BaseModel):
    id: int
    user_id: int
    display_name: str
    avatar_url: Optional[str] = None
    location: Optional[str] = None
    gharana_affiliation: Optional[str] = None
    guru_or_institution: Optional[str] = None
    experience_level: Optional[str] = None
    bio: Optional[str] = None
    interests: Optional[str] = None
    achievements: Optional[str] = None
    is_public: bool
    show_location: bool
    show_achievements: bool
    model_config = ConfigDict(from_attributes=True)

class StudentProfileUpdate(BaseModel):
    display_name: Optional[str] = Field(None, min_length=2, max_length=150)
    avatar_url: Optional[str] = None
    location: Optional[str] = None
    gharana_affiliation: Optional[str] = None
    guru_or_institution: Optional[str] = None
    experience_level: Optional[str] = None
    bio: Optional[str] = None
    interests: Optional[str] = None
    achievements: Optional[str] = None
    is_public: Optional[bool] = None
    show_location: Optional[bool] = None
    show_achievements: Optional[bool] = None

class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    is_active: bool
    role: RoleOut
    profile: Optional[StudentProfileOut] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class UserRoleUpdate(BaseModel):
    role_name: str
    is_active: Optional[bool] = None

class SourceReferenceBase(BaseModel):
    entity_type: str
    entity_slug: Optional[str] = None
    citation_text: str
    author_or_institution: Optional[str] = None
    publication_year: Optional[str] = None
    url: Optional[str] = None

class SourceReferenceOut(SourceReferenceBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class HistoricalArticleBase(BaseModel):
    slug: str
    title: str
    era: str
    period_label: Optional[str] = None
    timeline_order: int = 1
    summary: str
    content: str
    key_milestones: Optional[str] = None
    image_url: Optional[str] = None
    image_credit: Optional[str] = None
    verification_status: str = "verified"

class HistoricalArticleCreate(HistoricalArticleBase):
    pass

class HistoricalArticleUpdate(BaseModel):
    title: Optional[str] = None
    era: Optional[str] = None
    period_label: Optional[str] = None
    timeline_order: Optional[int] = None
    summary: Optional[str] = None
    content: Optional[str] = None
    key_milestones: Optional[str] = None
    image_url: Optional[str] = None
    image_credit: Optional[str] = None
    verification_status: Optional[str] = None

class HistoricalArticleOut(HistoricalArticleBase):
    id: int
    created_at: datetime
    references: List[SourceReferenceOut] = []
    model_config = ConfigDict(from_attributes=True)

class GharanaBase(BaseModel):
    slug: str
    name: str
    hindi_name: Optional[str] = None
    origin_region: str
    founder_or_pioneers: str
    historical_background: str
    stylistic_characteristics: str
    rhythm_and_movement_notes: str
    performance_traditions: str
    notable_contributions: str
    prominent_exponents: str
    cultural_nuance_note: Optional[str] = None
    image_url: Optional[str] = None
    image_credit: Optional[str] = None
    verification_status: str = "verified"

class GharanaCreate(GharanaBase):
    pass

class GharanaUpdate(BaseModel):
    name: Optional[str] = None
    hindi_name: Optional[str] = None
    origin_region: Optional[str] = None
    founder_or_pioneers: Optional[str] = None
    historical_background: Optional[str] = None
    stylistic_characteristics: Optional[str] = None
    rhythm_and_movement_notes: Optional[str] = None
    performance_traditions: Optional[str] = None
    notable_contributions: Optional[str] = None
    prominent_exponents: Optional[str] = None
    cultural_nuance_note: Optional[str] = None
    image_url: Optional[str] = None
    image_credit: Optional[str] = None
    verification_status: Optional[str] = None

class GharanaOut(GharanaBase):
    id: int
    references: List[SourceReferenceOut] = []
    model_config = ConfigDict(from_attributes=True)

class ArtistBase(BaseModel):
    slug: str
    name: str
    honorific: Optional[str] = None
    artist_type: str = "Historical & Legendary"
    birth_death_years: Optional[str] = None
    location: Optional[str] = None
    gharana_id: Optional[int] = None
    gharana_label: Optional[str] = None
    institution: Optional[str] = None
    specialisation: Optional[str] = None
    short_bio: str
    biography: str
    contributions: str
    awards_recognitions: Optional[str] = None
    notable_works: Optional[str] = None
    official_website: Optional[str] = None
    public_contact_info: Optional[str] = None
    image_url: Optional[str] = None
    image_credit: Optional[str] = None
    verification_status: str = "verified"

class ArtistCreate(ArtistBase):
    pass

class ArtistUpdate(BaseModel):
    name: Optional[str] = None
    honorific: Optional[str] = None
    artist_type: Optional[str] = None
    birth_death_years: Optional[str] = None
    location: Optional[str] = None
    gharana_id: Optional[int] = None
    gharana_label: Optional[str] = None
    institution: Optional[str] = None
    specialisation: Optional[str] = None
    short_bio: Optional[str] = None
    biography: Optional[str] = None
    contributions: Optional[str] = None
    awards_recognitions: Optional[str] = None
    notable_works: Optional[str] = None
    official_website: Optional[str] = None
    public_contact_info: Optional[str] = None
    image_url: Optional[str] = None
    image_credit: Optional[str] = None
    verification_status: Optional[str] = None

class ArtistOut(ArtistBase):
    id: int
    references: List[SourceReferenceOut] = []
    model_config = ConfigDict(from_attributes=True)

class TaalBase(BaseModel):
    slug: str
    name: str
    hindi_name: Optional[str] = None
    matras: int
    vibhag_structure: str
    tali_positions: str
    khali_positions: str
    sam_position: int = 1
    jāti: Optional[str] = None
    theka_bols: str
    explanation: str
    performance_usage: Optional[str] = None
    verification_status: str = "verified"

class TaalCreate(TaalBase):
    pass

class TaalOut(TaalBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class GlossaryTermBase(BaseModel):
    slug: str
    term: str
    hindi_term: Optional[str] = None
    transliteration_variants: Optional[str] = None
    category: str
    short_definition: str
    detailed_explanation: str
    example_usage: Optional[str] = None
    related_terms: Optional[str] = None
    is_featured_term: bool = False
    verification_status: str = "verified"

class GlossaryTermCreate(GlossaryTermBase):
    pass

class GlossaryTermUpdate(BaseModel):
    term: Optional[str] = None
    hindi_term: Optional[str] = None
    transliteration_variants: Optional[str] = None
    category: Optional[str] = None
    short_definition: Optional[str] = None
    detailed_explanation: Optional[str] = None
    example_usage: Optional[str] = None
    related_terms: Optional[str] = None
    is_featured_term: Optional[bool] = None
    verification_status: Optional[str] = None

class GlossaryTermOut(GlossaryTermBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class CompositionBase(BaseModel):
    slug: str
    title: str
    composition_type: str
    associated_taal: str
    gharana_attribution: Optional[str] = None
    bol_notation: Optional[str] = None
    explanation: str
    performance_context: str
    source_attribution: str
    related_compositions: Optional[str] = None
    verification_status: str = "verified"

class CompositionCreate(CompositionBase):
    pass

class CompositionUpdate(BaseModel):
    title: Optional[str] = None
    composition_type: Optional[str] = None
    associated_taal: Optional[str] = None
    gharana_attribution: Optional[str] = None
    bol_notation: Optional[str] = None
    explanation: Optional[str] = None
    performance_context: Optional[str] = None
    source_attribution: Optional[str] = None
    related_compositions: Optional[str] = None
    verification_status: Optional[str] = None

class CompositionOut(CompositionBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class MovementVocabularyOut(BaseModel):
    id: int
    slug: str
    name: str
    hindi_name: Optional[str] = None
    category: str
    description: str
    contextual_usage: str
    regional_or_style_notes: Optional[str] = None
    source_attribution: Optional[str] = None
    verification_status: str
    model_config = ConfigDict(from_attributes=True)

class LearningResourceBase(BaseModel):
    title: str
    creator_or_institution: str
    category: str
    description: str
    external_url: str
    year_published: Optional[str] = None
    is_featured: bool = False
    verification_status: str = "verified"

class LearningResourceCreate(LearningResourceBase):
    pass

class LearningResourceOut(LearningResourceBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class InstitutionOut(BaseModel):
    id: int
    name: str
    city: str
    country: str
    gharana_focus: Optional[str] = None
    founded_year: Optional[str] = None
    description: str
    notable_faculty: Optional[str] = None
    official_website: Optional[str] = None
    verification_status: str
    model_config = ConfigDict(from_attributes=True)

class EventBase(BaseModel):
    title: str
    category: str
    description: str
    event_date: str
    event_time: Optional[str] = None
    location: str
    venue: Optional[str] = None
    organiser: str
    featured_artists: Optional[str] = None
    registration_url: Optional[str] = None
    image_url: Optional[str] = None
    is_demonstration: bool = True
    status: str = "published"

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    event_date: Optional[str] = None
    event_time: Optional[str] = None
    location: Optional[str] = None
    venue: Optional[str] = None
    organiser: Optional[str] = None
    featured_artists: Optional[str] = None
    registration_url: Optional[str] = None
    image_url: Optional[str] = None
    is_demonstration: Optional[bool] = None
    status: Optional[str] = None

class EventOut(EventBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class BookmarkCreate(BaseModel):
    entity_type: str
    entity_id: int
    entity_title: str
    entity_url: str

class BookmarkOut(BookmarkCreate):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class CommunitySubmissionCreate(BaseModel):
    submission_type: str
    title: str = Field(..., min_length=4, max_length=255)
    summary: str = Field(..., min_length=10, max_length=500)
    content_body: str = Field(..., min_length=20)
    gharana_or_category: Optional[str] = None
    source_references: str = Field(..., min_length=5)
    media_url: Optional[str] = None
    rights_confirmed: bool = True

class CommunitySubmissionReview(BaseModel):
    status: str = Field(..., pattern="^(approved|rejected|changes_requested|pending)$")
    reviewer_notes: Optional[str] = None
    title: Optional[str] = None
    summary: Optional[str] = None
    content_body: Optional[str] = None
    source_references: Optional[str] = None

class CommunitySubmissionOut(BaseModel):
    id: int
    submitted_by_id: int
    submitter_name: Optional[str] = None
    submission_type: str
    title: str
    summary: str
    content_body: str
    gharana_or_category: Optional[str] = None
    source_references: str
    media_url: Optional[str] = None
    rights_confirmed: bool
    status: str
    reviewer_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

class SearchResultItem(BaseModel):
    entity_type: str
    id: int
    slug_or_id: str
    title: str
    subtitle: Optional[str] = None
    snippet: str
    url: str
    badge: Optional[str] = None

class GlobalSearchResponse(BaseModel):
    query: str
    category: Optional[str] = None
    total: int
    results: List[SearchResultItem]
