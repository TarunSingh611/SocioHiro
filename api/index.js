// Vercel API route for the backend - API only
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

// Create Express app for API only
const app = express();

// CORS configuration for Vercel
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://socio-hiro.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Check for required environment variables
const requiredEnvVars = ['MONGODB_URI', 'SESSION_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  console.error('Please configure these in your Vercel project settings');
}

// Connect to MongoDB with error handling
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    return false;
  }
};

// Initialize database connection
let isDBConnected = false;

const initializeDB = async () => {
  if (!isDBConnected) {
    isDBConnected = await connectDB();
  }
  return isDBConnected;
};

// Import your existing routes and middleware
const routes = require('../backend/src/routes');
const { optionalAuth } = require('../backend/src/middleware/auth');

// Apply optional authentication to all API routes
app.use('/api', optionalAuth);

// API Routes - handle all /api/* requests
app.use('/api', async (req, res, next) => {
  // Initialize DB if not connected
  await initializeDB();
  
  // If DB is not connected, return error
  if (!isDBConnected) {
    return res.status(500).json({
      error: 'Database connection failed',
      message: 'Please check MONGODB_URI environment variable',
      help: 'Configure MONGODB_URI in your Vercel project settings'
    });
  }
  
  console.log('API Request:', req.method, req.url);
  return routes(req, res, next);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    hasMongoDB: !!process.env.MONGODB_URI,
    hasSessionSecret: !!process.env.SESSION_SECRET,
    missingEnvVars: missingEnvVars,
    dbConnected: isDBConnected
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// Export the Express app for Vercel
module.exports = app; 