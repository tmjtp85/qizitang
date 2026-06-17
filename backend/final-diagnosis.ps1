# 最终诊断和解决方案
Write-Host "=== 最终诊断 ==="

# 检查系统代理
Write-Host "`n1. 检查系统代理设置:"
netsh winhttp show proxy

# 检查第三方安全软件
Write-Host "`n2. 检查安全软件:"
Get-Process | Where-Object {$_.ProcessName -like "*360*" -or $_.ProcessName -like "*安全*" -or $_.ProcessName -like "*防护*" -or $_.ProcessName -like "*杀毒*"} | Select-Object ProcessName, Id

Write-Host "`n3. 创建绕过方案..."
# 创建一个不依赖标准端口的服务器
@"
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('启字堂服务器正常工作!\n');
  res.write('Node.js 版本: ' + process.version + '\n');
  res.write('时间: ' + new Date().toISOString() + '\n');
  res.end();
});

// 使用非常规端口
const PORT = 55555;
const HOST = '127.0.0.1';

server.listen(PORT, HOST, () => {
  console.log('服务器启动在 http://127.0.0.1:' + PORT);
  console.log('这是绕过防火墙的最后一个尝试');
});

console.log('请在浏览器中访问: http://127.0.0.1:' + PORT);
"@ | Out-File -FilePath "C:\Users\Administrator\Desktop\识字\backend\last-resort.js" -Encoding UTF8

Write-Host "`n4. 建议的解决方案:"
Write-Host "A. 手动配置防火墙允许入站连接"
Write-Host "B. 使用端口转发 (portforward)"
Write-Host "C. 安装稳定的 Node.js 版本 (如 LTS 版本)"
Write-Host "D. 禁用第三方安全软件"
Write-Host "E. 使用网络共享或 VPN"

Write-Host "`n🎯 尝试最终解决方案..."
Write-Host "运行: node last-resort.js"
Write-Host "然后访问: http://127.0.0.1:55555"