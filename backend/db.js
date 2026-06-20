const Database = require('better-sqlite3');
const db = new Database('volunteers.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'volunteer',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    date TEXT NOT NULL,
    location TEXT,
    slots INTEGER DEFAULT 10,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    volunteer_id INTEGER REFERENCES users(id),
    event_id INTEGER REFERENCES events(id),
    registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(volunteer_id, event_id)
  );

  CREATE TABLE IF NOT EXISTS volunteer_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE REFERENCES users(id),
    age INTEGER,
    phone TEXT,
    city TEXT,
    areas_of_interest TEXT,
    availability TEXT,
    message TEXT,
    status TEXT DEFAULT 'New',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

module.exports = db;