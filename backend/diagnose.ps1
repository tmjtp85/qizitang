# 获取系统信息和 Node.js 版本
Write-Host "=== 系统诊断 ==="
Write-Host "Node.js 版本:"
node --version

Write-Host "`nnpm 版本:"
npm --version

Write-Host "`n检查 Node.js 安装位置:"
where node

Write-Host "`n检查 npm 安装位置:"
where npm

Write-Host "`n检查环境变量:"
$env:PATH | Split-Path -Parent

Write-Host "`n检查端口占用:"
netstat -ano | findstr ":5000"