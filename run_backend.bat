@echo off
cd /d C:\Users\Administrator\Desktop\??\backend
node app.js > C:\Users\Administrator\Desktop\??\backend.log 2>&1
echo %errorlevel% > C:\Users\Administrator\Desktop\??\backend.exit
