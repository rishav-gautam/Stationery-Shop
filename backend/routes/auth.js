const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, getProfile } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validation');

// Register
router.post('/register',
  [
    body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('full_name').trim().notEmpty().withMessage('Full name is required')
  ],
  validate,
  register
);

// Login
router.post('/login',
  [
    body('username').notEmpty().withMessage('Username or email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  login
);

// Get profile
router.get('/profile', authenticate, getProfile);

module.exports = router;

