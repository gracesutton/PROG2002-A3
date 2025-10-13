const express = require('express');
const router = express.Router();

const db = require('../event_db');

async function list(req, res) {
  const { q, from, to, location, category, includeSuspended, includeInactive } = req.query;
  const where = [];
  const params = [];

  if (!includeSuspended) where.push('Suspended = 0');
  if (!includeInactive)  where.push('IsActive = 1');

  if (from)     { where.push('EventDate >= ?'); params.push(from); }
  if (to)       { where.push('COALESCE(EndDate, EventDate) <= ?'); params.push(to); }
  if (location) { where.push('Location LIKE ?'); params.push(`%${location}%`); }
  if (category) { where.push('CategoryID = ?'); params.push(category); }
  if (q)        { where.push('(EventName LIKE ? OR Description LIKE ?)'); params.push(`%${q}%`, `%${q}%`); }

  const sql = `
    SELECT * FROM events
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY EventDate, COALESCE(StartTime, '00:00:00')
  `;
  try {
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'List failed', detail: e.message });
  }
}

async function get(req, res) {
  try {
    const [rows] = await db.query('SELECT * FROM events WHERE EventID=?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Get failed', detail: e.message });
  }
}

async function create(req, res) {
  const {
    EventName, Description, EventDate, EndDate, StartTime, EndTime,
    Location, TicketPrice=0, GoalAmount=0, CurrentProgress=0,
    IsActive=1, Suspended=0, OrganisationID, CategoryID
  } = req.body;

  if (!EventName || !EventDate || !OrganisationID || !CategoryID) {
    return res.status(400).json({ error: 'EventName, EventDate, OrganisationID, CategoryID are required' });
  }
  try {
    const [r] = await db.query(`
      INSERT INTO events
      (EventName, Description, EventDate, EndDate, StartTime, EndTime, Location,
       TicketPrice, GoalAmount, CurrentProgress, IsActive, Suspended, OrganisationID, CategoryID)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [EventName, Description ?? null, EventDate, EndDate ?? null, StartTime ?? null, EndTime ?? null,
       Location ?? null, TicketPrice, GoalAmount, CurrentProgress, IsActive ? 1 : 0,
       Suspended ? 1 : 0, OrganisationID, CategoryID]
    );
    res.status(201).json({ ok: true, EventID: r.insertId });
  } catch (e) {
    res.status(500).json({ error: 'Create failed', detail: e.message });
  }
}

async function update(req, res) {
  const id = req.params.id;
  const {
    EventName, Description, EventDate, EndDate, StartTime, EndTime,
    Location, TicketPrice, GoalAmount, CurrentProgress, IsActive, Suspended, OrganisationID, CategoryID
  } = req.body;

  try {
    const [r] = await db.query(`
      UPDATE events SET
        EventName=?, Description=?, EventDate=?, EndDate=?, StartTime=?, EndTime=?, Location=?,
        TicketPrice=?, GoalAmount=?, CurrentProgress=?, IsActive=?, Suspended=?, OrganisationID=?, CategoryID=?
      WHERE EventID=?`,
      [EventName, Description ?? null, EventDate, EndDate ?? null, StartTime ?? null, EndTime ?? null,
       Location ?? null, TicketPrice ?? 0, GoalAmount ?? 0, CurrentProgress ?? 0,
       IsActive ? 1 : 0, Suspended ? 1 : 0, OrganisationID, CategoryID, id]
    );
    if (!r.affectedRows) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Update failed', detail: e.message });
  }
}

async function remove(req, res) {
  try {
    const [r] = await db.query('DELETE FROM events WHERE EventID=?', [req.params.id]);
    if (!r.affectedRows) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Delete failed', detail: e.message });
  }
}

async function setActive(req, res) {
  try {
    const [r] = await db.query('UPDATE events SET IsActive=? WHERE EventID=?',
      [req.body.isActive ? 1 : 0, req.params.id]);
    if (!r.affectedRows) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true, IsActive: !!req.body.isActive });
  } catch (e) {
    res.status(500).json({ error: 'Set active failed', detail: e.message });
  }
}

async function setSuspended(req, res) {
  try {
    const [r] = await db.query('UPDATE events SET Suspended=? WHERE EventID=?',
      [req.body.suspended ? 1 : 0, req.params.id]);
    if (!r.affectedRows) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true, Suspended: !!req.body.suspended });
  } catch (e) {
    res.status(500).json({ error: 'Set suspended failed', detail: e.message });
  }
}

router.get('/', list);
router.get('/:id', get);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);
router.patch('/:id/active', setActive);
router.patch('/:id/suspend', setSuspended);

module.exports = router;
