const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import routes
const registrationRoutes = require('./routes/registration');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Configure CORS for production
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? [
      'https://your-frontend-domain.vercel.app',
      'https://your-frontend-domain.onrender.com',
      'https://project5-wud7.onrender.com'
    ]
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/registration_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });

// Routes
app.use('/api/registration', registrationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API-only server - frontend will be deployed separately on Vercel
app.get('/', (req, res) => {
  res.json({
    message: 'MERN Registration API Server',
    endpoints: {
      health: '/api/health',
      registration: '/api/registration',
      users: '/api/registration',
      stats: '/api/registration/stats',
      excel: '/api/registration/excel'
    },
    frontend: 'Deployed separately on Vercel'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 Registration API: http://localhost:${PORT}/api/registration`);
}); 