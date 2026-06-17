@echo off
echo 正在诊断网络问题...
echo.

echo 1. 检查端口监听状态
netstat -an | findstr ":3001"
echo.

echo 2. 检查防火墙状态
netsh advfirewall show allprofiles
echo.

echo 3. 测试 TCP 连接
echo quit | telnet 127.0.0.1 3001
echo.

echo 4. 检查路由表
route print
echo.

echo 诊断完成
pause