const http = require('http');

// 创建最简单的 HTTP 服务器
const server = http.createServer((req, res) => {
  console.log(`收到请求: ${req.method} ${req.url}`);
  
  // 简单的响应
  res.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  });
  
  res.end('启字堂服务器正常工作!\n时间: ' + new Date().toLocaleString('zh-CN'));
});

// 启动服务器
const PORT = 55555;
server.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 服务器启动在端口 ${PORT}`);
  console.log(`📍 访问地址: http://127.0.0.1:${PORT}`);
  console.log(`📊 服务器信息: 正常运行`);
  
  // 立即自我测试
  setTimeout(() => {
    const test = require('http').get(`http://127.0.0.1:${PORT}`, (res) => {
      console.log(`✅ 自我测试成功 - 状态码: ${res.statusCode}`);
    });
  }, 1000);
});

// 错误处理
server.on('error', (err) => {
  console.error('❌ 服务器错误:', err.message);
});