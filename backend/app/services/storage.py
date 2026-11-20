import os, uuid
from fastapi import UploadFile
from app.core.config import settings

class StorageService:
    def __init__(self):
        self.backend = settings.STORAGE_BACKEND
        self.local_dir = settings.LOCAL_UPLOAD_DIR
        if self.backend == "local":
            os.makedirs(self.local_dir, exist_ok=True)

    async def save_upload(self, file: UploadFile) -> str:
        ext = os.path.splitext(file.filename or "")[1].lower()
        if ext not in {".jpg", ".jpeg", ".png", ".webp", ".gif", ".pdf", ".mp3", ".wav"}:
            raise ValueError("Unsupported file extension.")
        unique_name = f"{uuid.uuid4().hex}{ext}"
        if self.backend == "local":
            dest_path = os.path.join(self.local_dir, unique_name)
            content = await file.read()
            if len(content) > 10 * 1024 * 1024:
                raise ValueError("File exceeds 10 MB.")
            with open(dest_path, "wb") as f:
                f.write(content)
            return f"/uploads/{unique_name}"
        raise NotImplementedError("Configure S3 credentials.")

storage_service = StorageService()
