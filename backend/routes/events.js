const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// GET all events
router.get('/', (req, res) => {
  const events = db.prepare('SELECT * FROM events ORDER BY date ASC').all();
  res.json(events);
});

// POST create event (admin only)
router.post('/', authMiddleware, (req, res) => {
  const { name, date, location, slots, description } = req.body;
  if (!name || !date) return res.status(400).json({ error: 'Name and date are required.' });
  const result = db.prepare(
    'INSERT INTO events (name, date, location, slots, description) VALUES (?, ?, ?, ?, ?)'
  ).run(name, date, location, slots||10, description||null);
  res.json({ id: result.lastInsertRowid, name, date, location, slots, description });
});

// DELETE event (admin only)
router.delete('/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM registrations WHERE event_id = ?').run(req.params.id);
  db.prepare('DELETE FROM events WHERE id = ?').run(req.params.id);
  res.json({ message: 'Event deleted.' });
});

// POST register for event
router.post('/:id/register', authMiddleware, (req, res) => {
  const { volunteerId } = req.body;
  try {
    db.prepare('INSERT INTO registrations (event_id, volunteer_id) VALUES (?, ?)').run(req.params.id, volunteerId);
    res.json({ message: 'Registered successfully!' });
  } catch {
    res.status(400).json({ error: 'You are already registered for this event.' });
  }
});

module.exports = router;     