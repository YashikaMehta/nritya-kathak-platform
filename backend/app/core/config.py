from typing import List
import secrets
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APP_NAME: str = "NRITYA"
    APP_TAGLINE: str = "Preserving Tradition. Connecting Generations."
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    SECRET_KEY: str = Field(default_factory=lambda: secrets.token_urlsafe(32))
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    DATABASE_URL: str = "sqlite:///./nritya.db"
    BACKEND_CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000"
    STORAGE_BACKEND: str = "local"
    LOCAL_UPLOAD_DIR: str = "uploads"
    S3_BUCKET_NAME: str = ""
    AWS_REGION: str = "ap-south-1"
    ADMIN_EMAIL: str = "admin@nritya-archive.org"
    ADMIN_PASSWORD: str = Field(default_factory=lambda: secrets.token_urlsafe(24))
    ADMIN_FULL_NAME: str = "NRITYA Chief Curator"

    model_config = SettingsConfigDict(env_file=(".env", "../.env"), env_file_encoding="utf-8", extra="ignore")

    @property
    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.BACKEND_CORS_ORIGINS.split(",") if o.strip()]

settings = Settings()
