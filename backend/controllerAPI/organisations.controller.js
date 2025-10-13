const express = require('express');
const router = express.Router();

const db = require('../event_db');

async function list(_req, res) {
  const [r] = await db.query('SELECT * FROM organisations ORDER BY OrganisationName');
  res.json(r);
}

async function get(req, res) {
  const [r] = await db.query('SELECT * FROM organisations WHERE OrganisationID=?', [req.params.id]);
  if (!r.length) return res.status(404).json({ error: 'Not found' });
  res.json(r[0]);
}

async function create(req, res) {
  const { OrganisationName, ContactEmail, Phone, Address } = req.body;
  if (!OrganisationName) return res.status(400).json({ error: 'OrganisationName required' });
  const [r] = await db.query(
    'INSERT INTO organisations (OrganisationName, ContactEmail, Phone, Address) VALUES (?,?,?,?)',
    [OrganisationName, ContactEmail ?? null, Phone ?? null, Address ?? null]
  );
  res.status(201).json({ ok: true, OrganisationID: r.insertId });
}

async function update(req, res) {
  const { OrganisationName, ContactEmail, Phone, Address } = req.body;
  const [r] = await db.query(
    'UPDATE organisations SET OrganisationName=?, ContactEmail=?, Phone=?, Address=? WHERE OrganisationID=?',
    [OrganisationName, ContactEmail ?? null, Phone ?? null, Address ?? null, req.params.id]
  );
  if (!r.affectedRows) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true });
}

async function remove(req, res) {
  const [r] = await db.query('DELETE FROM organisations WHERE OrganisationID=?', [req.params.id]);
  if (!r.affectedRows) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true });
}

router.get('/', list);
router.get('/:id', get);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
