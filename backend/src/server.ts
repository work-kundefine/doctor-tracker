import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes';
import { connectDB } from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[HTTP] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// API Routes
app.use('/api', apiRouter);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Doctor Tracker Clinical Intelligence API',
    status: 'ONLINE',
    version: '4.9.2',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      doctors: '/api/doctors',
      patients: '/api/patients',
      analytics: '/api/analytics',
      health: '/api/health',
    },
  });
});

// Connect to MongoDB and start listening
connectDB().then((connected) => {
  if (connected) {
    console.log('[Database] MongoDB Atlas/Local connection initialized.');
  } else {
    console.log('[Database] Running in resilient embedded simulation mode.');
  }

  app.listen(PORT, () => {
    console.log(`🚀 Standalone Doctor Tracker Backend API running at http://localhost:${PORT}`);
    console.log(`📋 Clinical API docs available at http://localhost:${PORT}/`);
  });
});

export default app;
