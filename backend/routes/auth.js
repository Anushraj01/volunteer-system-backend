const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

// REGISTER — with full volunteer profile
router.post('/register', async (req, res) => {
  const { name, email, password, age, phone, city, areas_of_interest, availability, message } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password are required.' });

  // Duplicate detection
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(400).json({ error: 'This email is already registered.' });

  const hashed = await bcrypt.hash(password, 10);
  try {
    const result = db.prepare(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)'
    ).run(name, email, hashed);

    // Create volunteer profile
    db.prepare(`
      INSERT INTO volunteer_profiles (user_id, age, phone, city, areas_of_interest, availability, message)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(result.lastInsertRowid, age||null, phone||null, city||null,
           Array.isArray(areas_of_interest) ? areas_of_interest.join(',') : (areas_of_interest||null),
           availability||null, message||null);

    res.json({ message: 'Registered successfully!', id: result.lastInsertRowid });
  } catch (e) {
    res.status(400).json({ error: 'Registration failed. ' + e.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required.' });
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) return res.status(401).json({ error: 'No account found with this email.' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Incorrect password.' });
  const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, name: user.name, role: user.role });
});

module.exports = router;