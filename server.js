const express = require('express');
const mariadb = require('mariadb');
const cors = require('cors');
const bodyParser = require('body-parser');


const path = require('path');
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Statische Auslieferung der index.html für die Startseite
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Legefeld140215', // <-- hier dein MariaDB-Root-Passwort eintragen
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

app.post('/daten', async (req, res) => {
    let conn;
    try {
        const { name, adresse, ausbildung } = req.body;
        conn = await pool.getConnection();
        await conn.query('INSERT INTO personen (name, adresse, ausbildung) VALUES (?, ?, ?)', [name, adresse, ausbildung]);
        res.status(201).send('Datensatz hinzugefügt');
    } catch (err) {
        res.status(500).send('Fehler: ' + err.message);
    } finally {
        if (conn) conn.release();
    }
});

app.listen(3000, () => {
    console.log('Server läuft auf Port 3000');
});
