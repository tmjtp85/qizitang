// Health check
module.exports = (req, res) => {
  res.json({ status: 'ok', message: '启字堂后端服务运行中' });
};