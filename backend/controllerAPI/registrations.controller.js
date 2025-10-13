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
router.post('/', (req, res) => {
  const { EventID, FullName, Email, Phone, Tickets, Notes } = req.body || {};
  if (!EventID || !FullName || !Email) {
    return res.status(400).json({ error: 'EventID, FullName and Email are required' });
  }
  const tix = Number.isInteger(Tickets) && Tickets > 0 ? Tickets : 1;

  // ensure event exists
  db.query('SELECT EventID FROM Events WHERE EventID = ?', [EventID], (e1, rows) => {
    if (e1) { console.error('check event error:', e1); return res.status(500).json({ error: 'Server error' }); }
    if (rows.length === 0) return res.status(404).json({ error: 'Event not found' });

    const insert = `
      INSERT INTO registrations (EventID, FullName, Email, Phone, Tickets, Notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(
      insert,
      [EventID, String(FullName).trim(), String(Email).trim(), Phone || null, tix, Notes || null],
      (e2, result) => {
        if (e2) {
          if (e2.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Already registered with this email for this event.' });
          console.error('insert error:', e2);
          return res.status(500).json({ error: 'Server error' });
        }
        db.query(
          `SELECT RegistrationID, EventID, FullName, Email, Phone, Tickets, Notes, CreatedAt
           FROM registrations WHERE RegistrationID = ?`,
          [result.insertId],
          (e3, created) => {
            if (e3) { console.error('fetch created error:', e3); return res.status(500).json({ error: 'Server error' }); }
            res.status(201).json(created[0]);
          }
        );
      }
    );
  });
});


module.exports = router;
