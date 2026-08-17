import sqlite from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Ricava il percorso assoluto della cartella 'data' in locale
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const localDbPath = path.join(__dirname, 'items.db');

// 2. Mantieni la tua logica: usa DB_PATH, altrimenti verifica l'ambiente
// In produzione usa '/data/items.db', in locale usa il percorso assoluto corretto
const dbPath = process.env.DB_PATH || (process.env.NODE_ENV === 'production' ? '/data/items.db' : localDbPath);

// 3. Apri il database
const db = new sqlite.Database(dbPath, (err) => {
  if (err) {
    console.error("Errore di connessione al DB:", err.message);
    throw err;
  } else {
    console.log("Connesso al database SQLite in:", dbPath);
  }
});

export default db;