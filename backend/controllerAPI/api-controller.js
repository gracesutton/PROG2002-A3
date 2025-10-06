// import express, connect to DB, and create a router
const express = require('express');
const connection = require('../event_db.js');
const e = require('express');
const router = express.Router();

// READ all events with images from categories
router.get('/', (req, res) => {
  const sql = `
    SELECT e.EventID, e.EventName, e.Description, e.EventDate, e.Location,
           c.CategoryName, c.CategoryImage
    FROM Events e
    JOIN Categories c ON e.CategoryID = c.CategoryID
  `;
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error retrieving events:', err);
    } else {
        res.send(results);
    }
  });
});

// GET all categories
router.get('/categories/list', (req, res) => {
  connection.query( 'SELECT * FROM Categories ORDER BY CategoryName ASC', (err, results) => {
      if (err) {
        console.error('Error retrieving categories:', err);
      } else {
      res.send(results);
      }
    });
});

// SEARCH events by date, location, and category
router.get('/search', (req, res) => {
  const { date, location, categoryId } = req.query;

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

  if (categoryId) {
    sql += " AND e.CategoryID = ?";
    params.push(categoryId);
  }

  connection.query(sql, params, (err, results) => {
    if (err) {
      console.error('Error performing search:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  
  });
});


// READ single event by ID
router.get('/:id', (req, res) => {
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
  connection.query(sql, [req.params.id], (err, results) => {
    if (err) {
      console.error('Error retrieving event:', err);
    } else {
        res.send(results[0]);
        
    }
  });
});

// export the router
module.exports = router;
