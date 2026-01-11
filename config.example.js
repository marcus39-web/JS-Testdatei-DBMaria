// Kopiere diese Datei als config.js und passe die Werte an
module.exports = {
  database: {
    host: 'localhost',
    user: 'root',
    password: 'dein_passwort',
    database: 'testdb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  },
  server: {
    port: 3000
  }
};
