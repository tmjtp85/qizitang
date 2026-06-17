const net = require('net');

const server = net.createServer((socket) => {
  console.log('客户端连接成功!');
  socket.write('Hello from Node.js!\n');
  socket.write('启字堂服务器运行正常\n');
  socket.end();
});

server.on('error', (err) => {
  console.error('服务器错误:', err);
});

const PORT = 55555;
server.listen(PORT, '127.0.0.1', () => {
  console.log(`TCP 服务器启动在端口 ${PORT}`);
  console.log(`客户端可以连接到: 127.0.0.1:${PORT}`);
});

// 5秒后自我测试
setTimeout(() => {
  console.log('开始自我测试...');
  const client = require('net');
  const selfTest = client.connect(PORT, '127.0.0.1', () => {
    console.log('自我测试: 连接成功!');
    selfTest.write('test\n');
  });
  
  selfTest.on('data', (data) => {
    console.log('自我测试收到:', data.toString());
    selfTest.end();
  });
  
  selfTest.on('error', (err) => {
    console.log('自我测试失败:', err.message);
  });
}, 2000);