const { getDatabase, queryOne } = require('./_db');

module.exports = async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(404).json({ success: false, message: 'Not found' });
  }
  const db = await getDatabase();
  const row = queryOne(db, 'SELECT * FROM characters WHERE id = ?', [id]);
  if (!row) {
    return res.status(404).json({ success: false, message: 'Not found' });
  }
  res.json({ success: true, data: row });
};