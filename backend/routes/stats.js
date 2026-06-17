const express = require('express');
const router = express.Router();
const { queryOne, queryAll } = require('../db');

router.get('/summary/:device_id', (req, res) => {
  try {
    const { device_id } = req.params;
    const totalChars = queryOne("SELECT COUNT(DISTINCT char_id) as total FROM learning_records WHERE device_id = ? AND action_type IN ('view','practice')", [device_id]);
    const totalPractice = queryOne("SELECT COUNT(*) as total FROM learning_records WHERE device_id = ? AND action_type IN ('writing','practice')", [device_id]);
    const totalGames = queryOne("SELECT COUNT(*) as total FROM game_scores WHERE device_id = ?", [device_id]);
    const totalWrong = queryOne("SELECT COUNT(*) as total FROM wrong_chars WHERE device_id = ?", [device_id]);
    const totalTime = queryOne("SELECT COALESCE(SUM(study_seconds), 0) as total FROM daily_checkin WHERE device_id = ?", [device_id]);

    res.json({
      success: true,
      data: {
        total_chars_learned: totalChars?.total || 0,
        total_practice: totalPractice?.total || 0,
        total_games: totalGames?.total || 0,
        total_wrong: totalWrong?.total || 0,
        total_study_seconds: totalTime?.total || 0
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/daily/:device_id', (req, res) => {
  try {
    const { days = 7 } = req.query;
    const rows = queryAll(
      "SELECT checkin_date, chars_learned, practice_count, game_count, study_seconds FROM daily_checkin WHERE device_id = ? AND checkin_date >= date('now', ?) ORDER BY checkin_date ASC",
      [req.params.device_id, `-${parseInt(days)} days`]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/wrong-top/:device_id', (req, res) => {
  try {
    const rows = queryAll(
      'SELECT c.char, c.pinyin, w.error_count FROM wrong_chars w JOIN characters c ON w.char_id = c.id WHERE w.device_id = ? ORDER BY w.error_count DESC LIMIT 20',
      [req.params.device_id]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
