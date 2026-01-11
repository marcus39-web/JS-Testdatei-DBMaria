# MariaDB Setup für Node.js

1. Installiere MariaDB auf deinem Rechner (https://mariadb.org/download/).
2. Lege eine Datenbank und eine Tabelle an, z.B.:

CREATE DATABASE js_personen;
USE js_personen;
CREATE TABLE personen (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255)
);
INSERT INTO personen (name) VALUES ('Max Mustermann'), ('Erika Musterfrau'), ('Anna Beispiel');

3. Installiere das Node.js-Paket:
npm install mariadb

4. Beispiel für eine Verbindung in Node.js:

const mariadb = require('mariadb');
const pool = mariadb.createPool({
  host: 'localhost',
  user: 'deinBenutzer',
  password: 'deinPasswort',
  database: 'js_personen'
});

app.get('/daten', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM personen');
    res.json(rows);
  } catch (err) {
    res.status(500).send('Fehler: ' + err.message);
  } finally {
    if (conn) conn.release();
  }
});

// ...restlicher Express-Code wie gehabt
