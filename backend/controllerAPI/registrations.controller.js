const express = require('express');
const router = express.Router();

const db = require('../event_db');

async function list(req, res) {
  const { eventId } = req.query;
  const where = [];
  const params = [];
  if (eventId) { where.push('r.EventID = ?'); params.push(eventId); }

  const sql = `
    SELECT r.*, e.EventName
    FROM registrations r
    JOIN events e ON e.EventID = r.EventID
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY r.CreatedAt DESC
  `;
  try {
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (e) {
    console.error('List failed:', e);
    res.status(500).json({ error: 'List failed', detail: e.message });
  }
}

router.get('/', list);

// GET /api/registrations/event/:id
router.get('/event/:id', async (req, res) => {
  const eventId = Number.parseInt(req.params.id, 10);

  const sql = `
    SELECT r.*, e.EventName
    FROM registrations r
    JOIN events e ON e.EventID = r.EventID
    WHERE r.EventID = ?
    ORDER BY r.CreatedAt DESC
  `;

  try {
    const [rows] = await db.query(sql, [eventId]);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching registrations for event:', err);
    res.status(500).json({ error: 'Database query failed', detail: err.message });
  }
});

// POST /api/registrations
router.post('/', async (req, res) => {
  try {
    const { EventID, FullName, Email, Phone, Tickets, Notes } = req.body || {};
    if (!EventID || !FullName || !Email) {
      return res.status(400).json({ error: 'EventID, FullName and Email are required' });
    }
    const tix = Number.isInteger(Tickets) && Tickets > 0 ? Tickets : 1;

    // ensure event exists
    const [eventRows] = await db.query('SELECT EventID FROM events WHERE EventID = ?', [EventID]);
    if (eventRows.length === 0) return res.status(404).json({ error: 'Event not found' });

    // insert registration
    const insert = `
      INSERT INTO registrations (EventID, FullName, Email, Phone, Tickets, Notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [insertResult] = await db.query(
      insert,
      [EventID, String(FullName).trim(), String(Email).trim(), Phone || null, tix, Notes || null]);

    // fetch and return the created registration
    const [createdRows] = await db.query(
      `SELECT RegistrationID, EventID, FullName, Email, Phone, Tickets, Notes, CreatedAt
           FROM registrations WHERE RegistrationID = ?`,
      [insertResult.insertId]
    );
    res.status(201).json(createdRows[0]);

  } catch (err) {
    console.error('Error creating registration:', err);

    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Already registered with this email for this event.' });
    }
    res.status(500).json({ error: 'Database query failed', detail: err.message });
  }
});

module.exports = router;
