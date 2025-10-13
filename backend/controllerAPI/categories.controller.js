const express = require('express');
const router = express.Router();

const db = require('../event_db');

async function list(_req, res) {
  const [r] = await db.query('SELECT * FROM categories ORDER BY CategoryName');
  res.json(r);
}

async function create(req, res) {
  const { CategoryName } = req.body;
  if (!CategoryName) return res.status(400).json({ error: 'CategoryName required' });
  const [r] = await db.query(
    'INSERT INTO categories (CategoryName) VALUES (?)',
    [CategoryName]
  );
  res.status(201).json({ ok: true, CategoryID: r.insertId });
}

async function remove(req, res) {
  const [r] = await db.query('DELETE FROM categories WHERE CategoryID=?', [req.params.id]);
  if (!r.affectedRows) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true });
}

router.get('/', list);
router.post('/', create);
router.delete('/:id', remove);

module.exports = router;
