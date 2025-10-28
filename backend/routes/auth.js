const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Admin login
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const payload = {
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            department: admin.department
          }
        });
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current admin
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    res.json(admin);
  } catch (error) {
    console.error('Get admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/register
// @desc    Register new admin (for initial setup)
// @access  Public (should be protected in production)
router.post('/register', [
  body('name').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, department } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Create new admin
    const admin = new Admin({
      name,
      email,
      password,
      department: department || 'Municipal Corporation'
    });

    await admin.save();

    // Create JWT token
    const payload = {
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          token,
          admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            department: admin.department
          }
        });
      }
    );
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;