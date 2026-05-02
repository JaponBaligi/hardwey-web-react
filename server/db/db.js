const Database = require('better-sqlite3');

const db = new Database(process.env.DB_PATH || './data.db');
try {
  db.pragma('journal_mode = WAL');
} catch {}

module.exports = db;
