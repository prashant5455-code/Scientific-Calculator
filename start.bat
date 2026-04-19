@echo off
echo Starting Scientific Calculator...

REM Start backend server
cd backend
start cmd /k "node server.js"

REM Wait a moment for backend to start
timeout /t 3 /nobreak > nul

REM Start frontend server
cd ../frontend
start cmd /k "python -m http.server 8000"

echo.
echo Backend server starting on http://localhost:3001
echo Frontend server starting on http://localhost:8000
echo.
echo Press any key to exit...
pause > nul