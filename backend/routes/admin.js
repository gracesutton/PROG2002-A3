// routes/admin.js
const express = require('express');
const router = express.Router();
const db = require('../event_db');

// events

// List events
router.get('/events', async (req, res) => {
  const { includeSuspended, includeInactive } = req.query;
  const where = [];
  const params = [];

  if (!includeSuspended) where.push('Suspended = 0');
  if (!includeInactive)  where.push('IsActive = 1');

  const sql = `
    SELECT * FROM events
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY EventDate, StartTime
  `;

  try {
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Create event
router.post('/events', async (req, res) => {
  const {
    EventName, Description, EventDate, EndDate,
    StartTime, EndTime, Location,
    TicketPrice = 0, GoalAmount = 0, CurrentProgress = 0,
    OrganisationID, CategoryID, IsActive = 1, Suspended = 0,
  } = req.body;

  if (!EventName || !EventDate || !OrganisationID || !CategoryID) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO events
       (EventName, Description, EventDate, EndDate, StartTime, EndTime, Location,
        TicketPrice, GoalAmount, CurrentProgress, IsActive, Suspended, OrganisationID, CategoryID)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [EventName, Description ?? null, EventDate, EndDate ?? null, StartTime ?? null, EndTime ?? null,
       Location ?? null, TicketPrice, GoalAmount, CurrentProgress, IsActive ? 1 : 0, Suspended ? 1 : 0,
       OrganisationID, CategoryID]
    );
    res.status(201).json({ ok: true, EventID: result.insertId });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Create failed' });
  }
});

//Delete event
router.delete('/events/:id', async (req, res) => {
  try {
    const [r] = await db.query('DELETE FROM events WHERE EventID=?', [req.params.id]);
    if (r.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Delete failed' });
  }
});

// Update event
router.put('/events/:id', async (req, res) => {
  const id = req.params.id;
  const {
    EventName, Description, EventDate, EndDate,
    StartTime, EndTime, Location,
    TicketPrice, GoalAmount, CurrentProgress,
    OrganisationID, CategoryID, IsActive, Suspended,
  } = req.body;

  try {
    const [r] = await db.query(
      `UPDATE events
       SET EventName=?, Description=?, EventDate=?, EndDate=?, StartTime=?, EndTime=?, Location=?,
           TicketPrice=?, GoalAmount=?, CurrentProgress=?, OrganisationID=?, CategoryID=?, IsActive=?, Suspended=?
       WHERE EventID=?`,
      [EventName, Description ?? null, EventDate, EndDate ?? null, StartTime ?? null, EndTime ?? null, Location ?? null,
       TicketPrice ?? 0, GoalAmount ?? 0, CurrentProgress ?? 0, OrganisationID, CategoryID,
       IsActive ? 1 : 0, Suspended ? 1 : 0, id]
    );
    if (r.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Update failed' });
  }
});

//Get single event
router.get('/events/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM events WHERE EventID = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Fetch event failed' });
  }
});

// Toggle IsActive
router.patch('/events/:id/active', async (req, res) => {
  const id = req.params.id;
  const { isActive } = req.body;
  try {
    const [r] = await db.query(`UPDATE events SET IsActive=? WHERE EventID=?`, [isActive ? 1 : 0, id]);
    if (r.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true, IsActive: !!isActive });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Toggle active failed' });
  }
});

// Toggle Suspended
router.patch('/events/:id/suspend', async (req, res) => {
  const id = req.params.id;
  const { suspended } = req.body;
  try {
    const [r] = await db.query(`UPDATE events SET Suspended=? WHERE EventID=?`, [suspended ? 1 : 0, id]);
    if (r.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true, Suspended: !!suspended });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Suspend failed' });
  }
});

// Organisations
router.get('/organisations', async (_req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM organisations ORDER BY OrganisationName`);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Fetch organisations failed' });
  }
});

// Categories
router.get('/categories', async (_req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM categories ORDER BY CategoryName`);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Fetch categories failed' });
  }
});

module.exports = router;
