@echo off
title NRITYA Kathak Platform Launcher
echo ===================================================
echo   Starting NRITYA Backend & Frontend...
echo ===================================================
cd /d "%~dp0"

start "NRITYA Backend (FastAPI)" cmd /k "cd /d "%~dp0backend" && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
timeout /t 3 /nobreak >nul
start "NRITYA Frontend (Vite)" cmd /k "cd /d "%~dp0frontend" && npm run dev"
timeout /t 3 /nobreak >nul
start http://localhost:5173
