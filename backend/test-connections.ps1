# 尝试多种连接方式
Write-Host "=== 尝试所有连接方式 ==="

# 方式1: 使用 PowerShell 的 Invoke-RestMethod
try {
    Write-Host "方式1: Invoke-RestMethod"
    $response = Invoke-RestMethod -Uri "http://127.0.0.1:8888" -TimeoutSec 3
    Write-Host "成功!" $response
} catch {
    Write-Host "失败:" $_.Exception.Message
}

Write-Host "`n方式2: 使用 curl 命令"
try {
    curl -Uri "http://127.0.0.1:8888" -TimeoutSec 3
    Write-Host "curl 成功"
} catch {
    Write-Host "curl 失败"
}

Write-Host "`n方式3: 使用 wget (如果可用)"
try {
    wget -O - "http://127.0.0.1:8888" --timeout=3
    Write-Host "wget 成功"
} catch {
    Write-Host "wget 失败或不可用"
}

Write-Host "`n方式4: 使用 telnet"
Write-Host "手动测试: telnet 127.0.0.1 8888"