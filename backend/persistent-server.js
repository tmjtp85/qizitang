const http = require('http');
const { exec } = require('child_process');

// 持久化服务器管理器
class PersistentServer {
  constructor(port = 55555) {
    this.port = port;
    this.server = null;
    this.pid = process.pid;
    this.startTime = new Date();
    this.restartCount = 0;
  }

  createServer() {
    const server = http.createServer((req, res) => {
      res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Connection': 'keep-alive'
      });
      
      const uptime = Math.floor((new Date() - this.startTime) / 1000);
      const response = `启字堂服务器 🚀 - 第${this.restartCount + 1}次启动

✅ 状态: 运行正常
🕒 启动时间: ${this.startTime.toLocaleString('zh-CN')}
⏱️ 运行时长: ${uptime} 秒
🔧 Node.js: ${process.version}
🌐 地址: 127.0.0.1:${this.port}
📊 进程ID: ${this.pid}
🔄 重启次数: ${this.restartCount}

📋 可用路径:
  / - 主页面
  /status - 状态信息
  /restart - 重启请求 (管理员)

💡 提示: 这是持久化服务器，会自动重启
`;

      res.write(response);
      res.end();
    });

    // 错误处理和自动重启
    server.on('error', (err) => {
      console.error(`服务器错误: ${err.message}`);
      if (err.code === 'EADDRINUSE') {
        this.restart();
      }
    });

    // 进程退出时重启
    process.on('uncaughtException', (err) => {
      console.error('未捕获的异常:', err);
      console.log('自动重启服务器...');
      this.restart();
    });

    return server;
  }

  start() {
    this.server = this.createServer();
    
    this.server.listen(this.port, '127.0.0.1', () => {
      console.log(`🚀 启字堂服务器启动! (第${this.restartCount + 1}次启动)`);
      console.log(`📍 地址: http://127.0.0.1:${this.port}`);
      console.log(`⏰ 时间: ${new Date().toLocaleString()}`);
      console.log(`🔧 PID: ${this.pid}`);
      
      // 启动后测试
      this.test();
    });

    // 定期健康检查
    setInterval(() => {
      this.healthCheck();
    }, 30000); // 每30秒检查一次
  }

  restart() {
    console.log('\n🔄 服务器正在重启...');
    this.restartCount++;
    
    // 关闭当前服务器
    if (this.server) {
      this.server.close(() => {
        console.log('✅ 旧服务器已关闭');
        // 延迟重启
        setTimeout(() => {
          this.start();
        }, 1000);
      });
    } else {
      // 直接启动新服务器
      setTimeout(() => {
        this.start();
      }, 1000);
    }
  }

  test() {
    setTimeout(() => {
      const testReq = require('http').get(`http://127.0.0.1:${this.port}`, (res) => {
        console.log(`✅ 自我测试成功 - 状态码: ${res.statusCode}`);
      });
      
      testReq.on('error', (err) => {
        console.log(`❌ 自我测试失败: ${err.message}`);
      });
    }, 2000);
  }

  healthCheck() {
    const testReq = require('http').get(`http://127.0.0.1:${this.port}`, (res) => {
      if (res.statusCode === 200) {
        // 静默成功
      } else {
        console.log(`⚠️ 健康检查异常: 状态码 ${res.statusCode}`);
        this.restart();
      }
    });
    
    testReq.on('error', (err) => {
      console.log(`⚠️ 健康检查失败: ${err.message}`);
      this.restart();
    });
  }
}

// 处理重启请求
process.on('message', (msg) => {
  if (msg === 'restart') {
    console.log('收到重启命令');
    server.restart();
  }
});

// 启动服务器
const server = new PersistentServer();
server.start();

// 保持进程活跃
console.log('🎯 持久化服务器已启动，将自动维护运行状态...');

// 每5秒输出一次状态（用于调试）
setInterval(() => {
  const uptime = Math.floor((new Date() - server.startTime) / 1000);
  console.log(`📊 服务器状态运行中... (${uptime}秒)`);
}, 5000);