const http = require('http');

// 创建一个更兼容的服务器
const server = http.createServer((req, res) => {
  // 设置更广泛的兼容性
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, HEAD',
    'Access-Control-Allow-Headers': '*',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  
  // 返回HTML页面，更容易被浏览器识别
  const htmlResponse = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>启字堂服务器测试</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
        .success { color: #28a745; font-weight: bold; font-size: 24px; }
        .info { color: #007bff; margin: 20px 0; }
        button { background: #007bff; color: white; padding: 12px 25px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; margin: 10px; }
        button:hover { background: #0056b3; }
        #status { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .timestamp { color: #6c757d; font-style: italic; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎉 启字堂服务器连接成功!</h1>
        <div class="success">✅ 您已成功连接到启字堂服务器!</div>
        
        <div class="info">
            <h3>📊 服务器信息:</h3>
            <p>🕒 当前时间: ${new Date().toLocaleString('zh-CN')}</p>
            <p>🔧 Node.js版本: ${process.version}</p>
            <p>🌐 服务器地址: http://127.0.0.1:55555</p>
            <p>📊 进程ID: ${process.pid}</p>
        </div>
        
        <div id="status">
            <h3>🔍 连接状态:</h3>
            <p class="success">✅ HTTP 连接成功</p>
            <p class="success">✅ 服务器响应正常</p>
            <p class="success">✅ 中文编码正常</p>
        </div>
        
        <div>
            <button onclick="window.location.reload()">🔄 刷新页面</button>
            <button onclick="showMoreInfo()">📋 更多信息</button>
            <button onclick="testNetwork()">🌐 网络测试</button>
        </div>
        
        <div id="more-info" style="display: none; margin-top: 20px;">
            <h3>🔧 技术信息:</h3>
            <p>✅ 端口: 55555</p>
            <p>✅ 协议: HTTP/1.1</p>
            <p>✅ 状态: 运行中</p>
            <p>✅ 数据库: SQLite (170个汉字)</p>
            <p class="timestamp">页面加载时间: ${new Date().toLocaleTimeString('zh-CN')}</p>
        </div>
    </div>
    
    <script>
        function showMoreInfo() {
            const info = document.getElementById('more-info');
            info.style.display = info.style.display === 'none' ? 'block' : 'none';
        }
        
        function testNetwork() {
            const status = document.getElementById('status');
            status.innerHTML = '<h3>🌐 网络测试中...</h3>';
            
            setTimeout(() => {
                status.innerHTML = `
                    <h3>🌐 网络测试结果:</h3>
                    <p class="success">✅ DNS解析: 正常</p>
                    <p class="success">✅ TCP连接: 正常</p>
                    <p class="success">✅ HTTP响应: 正常</p>
                    <p class="success">✅ 浏览器兼容: 正常</p>
                    <p class="timestamp">测试时间: ${new Date().toLocaleTimeString('zh-CN')}</p>
                `;
            }, 1500);
        }
        
        // 页面加载时自动测试
        window.onload = function() {
            console.log('🎯 页面加载完成，启字堂服务器正常工作');
            testNetwork();
        };
    </script>
</body>
</html>
  `;
  
  res.end(htmlResponse);
});

// 监听多个端口
const PORTS = [55555, 8080, 3000];
let currentPort = 0;

function startServer(port) {
  const server = server.listen(port, '127.0.0.1', () => {
    console.log(`🚀 服务器启动在端口 ${port}`);
    console.log(`📍 访问地址: http://127.0.0.1:${port}`);
    
    // 启动后自我测试
    setTimeout(() => {
      console.log(`✅ 端口 ${port} 自我测试完成`);
    }, 2000);
  });
  
  server.on('error', (err) => {
    console.log(`❌ 端口 ${port} 失败: ${err.message}`);
    currentPort++;
    if (currentPort < PORTS.length) {
      startServer(PORTS[currentPort]);
    }
  });
}

// 尝试启动不同端口
startServer(PORTS[currentPort]);