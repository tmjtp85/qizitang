const mysql = require('mysql2/promise');
async function test() {
  try {
    const conn = await mysql.createConnection({ host: 'localhost', port: 3306, user: 'root', password: 'qizitang123' });
    const [rows] = await conn.query('SELECT 1 AS test');
    console.log('Connected!', rows);
    await conn.end();
  } catch (e) { console.log('Error:', e.code, e.message); }
}
test();
