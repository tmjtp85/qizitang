const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, 'public')));

// 先初始化数据库，再加载路由（确保 db 已就绪）
async function start() {
  console.log('正在初始化数据库...');
  await initDB();
  console.log('数据库初始化完成，正在加载路由...');

  const charactersRouter = require('./routes/characters');
  const learningRouter = require('./routes/learning');
  const deviceRouter = require('./routes/device');
  const statsRouter = require('./routes/stats');
  const ttsRouter = require('./routes/tts');

  app.use('/api/characters', charactersRouter);
  app.use('/api/learning', learningRouter);
  app.use('/api/device', deviceRouter);
  app.use('/api/stats', statsRouter);
  app.use('/api/tts', ttsRouter);

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: '启字堂后端服务运行中' });
  });

  app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
    }
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`启字堂后端服务启动，端口: ${PORT}`);
    console.log(`访问地址: http://localhost:${PORT}`);
  });
}

start().catch(err => {
  console.error('启动失败:', err);
  process.exit(1);
});