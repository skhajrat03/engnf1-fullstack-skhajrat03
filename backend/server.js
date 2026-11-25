
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './src/config/db.js';
import userRoutes from './src/routes/userRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import resourceRoutes from './src/routes/resourceRoutes.js';
import bookingRoutes from './src/routes/bookingRoutes.js';

dotenv.config();

const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Parse JSON requests
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(
    `[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`
  );
  next();
});

// Health check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TriageSync Backend is Running'
  });
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/bookings', bookingRoutes);

// Start server
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`TriageSync server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
};

startServer();
