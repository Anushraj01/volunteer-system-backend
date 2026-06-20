const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// GET all volunteers with profiles (admin only) — supports search & filter
router.get('/', authMiddleware, (req, res) => {
  const { search, status, area } = req.query;
  let query = `
    SELECT users.id, users.name, users.email, users.created_at,
           vp.age, vp.phone, vp.city, vp.areas_of_interest,
           vp.availability, vp.message, vp.status
    FROM users
    LEFT JOIN volunteer_profiles vp ON vp.user_id = users.id
    WHERE users.role = 'volunteer'
  `;
  const params = [];
  if (search) { query += ` AND (users.name LIKE ? OR users.email LIKE ? OR vp.city LIKE ?)`; const s = `%${search}%`; params.push(s,s,s); }
  if (status) { query += ` AND vp.status = ?`; params.push(status); }
  if (area)   { query += ` AND vp.areas_of_interest LIKE ?`; params.push(`%${area}%`); }
  query += ' ORDER BY users.created_at DESC';
  const volunteers = db.prepare(query).all(...params);
  res.json(volunteers);
});

// PATCH update volunteer status (admin only)
router.patch('/:id/status', authMiddleware, (req, res) => {
  const { status } = req.body;
  const allowed = ['New', 'Contacted', 'Active', 'Inactive'];
  if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status.' });
  db.prepare('UPDATE volunteer_profiles SET status = ? WHERE user_id = ?').run(status, req.params.id);
  res.json({ message: 'Status updated.' });
});

// DELETE volunteer (admin only)
router.delete('/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM registrations WHERE volunteer_id = ?').run(req.params.id);
  db.prepare('DELETE FROM volunteer_profiles WHERE user_id = ?').run(req.params.id);
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  res.json({ message: 'Volunteer deleted.' });
});

// GET summary stats (admin only)
router.get('/summary', authMiddleware, (req, res) => {
  const total = db.prepare(`SELECT COUNT(*) as c FROM users WHERE role='volunteer'`).get().c;
  const byStatus = db.prepare(`SELECT status, COUNT(*) as count FROM volunteer_profiles GROUP BY status`).all();
  const topCities = db.prepare(`SELECT city, COUNT(*) as count FROM volunteer_profiles WHERE city IS NOT NULL GROUP BY city ORDER BY count DESC LIMIT 5`).all();
  const totalEvents = db.prepare(`SELECT COUNT(*) as c FROM events`).get().c;
  const totalRegistrations = db.prepare(`SELECT COUNT(*) as c FROM registrations`).get().c;
  res.json({ total, byStatus, topCities, totalEvents, totalRegistrations });
});

// GET CSV report (admin only)
router.get('/report', authMiddleware, (req, res) => {
  const rows = db.prepare(`
    SELECT users.name, users.email, vp.age, vp.phone, vp.city,
           vp.areas_of_interest, vp.availability, vp.status, vp.message, users.created_at
    FROM users
    LEFT JOIN volunteer_profiles vp ON vp.user_id = users.id
    WHERE users.role = 'volunteer'
    ORDER BY users.created_at DESC
  `).all();
  const csv = [
    'Name,Email,Age,Phone,City,Areas of Interest,Availability,Status,Message,Registered At',
    ...rows.map(r => `"${r.name}","${r.email}","${r.age||''}","${r.phone||''}","${r.city||''}","${r.areas_of_interest||''}","${r.availability||''}","${r.status||''}","${(r.message||'').replace(/"/g,"'")}","${r.created_at}"`)
  ].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=volunteers-report.csv');
  res.send(csv);
});

module.exports = router;