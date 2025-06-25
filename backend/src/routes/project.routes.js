const express = require('express');
const { body, validationResult } = require('express-validator');
const Project = require('../models/project.model');
const router = express.Router();

// Create project
router.post('/',
  [
    body('name').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('members').isArray().notEmpty()
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

      const project = new Project({
        ...req.body
      });

      await project.save();
      res.status(201).json({
        status: 201,
        message: "Project created successfully",
        data: project
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Error creating project",
        error: error.message
      });
    }
  }
);

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({})
      .populate('members', 'name email role')
      .populate('createdBy', 'name email');
      
    res.status(200).json({
      status: 200,
      message: "Projects retrieved successfully",
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error fetching projects",
      error: error.message
    });
  }
});

// Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('members', 'name email role')
      .populate('createdBy', 'name email');

    if (!project) {
      return res.status(404).json({
        status: 404,
        message: "Project not found"
      });
    }

    res.status(200).json({
      status: 200,
      message: "Project retrieved successfully",
      data: project
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error fetching project",
      error: error.message
    });
  }
});

// Update project
router.patch('/:id', async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'description', 'members'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({
        status: 400,
        message: "Invalid updates",
        error: "Only name, description, and members can be updated"
      });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        status: 404,
        message: "Project not found"
      });
    }

    updates.forEach(update => project[update] = req.body[update]);
    await project.save();

    res.status(200).json({
      status: 200,
      message: "Project updated successfully",
      data: project
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error updating project",
      error: error.message
    });
  }
});

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({
        status: 404,
        message: "Project not found"
      });
    }
    res.status(200).json({
      status: 200,
      message: "Project deleted successfully",
      data: project
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error deleting project",
      error: error.message
    });
  }
});

// Remove member from project
router.delete('/:projectId/members/:memberId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({
        status: 404,
        message: "Project not found"
      });
    }

    // Check if member exists in the project
    const memberIndex = project.members.indexOf(req.params.memberId);
    if (memberIndex === -1) {
      return res.status(404).json({
        status: 404,
        message: "Member not found in project"
      });
    }

    // Remove member from the project
    project.members.splice(memberIndex, 1);
    await project.save();

    // Populate the updated project data
    const updatedProject = await Project.findById(project._id)
      .populate('members', 'name email role')
      .populate('createdBy', 'name email');

    res.status(200).json({
      status: 200,
      message: "Member removed from project successfully",
      data: updatedProject
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error removing member from project",
      error: error.message
    });
  }
});

module.exports = router; 