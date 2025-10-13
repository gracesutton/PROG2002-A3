// Import dependencies
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Create Express app
const app = express();

// Global middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import controllers / routes
const apiController = require('./controllerAPI/api-controller');
const eventsController = require('./controllerAPI/events.controller');
const categoriesController = require('./controllerAPI/categories.controller');
const organisationsController = require('./controllerAPI/organisations.controller');
const registrationsController = require('./controllerAPI/registrations.controller');

// Admin routes (only keep ones that exist)
const adminRoutes = require('./routes/admin');
// const adminEventsRoutes = require('./routes/admin.events');
// const adminOrganisationsRoutes = require('./routes/admin.organisations');
// const adminCategoriesRoutes = require('./routes/admin.categories');
// const adminRegistrationsRoutes = require('./routes/admin.registrations');

function assertRouter(name, r) {
  console.log(`[route-check] ${name}:`, typeof r);
}

assertRouter('apiController', require('./controllerAPI/api-controller'));
assertRouter('eventsController', require('./controllerAPI/events.controller'));
assertRouter('categoriesController', require('./controllerAPI/categories.controller'));
assertRouter('organisationsController', require('./controllerAPI/organisations.controller'));
assertRouter('registrationsController', require('./controllerAPI/registrations.controller'));
assertRouter('adminRoutes', require('./routes/admin'));


// Mount routes
app.use('/api', apiController);
app.use('/api/events', eventsController);
app.use('/api/categories', categoriesController);
app.use('/api/organisations', organisationsController);
app.use('/api/registrations', registrationsController);

app.use('/api/admin', adminRoutes);
// app.use('/api/admin/events', adminEventsRoutes);
// app.use('/api/admin/organisations', adminOrganisationsRoutes);
// app.use('/api/admin/categories', adminCategoriesRoutes);
// app.use('/api/admin/registrations', adminRegistrationsRoutes);

// Health & DB check routes
app.get('/health', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

const db = require('./event_db'); 

app.get('/api/test-db', async (_req, res) => {
  try {
    const [rows] = await db.query('SELECT COUNT(*) AS totalEvents FROM events');
    res.json({ connected: true, totalEvents: rows[0].totalEvents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ connected: false, error: err.message });
  }
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
