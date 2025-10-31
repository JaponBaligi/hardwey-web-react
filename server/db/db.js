import Database from 'better-sqlite3';

const db = new Database(process.env.DB_PATH || './data.db');
try {
  db.pragma('journal_mode = WAL');
} catch {}

export default db;


