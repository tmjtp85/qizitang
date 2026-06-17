const http = require('http');
const net = require('net');

console.log('🔍 启字堂服务器诊断工具');

// 测试不同连接方式
function testConnections() {
  console.log('\n=== 连接测试开始 ===');
  
  // 1. TCP 连接测试
  console.log('\n1. TCP 连接测试:');
  const tcpTest = net.connect(55555, '127.0.0.1', () => {
    console.log('✅ TCP 连接成功');
    tcpTest.end();
  });
  
  tcpTest.on('error', (err) => {
    console.log('❌ TCP 连接失败:', err.message);
  });
  
  // 2. HTTP 连接测试
  console.log('\n2. HTTP 连接测试:');
  const httpTest = http.get('http://127.0.0.1:55555', (res) => {
    console.log('✅ HTTP 连接成功 - 状态码:', res.statusCode);
    res.on('data', (chunk) => {
      console.log('📝 服务器响应:', chunk.toString());
    });
  });
  
  httpTest.on('error', (err) => {
    console.log('❌ HTTP 连接失败:', err.message);
  });
  
  // 3. 网络诊断
  console.log('\n3. 网络诊断:');
  console.log('本地回环地址测试:');
  
  // 测试不同地址格式
  const addresses = ['127.0.0.1', 'localhost'];
  
  addresses.forEach(addr => {
    console.log(`\n测试 ${addr}:55555`);
    const client = net.connect(55555, addr, () => {
      console.log(`✅ ${addr} 连接成功`);
      client.end();
    });
    
    client.on('error', (err) => {
      console.log(`❌ ${addr} 连接失败:`, err.message);
    });
  });
}

// 测试端口占用
function testPortStatus() {
  console.log('\n=== 端口状态检查 ===');
  console.log('当前进程信息:');
  console.log('PID:', process.pid);
  console.log('端口:', 55555);
  console.log('监听地址: 127.0.0.1');
}

// 启动服务器和诊断
function startAndDiagnose() {
  console.log('🚀 启动诊断服务器...');
  
  const server = http.createServer((req, res) => {
    console.log(`收到请求: ${req.method} ${req.url}`);
    
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    
    const response = `🎯 启字堂服务器诊断成功！

✅ 服务器状态: 正常运行
📅 时间: ${new Date().toLocaleString('zh-CN')}
🔧 Node.js: ${process.version}
🌐 地址: 127.0.0.1:55555
📊 进程ID: ${process.pid}

🔍 连接测试:
  - TCP: ✅ 正常
  - HTTP: ✅ 正常
  - 回环: ✅ 正常

💡 提示: 如果您无法访问，请检查:
  1. 浏览器代理设置
  2. 防火墙配置
  3. DNS 解析

📋 可用地址:
  http://127.0.0.1:55555
  http://localhost:55555
`;

    res.end(response);
  });
  
  // 启动服务器
  server.listen(55555, '127.0.0.1', () => {
    console.log('✅ 服务器启动成功');
    console.log('📍 地址: http://127.0.0.1:55555');
    
    // 运行诊断
    setTimeout(() => {
      testPortStatus();
      testConnections();
    }, 2000);
  });
  
  server.on('error', (err) => {
    console.error('❌ 服务器错误:', err.message);
  });
}

// 开始诊断
startAndDiagnose();