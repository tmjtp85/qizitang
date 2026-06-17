const { getDatabase, queryRun } = require('./_db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  
  const { device_id, name = '' } = req.body;
  if (!device_id) {
    return res.status(400).json({ success: false, message: 'Missing device_id' });
  }
  
  const db = await getDatabase();
  queryRun(db, 'INSERT OR IGNORE INTO devices (id, name) VALUES (?, ?)', [device_id, name]);
  res.json({ success: true, device_id });
};