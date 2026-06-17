const http = require('http');

const hostname = '127.0.0.1';
const port = 8080;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  const response = {
    status: 'ok',
    message: '启字堂后端服务运行中',
    port: port,
    timestamp: new Date().toISOString()
  };
  res.end(JSON.stringify(response));
});

server.listen(port, hostname, () => {
  console.log(`服务器运行在 http://${hostname}:${port}/`);
  console.log(`API健康检查: http://${hostname}:${port}/`);
  
  // 立即测试自己
  const testReq = http.get(`http://${hostname}:${port}/`, (testRes) => {
    console.log('服务器自我测试成功，状态码:', testRes.statusCode);
    testRes.on('data', (chunk) => {
      console.log('服务器响应:', chunk.toString());
    });
  });
  
  testReq.on('error', (err) => {
    console.error('自我测试失败:', err.message);
  });
});

server.on('error', (err) => {
  console.error('服务器错误:', err);
});