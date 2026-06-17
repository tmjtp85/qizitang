const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'qizitang.db');
let db;

async function initDB() {
  if (!db) {
    // 初始化 sql.js
    const SQL = await initSqlJs();
    
    // 读取现有的数据库文件（如果存在）
    let fileBuffer = null;
    try {
      if (fs.existsSync(dbPath)) {
        fileBuffer = fs.readFileSync(dbPath);
        console.log('读取现有数据库文件');
      }
    } catch (err) {
      console.log('无法读取现有数据库文件:', err.message);
    }
    
    // 创建数据库实例
    db = new SQL.Database(fileBuffer);
    console.log('数据库连接成功，使用 SQL.js');

    // 修补 sql.js Statement 原型
    const testStmt = db.prepare("SELECT 1 AS a");
    const Statement = testStmt.constructor;
    testStmt.free();

    const origBind = Statement.prototype.bind;
    Statement.prototype.bind = function(values) {
      if (!Array.isArray(values) && values != null && typeof values !== 'object') {
        return origBind.call(this, [values]);
      }
      return origBind.call(this, values);
    };

    Statement.prototype.all = function(...args) {
      if (args.length > 1) {
        this.bind(args);
      } else if (args.length === 1) {
        const v = args[0];
        if (v != null) this.bind(v);
      }
      const rows = [];
      while (this.step()) rows.push(this.getAsObject());
      this.free();
      return rows;
    };
    
    // 设置表结构（如果不存在）
    db.exec(`
      CREATE TABLE IF NOT EXISTS characters (
        id INTEGER PRIMARY KEY,
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
        id INTEGER PRIMARY KEY,
        device_id TEXT NOT NULL UNIQUE,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        last_active TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS learning_records (
        id INTEGER PRIMARY KEY,
        device_id TEXT NOT NULL,
        char_id INTEGER NOT NULL,
        action_type TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (char_id) REFERENCES characters(id)
      );
      CREATE INDEX IF NOT EXISTS idx_lr_device ON learning_records(device_id);

      CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY,
        device_id TEXT NOT NULL,
        char_id INTEGER NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(device_id, char_id),
        FOREIGN KEY (char_id) REFERENCES characters(id)
      );

      CREATE TABLE IF NOT EXISTS wrong_chars (
        id INTEGER PRIMARY KEY,
        device_id TEXT NOT NULL,
        char_id INTEGER NOT NULL,
        error_count INTEGER DEFAULT 1,
        last_error TEXT DEFAULT CURRENT_TIMESTAMP,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(device_id, char_id),
        FOREIGN KEY (char_id) REFERENCES characters(id)
      );

      CREATE TABLE IF NOT EXISTS daily_checkin (
        id INTEGER PRIMARY KEY,
        device_id TEXT NOT NULL,
        checkin_date TEXT NOT NULL,
        chars_learned INTEGER DEFAULT 0,
        practice_count INTEGER DEFAULT 0,
        game_count INTEGER DEFAULT 0,
        study_seconds INTEGER DEFAULT 0,
        UNIQUE(device_id, checkin_date)
      );

      CREATE TABLE IF NOT EXISTS game_scores (
        id INTEGER PRIMARY KEY,
        device_id TEXT NOT NULL,
        game_type TEXT NOT NULL,
        score INTEGER DEFAULT 0,
        total INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // 初始化示例数据（如果数据库为空）
    const countStmt = db.prepare('SELECT COUNT(*) as cnt FROM characters');
    countStmt.step();
    const charCount = countStmt.getAsObject().cnt;
    countStmt.free();
    if (charCount === 0) {
      console.log('初始化示例汉字数据...');
      const sampleChars = [
        { char: '一', pinyin: 'yī', strokes: 1, category: 'preschool', words: '["一个", "一天"]', sentence: '我有一个苹果。' },
        { char: '二', pinyin: 'èr', strokes: 2, category: 'preschool', words: '["二个", "二月"]', sentence: '今天是二月二日。' },
        { char: '三', pinyin: 'sān', strokes: 3, category: 'preschool', words: '["三个", "三月"]', sentence: '三月有三天假期。' },
        { char: '四', pinyin: 'sì', strokes: 5, category: 'preschool', words: '["四个", "四季"]', sentence: '一年有四季。' },
        { char: '五', pinyin: 'wǔ', strokes: 4, category: 'preschool', words: '["五个", "五星"]', sentence: '五星红旗真美丽。' },
        { char: '人', pinyin: 'rén', strokes: 2, category: 'preschool', words: '["大人", "人们"]', sentence: '路上有很多人。' },
        { char: '口', pinyin: 'kǒu', strokes: 3, category: 'preschool', words: '["开口", "门口"]', sentence: '我家门口有棵树。' },
        { char: '手', pinyin: 'shǒu', strokes: 4, category: 'preschool', words: '["小手", "左手"]', sentence: '我用小手写字。' },
        { char: '日', pinyin: 'rì', strokes: 4, category: 'grade1_up', words: '["日子", "日月"]', sentence: '今天是个好日子。' },
        { char: '月', pinyin: 'yuè', strokes: 4, category: 'grade1_up', words: '["月亮", "月牙"]', sentence: '弯弯的月亮挂在天上。' },
        { char: '水', pinyin: 'shuǐ', strokes: 4, category: 'grade1_up', words: '["水果", "山水"]', sentence: '我爱喝白开水。' },
        { char: '火', pinyin: 'huǒ', strokes: 4, category: 'grade1_up', words: '["大火", "火山"]', sentence: '小心不要玩火。' },
        { char: '山', pinyin: 'shān', strokes: 3, category: 'grade1_up', words: '["大山", "山水"]', sentence: '远处有一座大山。' },
        { char: '石', pinyin: 'shí', strokes: 5, category: 'grade1_up', words: '["石头", "石子"]', sentence: '地上有很多小石子。' },
        { char: '田', pinyin: 'tián', strokes: 5, category: 'grade1_up', words: '["田地", "水田"]', sentence: '农民伯伯在田里干活。' },
        { char: '土', pinyin: 'tǔ', strokes: 3, category: 'grade1_up', words: '["土地", "泥土"]', sentence: '种子从泥土里长出来。' },
        { char: '上', pinyin: 'shàng', strokes: 3, category: 'grade1_down', words: '["上下", "天上"]', sentence: '天上有白云。' },
        { char: '下', pinyin: 'xià', strokes: 3, category: 'grade1_down', words: '["下雨", "下来"]', sentence: '今天下雨了。' },
        { char: '左', pinyin: 'zuǒ', strokes: 5, category: 'grade1_down', words: '["左手", "左边"]', sentence: '我的左边是小明。' },
        { char: '右', pinyin: 'yòu', strokes: 5, category: 'grade1_down', words: '["右手", "右边"]', sentence: '我用右手写字。' }
      ];
      
      const insert = db.prepare('INSERT INTO characters (char, pinyin, strokes, category, words, sentence) VALUES (?, ?, ?, ?, ?, ?)');
      sampleChars.forEach(c => {
        insert.run([c.char, c.pinyin, c.strokes, c.category, c.words, c.sentence]);
      });
      console.log(`已插入 ${sampleChars.length} 个示例汉字`);
    }
    
    console.log('SQLite database initialized.');
    return Promise.resolve();
  }
  return Promise.resolve();
}

function getDB() {
  return db;
}

function saveDB() {
  if (db) {
    const data = db.export();
    fs.writeFileSync(dbPath, data);
    console.log('数据库已保存到磁盘');
  }
}

// internal helpers (accept database param)
function _queryOne(database, sql, params) {
  const stmt = database.prepare(sql);
  try {
    if (params != null) {
      const bindParams = Array.isArray(params) ? params : [params];
      stmt.bind(bindParams);
    }
    if (!stmt.step()) return null;
    return stmt.getAsObject();
  } finally {
    stmt.free();
  }
}

function _queryAll(database, sql, params) {
  const stmt = database.prepare(sql);
  const rows = [];
  try {
    if (params != null) {
      const bindParams = Array.isArray(params) ? params : [params];
      stmt.bind(bindParams);
    }
    while (stmt.step()) rows.push(stmt.getAsObject());
  } finally {
    stmt.free();
  }
  return rows;
}

function _queryRun(database, sql, params) {
  const stmt = database.prepare(sql);
  try {
    stmt.run(params);
  } finally {
    stmt.free();
  }
}

// 使用 getter 延迟求值 db，确保路由在 initDB 之后加载仍能拿到正确实例
// 查询辅助函数（闭包捕获 db 变量，自动使用当前数据库实例）
Object.defineProperty(module.exports, 'db', {
  get: () => db,
  enumerable: true
});
module.exports.initDB = initDB;
module.exports.getDB = getDB;
module.exports.saveDB = saveDB;
module.exports.queryOne = function(sql, params) { return _queryOne(db, sql, params); };
module.exports.queryAll = function(sql, params) { return _queryAll(db, sql, params); };
module.exports.queryRun = function(sql, params) { return _queryRun(db, sql, params); };

// 每分钟自动保存一次数据库到磁盘
setInterval(saveDB, 60000);