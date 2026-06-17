# 简单的修复脚本
Write-Host "尝试修复防火墙问题..."

# 尝试关闭入站阻止
netsh advfirewall set allprofiles firewallpolicy inboundblockinbound off

# 添加入站规则
netsh advfirewall firewall add rule name="NodeJS Test" dir=in action=allow protocol=TCP localport=3001,3000,8080

Write-Host "修复尝试完成"

Write-Host "检查端口 3001 是否允许..."
netsh advfirewall firewall show rule | findstr "3001"

Write-Host "检查所有入站规则..."
netsh advfirewall firewall show rule name="NodeJS Test"