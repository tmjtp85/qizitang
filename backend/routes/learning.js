const express = require('express');
const router = express.Router();
const { queryOne, queryAll, queryRun } = require('../db');

router.post('/record', (req, res) => {
  try {
    const { device_id, char_id, action_type } = req.body;
    if (!device_id || !char_id || !action_type) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    queryRun('INSERT INTO learning_records (device_id, char_id, action_type) VALUES (?, ?, ?)',
      [device_id, char_id, action_type]);

    const today = new Date().toISOString().slice(0, 10);
    queryRun(`INSERT INTO daily_checkin (device_id, checkin_date, chars_learned, practice_count, game_count, study_seconds)
         VALUES (?, ?, 0, 0, 0, 0)
         ON CONFLICT(device_id, checkin_date) DO UPDATE SET
           chars_learned = chars_learned + CASE WHEN ? = 'view' THEN 1 ELSE 0 END,
           practice_count = practice_count + CASE WHEN ? IN ('writing','practice') THEN 1 ELSE 0 END,
           game_count = game_count + CASE WHEN ? IN ('game_correct','game_wrong') THEN 1 ELSE 0 END`,
      [device_id, today, action_type, action_type, action_type]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/favorite', (req, res) => {
  try {
    const { device_id, char_id } = req.body;
    queryRun('INSERT OR IGNORE INTO favorites (device_id, char_id) VALUES (?, ?)', [device_id, char_id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/favorite', (req, res) => {
  try {
    const { device_id, char_id } = req.body;
    queryRun('DELETE FROM favorites WHERE device_id = ? AND char_id = ?', [device_id, char_id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/favorites/:device_id', (req, res) => {
  try {
    const rows = queryAll('SELECT c.*, f.created_at as favorited_at FROM favorites f JOIN characters c ON f.char_id = c.id WHERE f.device_id = ? ORDER BY f.created_at DESC', [req.params.device_id]);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/favorites/check/:device_id/:char_id', (req, res) => {
  try {
    const row = queryOne( 'SELECT id FROM favorites WHERE device_id = ? AND char_id = ?', [req.params.device_id, req.params.char_id]);
    res.json({ success: true, favorited: !!row });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/wrong', (req, res) => {
  try {
    const { device_id, char_id } = req.body;
    queryRun(`INSERT INTO wrong_chars (device_id, char_id, error_count) VALUES (?, ?, 1)
         ON CONFLICT(device_id, char_id) DO UPDATE SET error_count = error_count + 1, last_error = CURRENT_TIMESTAMP`,
      [device_id, char_id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/wrong', (req, res) => {
  try {
    const { device_id, char_id } = req.body;
    if (char_id) {
      queryRun('DELETE FROM wrong_chars WHERE device_id = ? AND char_id = ?', [device_id, char_id]);
    } else {
      queryRun('DELETE FROM wrong_chars WHERE device_id = ?', [device_id]);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/wrong/:device_id', (req, res) => {
  try {
    const rows = queryAll('SELECT c.*, w.error_count, w.last_error FROM wrong_chars w JOIN characters c ON w.char_id = c.id WHERE w.device_id = ? ORDER BY w.error_count DESC, w.last_error DESC', [req.params.device_id]);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/game-score', (req, res) => {
  try {
    const { device_id, game_type, score, total, level = 1 } = req.body;
    queryRun('INSERT INTO game_scores (device_id, game_type, score, total, level) VALUES (?, ?, ?, ?, ?)',
      [device_id, game_type, score, total, level]);
    const today = new Date().toISOString().slice(0, 10);
    queryRun(`INSERT INTO daily_checkin (device_id, checkin_date, game_count) VALUES (?, ?, 1)
         ON CONFLICT(device_id, checkin_date) DO UPDATE SET game_count = game_count + 1`,
      [device_id, today]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/study-duration', (req, res) => {
  try {
    const { device_id, seconds } = req.body;
    const today = new Date().toISOString().slice(0, 10);
    queryRun(`INSERT INTO daily_checkin (device_id, checkin_date, study_seconds) VALUES (?, ?, ?)
         ON CONFLICT(device_id, checkin_date) DO UPDATE SET study_seconds = study_seconds + ?`,
      [device_id, today, seconds, seconds]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/checkin/:device_id', (req, res) => {
  try {
    const { year, month } = req.query;
    let sql = 'SELECT * FROM daily_checkin WHERE device_id = ?';
    const params = [req.params.device_id];
    if (year && month) {
      sql += " AND strftime('%Y', checkin_date) = ? AND strftime('%m', checkin_date) = ?";
      params.push(String(year), String(month).padStart(2, '0'));
    }
    sql += ' ORDER BY checkin_date DESC';
    const records = queryAll(sql, params);

    const streakRow = queryOne( `
      WITH grouped AS (
        SELECT checkin_date, julianday(checkin_date) - ROW_NUMBER() OVER (ORDER BY checkin_date) as grp
        FROM daily_checkin WHERE device_id = ?
      )
      SELECT MAX(cnt) as streak FROM (SELECT COUNT(*) as cnt FROM grouped GROUP BY grp)
    `, [req.params.device_id]);
    const streak = streakRow?.streak || 0;

    res.json({ success: true, data: records, streak });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
