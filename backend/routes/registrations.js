const express = require('express');
const router = express.Router();
const db = require('../event_db'); // callback-based pool

// GET /api/registrations/event/:id
router.get('/event/:id', (req, res) => {
  const eventId = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(eventId)) return res.status(400).json({ error: 'Invalid event id' });

  const sql = `
    SELECT RegistrationID, EventID, FullName, Email, Phone, Tickets, Notes, CreatedAt
    FROM Registrations
    WHERE EventID = ?
    ORDER BY CreatedAt DESC
  `;
  db.query(sql, [eventId], (err, rows) => {
    if (err) {
      console.error('GET /registrations/event/:id DB error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(rows);
  });
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
      INSERT INTO Registrations (EventID, FullName, Email, Phone, Tickets, Notes)
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
           FROM Registrations WHERE RegistrationID = ?`,
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
