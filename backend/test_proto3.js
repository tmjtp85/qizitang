const mysql = require('mysql2/promise');
async function test() {
  const pool = mysql.createPool({ host: 'localhost', port: 3306, user: 'root', password: 'qizitang123', database: 'qizitang', connectionLimit: 3 });
  try {
    const [rows] = await pool.query('SELECT `char`, pinyin FROM characters LIMIT 3');
    console.log('OK:', rows.length, 'rows');
    rows.forEach(r => console.log(' ', r['`char`'] || '?', r.pinyin));
  } catch(e) { console.log('Error:', e.message, e.sqlState); }
  await pool.end();
}
test();
