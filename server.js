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
    ? ['https://your-frontend-domain.onrender.com', 'https://your-frontend-domain.vercel.app']
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

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  // Check if the build directory exists
  const buildPath = path.join(__dirname, 'client/build');
  const indexPath = path.join(buildPath, 'index.html');

  if (fs.existsSync(buildPath)) {
    console.log('✅ Found React build directory, serving static files');
    app.use(express.static(buildPath));

    app.get('*', (req, res) => {
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).json({
          error: 'Frontend not built',
          message: 'React build files not found. Please build the frontend first.',
          path: indexPath
        });
      }
    });
  } else {
    console.log('⚠️  React build directory not found, serving API only');
    // If no frontend build, serve API only
    app.get('*', (req, res) => {
      res.status(404).json({
        error: 'Not Found',
        message: 'This is a backend API server. Frontend not available.',
        apiEndpoints: {
          health: '/api/health',
          registration: '/api/registration'
        }
      });
    });
  }
}

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