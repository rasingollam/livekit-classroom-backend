const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const env = require('./config/env');

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: env.clientOrigin
}));
app.use(express.json());

// Routes
app.use(routes);

// Error handling
app.use(errorHandler);

module.exports = app;