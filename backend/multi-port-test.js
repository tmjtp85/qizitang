const http = require('http');

// 创建服务器实例
const server = http.createServer((req, res) => {
  // 详细的响应头
  res.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  
  const response = `启字堂服务器测试成功！

🎯 状态: 运行正常
📅 时间: ${new Date().toLocaleString('zh-CN')}
🔧 Node.js版本: ${process.version}
🌍 请求信息:
   - 方法: ${req.method}
   - 路径: ${req.url}
   - 来源: ${req.socket.remoteAddress}

✅ 连接测试通过！

如需访问完整应用，请检查浏览器设置或尝试其他端口。
`;

  res.end(response);
});

// 尝试多个端口
const ports = [55555, 55556, 55557];
let currentPort = 0;

function tryStartPort() {
  if (currentPort >= ports.length) {
    console.log('所有端口尝试失败');
    return;
  }

  const PORT = ports[currentPort];
  console.log(`尝试启动端口 ${PORT}...`);

  server.listen(PORT, '127.0.0.1', () => {
    console.log(`✅ 服务器成功启动在端口 ${PORT}`);
    console.log(`📍 测试地址: http://127.0.0.1:${PORT}`);
    console.log(`📍 本地地址: http://localhost:${PORT}`);
    
    // 立即测试
    setTimeout(() => {
      testConnection(PORT);
    }, 1000);
  });

  server.on('error', (err) => {
    console.log(`❌ 端口 ${PORT} 失败: ${err.message}`);
    currentPort++;
    tryStartPort();
  });
}

function testConnection(port) {
  const testUrl = `http://127.0.0.1:${port}`;
  const testReq = require('http').get(testUrl, (res) => {
    console.log(`✅ 端口 ${port} 测试成功! 状态码: ${res.statusCode}`);
  });
  
  testReq.on('error', (err) => {
    console.log(`❌ 端口 ${port} 测试失败: ${err.message}`);
  });
}

tryStartPort();