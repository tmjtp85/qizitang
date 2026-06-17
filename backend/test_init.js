require('dotenv').config();
console.log('DB_PASSWORD from env:', process.env.DB_PASSWORD ? 'set to [' + process.env.DB_PASSWORD + ']' : 'NOT SET');
const { initDB } = require('../db');
initDB().then(() => console.log('initDB OK')).catch(e => console.log('initDB Error:', e.code, e.message));
