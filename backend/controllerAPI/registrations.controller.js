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
    res.status(500).json({ error: 'List failed', detail: e.message });
  }
}

router.get('/', list);

module.exports = router;
