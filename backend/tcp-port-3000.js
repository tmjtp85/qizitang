const net = require('net');

console.log('🔍 启字堂服务器 - TCP 端口 3000 测试');

// 创建 TCP 服务器
const server = net.createServer((socket) => {
  console.log('📞 客户端连接成功');
  
  socket.write('启字堂 TCP 服务器响应\n');
  socket.write('时间: ' + new Date().toLocaleString('zh-CN') + '\n');
  
  socket.on('data', (data) => {
    console.log('📝 收到数据:', data.toString());
    socket.write('数据已收到: ' + data.toString() + '\n');
  });
  
  socket.on('close', () => {
    console.log('🔚 连接关闭');
  });
});

// 启动服务器
const PORT = 3000;
server.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 TCP 服务器启动成功 - 端口 ${PORT}`);
  console.log(`📍 地址: 127.0.0.1:${PORT}`);
  console.log(`📊 进程ID: ${process.pid}`);
  
  // 立即自我测试
  const client = net.connect(PORT, '127.0.0.1', () => {
    console.log('✅ 自我测试成功 - TCP 连接建立');
    client.write('测试数据\n');
    client.end();
  });
});

// 错误处理
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