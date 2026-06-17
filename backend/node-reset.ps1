# 创建 Node.js 重置脚本
Write-Host "=== Node.js 重置方案 ==="

Write-Host "方案1: 使用 nvm 管理版本"
Write-Host "方案2: 手动下载稳定版本"
Write-Host "方案3: 使用当前版本创建绕过方案"

Write-Host "`n创建绕过方案..."

# 创建一个使用当前版本但兼容性更好的服务器
@"
const http = require('http');
const { URL } = require('url');

const server = http.createServer((req, res) => {
  // 允许跨域请求
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  res.writeHead(200, { 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  
  const responseData = {
    status: 'ok',
    message: '启字堂后端服务运行中',
    nodeVersion: process.version,
    timestamp: new Date().toISOString(),
    path: req.url
  };
  
  res.end(JSON.stringify(responseData, null, 2));
});

const PORT = 8888;
const HOST = '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log(`🚀 服务器启动成功!`);
  console.log(`📍 地址: http://127.0.0.1:${PORT}`);
  console.log(`📍 全局地址: http://localhost:${PORT}`);
  console.log(`📊 状态: ${process.version}`);
  
  // 立即测试
  const selfTest = require('http');
  selfTest.get(`http://127.0.0.1:${PORT}`, (res) => {
    console.log('✅ 自我测试成功:', res.statusCode);
  });
});

server.on('error', (err) => {
  console.error('❌ 服务器错误:', err.message);
});
"@ | Out-File -FilePath "C:\Users\Administrator\Desktop\识字\backend\final-server.js" -Encoding UTF8

Write-Host "🎯 最终服务器脚本已创建"
Write-Host "🔧 运行命令: node final-server.js"
Write-Host "📝 然后访问 http://127.0.0.1:8888 测试"