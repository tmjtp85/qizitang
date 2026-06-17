const express = require('express');
const router = express.Router();
const { queryOne, queryAll } = require('../db');

router.get('/', (req, res) => {
  try {
    const { category, page = 1, limit = 20, search } = req.query;
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

    const row = queryOne(`SELECT COUNT(*) as total FROM characters WHERE ${where}`, params);
    const total = row ? row.total : 0;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const rows = queryAll(`SELECT * FROM characters WHERE ${where} ORDER BY id ASC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]);

    res.json({ success: true, data: rows, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/random', (req, res) => {
  try {
    const { category, count = 4 } = req.query;
    let sql = 'SELECT * FROM characters';
    const params = [];
    if (category && ['preschool', 'grade1_up', 'grade1_down'].includes(category)) {
      sql += ' WHERE category = ?';
      params.push(category);
    }
    sql += ' ORDER BY RANDOM() LIMIT ?';
    params.push(parseInt(count));
    const rows = queryAll(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const row = queryOne('SELECT * FROM characters WHERE id = ?', [req.params.id]);
    if (!row) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: row });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
