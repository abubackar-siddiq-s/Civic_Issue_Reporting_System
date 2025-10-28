const express = require('express');
const { body, validationResult } = require('express-validator');
const Issue = require('../models/Issue');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/admin/issues
// @desc    Get all issues for admin dashboard
// @access  Private
router.get('/issues', auth, async (req, res) => {
  try {
    const { 
      category, 
      status, 
      priority, 
      assignedTo,
      limit = 50, 
      page = 1,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const issues = await Issue.find(filter)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Issue.countDocuments(filter);

    // Get statistics
    const stats = await Issue.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const categoryStats = await Issue.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      issues,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      },
      stats: {
        byStatus: stats,
        byCategory: categoryStats
      }
    });
  } catch (error) {
    console.error('Get admin issues error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/issues/:id
// @desc    Get single issue with full details
// @access  Private
router.get('/issues/:id', auth, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    res.json(issue);
  } catch (error) {
    console.error('Get admin issue error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/issues/:id
// @desc    Update issue status and details
// @access  Private
router.put('/issues/:id', auth, [
  body('status').optional().isIn(['Submitted', 'In Progress', 'Resolved', 'Closed']),
  body('priority').optional().isIn(['Low', 'Medium', 'High', 'Critical']),
  body('assignedTo').optional().isString(),
  body('adminNotes').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, priority, assignedTo, adminNotes } = req.body;

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Update fields
    if (status) issue.status = status;
    if (priority) issue.priority = priority;
    if (assignedTo !== undefined) issue.assignedTo = assignedTo;
    if (adminNotes !== undefined) issue.adminNotes = adminNotes;

    await issue.save();

    res.json({
      message: 'Issue updated successfully',
      issue
    });
  } catch (error) {
    console.error('Update issue error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/issues/:id
// @desc    Delete an issue
// @access  Private
router.delete('/issues/:id', auth, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    await Issue.findByIdAndDelete(req.params.id);

    res.json({ message: 'Issue deleted successfully' });
  } catch (error) {
    console.error('Delete issue error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Total issues
    const totalIssues = await Issue.countDocuments();

    // Issues in last period
    const recentIssues = await Issue.countDocuments({
      createdAt: { $gte: startDate }
    });

    // Status breakdown
    const statusStats = await Issue.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Category breakdown
    const categoryStats = await Issue.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // Priority breakdown
    const priorityStats = await Issue.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent issues
    const latestIssues = await Issue.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title status category createdAt priority');

    res.json({
      totalIssues,
      recentIssues,
      statusStats,
      categoryStats,
      priorityStats,
      latestIssues
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;