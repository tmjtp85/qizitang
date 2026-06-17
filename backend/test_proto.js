const mysql = require('mysql2/promise');
async function test() {
  const pool = mysql.createPool({ host: 'localhost', port: 3306, user: 'root', password: 'qizitang123', database: 'qizitang', connectionLimit: 3 });
  try {
    const [rows] = await pool.query('SELECT char, pinyin FROM characters LIMIT 3');
    console.log('query OK:', rows.length, 'rows');
    rows.forEach(r => console.log(' ', r.char, r.pinyin));
  } catch(e) { console.log('query Error:', e.message); }
  try {
    const [rows] = await pool.execute('SELECT char, pinyin FROM characters WHERE category = ? LIMIT 3', ['preschool']);
    console.log('execute OK:', rows.length, 'rows');
  } catch(e) { console.log('execute Error:', e.message); }
  await pool.end();
}
test();
