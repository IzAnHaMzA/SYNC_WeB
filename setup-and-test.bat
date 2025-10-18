@echo off
echo ========================================
echo INSTOK LOCAL TESTING SETUP
echo ========================================
echo.

echo [1/5] Checking .env file...
if exist .env (
    echo ✅ .env file found
) else (
    echo ❌ .env file NOT found!
    echo.
    echo Creating .env file...
    (
        echo # Supabase Configuration
        echo SUPABASE_URL=https://davkthwggjegcqrmigaph.supabase.co
        echo SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhdmt0aHdnamVnY3FybWlnYXBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzg0MzQsImV4cCI6MjA3NTUxNDQzNH0.Byevw85s1o5ynxyizRZs5qga1lz2z5_uwRJcLn1gRvw
        echo SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhdmt0aHdnamVnY3FybWlnYXBoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkzODQzNCwiZXhwIjoyMDc1NTE0NDM0fQ.h4OCPtp7M1JL7eB3tMsoNUFX37I4VceAlXFp8jpAWxU
        echo.
        echo # JWT Secret
        echo JWT_SECRET=instok-super-secret-jwt-key
        echo.
        echo # Server Configuration
        echo PORT=5000
        echo NODE_ENV=development
    ) > .env
    echo ✅ .env file created
)
echo.

echo [2/5] Killing existing Node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo [3/5] Starting backend server...
start "INSTOK Backend" cmd /k "npm run server"
timeout /t 5 /nobreak >nul

echo [4/5] Starting frontend dev server...
start "INSTOK Frontend" cmd /k "npm run dev"
timeout /t 5 /nobreak >nul

echo [5/5] Opening browser...
start http://localhost:3000

echo.
echo ========================================
echo ✅ SETUP COMPLETE!
echo ========================================
echo.
echo Backend:  http://localhost:5000/api
echo Frontend: http://localhost:3000
echo.
echo Two command windows have opened:
echo 1. Backend Server (port 5000)
echo 2. Frontend Dev Server (port 3000)
echo.
echo DO NOT close these windows!
echo.
echo ========================================
echo TESTING INSTRUCTIONS:
echo ========================================
echo.
echo 1. Browser should open automatically
echo 2. Click "Sign Up" or "Register"
echo 3. Fill in the form:
echo    - Full Name: Test User
echo    - Username: testuser1
echo    - Email: test@example.com
echo    - Password: password123
echo 4. Click "Sign Up"
echo 5. If successful, you'll be redirected to home
echo.
echo TEST THESE FEATURES:
echo - ✅ Sign Up
echo - ✅ Login
echo - ✅ Create Post
echo - ✅ Follow User
echo - ✅ Like Post
echo - ✅ Comment on Post
echo.
echo Press F12 to open Developer Tools if you see errors
echo.
echo ========================================
pause

