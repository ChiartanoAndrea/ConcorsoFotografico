import fs from 'fs/promises';
import path from 'path';
import db from './db.mjs';

function insertImage(title, url, vote = 0) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO Image(title, url, vote) VALUES(?, ?, ?)';
    db.run(sql, [title, url, vote], function (err) {
      if (err) return reject(err);
      resolve(this.lastID);
    });
  });
}

async function run() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage:');
    console.log('  node script_image.mjs "Titolo" "URL"               -> insert single image');
    console.log('  node script_image.mjs --file images.json            -> insert images from JSON array');
    process.exit(1);
  }

  try {
    const results = [];

    if (args[0] === '--file') {
      const filePath = path.resolve(process.cwd(), args[1] || 'images.json');
      const content = await fs.readFile(filePath, 'utf8');
      const list = JSON.parse(content);

      if (!Array.isArray(list)) throw new Error('Il file JSON deve contenere un array di oggetti {titolo, url, [voti]}');

      for (const item of list) {
        const title = item.title || item.titolo || item.name || 'Untitled';
        const url = item.url || item.src;
        const vote = typeof item.vote === 'number' ? item.vote : 0;
        if (!url) {
          console.warn('Skipping item without url:', item);
          continue;
        }
        const id = await insertImage(title, url, vote);
        results.push({ id, title, url });
        console.log('Inserted image id=', id, 'title=', title);
      }
    } else {
      // single insert: titolo url
      const titolo = args[0];
      const url = args[1];
      if (!titolo || !url) throw new Error('Serve titolo e url per inserire una singola immagine');
      const id = await insertImage(titolo, url, 0);
      results.push({ id, titolo, url });
      console.log('Inserted image id=', id);
    }

    console.log('\nDone. Inserted', results.length, 'images.');
  } catch (err) {
    console.error('Error:', err.message || err);
  } finally {
    // close DB and exit
    try { db.close(); } catch (e) {}
    process.exit(0);
  }
}

run();
