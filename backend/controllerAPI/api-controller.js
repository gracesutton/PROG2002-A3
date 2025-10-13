// import express, connect to DB, and create a router
const express = require('express');
const db = require('../event_db.js');
const router = express.Router();

// READ all events with images from categories
router.get('/', async (req, res) => {
  const sql = `
    SELECT e.*,
           c.CategoryName, c.CategoryImage,
           o.OrganisationName
    FROM Events e
    JOIN Categories c ON e.CategoryID = c.CategoryID
    JOIN Organisations o ON e.OrganisationID = o.OrganisationID
    ORDER BY e.EventID ASC;
  `;
  try {
    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    console.error('Error retrieving events:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// GET all categories
router.get('/categories/list', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Categories ORDER BY CategoryName ASC');
    res.json(rows);
  } catch (err) {
    console.error('Error retrieving categories:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// SEARCH events by date, location, and category
router.get('/search', async (req, res) => {
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
  });


// READ single event by ID
router.get('/:id', async (req, res) => {
  const sql = `
    SELECT e.EventID, e.EventName, e.Description, e.EventDate, e.Location,
           e.TicketPrice, e.GoalAmount, e.CurrentProgress,
           c.CategoryName, c.CategoryImage,
           o.OrganisationName, o.OrganisationDescription, o.Website, o.Phone
    FROM Events e
    JOIN Categories c ON e.CategoryID = c.CategoryID
    JOIN Organisations o ON e.OrganisationID = o.OrganisationID
    WHERE e.EventID = ?
  `;
  try {
    const [rows] = await db.query(sql, [req.params.id]);
    res.json(rows[0]) || null;
  } catch (err) {
    console.error('Error retrieving event:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// export the router
module.exports = router;
