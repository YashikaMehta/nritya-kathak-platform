from datetime import datetime, timezone
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database.session import Base

def utcnow():
    return datetime.now(timezone.utc)

class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False, index=True)
    description = Column(String(255), nullable=True)
    users = relationship("User", back_populates="role")

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(150), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)
    role = relationship("Role", back_populates="users")
    profile = relationship("StudentProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    bookmarks = relationship("Bookmark", back_populates="user", cascade="all, delete-orphan")
    submissions = relationship("CommunitySubmission", back_populates="submitted_by", foreign_keys="CommunitySubmission.submitted_by_id")

class StudentProfile(Base):
    __tablename__ = "student_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    display_name = Column(String(150), nullable=False)
    avatar_url = Column(String(500), nullable=True)
    location = Column(String(150), nullable=True)
    gharana_affiliation = Column(String(150), nullable=True)
    guru_or_institution = Column(String(200), nullable=True)
    experience_level = Column(String(100), nullable=True)
    bio = Column(Text, nullable=True)
    interests = Column(String(500), nullable=True)
    achievements = Column(Text, nullable=True)
    is_public = Column(Boolean, default=True, nullable=False)
    show_location = Column(Boolean, default=True, nullable=False)
    show_achievements = Column(Boolean, default=True, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)
    user = relationship("User", back_populates="profile")

class ArchiveCategory(Base):
    __tablename__ = "archive_categories"
    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    icon_name = Column(String(50), nullable=True)
    display_order = Column(Integer, default=0, nullable=False)

class HistoricalArticle(Base):
    __tablename__ = "historical_articles"
    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(180), unique=True, nullable=False, index=True)
    title = Column(String(255), nullable=False, index=True)
    era = Column(String(120), nullable=False)
    period_label = Column(String(100), nullable=True)
    timeline_order = Column(Integer, default=1, nullable=False)
    summary = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    key_milestones = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    image_credit = Column(String(300), nullable=True)
    verification_status = Column(String(50), default="verified", nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)

class Gharana(Base):
    __tablename__ = "gharanas"
    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(120), unique=True, nullable=False, index=True)
    name = Column(String(150), nullable=False, index=True)
    hindi_name = Column(String(150), nullable=True)
    origin_region = Column(String(150), nullable=False)
    founder_or_pioneers = Column(String(300), nullable=False)
    historical_background = Column(Text, nullable=False)
    stylistic_characteristics = Column(Text, nullable=False)
    rhythm_and_movement_notes = Column(Text, nullable=False)
    performance_traditions = Column(Text, nullable=False)
    notable_contributions = Column(Text, nullable=False)
    prominent_exponents = Column(Text, nullable=False)
    cultural_nuance_note = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    image_credit = Column(String(300), nullable=True)
    verification_status = Column(String(50), default="verified", nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)
    artists = relationship("Artist", back_populates="gharana")

class Artist(Base):
    __tablename__ = "artists"
    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(180), unique=True, nullable=False, index=True)
    name = Column(String(200), nullable=False, index=True)
    honorific = Column(String(100), nullable=True)
    artist_type = Column(String(80), default="Historical & Legendary", nullable=False)
    birth_death_years = Column(String(100), nullable=True)
    location = Column(String(150), nullable=True)
    gharana_id = Column(Integer, ForeignKey("gharanas.id", ondelete="SET NULL"), nullable=True)
    gharana_label = Column(String(150), nullable=True)
    institution = Column(String(200), nullable=True)
    specialisation = Column(String(250), nullable=True)
    short_bio = Column(Text, nullable=False)
    biography = Column(Text, nullable=False)
    contributions = Column(Text, nullable=False)
    awards_recognitions = Column(Text, nullable=True)
    notable_works = Column(Text, nullable=True)
    official_website = Column(String(400), nullable=True)
    public_contact_info = Column(String(250), nullable=True)
    image_url = Column(String(500), nullable=True)
    image_credit = Column(String(300), nullable=True)
    verification_status = Column(String(50), default="verified", nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)
    gharana = relationship("Gharana", back_populates="artists")

class Taal(Base):
    __tablename__ = "taals"
    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    name = Column(String(120), nullable=False, index=True)
    hindi_name = Column(String(120), nullable=True)
    matras = Column(Integer, nullable=False)
    vibhag_structure = Column(String(120), nullable=False)
    tali_positions = Column(String(120), nullable=False)
    khali_positions = Column(String(120), nullable=False)
    sam_position = Column(Integer, default=1, nullable=False)
    jāti = Column(String(80), nullable=True)
    theka_bols = Column(Text, nullable=False)
    explanation = Column(Text, nullable=False)
    performance_usage = Column(Text, nullable=True)
    verification_status = Column(String(50), default="verified", nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)

class GlossaryTerm(Base):
    __tablename__ = "glossary_terms"
    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(150), unique=True, nullable=False, index=True)
    term = Column(String(150), nullable=False, index=True)
    hindi_term = Column(String(150), nullable=True)
    transliteration_variants = Column(String(250), nullable=True)
    category = Column(String(100), nullable=False, index=True)
    short_definition = Column(String(400), nullable=False)
    detailed_explanation = Column(Text, nullable=False)
    example_usage = Column(Text, nullable=True)
    related_terms = Column(String(300), nullable=True)
    is_featured_term = Column(Boolean, default=False, nullable=False)
    verification_status = Column(String(50), default="verified", nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)

class Composition(Base):
    __tablename__ = "compositions"
    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(180), unique=True, nullable=False, index=True)
    title = Column(String(200), nullable=False, index=True)
    composition_type = Column(String(100), nullable=False, index=True)
    associated_taal = Column(String(120), nullable=False)
    gharana_attribution = Column(String(150), nullable=True)
    bol_notation = Column(Text, nullable=True)
    explanation = Column(Text, nullable=False)
    performance_context = Column(Text, nullable=False)
    source_attribution = Column(String(300), nullable=False)
    related_compositions = Column(String(250), nullable=True)
    verification_status = Column(String(50), default="verified", nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)

class MovementVocabulary(Base):
    __tablename__ = "movement_vocabulary"
    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(150), unique=True, nullable=False, index=True)
    name = Column(String(150), nullable=False, index=True)
    hindi_name = Column(String(150), nullable=True)
    category = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=False)
    contextual_usage = Column(Text, nullable=False)
    regional_or_style_notes = Column(Text, nullable=True)
    source_attribution = Column(String(250), nullable=True)
    verification_status = Column(String(50), default="verified", nullable=False)

class LearningResource(Base):
    __tablename__ = "learning_resources"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    creator_or_institution = Column(String(200), nullable=False)
    category = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=False)
    external_url = Column(String(500), nullable=False)
    year_published = Column(String(50), nullable=True)
    is_featured = Column(Boolean, default=False, nullable=False)
    verification_status = Column(String(50), default="verified", nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)

class Institution(Base):
    __tablename__ = "institutions"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(220), nullable=False, index=True)
    city = Column(String(120), nullable=False, index=True)
    country = Column(String(100), default="India", nullable=False)
    gharana_focus = Column(String(150), nullable=True)
    founded_year = Column(String(50), nullable=True)
    description = Column(Text, nullable=False)
    notable_faculty = Column(String(300), nullable=True)
    official_website = Column(String(400), nullable=True)
    verification_status = Column(String(50), default="verified", nullable=False)

class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    category = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=False)
    event_date = Column(String(50), nullable=False, index=True)
    event_time = Column(String(80), nullable=True)
    location = Column(String(200), nullable=False, index=True)
    venue = Column(String(200), nullable=True)
    organiser = Column(String(200), nullable=False)
    featured_artists = Column(String(300), nullable=True)
    registration_url = Column(String(500), nullable=True)
    image_url = Column(String(500), nullable=True)
    is_demonstration = Column(Boolean, default=True, nullable=False)
    status = Column(String(50), default="published", nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)

class Bookmark(Base):
    __tablename__ = "bookmarks"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    entity_type = Column(String(80), nullable=False)
    entity_id = Column(Integer, nullable=False)
    entity_title = Column(String(255), nullable=False)
    entity_url = Column(String(300), nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    user = relationship("User", back_populates="bookmarks")
    __table_args__ = (UniqueConstraint("user_id", "entity_type", "entity_id", name="uq_user_bookmark"),)

class CommunitySubmission(Base):
    __tablename__ = "community_submissions"
    id = Column(Integer, primary_key=True, index=True)
    submitted_by_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    submission_type = Column(String(80), nullable=False)
    title = Column(String(255), nullable=False)
    summary = Column(String(500), nullable=False)
    content_body = Column(Text, nullable=False)
    gharana_or_category = Column(String(150), nullable=True)
    source_references = Column(Text, nullable=False)
    media_url = Column(String(500), nullable=True)
    rights_confirmed = Column(Boolean, default=True, nullable=False)
    status = Column(String(50), default="pending", nullable=False, index=True)
    reviewer_notes = Column(Text, nullable=True)
    reviewed_by_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)
    submitted_by = relationship("User", back_populates="submissions", foreign_keys=[submitted_by_id])

class SourceReference(Base):
    __tablename__ = "source_references"
    id = Column(Integer, primary_key=True, index=True)
    entity_type = Column(String(80), nullable=False, index=True)
    entity_slug = Column(String(180), nullable=True, index=True)
    citation_text = Column(Text, nullable=False)
    author_or_institution = Column(String(255), nullable=True)
    publication_year = Column(String(50), nullable=True)
    url = Column(String(500), nullable=True)

class MediaRecord(Base):
    __tablename__ = "media_records"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    file_url = Column(String(500), nullable=False)
    content_type = Column(String(100), nullable=False)
    credit_attribution = Column(String(300), nullable=True)
    uploaded_by_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
