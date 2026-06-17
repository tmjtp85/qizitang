$proc = Start-Process -FilePath "node.exe" -ArgumentList "app.js" -WorkingDirectory "C:\Users\Administrator\Desktop\Ê¶×Ö\backend" -WindowStyle Hidden -PassThru
$proc.Id | Out-File "C:\Users\Administrator\Desktop\Ê¶×Ö\backend\.pid" -Force
