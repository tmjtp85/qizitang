const { getDatabase, queryOne, queryAll } = require('./_db');

module.exports = async (req, res) => {
  const { category, page = 1, limit = 20, search } = req.query;
  const db = await getDatabase();
  
  let where = '1=1';
  const params = [];
  
  if (category && ['preschool', 'grade1_up', 'grade1_down'].includes(category)) {
    where += ' AND category = ?';
    params.push(category);
  }
  
  if (search) {
    where += ' AND (char LIKE ? OR pinyin LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  
  const row = queryOne(db, `SELECT COUNT(*) as total FROM characters WHERE ${where}`, params);
  const total = row ? row.total : 0;
  
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const rows = queryAll(db, `SELECT * FROM characters WHERE ${where} ORDER BY id ASC LIMIT ? OFFSET ?`,
    [...params, parseInt(limit), offset]);
  
  res.json({ success: true, data: rows, total, page: parseInt(page), limit: parseInt(limit) });
};