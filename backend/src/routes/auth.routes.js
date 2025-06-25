const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/user.model');
const router = express.Router();

// Register new user
router.post('/register',
  [
    body('name').trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('password').trim().notEmpty(),
    body('username').trim()
      .notEmpty()
      .isLength({ min: 3, max: 30 })
      .matches(/^[a-zA-Z0-9._-]+$/)
      .withMessage('Username can only contain letters, numbers, dots, underscores and hyphens'),
    body('role').trim().notEmpty(),
    body('type').isIn(['admin', 'developer', 'qa', 'intern'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 400,
          message: "Validation failed",
          errors: errors.array()
        });
      }

      const { name, email, username, password, role, type } = req.body;

      // Check if user already exists (email)
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({
          status: 400,
          message: "Email already registered",
          error: "A user with this email already exists"
        });
      }

      // Check if username is taken
      const existingUsername = await User.findOne({ username: username.toLowerCase() });
      if (existingUsername) {
        return res.status(400).json({
          status: 400,
          message: "Username already taken",
          error: "A user with this username already exists"
        });
      }

      const user = new User({
        email,
        password,
        plainPassword: password,
        name,
        role,
        type,
        username: username.toLowerCase()
      });

      await user.save();
                           
      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Fetch the user again to include plainPassword in response
      const createdUser = await User.findById(user._id).select('+plainPassword');

      res.status(201).json({
        status: 201,
        message: "User registered successfully",
        data: { user: createdUser, token }
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Error creating user",
        error: error.message
      });
    }
  }
);

// Login user
router.post('/login',
  [
    body('username').trim().notEmpty(),
    body('password').notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 400,
          message: "Validation failed",
          errors: errors.array()
        });
      }

      const { username, password } = req.body;

      // Find user by username or email
      const user = await User.findOne({
        $or: [
          { username: username.toLowerCase() },
          { email: username.toLowerCase() }
        ]
      }).select('+plainPassword');

      if (!user) {
        return res.status(401).json({
          status: 401,
          message: "Authentication failed",
          error: "Invalid credentials"
        });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          status: 401,
          message: "Authentication failed",
          error: "Invalid credentials"
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(200).json({
        status: 200,
        message: "Login successful",
        data: { user, token }
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Error during login",
        error: error.message
      });
    }
  }
);

module.exports = router; 