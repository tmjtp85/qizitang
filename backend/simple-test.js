console.log('🎯 启动简单测试服务器...');

// 最简单的 HTTP 服务器
const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Hello from启字堂服务器!\nThis is a simple test server.\n时间: ' + new Date());
});

server.listen(55555, '127.0.0.1', () => {
  console.log('✅ 服务器启动在 127.0.0.1:55555');
  console.log('PID:', process.pid);
});

// 简单的错误处理
server.on('error', (err) => {
  console.log('错误:', err.message);
});

console.log('🚀 服务器正在运行...');