-- Datenbank erstellen
CREATE DATABASE IF NOT EXISTS testdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE testdb;

-- Tabelle für Benutzer erstellen
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  age INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Beispieldaten einfügen
INSERT INTO users (name, email, age) VALUES 
  ('Max Mustermann', 'max.mustermann@example.com', 28),
  ('Anna Schmidt', 'anna.schmidt@example.com', 32),
  ('Tom Weber', 'tom.weber@example.com', 25),
  ('Lisa Müller', 'lisa.mueller@example.com', 30);
