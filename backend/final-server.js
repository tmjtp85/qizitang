const http = require('http');

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
  console.log('🚀 服务器启动成功!');
  console.log('📍 地址: http://127.0.0.1:' + PORT);
  console.log('📍 全局地址: http://localhost:' + PORT);
  console.log('📊 状态: ' + process.version);
  
  // 立即测试
  const selfTest = require('http');
  selfTest.get('http://127.0.0.1:' + PORT, (res) => {
    console.log('✅ 自我测试成功:', res.statusCode);
  });
});

server.on('error', (err) => {
  console.error('❌ 服务器错误:', err.message);
});