const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from test server!');
});

const PORT = 3001;
server.listen(PORT, '127.0.0.1', () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Test URL: http://127.0.0.1:${PORT}`);
  
  // 立即测试自己
  const testReq = http.get(`http://127.0.0.1:${PORT}/`, (testRes) => {
    console.log('Self test successful, status:', testRes.statusCode);
    testRes.on('data', (chunk) => {
      console.log('Response:', chunk.toString());
    });
  });
  
  testReq.on('error', (err) => {
    console.error('Self test failed:', err.message);
  });
});

server.on('error', (err) => {
  console.error('Server error:', err);
});