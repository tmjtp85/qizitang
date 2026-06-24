@echo off
echo ==================================
echo   Qizitang Stop
echo ==================================
echo.

taskkill /FI "WINDOWTITLE eq Qizitang*" /T /F

echo.
echo ==================================
echo Stopped all processes
echo ==================================
echo.
pause
