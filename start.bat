@echo off
title Aurora Streaming Platform
color 0C
cd /d "%~dp0"

echo ========================================================
echo       AURORA STREAMING PLATFORM - STARTUP
echo ========================================================
echo.

:: 1. Verify Node.js is installed
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js was not found in your system PATH!
    echo Please download and install Node.js from: https://nodejs.org
    echo After installing, close and re-open this script.
    echo.
    pause
    exit /b 1
)

echo [*] Node.js is ready.
echo [*] Starting Aurora Cinema Server...
echo [*] Press Ctrl+C in this window at any time to stop the server.
echo.

:: 2. Start native Node server (server automatically opens your browser on the active port)
node server\server.js

echo.
echo Server has stopped.
pause
