const { getDatabase, queryOne, queryAll, queryRun } = require('./_db');

module.exports = async (req, res) => {
  const { type, device_id } = req.query;
  
  if (req.method === 'GET' && type === 'favorites' && device_id) {
    const db = await getDatabase();
    const rows = queryAll(db, 'SELECT c.*, f.created_at as favorited_at FROM favorites f JOIN characters c ON f.char_id = c.id WHERE f.device_id = ? ORDER BY f.created_at DESC', [device_id]);
    return res.json({ success: true, data: rows });
  }
  
  if (req.method === 'GET' && type === 'favorites/check' && device_id && req.query.char_id) {
    const db = await getDatabase();
    const row = queryOne(db, 'SELECT id FROM favorites WHERE device_id = ? AND char_id = ?', [device_id, req.query.char_id]);
    return res.json({ success: true, favorited: !!row });
  }
  
  if (req.method === 'GET' && type === 'wrong' && device_id) {
    const db = await getDatabase();
    const rows = queryAll(db, 'SELECT c.*, w.error_count, w.last_error FROM wrong_chars w JOIN characters c ON w.char_id = c.id WHERE w.device_id = ? ORDER BY w.error_count DESC, w.last_error DESC', [device_id]);
    return res.json({ success: true, data: rows });
  }
  
  if (req.method === 'POST' && type === 'record') {
    const { char_id, action_type } = req.body;
    const db = await getDatabase();
    queryRun(db, 'INSERT INTO learning_records (device_id, char_id, action_type) VALUES (?, ?, ?)', [device_id, char_id, action_type]);
    
    const today = new Date().toISOString().slice(0, 10);
    queryRun(db, `INSERT INTO daily_checkin (device_id, checkin_date, chars_learned, practice_count, game_count, study_seconds) VALUES (?, ?, 0, 0, 0, 0) ON CONFLICT(device_id, checkin_date) DO UPDATE SET chars_learned = chars_learned + CASE WHEN ? = 'view' THEN 1 ELSE 0 END, practice_count = practice_count + CASE WHEN ? IN ('writing','practice') THEN 1 ELSE 0 END, game_count = game_count + CASE WHEN ? IN ('game_correct','game_wrong') THEN 1 ELSE 0 END`, [device_id, today, action_type, action_type, action_type]);
    
    return res.json({ success: true });
  }
  
  if (req.method === 'POST' && type === 'favorite') {
    const { char_id } = req.body;
    const db = await getDatabase();
    queryRun(db, 'INSERT OR IGNORE INTO favorites (device_id, char_id) VALUES (?, ?)', [device_id, char_id]);
    return res.json({ success: true });
  }
  
  if (req.method === 'DELETE' && type === 'favorite') {
    const { char_id } = req.body;
    const db = await getDatabase();
    queryRun(db, 'DELETE FROM favorites WHERE device_id = ? AND char_id = ?', [device_id, char_id]);
    return res.json({ success: true });
  }
  
  if (req.method === 'POST' && type === 'wrong') {
    const { char_id } = req.body;
    const db = await getDatabase();
    queryRun(db, `INSERT INTO wrong_chars (device_id, char_id, error_count) VALUES (?, ?, 1) ON CONFLICT(device_id, char_id) DO UPDATE SET error_count = error_count + 1, last_error = CURRENT_TIMESTAMP`, [device_id, char_id]);
    return res.json({ success: true });
  }
  
  if (req.method === 'DELETE' && type === 'wrong') {
    const { char_id } = req.body;
    const db = await getDatabase();
    if (char_id) {
      queryRun(db, 'DELETE FROM wrong_chars WHERE device_id = ? AND char_id = ?', [device_id, char_id]);
    } else {
      queryRun(db, 'DELETE FROM wrong_chars WHERE device_id = ?', [device_id]);
    }
    return res.json({ success: true });
  }
  
  if (req.method === 'POST' && type === 'game-score') {
    const { game_type, score, total, level = 1 } = req.body;
    const db = await getDatabase();
    queryRun(db, 'INSERT INTO game_scores (device_id, game_type, score, total, level) VALUES (?, ?, ?, ?, ?)', [device_id, game_type, score, total, level]);
    const today = new Date().toISOString().slice(0, 10);
    queryRun(db, `INSERT INTO daily_checkin (device_id, checkin_date, game_count) VALUES (?, ?, 1) ON CONFLICT(device_id, checkin_date) DO UPDATE SET game_count = game_count + 1`, [device_id, today]);
    return res.json({ success: true });
  }
  
  if (req.method === 'POST' && type === 'study-duration') {
    const { seconds } = req.body;
    const db = await getDatabase();
    const today = new Date().toISOString().slice(0, 10);
    queryRun(db, `INSERT INTO daily_checkin (device_id, checkin_date, study_seconds) VALUES (?, ?, ?) ON CONFLICT(device_id, checkin_date) DO UPDATE SET study_seconds = study_seconds + ?`, [device_id, today, seconds, seconds]);
    return res.json({ success: true });
  }
  
  if (req.method === 'GET' && type === 'checkin' && device_id) {
    const { year, month } = req.query;
    const db = await getDatabase();
    let sql = 'SELECT * FROM daily_checkin WHERE device_id = ?';
    const params = [device_id];
    if (year && month) {
      sql += " AND strftime('%Y', checkin_date) = ? AND strftime('%m', checkin_date) = ?";
      params.push(String(year), String(month).padStart(2, '0'));
    }
    sql += ' ORDER BY checkin_date DESC';
    const records = queryAll(db, sql, params);
    
    const streakRow = queryOne(db, `WITH grouped AS (SELECT checkin_date, julianday(checkin_date) - ROW_NUMBER() OVER (ORDER BY checkin_date) as grp FROM daily_checkin WHERE device_id = ?) SELECT MAX(cnt) as streak FROM (SELECT COUNT(*) as cnt FROM grouped GROUP BY grp)`, [device_id]);
    const streak = streakRow?.streak || 0;
    
    return res.json({ success: true, data: records, streak });
  }
  
  res.status(404).json({ success: false, message: 'Not found' });
};