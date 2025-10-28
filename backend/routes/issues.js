const express = require('express');
const { body, validationResult } = require('express-validator');
const Issue = require('../models/Issue');
const upload = require('../middleware/upload');

const router = express.Router();

// @route   POST /api/issues
// @desc    Create a new issue report
// @access  Public
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    // Parse nested JSON strings from FormData
    let parsedBody = { ...req.body };
    if (typeof parsedBody.location === 'string') {
      parsedBody.location = JSON.parse(parsedBody.location);
    }
    if (typeof parsedBody.reporterInfo === 'string') {
      parsedBody.reporterInfo = JSON.parse(parsedBody.reporterInfo);
    }
    
    // Update req.body with parsed data for validation
    req.body = parsedBody;
    
    // Manual validation
    const errors = [];
    
    if (!parsedBody.title || !parsedBody.title.trim()) {
      errors.push({ type: 'field', msg: 'Title is required', path: 'title', location: 'body' });
    }
    
    if (!parsedBody.description || !parsedBody.description.trim()) {
      errors.push({ type: 'field', msg: 'Description is required', path: 'description', location: 'body' });
    }
    
    const validCategories = ['Garbage', 'Streetlight', 'Water', 'Road', 'Drainage', 'Other'];
    if (!parsedBody.category || !validCategories.includes(parsedBody.category)) {
      errors.push({ type: 'field', msg: 'Invalid category', path: 'category', location: 'body' });
    }
    
    if (!parsedBody.location || !parsedBody.location.address || !parsedBody.location.address.trim()) {
      errors.push({ type: 'field', msg: 'Address is required', path: 'location.address', location: 'body' });
    }
    
    if (!parsedBody.reporterInfo || !parsedBody.reporterInfo.name || !parsedBody.reporterInfo.name.trim()) {
      errors.push({ type: 'field', msg: 'Reporter name is required', path: 'reporterInfo.name', location: 'body' });
    }
    
    if (!parsedBody.reporterInfo || !parsedBody.reporterInfo.email || !parsedBody.reporterInfo.email.trim()) {
      errors.push({ type: 'field', msg: 'Valid email is required', path: 'reporterInfo.email', location: 'body' });
    }
    
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const {
      title,
      description,
      category,
      priority,
      location,
      reporterInfo
    } = req.body;

    // Parse location coordinates if provided
    let coordinates = null;
    if (location.coordinates) {
      coordinates = typeof location.coordinates === 'string' 
        ? JSON.parse(location.coordinates) 
        : location.coordinates;
    }

    // Handle uploaded images
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        images.push({
          url: `/uploads/${file.filename}`,
          filename: file.filename
        });
      });
    }

    // Create new issue
    const issue = new Issue({
      title,
      description,
      category,
      priority: priority || 'Medium',
      location: {
        address: location.address,
        coordinates
      },
      images,
      reporterInfo: {
        name: reporterInfo.name,
        email: reporterInfo.email,
        phone: reporterInfo.phone || ''
      }
    });

    await issue.save();

    res.status(201).json({
      message: 'Issue reported successfully',
      issue: {
        id: issue._id,
        title: issue.title,
        status: issue.status,
        createdAt: issue.createdAt
      }
    });
  } catch (error) {
    console.error('Create issue error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/issues
// @desc    Get all issues (for public viewing)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, status, limit = 50, page = 1 } = req.query;
    
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    const issues = await Issue.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('-reporterInfo.phone -adminNotes');

    const total = await Issue.countDocuments(filter);

    res.json({
      issues,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Get issues error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/issues/:id
// @desc    Get single issue by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .select('-reporterInfo.phone -adminNotes');
    
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    res.json(issue);
  } catch (error) {
    console.error('Get issue error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/issues/search/:query
// @desc    Search issues by title or description
// @access  Public
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { limit = 20 } = req.query;

    const issues = await Issue.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { 'location.address': { $regex: query, $options: 'i' } }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .select('-reporterInfo.phone -adminNotes');

    res.json(issues);
  } catch (error) {
    console.error('Search issues error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;