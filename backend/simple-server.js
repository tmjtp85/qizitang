const express = require('express');
const app = express();
const PORT = 8080;

app.get('/test', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Simple server running on port ${PORT}`);
});