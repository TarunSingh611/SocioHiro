@echo off
echo 🚀 Starting InstagramStore in debug mode...
echo.

REM Check if .env files exist
if not exist "backend\.env" (
    echo ⚠️  Warning: backend/.env file not found
    echo    Please create backend/.env with your configuration
)

if not exist "frontend\.env" (
    echo ⚠️  Warning: frontend/.env file not found
    echo    Please create frontend/.env with your configuration
)

echo.
echo 🔗 Debug URLs:
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:3000
echo    Backend Debug: http://localhost:9229
echo.
echo 🎯 VS Code Debug Configurations:
echo    - Debug Frontend (React)
echo    - Debug Backend (Node.js)
echo    - Debug Full Stack (Frontend + Backend)
echo.
echo 📖 For more information, see DEBUGGING_GUIDE.md
echo.
echo ⏹️  Press Ctrl+C to stop all servers
echo.

REM Start backend in debug mode
echo 📦 Starting Backend...
start "Backend Debug" cmd /k "cd backend && node --inspect=9229 src/server.js"

REM Wait a bit for backend to start
timeout /t 3 /nobreak > nul

REM Start frontend
echo 📦 Starting Frontend...
start "Frontend Debug" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ Both servers started in separate windows
echo    You can now use VS Code debug configurations
echo    or debug directly in the browser/terminal
echo.
pause
