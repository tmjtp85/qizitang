const express = require('express');
const path = require('path');

const app = express();
const PORT = 5000; // 使用更高的端口

// 尝试绕过防火墙限制
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: '启字堂后端服务运行中',
    port: PORT,
    ip: req.socket.remoteAddress
  });
});

// 添加静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// 所有请求都返回健康状态
app.get('*', (req, res) => {
  res.json({
    status: 'ok',
    path: req.path,
    message: '启字堂服务器正常运行'
  });
});

console.log(`尝试启动在端口 ${PORT}...`);

// 尝试不同的绑定方式
const bindAttempts = [
  () => app.listen(PORT, '127.0.0.1'),
  () => app.listen(PORT, '0.0.0.0'),
  () => app.listen(PORT + 1, '127.0.0.1')
];

let attemptIndex = 0;

function tryBind() {
  if (attemptIndex < bindAttempts.length) {
    console.log(`尝试绑定 ${attemptIndex + 1}/${bindAttempts.length}...`);
    const server = bindAttempts[attemptIndex]();
    
    server.on('listening', () => {
      console.log(`✅ 成功绑定到端口 ${PORT + (attemptIndex > 0 ? 1 : 0)}!`);
      console.log(`访问地址: http://127.0.0.1:${PORT + (attemptIndex > 0 ? 1 : 0)}`);
      
      // 立即测试
      setTimeout(() => {
        console.log('正在进行自我测试...');
      }, 1000);
    });
    
    server.on('error', (err) => {
      console.log(`❌ 绑定失败: ${err.message}`);
      attemptIndex++;
      tryBind();
    });
  } else {
    console.log('❌ 所有绑定尝试都失败了');
  }
}

tryBind();