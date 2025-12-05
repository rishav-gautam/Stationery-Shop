const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getAllPurchases,
  getPurchaseById,
  createPurchase,
  updatePurchase
} = require('../controllers/purchaseController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validation');

// All routes require authentication
router.use(authenticate);

// Get all purchases
router.get('/', getAllPurchases);

// Get purchase by ID
router.get('/:id', getPurchaseById);

// Create purchase (admin/manager only)
router.post('/',
  authorize('admin', 'manager'),
  [
    body('supplier_id').isInt().withMessage('Valid supplier ID is required'),
    body('items').isArray({ min: 1 }).withMessage('Purchase must have at least one item'),
    body('items.*.product_id').isInt().withMessage('Valid product ID is required'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('items.*.unit_price').isFloat({ min: 0 }).withMessage('Unit price must be a positive number'),
    body('discount').optional().isFloat({ min: 0 }).withMessage('Discount must be a positive number'),
    body('tax').optional().isFloat({ min: 0 }).withMessage('Tax must be a positive number')
  ],
  validate,
  createPurchase
);

// Update purchase (admin/manager only)
router.put('/:id',
  authorize('admin', 'manager'),
  [
    body('payment_status').optional().isIn(['pending', 'paid', 'partial']).withMessage('Invalid payment status')
  ],
  validate,
  updatePurchase
);

module.exports = router;

