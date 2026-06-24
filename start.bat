@echo off
echo ==================================
echo   Qizitang - Start
echo ==================================
echo.
echo Backend starting...
cd /d "%~dp0backend"
start "Qizitang Backend" cmd /k "node app.js"

timeout /t 3 /nobreak >nul

echo Frontend starting...
cd /d "%~dp0frontend"
start "Qizitang Frontend" cmd /k "npm run dev"

echo.
echo ==================================
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5173
echo ==================================
echo.
echo Press any key to keep windows open...
pause >nul
