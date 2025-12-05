const pool = require('../config/database');

const getAllCategories = async (req, res) => {
  try {
    const [categories] = await pool.execute('SELECT * FROM categories ORDER BY name');
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const [categories] = await pool.execute('SELECT * FROM categories WHERE id = ?', [id]);

    if (categories.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(categories[0]);
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check if category exists
    const [existing] = await pool.execute('SELECT id FROM categories WHERE name = ?', [name]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const [result] = await pool.execute(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [name, description || null]
    );

    res.status(201).json({ message: 'Category created successfully', id: result.insertId });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Check if category exists
    const [existing] = await pool.execute('SELECT id FROM categories WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if new name conflicts
    if (name) {
      const [nameCheck] = await pool.execute('SELECT id FROM categories WHERE name = ? AND id != ?', [name, id]);
      if (nameCheck.length > 0) {
        return res.status(400).json({ message: 'Category name already exists' });
      }
    }

    await pool.execute(
      'UPDATE categories SET name = COALESCE(?, name), description = COALESCE(?, description) WHERE id = ?',
      [name, description, id]
    );

    res.json({ message: 'Category updated successfully' });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category exists
    const [existing] = await pool.execute('SELECT id FROM categories WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if category is used by products
    const [products] = await pool.execute('SELECT id FROM products WHERE category_id = ? LIMIT 1', [id]);
    if (products.length > 0) {
      return res.status(400).json({ message: 'Category is in use and cannot be deleted' });
    }

    await pool.execute('DELETE FROM categories WHERE id = ?', [id]);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};

