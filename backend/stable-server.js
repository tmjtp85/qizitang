const http = require('http');

// 创建稳定的服务器
const server = http.createServer((req, res) => {
  // 立即设置响应头，避免缓冲问题
  res.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  
  // 创建稳定的响应内容
  const response = `启字堂服务器 🚀

✅ 状态: 运行正常
📅 时间: ${new Date().toLocaleString('zh-CN')}
🔧 Node.js: ${process.version}
🌐 地址: 127.0.0.1:55555
📊 进程ID: ${process.pid}
🔗 连接成功！

📋 可用测试路径:
  / - 主页面
  /test - 测试页面
  /health - 健康检查
  /status - 状态信息

🎯 提示: 如果页面加载失败，请刷新页面
`;

  // 直接写入并结束
  res.write(response);
  res.end();
});

// 错误处理
server.on('error', (err) => {
  console.error('服务器错误:', err);
  
  // 如果端口被占用，更换端口
  if (err.code === 'EADDRINUSE') {
    console.log('端口被占用，更换端口...');
    server.listen(55556, '127.0.0.1', () => {
      console.log(`新端口: 55556`);
    });
  }
});

// 启动服务器
const PORT = 55555;
server.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 启字堂服务器启动成功!`);
  console.log(`📍 地址: http://127.0.0.1:${PORT}`);
  console.log(`🕒 启动时间: ${new Date().toLocaleString()}`);
  console.log(`🔧 PID: ${process.pid}`);
  
  // 启动后立即自我测试
  setTimeout(() => {
    testServer();
  }, 2000);
});

// 定期保持服务器活跃
setInterval(() => {
  const currentTime = new Date().toLocaleTimeString();
  // 这个日志不会发送到客户端，只是保持进程活跃
  if (Math.random() < 0.1) { // 10% 概率记录，避免日志过多
    console.log(`服务器状态检查 - ${currentTime}`);
  }
}, 30000); // 每30秒检查一次

function testServer() {
  const testReq = require('http').get(`http://127.0.0.1:${PORT}`, (res) => {
    console.log(`✅ 自我测试成功 - 状态码: ${res.statusCode}`);
  });
  
  testReq.on('error', (err) => {
    console.log(`❌ 自我测试失败: ${err.message}`);
  });
}

// 处理进程退出
process.on('SIGINT', () => {
  console.log('\n👋 服务器正在关闭...');
  server.close(() => {
    console.log('✅ 服务器已安全关闭');
    process.exit(0);
  });
});

process.on('uncaughtException', (err) => {
  console.error('未捕获的异常:', err);
});

console.log('🎯 启字堂服务器正在启动中...');