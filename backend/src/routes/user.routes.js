const express = require('express');
const User = require('../models/user.model');
const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}).select('+plainPassword');
    res.status(200).json({
      status: 200,
      message: "Users retrieved successfully",
      data: users
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error fetching users",
      error: error.message
    });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('+plainPassword');
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found"
      });
    }
    res.status(200).json({
      status: 200,
      message: "User retrieved successfully",
      data: user
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error fetching user",
      error: error.message
    });
  }
});

// Update user
router.patch('/:id', async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'role', 'type', 'username'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({
        status: 400,
        message: "Invalid updates",
        error: "Only name, email, password, role, type, and username can be updated"
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found"
      });
    }

    updates.forEach(update => user[update] = req.body[update]);
    await user.save();

    const updatedUser = await User.findById(user._id).select('+plainPassword');
    
    res.status(200).json({
      status: 200,
      message: "User updated successfully",
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error updating user",
      error: error.message
    });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found"
      });
    }
    res.status(200).json({
      status: 200,
      message: "User deleted successfully",
      data: user
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error deleting user",
      error: error.message
    });
  }
});

router.delete('/', async (req, res) => {
  try {
    const user = await User.deleteMany();
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "Error Deleting User"
      });
    }
    res.status(200).json({
      status: 200,
      message: "User deleted successfully",
      data: user
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error deleting user",
      error: error.message
    });
  }
});

module.exports = router; 