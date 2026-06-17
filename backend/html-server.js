const http = require('http');

// 创建简单的HTML服务器
const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  });
  
  const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>启字堂服务器测试</title>
    <style>
        body { font-family: Arial; padding: 20px; background: #f0f8ff; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        .success { color: #28a745; font-weight: bold; font-size: 18px; }
        button { background: #007bff; color: white; padding: 10px; border: none; border-radius: 4px; cursor: pointer; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎉 启字堂服务器连接成功!</h1>
        <div class="success">✅ 您已成功连接到启字堂服务器!</div>
        
        <h3>📊 服务器信息:</h3>
        <p>🕒 时间: ${new Date().toLocaleString('zh-CN')}</p>
        <p>🔧 Node.js: ${process.version}</p>
        <p>🌐 地址: http://127.0.0.1:55555</p>
        <p>📊 进程ID: ${process.pid}</p>
        
        <button onclick="location.reload()">刷新</button>
        <button onclick="alert('测试成功!')">测试</button>
    </div>
</body>
</html>`;
  
  res.end(html);
});

const PORT = 55555;
server.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 服务器启动在端口 ${PORT}`);
  console.log(`📍 访问地址: http://127.0.0.1:${PORT}`);
});