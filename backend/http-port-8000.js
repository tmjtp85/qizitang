const http = require('http');

console.log('🔍 启字堂服务器 - HTTP 端口 8000 测试');

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
  console.log(`📝 收到请求: ${req.method} ${req.url}`);
  
  res.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8'
  });
  
  res.end('启字堂 HTTP 服务器响应\n时间: ' + new Date().toLocaleString('zh-CN') + '\n');
});

// 启动服务器
const PORT = 8000;
server.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 HTTP 服务器启动成功 - 端口 ${PORT}`);
  console.log(`📍 地址: http://127.0.0.1:${PORT}`);
  console.log(`📊 进程ID: ${process.pid}`);
  
  // 立即自我测试
  const test = require('http').get(`http://127.0.0.1:${PORT}`, (res) => {
    console.log(`✅ 自我测试成功 - 状态码: ${res.statusCode}`);
  });
});

// 详细错误处理
server.on('error', (err) => {
  console.error('❌ 服务器错误:', err);
  console.error('错误代码:', err.code);
  console.error('错误消息:', err.message);
  console.error('错误堆栈:', err.stack);
});

// 进程退出处理
process.on('uncaughtException', (err) => {
  console.error('❌ 未捕获异常:', err);
});

process.on('exit', (code) => {
  console.log(`🔚 进程退出 - 代码: ${code}`);
});