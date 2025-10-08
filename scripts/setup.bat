@echo off
REM INSTOK Setup Script for Windows
REM This script automates the initial setup process

echo ======================================
echo   INSTOK - Instagram Clone Setup
echo ======================================
echo.

REM Check Node.js
echo Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    node --version
    echo [OK] Node.js found
) else (
    echo [ERROR] Node.js not found
    echo Please install Node.js 18+ from https://nodejs.org/
    exit /b 1
)

echo.

REM Check npm
echo Checking npm...
where npm >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    npm --version
    echo [OK] npm found
) else (
    echo [ERROR] npm not found
    exit /b 1
)

echo.

REM Check MongoDB
echo Checking MongoDB...
where mongod >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] MongoDB installed
) else (
    echo [WARNING] MongoDB not found
    echo Please install MongoDB from https://www.mongodb.com/try/download/community
)

echo.
echo Installing dependencies...
call npm install

if %ERRORLEVEL% EQU 0 (
    echo [OK] Dependencies installed successfully
) else (
    echo [ERROR] Failed to install dependencies
    exit /b 1
)

echo.
echo Creating uploads directory...
if not exist uploads mkdir uploads

echo.
echo Checking environment file...
if not exist .env (
    echo Creating .env file...
    (
        echo # Server Configuration
        echo PORT=5000
        echo NODE_ENV=development
        echo.
        echo # Database
        echo MONGODB_URI=mongodb://localhost:27017/instok
        echo.
        echo # JWT Secret ^(Change this in production!^)
        echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
        echo.
        echo # Frontend URL
        echo CLIENT_URL=http://localhost:5173
        echo.
        echo # File Upload
        echo MAX_FILE_SIZE=52428800
    ) > .env
    echo [OK] .env file created
) else (
    echo [OK] .env file already exists
)

echo.
echo ======================================
echo   Setup Complete!
echo ======================================
echo.
echo Next steps:
echo.
echo 1. Start MongoDB:
echo    mongod
echo.
echo 2. Start the application:
echo    npm run dev:full
echo.
echo 3. Open your browser:
echo    http://localhost:5173
echo.
echo For Android development, see ANDROID_SETUP.md
echo.
echo Happy coding!
pause

