@echo off
echo ================================================
echo  INSTOK - Local Development Startup
echo ================================================
echo.

echo Step 1: Killing any existing Node.js processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo Step 2: Starting Backend Server (Supabase)...
start "INSTOK Backend (Port 5000)" cmd /k "npm run server"
timeout /t 5 /nobreak >nul

echo Step 3: Starting Frontend Dev Server (Vite)...
start "INSTOK Frontend (Port 3000)" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ================================================
echo  SERVERS STARTED!
echo ================================================
echo.
echo Frontend: http://localhost:3000/SYNC_WeB/
echo Backend:  http://localhost:5000/api
echo.
echo Press any key to open the app in your browser...
pause >nul

start http://localhost:3000/SYNC_WeB/

echo.
echo Both servers are running in separate windows.
echo Close those windows to stop the servers.
echo.
pause

