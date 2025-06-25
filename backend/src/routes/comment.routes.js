const express = require('express');
const { body, validationResult } = require('express-validator');
const Comment = require('../models/comment.model');
const Bug = require('../models/bug.model');
const Project = require('../models/project.model');
const router = express.Router();

// Create comment
router.post('/',
  [
    body('text').trim().notEmpty(),
    body('bug').isMongoId(),
    body('author').isMongoId()
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

      // Check if bug exists
      const bug = await Bug.findById(req.body.bug);
      if (!bug) {
        return res.status(404).json({
          status: 404,
          message: "Bug not found"
        });
      }

      const comment = new Comment({
        text: req.body.text,
        bug: req.body.bug,
        author: req.body.author
      });

      await comment.save();
      
      // Populate author details
      await comment.populate('author', 'name email');
      
      res.status(201).json({
        status: 201,
        message: "Comment created successfully",
        data: comment
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Error creating comment",
        error: error.message
      });
    }
  }
);

// Get comments for a bug
router.get('/bug/:bugId', async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.bugId);
    if (!bug) {
      return res.status(404).json({
        status: 404,
        message: "Bug not found"
      });
    }

    const comments = await Comment.find({ bug: req.params.bugId })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 200,
      message: "Comments retrieved successfully",
      data: comments
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error fetching comments",
      error: error.message
    });
  }
});

// Update comment
router.patch('/:id', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        status: 404,
        message: "Comment not found"
      });
    }

    comment.text = req.body.text;
    await comment.save();
    
    await comment.populate('author', 'name email');
    
    res.status(200).json({
      status: 200,
      message: "Comment updated successfully",
      data: comment
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error updating comment",
      error: error.message
    });
  }
});

// Delete comment
router.delete('/:id', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        status: 404,
        message: "Comment not found"
      });
    }

    await comment.remove();
    res.status(200).json({
      status: 200,
      message: "Comment deleted successfully",
      data: comment
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error deleting comment",
      error: error.message
    });
  }
});

module.exports = router; 