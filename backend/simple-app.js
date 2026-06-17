const express = require('express');
const cors = require('cors');
const path = require('path');
const initSqlJs = require('sql.js');

const app = express();
const PORT = 3000;

// 初始化数据库
let db;
async function initDB() {
  const SQL = await initSqlJs();
  db = new SQL();
  console.log('数据库连接成功');
}

// 初始化中间件
app.use(cors());
app.use(express.json());

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: '启字堂后端服务运行中',
    port: PORT
  });
});

// 简单的测试端点
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '服务器正常工作',
    timestamp: new Date().toISOString()
  });
});

// 启动服务器
app.listen(PORT, '127.0.0.1', () => {
  console.log(`启字堂后端服务启动，端口: ${PORT}`);
  console.log(`访问地址: http://localhost:${PORT}`);
  console.log(`API健康检查: http://localhost:${PORT}/api/health`);
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: '服务器内部错误' });
});