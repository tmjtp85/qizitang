@echo off
chcp 65001 >nul
cd /d %~dp0
echo ========================================
echo   启字堂 · 一年级识字学习网页
echo ========================================
echo.

echo [1/3] 启动 MySQL 服务...
net start MySQL 2>nul || echo MySQL 服务已运行
timeout /t 2 /nobreak >nul

echo [2/3] 初始化数据库（仅首次需要）...
cd /d %~dp0backend
node utils\seedData.js

echo [3/3] 启动后端服务（含前端页面）...
start "qizitang" cmd /c "cd /d %~dp0backend && node app.js"
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo   启动完成！
echo   访问地址：http://localhost:3000
echo ========================================
echo.
echo 按任意键关闭此窗口（服务后台继续运行）
pause >nul
