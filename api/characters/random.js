const { getDatabase, queryOne } = require('./_db');

module.exports = async (req, res) => {
  const { category, count = 4 } = req.query;
  const db = await getDatabase();
  
  let sql = 'SELECT * FROM characters';
  const params = [];
  
  if (category && ['preschool', 'grade1_up', 'grade1_down'].includes(category)) {
    sql += ' WHERE category = ?';
    params.push(category);
  }
  
  sql += ' ORDER BY RANDOM() LIMIT ?';
  params.push(parseInt(count));
  
  const rows = [];
  const stmt = db.prepare(sql);
  if (params.length > 0) stmt.bind(params);
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  
  res.json({ success: true, data: rows });
};