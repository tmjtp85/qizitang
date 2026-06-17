const express = require('express');
const router = express.Router();
const { queryRun } = require('../db');

router.post('/register', (req, res) => {
  try {
    const { device_id } = req.body;
    if (!device_id) return res.status(400).json({ success: false, message: 'Missing device_id' });
    queryRun('INSERT OR IGNORE INTO devices (device_id) VALUES (?)', [device_id]);
    res.json({ success: true, device_id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
