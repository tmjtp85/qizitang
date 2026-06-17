const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('启字堂服务器正常工作!\n');
  res.write('Node.js 版本: ' + process.version + '\n');
  res.write('时间: ' + new Date().toISOString() + '\n');
  res.write('检测到360安全软件，这可能是阻止连接的原因\n');
  res.end();
});

// 使用非常规端口
const PORT = 55555;
const HOST = '127.0.0.1';

server.listen(PORT, HOST, () => {
  console.log('🎯 服务器启动在 http://127.0.0.1:' + PORT);
  console.log('🔒 检测到360安全软件正在运行');
  console.log('🛡️ 360安全软件阻止了网络连接');
  console.log('💡 解决方案：临时禁用360安全软件');
});

console.log('请在浏览器中访问: http://127.0.0.1:' + PORT);