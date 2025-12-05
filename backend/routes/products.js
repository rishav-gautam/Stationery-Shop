const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts
} = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validation');

// All routes require authentication
router.use(authenticate);

// Get all products
router.get('/', getAllProducts);

// Get low stock products
router.get('/low-stock', getLowStockProducts);

// Get product by ID
router.get('/:id', getProductById);

// Create product (admin/manager only)
router.post('/',
  authorize('admin', 'manager'),
  [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('sku').trim().notEmpty().withMessage('SKU is required'),
    body('unit_price').isFloat({ min: 0 }).withMessage('Unit price must be a positive number'),
    body('cost_price').isFloat({ min: 0 }).withMessage('Cost price must be a positive number')
  ],
  validate,
  createProduct
);

// Update product (admin/manager only)
router.put('/:id',
  authorize('admin', 'manager'),
  [
    body('unit_price').optional().isFloat({ min: 0 }).withMessage('Unit price must be a positive number'),
    body('cost_price').optional().isFloat({ min: 0 }).withMessage('Cost price must be a positive number')
  ],
  validate,
  updateProduct
);

// Delete product (admin only)
router.delete('/:id', authorize('admin'), deleteProduct);

module.exports = router;

