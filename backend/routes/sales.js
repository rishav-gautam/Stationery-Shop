const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getAllSales,
  getSaleById,
  createSale,
  getSalesStats
} = require('../controllers/saleController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validation');

// All routes require authentication
router.use(authenticate);

// Get all sales
router.get('/', getAllSales);

// Get sales statistics
router.get('/stats', getSalesStats);

// Get sale by ID
router.get('/:id', getSaleById);

// Create sale
router.post('/',
  [
    body('items').isArray({ min: 1 }).withMessage('Sale must have at least one item'),
    body('items.*.product_id').isInt().withMessage('Valid product ID is required'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('items.*.unit_price').isFloat({ min: 0 }).withMessage('Unit price must be a positive number'),
    body('discount').optional().isFloat({ min: 0 }).withMessage('Discount must be a positive number'),
    body('tax').optional().isFloat({ min: 0 }).withMessage('Tax must be a positive number')
  ],
  validate,
  createSale
);

module.exports = router;

