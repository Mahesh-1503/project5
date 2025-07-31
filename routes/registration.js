const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const ExcelHelper = require('../utils/excelHelper');
const path = require('path');

const router = express.Router();

// Initialize Excel helper
const excelHelper = new ExcelHelper(
  process.env.EXCEL_FILE_PATH || path.join(__dirname, '../data/registrations.xlsx')
);

// Initialize Excel file on startup
excelHelper.initializeFile().catch(console.error);

/**
 * @route   POST /api/registration
 * @desc    Register a new user and save to both MongoDB and Excel
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      dateOfBirth,
      gender,
      address,
      interests,
      newsletter,
      termsAccepted
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !dateOfBirth || !termsAccepted) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      address: {
        street: address?.street || '',
        city: address?.city || '',
        state: address?.state || '',
        zipCode: address?.zipCode || '',
        country: address?.country || 'United States'
      },
      interests: interests || [],
      newsletter: newsletter || false,
      termsAccepted
    });

    // Save to MongoDB
    const savedUser = await newUser.save();

    // Prepare data for Excel export
    const excelData = savedUser.toExcelData();

    // Append to Excel file
    await excelHelper.appendRegistration(excelData);

    // Return success response (without password)
    const userResponse = savedUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'User registered successfully! Data saved to database and Excel file.',
      user: userResponse,
      excelFile: process.env.EXCEL_FILE_PATH || 'data/registrations.xlsx'
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/registration
 * @desc    Get all registrations from MongoDB
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ registrationDate: -1 });
    
    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/registration/excel
 * @desc    Get all registrations from Excel file
 * @access  Public
 */
router.get('/excel', async (req, res) => {
  try {
    const registrations = await excelHelper.getAllRegistrations();
    
    res.json({
      success: true,
      count: registrations.length,
      registrations
    });
  } catch (error) {
    console.error('Error fetching Excel data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching Excel data',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/registration/stats
 * @desc    Get registration statistics
 * @access  Public
 */
router.get('/stats', async (req, res) => {
  try {
    // Get MongoDB stats
    const mongoCount = await User.countDocuments();
    
    // Get Excel stats
    const excelStats = await excelHelper.getFileStats();
    
    res.json({
      success: true,
      stats: {
        mongoDB: {
          totalRegistrations: mongoCount
        },
        excelFile: excelStats
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/registration/:id
 * @desc    Get a specific user by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id, '-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
});

module.exports = router; 