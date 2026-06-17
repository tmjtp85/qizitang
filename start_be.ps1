$p = Start-Process -FilePath "node" -ArgumentList "app.js" -WorkingDirectory "C:\Users\Administrator\Desktop\??\backend" -NoNewWindow -PassThru
Write-Output "PID: $($p.Id)"
Start-Sleep -Seconds 8
try {
  $r = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -UseBasicParsing -TimeoutSec 5
  Write-Output "OK: $($r.Content)"
} catch {
  Write-Output "Fail: $($_.Exception.Message)"
}
