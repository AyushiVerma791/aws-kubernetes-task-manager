const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const taskRoutes = require('./routes/tasks.routes');
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // logging

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Readiness check endpoint
app.get('/ready', async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.$queryRaw`SELECT 1`;
    await prisma.$disconnect();
    res.status(200).json({ status: 'ready', database: 'connected' });
  } catch (error) {
    res.status(503).json({ status: 'not ready', database: 'disconnected', error: error.message });
  }
});

// API Routes
app.use('/tasks', taskRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
