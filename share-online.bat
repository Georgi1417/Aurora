@echo off
title Aurora Cinema - Share Online Tunnel
color 0C
cd /d "%~dp0"

echo ========================================================
echo       AURORA CINEMA - INSTANT ONLINE PUBLIC ACCESS
echo ========================================================
echo.
echo [*] Checking if Aurora server is running...
curl -s http://localhost:5001/api/movies >nul 2>&1
if %errorlevel% neq 0 (
    curl -s http://localhost:5000/api/movies >nul 2>&1
    if %errorlevel% neq 0 (
        echo [!] Aurora server does not seem to be running.
        echo Starting Aurora server in background...
        start "" cmd /c start.bat
        timeout /t 3 >nul
    )
)

echo [*] Launching free secure HTTPS tunnel to the internet...
echo [*] Share the generated link with your friends or open on your phone!
echo.
npx --yes localtunnel --port 5001
pause
