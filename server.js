const express = require('express');
const mysql = require('mysql2/promise');
const xml2js = require('xml2js');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Konfiguration laden (oder Standard verwenden)
let config;
try {
  config = require('./config.js');
} catch (error) {
  console.log('Warnung: config.js nicht gefunden. Verwende Standard-Konfiguration.');
  config = {
    database: {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'testdb',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    },
    server: {
      port: 3000
    }
  };
}

// Datenbank-Verbindungspool erstellen
const pool = mysql.createPool(config.database);

// Datenbankverbindung testen beim Start
pool.getConnection()
  .then(connection => {
    console.log('✓ Datenbankverbindung erfolgreich hergestellt');
    connection.release();
  })
  .catch(err => {
    console.error('✗ Fehler bei der Datenbankverbindung:', err.message);
    console.error('Bitte überprüfen Sie die Konfiguration in config.js');
  });

// XML Builder
const xmlBuilder = new xml2js.Builder({ 
  rootName: 'response',
  headless: false,
  renderOpts: { pretty: true }
});

// Hilfsfunktion für XML-Antworten
function sendXML(res, data) {
  const xml = xmlBuilder.buildObject(data);
  res.set('Content-Type', 'application/xml');
  res.send(xml);
}

// Root-Route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API-Endpunkte

// Alle Benutzer abrufen (JSON)
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users ORDER BY id DESC');
    res.json({ success: true, users: rows });
  } catch (error) {
    console.error('Fehler beim Abrufen der Benutzer:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Alle Benutzer abrufen (XML)
app.get('/api/users/xml', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users ORDER BY id DESC');
    sendXML(res, { 
      success: true, 
      users: { user: rows }
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Benutzer:', error);
    sendXML(res, { success: false, error: error.message });
  }
});

// Einzelnen Benutzer abrufen
app.get('/api/users/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Benutzer nicht gefunden' });
    }
    res.json({ success: true, user: rows[0] });
  } catch (error) {
    console.error('Fehler beim Abrufen des Benutzers:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Neuen Benutzer erstellen
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, age } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name und E-Mail sind erforderlich' });
    }

    const [result] = await pool.query(
      'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
      [name, email, age || null]
    );

    res.json({ 
      success: true, 
      message: 'Benutzer erfolgreich erstellt',
      userId: result.insertId 
    });
  } catch (error) {
    console.error('Fehler beim Erstellen des Benutzers:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ success: false, error: 'E-Mail bereits vorhanden' });
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
});

// Benutzer aktualisieren
app.put('/api/users/:id', async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const { id } = req.params;

    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name und E-Mail sind erforderlich' });
    }

    const [result] = await pool.query(
      'UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?',
      [name, email, age || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Benutzer nicht gefunden' });
    }

    res.json({ 
      success: true, 
      message: 'Benutzer erfolgreich aktualisiert' 
    });
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Benutzers:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ success: false, error: 'E-Mail bereits vorhanden' });
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
});

// Benutzer löschen
app.delete('/api/users/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Benutzer nicht gefunden' });
    }

    res.json({ 
      success: true, 
      message: 'Benutzer erfolgreich gelöscht' 
    });
  } catch (error) {
    console.error('Fehler beim Löschen des Benutzers:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Statistiken abrufen (XML)
app.get('/api/stats/xml', async (req, res) => {
  try {
    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM users');
    const [avgResult] = await pool.query('SELECT AVG(age) as avgAge FROM users WHERE age IS NOT NULL');
    
    sendXML(res, {
      success: true,
      statistics: {
        totalUsers: countResult[0].total,
        averageAge: Math.round(avgResult[0].avgAge * 10) / 10
      }
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Statistiken:', error);
    sendXML(res, { success: false, error: error.message });
  }
});

// Datenbank-Verbindung testen
app.get('/api/test', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ success: true, message: 'Datenbankverbindung erfolgreich!' });
  } catch (error) {
    console.error('Datenbankverbindungsfehler:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Server starten
const PORT = config.server.port || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
  console.log('Drücke Ctrl+C zum Beenden');
});

// Graceful Shutdown
process.on('SIGINT', async () => {
  console.log('\nBeende Server...');
  await pool.end();
  process.exit(0);
});
