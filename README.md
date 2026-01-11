# JS-Testdatei-DBMaria
Übung zu jQuery, AJAX und XML mit node.js

## Beschreibung
Dieses Projekt ist eine vollständige Übungsanwendung, die folgende Technologien demonstriert:
- **Node.js** mit Express als Backend-Server
- **MariaDB/MySQL** als Datenbank
- **jQuery** für DOM-Manipulation und Event-Handling
- **AJAX** für asynchrone HTTP-Requests
- **XML** als Datenformat (zusätzlich zu JSON)

## Features
- ✅ CRUD-Operationen (Create, Read, Update, Delete) für Benutzer
- ✅ JSON und XML API-Endpunkte
- ✅ Responsive Web-Interface mit jQuery
- ✅ AJAX-Requests für alle Operationen
- ✅ XML-Parsing und -Anzeige
- ✅ Echtzeit-Statistiken
- ✅ Fehlerbehandlung und Validierung
- ✅ Rate Limiting für API-Sicherheit (100 Anfragen pro 15 Minuten)

## Voraussetzungen
- Node.js (Version 14 oder höher)
- MariaDB oder MySQL Server
- npm (Node Package Manager)

## Installation

### 1. Repository klonen
```bash
git clone <repository-url>
cd JS-Testdatei-DBMaria
```

### 2. Dependencies installieren
```bash
npm install
```

### 3. Datenbank einrichten
1. MariaDB/MySQL Server starten
2. Datenbank und Tabelle erstellen:
```bash
mysql -u root -p < database.sql
```

Oder manuell in MySQL/MariaDB:
```sql
CREATE DATABASE testdb;
USE testdb;
-- Führen Sie die SQL-Befehle aus database.sql aus
```

### 4. Konfiguration
1. Kopieren Sie die Beispiel-Konfigurationsdatei:
```bash
cp config.example.js config.js
```

2. Bearbeiten Sie `config.js` mit Ihren Datenbankzugangsdaten:
```javascript
module.exports = {
  database: {
    host: 'localhost',
    user: 'root',
    password: 'IhrPasswort',
    database: 'testdb'
  },
  server: {
    port: 3000
  }
};
```

## Verwendung

### Server starten
```bash
npm start
```

Für Entwicklung mit automatischem Neustart:
```bash
npm run dev
```

### Anwendung öffnen
Öffnen Sie Ihren Browser und navigieren Sie zu:
```
http://localhost:3000
```

## API-Endpunkte

### JSON-Endpunkte
- `GET /api/users` - Alle Benutzer abrufen
- `GET /api/users/:id` - Einzelnen Benutzer abrufen
- `POST /api/users` - Neuen Benutzer erstellen
- `PUT /api/users/:id` - Benutzer aktualisieren
- `DELETE /api/users/:id` - Benutzer löschen
- `GET /api/test` - Datenbankverbindung testen

### XML-Endpunkte
- `GET /api/users/xml` - Alle Benutzer als XML
- `GET /api/stats/xml` - Statistiken als XML

## Projektstruktur
```
JS-Testdatei-DBMaria/
├── public/
│   ├── index.html      # Frontend HTML
│   ├── style.css       # CSS Styling
│   └── app.js          # jQuery/AJAX Code
├── server.js           # Node.js Express Server
├── database.sql        # Datenbank-Schema
├── config.example.js   # Konfigurationsvorlage
├── package.json        # NPM Dependencies
└── README.md           # Diese Datei
```

## Technologie-Stack

### Backend
- **Express.js** - Web-Framework für Node.js
- **mysql2** - MySQL/MariaDB Client für Node.js
- **xml2js** - XML-Builder für Node.js
- **cors** - Cross-Origin Resource Sharing
- **express-rate-limit** - API Rate Limiting

### Frontend
- **jQuery 3.6.0** - JavaScript-Bibliothek
- **Vanilla CSS** - Responsive Design
- **AJAX** - Asynchrone Kommunikation

## Lernziele
Dieses Projekt demonstriert:
1. **Node.js Backend**: Server-Setup, Routing, Middleware
2. **Datenbankintegration**: Connection Pooling, SQL-Queries, CRUD-Operationen
3. **jQuery**: DOM-Manipulation, Event-Handling, AJAX-Requests
4. **AJAX**: GET, POST, PUT, DELETE Requests
5. **XML**: XML-Generierung, Parsing, und Anzeige
6. **REST API**: RESTful API-Design und Implementierung

## Troubleshooting

### Verbindungsfehler zur Datenbank
- Überprüfen Sie, ob MySQL/MariaDB läuft
- Überprüfen Sie die Zugangsdaten in `config.js`
- Stellen Sie sicher, dass die Datenbank `testdb` existiert

### Port bereits in Verwendung
Ändern Sie den Port in `config.js`:
```javascript
server: {
  port: 3001  // Oder einen anderen freien Port
}
```

### npm install Fehler
Versuchen Sie:
```bash
npm cache clean --force
npm install
```

## Lizenz
ISC

## Autor
marcus39-web
