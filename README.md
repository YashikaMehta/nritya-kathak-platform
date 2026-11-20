# NRITYA — Digital Kathak Archive & Community Platform

**Tagline:** *Preserving Tradition. Connecting Generations.*

## Quick Start in VS Code
1. Open `NRITYA.code-workspace` in VS Code (`code NRITYA.code-workspace`).
2. Copy `.env.example` to `.env` and set unique values for `SECRET_KEY` and `ADMIN_PASSWORD`. For Docker Compose, also set the PostgreSQL credentials and `DATABASE_URL`.
3. **Backend Setup:**
   ```bash
   cd backend
   python -m venv venv
   # Windows: venv\Scripts\activate | macOS/Linux: source venv/bin/activate
   pip install -r requirements.txt
   python ..\scripts\create_admin.py --email admin@nritya-archive.org
   uvicorn app.main:app --reload --port 8000
   ```
4. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
5. Open `http://localhost:5173` (Frontend) and `http://localhost:8000/docs` (Swagger API Docs).

Do not commit `.env` or the local SQLite database. Configure unique credentials before deploying.
