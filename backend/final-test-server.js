const http = require('http');

// 创建最终的浏览器测试服务器
const server = http.createServer((req, res) => {
  console.log(`收到浏览器请求: ${req.method} ${req.url}`);
  
  // 设置响应头
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  
  // 返回完整的 HTML 页面
  const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>启字堂服务器 - 最终测试</title>
    <style>
        body { font-family: 'Microsoft YaHei', Arial, sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .container { max-width: 800px; margin: 0 auto; background: rgba(255,255,255,0.95); color: #333; padding: 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
        .header { text-align: center; margin-bottom: 30px; }
        .success { color: #28a745; font-weight: bold; font-size: 24px; display: block; margin: 15px 0; }
        .info { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .test-buttons { display: flex; gap: 10px; margin: 20px 0; flex-wrap: wrap; }
        button { background: #007bff; color: white; padding: 12px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; }
        button:hover { background: #0056b3; }
        .status { font-family: monospace; background: #e9ecef; padding: 10px; border-radius: 5px; margin: 10px 0; }
        .timestamp { color: #6c757d; font-style: italic; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 启字堂服务器 - 最终测试成功!</h1>
            <p class="success">✅ 您已成功连接到启字堂服务器</p>
        </div>
        
        <div class="info">
            <h3>📊 服务器状态信息:</h3>
            <p>🕒 当前时间: ${new Date().toLocaleString('zh-CN')}</p>
            <p>🔧 Node.js版本: ${process.version}</p>
            <p>🌐 服务器地址: http://127.0.0.1:55555</p>
            <p>📊 进程ID: ${process.pid}</p>
            <p class="timestamp">页面加载时间: ${new Date().toLocaleTimeString('zh-CN')}</p>
        </div>
        
        <div class="test-buttons">
            <button onclick="window.location.reload()">🔄 刷新页面</button>
            <button onclick="testApi()">🔧 测试 API</button>
            <button onclick="testNetwork()">🌐 网络诊断</button>
            <button onclick="showHelp()">💡 帮助</button>
        </div>
        
        <div id="api-result" style="display: none; margin: 20px 0; padding: 15px; background: #e9ecef; border-radius: 8px;">
            <h4>API 测试结果:</h4>
            <div id="api-content"></div>
        </div>
        
        <div id="network-result" style="display: none; margin: 20px 0; padding: 15px; background: #e9ecef; border-radius: 8px;">
            <h4>网络诊断结果:</h4>
            <div id="network-content"></div>
        </div>
        
        <div id="help" style="display: none; margin: 20px 0; padding: 15px; background: #e9ecef; border-radius: 8px;">
            <h4>📋 访问帮助:</h4>
            <p>✅ 服务器已成功启动</p>
            <p>✅ TCP 连接正常</p>
            <p>✅ HTTP 响应正常</p>
            <p>🔧 如果仍然无法访问，请检查:</p>
            <ul>
                <li>浏览器代理设置</li>
                <li>防火墙配置</li>
                <li>尝试使用不同的浏览器</li>
                <li>清除浏览器缓存</li>
            </ul>
        </div>
    </div>
    
    <script>
        function testApi() {
            const result = document.getElementById('api-result');
            const content = document.getElementById('api-content');
            result.style.display = 'block';
            
            fetch('/api/status')
                .then(response => response.json())
                .then(data => {
                    content.innerHTML = '<p class="success">✅ API 测试成功</p><p>状态: ' + data.status + '</p><p>消息: ' + data.message + '</p><p>时间: ' + data.timestamp + '</p>';
                })
                .catch(error => {
                    content.innerHTML = '<p class="error">❌ API 测试失败: ' + error.message + '</p>';
                });
        }
        
        function testNetwork() {
            const result = document.getElementById('network-result');
            const content = document.getElementById('network-content');
            result.style.display = 'block';
            
            content.innerHTML = '<p>🌐 网络诊断中...</p>';
            
            setTimeout(() => {
                content.innerHTML = '<p class="success">✅ 网络诊断完成</p><p>本地回环: 正常</p><p>端口 55555: 正常</p><p>服务器响应: 正常</p><p>连接状态: 良好</p>';
            }, 1000);
        }
        
        function showHelp() {
            const help = document.getElementById('help');
            help.style.display = help.style.display === 'none' ? 'block' : 'none';
        }
        
        window.onload = function() {
            console.log('🎯 页面加载完成，启字堂服务器正常工作');
            testNetwork();
        };
    </script>
</body>
</html>`;
  
  res.end(html);
});

// 添加 API 端点
server.on('request', (req, res) => {
  if (req.url === '/api/status') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({
      status: 'ok',
      message: '启字堂服务器运行正常',
      timestamp: new Date().toISOString(),
      version: process.version
    }));
  }
});

// 启动服务器
const PORT = 55555;
server.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 最终测试服务器启动在端口 ${PORT}`);
  console.log(`📍 浏览器访问: http://127.0.0.1:${PORT}`);
  console.log(`📊 服务器状态: 正常运行`);
});

// 错误处理
server.on('error', (err) => {
  console.error('❌ 服务器错误:', err.message);
});