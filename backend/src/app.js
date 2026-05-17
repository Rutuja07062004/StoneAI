const express = require('express');
const cors = require('cors');
const { errorHandler, notFound } = require('./middleware/error');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: "StoneAI API running"
  });
});

// Test Database Connection Route
app.get('/api/test-db', (req, res) => {
  const mongoose = require('mongoose');
  const isConnected = mongoose.connection.readyState === 1;
  res.status(isConnected ? 200 : 500).json({
    success: isConnected,
    database: isConnected ? "connected" : "disconnected"
  });
});

// API Routes will be mounted here
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/minerals', require('./routes/mineralRoutes'));

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;
