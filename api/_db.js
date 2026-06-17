// 这是数据库共享模块
const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

let db = null;
let SQL = null;

const DB_PATH = path.join(__dirname, '..', 'data', 'qizitang.db');

// 确保 data 目录存在
function ensureDataDir() {
  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

async function getDatabase() {
  if (!SQL) {
    SQL = await initSqlJs();
  }
  
  if (!db) {
    ensureDataDir();
    
    if (fs.existsSync(DB_PATH)) {
      const fileBuf = fs.readFileSync(DB_PATH);
      db = new SQL.Database(fileBuf);
    } else {
      // 创建新数据库
      db = new SQL.Database();
      initDatabase(db);
    }
  }
  return db;
}

function saveDatabase() {
  ensureDataDir();
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

function initDatabase(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS characters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      char TEXT NOT NULL UNIQUE,
      pinyin TEXT NOT NULL,
      strokes INTEGER NOT NULL DEFAULT 0,
      stroke_order TEXT,
      radical TEXT DEFAULT '',
      category TEXT NOT NULL,
      words TEXT,
      sentence TEXT,
      image_url TEXT DEFAULT '',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS devices (
      id TEXT PRIMARY KEY,
      name TEXT DEFAULT '',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS learning_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device_id TEXT NOT NULL,
      char_id INTEGER NOT NULL,
      action_type TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS wrong_chars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device_id TEXT NOT NULL,
      char_id INTEGER NOT NULL,
      error_count INTEGER DEFAULT 1,
      last_error TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(device_id, char_id)
    );
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device_id TEXT NOT NULL,
      char_id INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(device_id, char_id)
    );
    CREATE TABLE IF NOT EXISTS game_scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device_id TEXT NOT NULL,
      game_type TEXT NOT NULL,
      score INTEGER NOT NULL,
      total INTEGER NOT NULL,
      level INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS daily_checkin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device_id TEXT NOT NULL,
      checkin_date TEXT NOT NULL,
      chars_learned INTEGER DEFAULT 0,
      practice_count INTEGER DEFAULT 0,
      game_count INTEGER DEFAULT 0,
      study_seconds INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(device_id, checkin_date)
    );
  `);
  
  // 插入示例数据
  const sampleChars = [
    ['一', 'yī', 1, 'preschool', '["一个","一天"]', '我们一起学习。'],
    ['人', 'rén', 2, 'preschool', '["人们","人们"]', '人们都在学习。'],
    ['大', 'dà', 3, 'preschool', '["大家","大小"]', '大家一起来。'],
    ['小', 'xiǎo', 3, 'preschool', '["小孩","小学"]', '小孩在玩。'],
    ['上', 'shàng', 3, 'preschool', '["上学","上面"]', '我去上学。'],
    ['下', 'xià', 3, 'preschool', '["下雨","下面"]', '下雨要带伞。'],
  ];
  
  const stmt = db.prepare('INSERT OR IGNORE INTO characters (char, pinyin, strokes, category, words, sentence) VALUES (?, ?, ?, ?, ?, ?)');
  
  for (const [c, p, s, cat, words, sentence] of sampleChars) {
    stmt.run([c, p, s, cat, words, sentence]);
  }
  
  saveDatabase();
}

function queryOne(db, sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length > 0) stmt.bind(params);
  let result = null;
  if (stmt.step()) {
    result = stmt.getAsObject();
  }
  stmt.free();
  return result;
}

function queryAll(db, sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length > 0) stmt.bind(params);
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

function queryRun(db, sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length > 0) stmt.bind(params);
  stmt.step();
  stmt.free();
  saveDatabase();
}

module.exports = {
  getDatabase,
  saveDatabase,
  queryOne,
  queryAll,
  queryRun
};