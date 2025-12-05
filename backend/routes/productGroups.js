const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getAllGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup
} = require('../controllers/productGroupController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validation');

// All routes require authentication
router.use(authenticate);

// Get all groups
router.get('/', getAllGroups);

// Get group by ID
router.get('/:id', getGroupById);

// Create group (admin/manager only)
router.post('/',
  authorize('admin', 'manager'),
  [
    body('name').trim().notEmpty().withMessage('Group name is required'),
    body('products').isArray({ min: 1 }).withMessage('Group must have at least one product'),
    body('products.*.product_id').isInt().withMessage('Valid product ID is required')
  ],
  validate,
  createGroup
);

// Update group (admin/manager only)
router.put('/:id',
  authorize('admin', 'manager'),
  [
    body('products').optional().isArray({ min: 1 }).withMessage('Group must have at least one product')
  ],
  validate,
  updateGroup
);

// Delete group (admin only)
router.delete('/:id', authorize('admin'), deleteGroup);

module.exports = router;

