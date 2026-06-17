const express = require('express');
const app = express();
const PORT = 8080;

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: '启字堂后端服务运行中',
    port: PORT,
    address: req.socket.localAddress
  });
});

// 尝试绑定到 127.0.0.1 而不是 0.0.0.0
app.listen(PORT, '127.0.0.1', () => {
  console.log(`启字堂后端服务启动，端口: ${PORT}`);
  console.log(`访问地址: http://127.0.0.1:${PORT}`);
  console.log(`API健康检查: http://127.0.0.1:${PORT}/api/health`);
});

app.on('error', (err) => {
  console.error('服务器错误:', err);
  if (err.code === 'EADDRINUSE') {
    console.log('端口被占用，尝试更换端口...');
    app.listen(PORT + 1, '127.0.0.1', () => {
      console.log(`服务启动在端口 ${PORT + 1}`);
    });
  }
});