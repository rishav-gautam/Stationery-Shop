const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validation');

// All routes require authentication
router.use(authenticate);

// Get all categories
router.get('/', getAllCategories);

// Get category by ID
router.get('/:id', getCategoryById);

// Create category (admin/manager only)
router.post('/',
  authorize('admin', 'manager'),
  [
    body('name').trim().notEmpty().withMessage('Category name is required')
  ],
  validate,
  createCategory
);

// Update category (admin/manager only)
router.put('/:id', authorize('admin', 'manager'), updateCategory);

// Delete category (admin only)
router.delete('/:id', authorize('admin'), deleteCategory);

module.exports = router;

