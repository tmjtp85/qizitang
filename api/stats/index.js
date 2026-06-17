const { getDatabase, queryOne, queryAll } = require('./_db');

module.exports = async (req, res) => {
  const { type, device_id } = req.query;
  
  if (!device_id) {
    return res.status(400).json({ success: false, message: 'Missing device_id' });
  }
  
  const db = await getDatabase();
  
  if (type === 'summary') {
    const totalChars = queryOne(db, "SELECT COUNT(DISTINCT char_id) as total FROM learning_records WHERE device_id = ? AND action_type IN ('view','practice')", [device_id]);
    const totalPractice = queryOne(db, "SELECT COUNT(*) as total FROM learning_records WHERE device_id = ? AND action_type IN ('writing','practice')", [device_id]);
    const totalGames = queryOne(db, "SELECT COUNT(*) as total FROM game_scores WHERE device_id = ?", [device_id]);
    const totalWrong = queryOne(db, "SELECT COUNT(*) as total FROM wrong_chars WHERE device_id = ?", [device_id]);
    const totalTime = queryOne(db, "SELECT COALESCE(SUM(study_seconds), 0) as total FROM daily_checkin WHERE device_id = ?", [device_id]);
    
    return res.json({
      success: true,
      data: {
        total_chars_learned: totalChars?.total || 0,
        total_practice: totalPractice?.total || 0,
        total_games: totalGames?.total || 0,
        total_wrong: totalWrong?.total || 0,
        total_study_seconds: totalTime?.total || 0
      }
    });
  }
  
  if (type === 'daily') {
    const { days = 7 } = req.query;
    const rows = queryAll(db, "SELECT checkin_date, chars_learned, practice_count, game_count, study_seconds FROM daily_checkin WHERE device_id = ? AND checkin_date >= date('now', ?) ORDER BY checkin_date ASC", [device_id, `-${parseInt(days)} days`]);
    return res.json({ success: true, data: rows });
  }
  
  if (type === 'wrong-top') {
    const rows = queryAll(db, 'SELECT c.char, c.pinyin, w.error_count FROM wrong_chars w JOIN characters c ON w.char_id = c.id WHERE w.device_id = ? ORDER BY w.error_count DESC LIMIT 20', [device_id]);
    return res.json({ success: true, data: rows });
  }
  
  res.status(404).json({ success: false, message: 'Not found' });
};