const express = require('express');
const router = express.Router();

const db = require('../event_db');

router.use(express.json());

async function list(req, res) {
  const { q, from, to, location, category, includeSuspended, includeInactive } = req.query;
  const where = [];
  const params = [];

  if (!includeSuspended) where.push('Suspended = 0');
  if (!includeInactive) where.push('IsActive = 1');

  if (from) { where.push('EventDate >= ?'); params.push(from); }
  if (to) { where.push('COALESCE(EndDate, EventDate) <= ?'); params.push(to); }
  if (location) { where.push('Location LIKE ?'); params.push(`%${location}%`); }
  if (category) { where.push('CategoryID = ?'); params.push(category); }
  if (q) { where.push('(EventName LIKE ? OR Description LIKE ?)'); params.push(`%${q}%`, `%${q}%`); }

  const sql = `
    SELECT
      e.*, 
      c.CategoryName, 
      c.CategoryImage, 
      o.OrganisationName
    FROM events e
    JOIN categories c ON e.CategoryID = c.CategoryID
    JOIN organisations o ON e.OrganisationID = o.OrganisationID
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
  const sql = `
  SELECT e.*, 
          c.CategoryName, c.CategoryImage,
          o.OrganisationName, o.OrganisationDescription, o.Website, o.Phone
  FROM events e
  JOIN categories c ON e.CategoryID = c.CategoryID
  JOIN organisations o ON e.OrganisationID = o.OrganisationID
  WHERE e.EventID = ?
`;
  try {
    const [rows] = await db.query(sql, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Get failed', detail: e.message });
  }
}

async function search(req, res) {

  console.log('Received query params:', req.query);
  const { date, location, categoryID } = req.query;

  let sql = `
    SELECT e.EventID, e.EventName, e.Description, e.EventDate, e.Location,
           c.CategoryName, c.CategoryImage, o.OrganisationName
    FROM Events e
    JOIN Categories c ON e.CategoryID = c.CategoryID
    JOIN Organisations o ON e.OrganisationID = o.OrganisationID
    WHERE 1=1
  `;

  // build sql query with search filters as parameters
  const params = [];

  if (date) {
    sql += " AND e.EventDate = ?";
    params.push(date);
  }

  if (location) {
    sql += " AND LOWER(e.Location) LIKE ?";
    params.push(`%${location}%`); // wildcard search, i.e. doesnt have to be full word
  }

  if (categoryID) {
    sql += " AND e.CategoryID = ?";
    params.push(categoryID);
  }

  try {
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('Error performing search:', err);
    return res.status(500).json({ error: 'Database query failed' });
  }
};


async function create(req, res) {

  console.log('[events.controller] Received POST /api/events with body:', req.body);

  const {
    EventName, Description, EventDate, EndDate, StartTime, EndTime,
    Location, TicketPrice = 0, GoalAmount = 0, CurrentProgress = 0,
    IsActive = 1, Suspended = 0, OrganisationID, CategoryID
  } = req.body;

  if (!EventName || !EventDate || !OrganisationID || !CategoryID) {
    console.log('Missing required fields:', { EventName, EventDate, OrganisationID, CategoryID });
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
    console.log('Event created successfully, new ID:', r.insertId);
    res.status(201).json({ ok: true, EventID: r.insertId });
  } catch (e) {
    console.error('SQL ERROR during event creation:');
    console.error(e);
    res.status(500).json({ error: 'Create failed', detail: e.message });
  }
}

async function update(req, res) {
  const id = req.params.id;
  const {
    EventName, Description, EventDate, EndDate, StartTime, EndTime,
    Location, TicketPrice, GoalAmount, CurrentProgress, IsActive, Suspended, OrganisationID, CategoryID
  } = req.body;

  // convert to numeric fields
  const orgID = Number(OrganisationID);
  const catID = Number(CategoryID);
  const cleanDate = EventDate ? EventDate.substring(0, 10) : null;

  try {
    const [r] = await db.query(`
      UPDATE events SET
        EventName=?, Description=?, EventDate=?, EndDate=?, StartTime=?, EndTime=?, Location=?,
        TicketPrice=?, GoalAmount=?, CurrentProgress=?, IsActive=?, Suspended=?, OrganisationID=?, CategoryID=?
      WHERE EventID=?`,
      [EventName, Description ?? null, cleanDate, EndDate ?? null, StartTime ?? null, EndTime ?? null,
        Location ?? null, TicketPrice ?? 0, GoalAmount ?? 0, CurrentProgress ?? 0,
        IsActive ? 1 : 0, Suspended ? 1 : 0, orgID, catID, id]
    );
    if (!r.affectedRows) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (e) {
    console.error('Update failed:', e.message);
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
router.get('/search', search);
router.get('/:id', get);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);
router.patch('/:id/active', setActive);
router.patch('/:id/suspend', setSuspended);

module.exports = router;
