@echo off
echo ========================================
echo   INSTOK - Android Development Setup
echo ========================================
echo.
echo This will start:
echo  1. Backend Server (Port 5000)
echo  2. Metro Bundler
echo  3. Open Android Studio guide
echo.
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting in 3 separate windows...
echo.

REM Start Backend Server in new window
start "INSTOK - Backend Server" cmd /k "cd /d %~dp0 && echo Backend Server Starting... && npm run server"

REM Wait a bit for server to start
timeout /t 3 /nobreak > nul

REM Start Metro Bundler in new window
start "INSTOK - Metro Bundler" cmd /k "cd /d %~dp0 && echo Metro Bundler Starting... && npm start"

REM Wait a bit
timeout /t 2 /nobreak > nul

echo.
echo ========================================
echo   SETUP COMPLETE!
echo ========================================
echo.
echo  Backend Server running in separate window
echo  Metro Bundler running in separate window
echo.
echo NEXT STEPS:
echo  1. Open Android Studio
echo  2. Open folder: %~dp0android
echo  3. Click Run button (green play icon)
echo.
echo Or run in this terminal:
echo  npm run android
echo.
echo ========================================
echo  Opening Android Studio guide...
echo ========================================
timeout /t 2 /nobreak > nul

REM Open the guide
start OPEN_IN_ANDROID_STUDIO.md

echo.
echo Press any key to close this window...
pause > nul

