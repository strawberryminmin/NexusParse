@echo off
title AI Resume Parser - Launcher
cd /d "%~dp0resume-parser"

echo.
echo  ============================================================
echo    AI Resume Parser  ^|  Powered by React + Vite
echo  ============================================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js is not installed!
    echo  Please download and install it from: https://nodejs.org
    echo.
    pause
    exit /b 1
)

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] npm is not available. Please reinstall Node.js.
    pause
    exit /b 1
)

REM Install dependencies if node_modules is missing
if not exist "node_modules" (
    echo  [INFO] First run detected - installing dependencies...
    echo  This may take a minute. Please wait...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo  [ERROR] npm install failed. Check your internet connection.
        pause
        exit /b 1
    )
    echo.
    echo  [OK] Dependencies installed successfully!
    echo.
)

echo  [INFO] Starting development server on http://localhost:3000
echo  [INFO] Browser will open automatically in a few seconds...
echo.
echo  Press Ctrl+C in the server window to stop the app.
echo  ============================================================
echo.

REM Start the dev server in a new window (Vite auto-opens browser via open:true in vite.config.js)
start "AI Resume Parser - Server" cmd /k "npm run dev"

REM Wait for server to be ready then open browser as backup
timeout /t 5 /nobreak >nul
start http://localhost:3000

echo.
echo  [OK] App launched! Check your browser at http://localhost:3000
echo.
pause
