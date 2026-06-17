# 尝试修改注册表来允许入站连接
# 这是一个修复脚本

# 检查当前防火墙状态
Write-Host "当前防火墙状态:"
netsh advfirewall show allprofiles | Select-String "状态"

# 尝试允许所有入站连接（需要管理员权限）
Write-Host "`n尝试启用入站连接..."
try {
    Start-Process powershell -Verb RunAs -ArgumentList "netsh advfirewall set allprofiles firewallpolicy inboundblockinbound off; netsh advfirewall set allprofiles firewallpolicy outboundblockoutbound off"
    Write-Host "已尝试修改防火墙策略"
} catch {
    Write-Host "无法修改防火墙策略，可能需要手动操作"
}

# 创建一个简单的 Python HTTP 服务器来测试
Write-Host "`n创建 Python 测试服务器..."
@"
import http.server
import socketserver

PORT = 3002
Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Python HTTP server running on port {PORT}")
    httpd.serve_forever()
"@ | Out-File -FilePath "C:\Users\Administrator\Desktop\识字\backend\python-server.py" -Encoding ASCII

Write-Host "Python 服务器脚本已创建，运行 'python python-server.py' 来启动"
Write-Host "然后访问 http://127.0.0.1:3002 测试"