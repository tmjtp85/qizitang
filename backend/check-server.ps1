# 简化的测试脚本
Write-Host "=== 启字堂服务器状态检查 ==="
Write-Host "时间: $(Get-Date)"

# 检查 Node.js 进程
$nodeProcesses = Get-Process | Where-Object {$_.ProcessName -eq "node"}
if ($nodeProcesses) {
    Write-Host "✅ Node.js 进程正在运行:"
    $nodeProcesses | Format-Table ProcessName, Id, Responding
} else {
    Write-Host "❌ 没有找到 Node.js 进程"
}

# 检查端口监听
$portStatus = netstat -ano | findstr ":55555"
if ($portStatus) {
    Write-Host "✅ 端口 55555 正在监听:"
    $portStatus
} else {
    Write-Host "❌ 端口 55555 没有监听"
}

Write-Host "`n=== 测试建议 ==="
Write-Host "1. 在浏览器中访问: http://127.0.0.1:55555"
Write-Host "2. 如果无法访问，请手动重启服务器"
Write-Host "3. 命令重启: node stable-server.js"

Write-Host "`n=== 服务器信息 ==="
Write-Host "文件路径: C:\Users\Administrator\Desktop\识字\backend\stable-server.js"
Write-Host "工作目录: C:\Users\Administrator\Desktop\识字\backend"
Write-Host "当前PID: $PID"