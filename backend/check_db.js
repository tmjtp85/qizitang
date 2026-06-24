const { initDB, getDB } = require('./db');

(async function() {
  await initDB();
  const db = getDB();
  const stmt = db.prepare('SELECT COUNT(*) as cnt FROM characters');
  stmt.step();
  const result = stmt.getAsObject();
  stmt.free();
  console.log('Database characters:', result.cnt);
  process.exit(0);
})();
