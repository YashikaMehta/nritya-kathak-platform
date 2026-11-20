import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.routes import admin, archive, artists, auth, community, events
from app.core.config import settings
from app.database.init_db import init_db

app = FastAPI(title=f"{settings.APP_NAME} API", description="Digital Kathak Archive & Community Platform REST API", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=False, allow_methods=["*"], allow_headers=["*"])
os.makedirs(settings.LOCAL_UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.LOCAL_UPLOAD_DIR), name="uploads")

API_PREFIX = "/api/v1"
app.include_router(auth.router, prefix=API_PREFIX)
app.include_router(archive.router, prefix=API_PREFIX)
app.include_router(artists.router, prefix=API_PREFIX)
app.include_router(events.router, prefix=API_PREFIX)
app.include_router(community.router, prefix=API_PREFIX)
app.include_router(admin.router, prefix=API_PREFIX)

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/")
def root():
    return {"application": settings.APP_NAME, "tagline": settings.APP_TAGLINE, "status": "operational", "docs_url": "/docs"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
