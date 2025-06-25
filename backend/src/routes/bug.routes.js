const express = require('express');
const { body, validationResult } = require('express-validator');
const Bug = require('../models/bug.model');
const Project = require('../models/project.model');
const router = express.Router();

// Create bug
router.post('/',
  [
    body('title').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('severity').isIn(['low', 'medium', 'high', 'critical']),
    body('project').isMongoId(),
    body('assignedUser').isMongoId()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 400,
          message: "Validation error",
          errors: errors.array()
        });
      }

      // Check if project exists
      const project = await Project.findById(req.body.project);
      if (!project) {
        return res.status(404).json({
          status: 404,
          message: "Project not found"
        });
      }

      const bug = new Bug({
        ...req.body,
        status: 'open'
      });

      await bug.save();
      res.status(201).json({
        status: 201,
        message: "Bug created successfully",
        data: bug
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Error creating bug",
        error: error.message
      });
    }
  }
);

// Get all bugs (with filters)
router.get('/', async (req, res) => {
  try {
    const query = {};
    
    // Filter by project if specified
    if (req.query.project) {
      query.project = req.query.project;
    }

    // Filter by status if specified
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by severity if specified
    if (req.query.severity) {
      query.severity = req.query.severity;
    }

    // Filter by assigned user if specified
    if (req.query.assignedUser) {
      query.assignedUser = req.query.assignedUser;
    }

    const bugs = await Bug.find(query)
      .populate('assignedUser', 'name email')
      .populate('reportedBy', 'name email')
      .populate('project', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 200,
      message: "Bugs retrieved successfully",
      data: bugs
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error fetching bugs",
      error: error.message
    });
  }
});

// Get bug by ID
router.get('/:id', async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id)
      .populate('assignedUser', 'name email')
      .populate('reportedBy', 'name email')
      .populate('project', 'name');

    if (!bug) {
      return res.status(404).json({
        status: 404,
        message: "Bug not found"
      });
    }

    res.status(200).json({
      status: 200,
      message: "Bug retrieved successfully",
      data: bug
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error fetching bug",
      error: error.message
    });
  }
});

// Update bug
router.patch('/:id', async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'severity', 'status', 'assignedUser'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({
        status: 400,
        message: "Invalid updates",
        error: "Only title, description, severity, status, and assignedUser can be updated"
      });
    }

    const bug = await Bug.findById(req.params.id);
    if (!bug) {
      return res.status(404).json({
        status: 404,
        message: "Bug not found"
      });
    }

    updates.forEach(update => bug[update] = req.body[update]);
    await bug.save();

    res.status(200).json({
      status: 200,
      message: "Bug updated successfully",
      data: bug
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error updating bug",
      error: error.message
    });
  }
});

// Delete bug
router.delete('/:id', async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);
    if (!bug) {
      return res.status(404).json({
        status: 404,
        message: "Bug not found"
      });
    }

    await bug.remove();
    res.status(200).json({
      status: 200,
      message: "Bug deleted successfully",
      data: bug
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error deleting bug",
      error: error.message
    });
  }
});

module.exports = router; 