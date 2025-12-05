const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
} = require('../controllers/supplierController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validation');

// All routes require authentication
router.use(authenticate);

// Get all suppliers
router.get('/', getAllSuppliers);

// Get supplier by ID
router.get('/:id', getSupplierById);

// Create supplier (admin/manager only)
router.post('/',
  authorize('admin', 'manager'),
  [
    body('name').trim().notEmpty().withMessage('Supplier name is required')
  ],
  validate,
  createSupplier
);

// Update supplier (admin/manager only)
router.put('/:id', authorize('admin', 'manager'), updateSupplier);

// Delete supplier (admin only)
router.delete('/:id', authorize('admin'), deleteSupplier);

module.exports = router;

