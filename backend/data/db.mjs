import sqlite from 'sqlite3';
// open the database

const dbPath = process.env.DB_PATH || (process.env.NODE_ENV === 'production' ? '/data/items.db' : 'items.db');
const db = new sqlite.Database(dbPath, (err) => {
  if (err) throw err;
});

export default db;