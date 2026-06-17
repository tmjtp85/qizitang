echo "=== 启字堂服务器状态检查 ==="
echo "时间: %date% %time%"
echo.

echo "检查 Node.js 进程..."
tasklist /FI "IMAGENAME eq node.exe" /FO TABLE
echo.

echo "检查端口 55555..."
netstat -ano | findstr ":55555"
echo.

echo "=== 测试建议 ==="
echo "1. 在浏览器中访问: http://127.0.0.1:55555"
echo "2. 如果无法访问，请手动重启服务器"
echo "3. 命令重启: node stable-server.js"
echo.
echo "=== 服务器信息 ==="
echo "文件路径: C:\Users\Administrator\Desktop\识字\backend\stable-server.js"
echo "工作目录: C:\Users\Administrator\Desktop\识字\backend"