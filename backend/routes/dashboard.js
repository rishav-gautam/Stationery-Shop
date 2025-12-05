const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Get dashboard statistics
router.get('/stats', getDashboardStats);

module.exports = router;

