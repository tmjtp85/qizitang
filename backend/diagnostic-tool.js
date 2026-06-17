const net = require('net');

console.log('🔍 启字堂服务器彻底诊断工具');

// TCP 连接测试
function testTcpConnection() {
  console.log('\n=== TCP 连接测试 ===');
  
  const client = net.connect(55555, '127.0.0.1', () => {
    console.log('✅ TCP 连接成功 - 服务器正在监听');
    client.write('TEST\n');
    
    client.on('data', (data) => {
      console.log('📝 服务器响应:', data.toString());
      client.end();
    });
  });
  
  client.on('error', (err) => {
    console.log('❌ TCP 连接失败:', err.message);
    
    // 尝试其他端口
    testOtherPorts();
  });
}

// 测试其他常用端口
function testOtherPorts() {
  console.log('\n=== 测试其他端口 ===');
  const ports = [8080, 3000, 8000, 80];
  
  ports.forEach(port => {
    console.log(`\n测试端口 ${port}:`);
    const client = net.connect(port, '127.0.0.1', () => {
      console.log(`✅ 端口 ${port} 连接成功`);
      client.end();
    });
    
    client.on('error', (err) => {
      console.log(`❌ 端口 ${port} 连接失败: ${err.message}`);
    });
  });
}

// 创建一个简单的 TCP 服务器来监听
function createDiagnosticServer() {
  console.log('\n=== 创建诊断服务器 ===');
  
  const server = net.createServer((socket) => {
    console.log('📞 客户端连接成功');
    socket.write('启字堂诊断服务器响应\n');
    socket.write('状态: 正常运行\n');
    socket.write('时间: ' + new Date().toLocaleString() + '\n');
    socket.end();
  });
  
  server.on('error', (err) => {
    console.log('❌ 服务器错误:', err.message);
  });
  
  // 启动服务器
  server.listen(55555, '127.0.0.1', () => {
    console.log('✅ 诊断服务器启动在 127.0.0.1:55555');
    
    // 启动测试
    setTimeout(() => {
      testTcpConnection();
    }, 1000);
  });
}

// 网络诊断
function networkDiagnosis() {
  console.log('\n=== 网络诊断 ===');
  
  // 检查本地回环
  console.log('\n1. 本地回环测试:');
  require('dns').lookup('localhost', (err, address) => {
    if (err) {
      console.log('❌ localhost 解析失败:', err.message);
    } else {
      console.log('✅ localhost 地址:', address);
    }
  });
  
  // 检查 127.0.0.1
  require('dns').lookup('127.0.0.1', (err, address) => {
    if (err) {
      console.log('❌ 127.0.0.1 解析失败:', err.message);
    } else {
      console.log('✅ 127.0.0.1 地址:', address);
    }
  });
}

// 主诊断函数
function runDiagnostics() {
  console.log('🎯 启字堂服务器彻底诊断开始');
  console.log('时间:', new Date().toLocaleString());
  
  createDiagnosticServer();
  networkDiagnosis();
}

// 运行诊断
runDiagnostics();