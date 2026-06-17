const express = require('express');
const router = express.Router();
const https = require('https');
const http = require('http');

router.get('/synthesize', (req, res) => {
  const { text, speed = 1.0 } = req.query;
  if (!text) return res.status(400).json({ success: false, message: 'Missing text' });

  const ttsUrl = `https://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=${speed}&text=${encodeURIComponent(text)}`;

  https.get(ttsUrl, (response) => {
    res.setHeader('Content-Type', 'audio/mp3');
    response.pipe(res);
  }).on('error', (err) => {
    res.status(500).json({ success: false, message: 'TTS service unavailable' });
  });
});

module.exports = router;
