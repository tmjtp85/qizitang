const http = require('http');

console.log('🔍 启字堂服务器 - HTTP 端口 9090 测试 (所有网络接口)');

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
  console.log(`📝 收到请求: ${req.method} ${req.url} from ${req.socket.remoteAddress}`);
  
  res.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  });
  
  res.end('启字堂 HTTP 服务器响应\n时间: ' + new Date().toLocaleString('zh-CN') + '\n');
});

// 启动服务器 - 监听所有网络接口
const PORT = 9090;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 HTTP 服务器启动成功 - 端口 ${PORT}`);
  console.log(`📍 地址: http://127.0.0.1:${PORT} 或 http://localhost:${PORT}`);
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