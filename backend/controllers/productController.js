const pool = require('../config/database');

const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', category_id = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ` AND (p.name LIKE ? OR p.sku LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category_id) {
      query += ` AND p.category_id = ?`;
      params.push(category_id);
    }

    // LIMIT and OFFSET must be integers, not parameters
    const limitInt = parseInt(limit) || 10;
    const offsetInt = parseInt(offset) || 0;
    query += ` ORDER BY p.created_at DESC LIMIT ${limitInt} OFFSET ${offsetInt}`;

    const [products] = await pool.execute(query, params.length > 0 ? params : undefined);

    // Get total count
    let countQuery = `SELECT COUNT(*) as total FROM products WHERE 1=1`;
    const countParams = [];
    if (search) {
      countQuery += ` AND (name LIKE ? OR sku LIKE ?)`;
      countParams.push(`%${search}%`, `%${search}%`);
    }
    if (category_id) {
      countQuery += ` AND category_id = ?`;
      countParams.push(category_id);
    }
    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [products] = await pool.execute(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ?`,
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(products[0]);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, sku, category_id, description, unit_price, cost_price, stock_quantity, min_stock_level, unit } = req.body;

    // Check if SKU exists
    const [existing] = await pool.execute('SELECT id FROM products WHERE sku = ?', [sku]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'SKU already exists' });
    }

    const [result] = await pool.execute(
      `INSERT INTO products (name, sku, category_id, description, unit_price, cost_price, stock_quantity, min_stock_level, unit) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, sku, category_id || null, description || null, unit_price, cost_price, stock_quantity || 0, min_stock_level || 10, unit || 'pcs']
    );

    res.status(201).json({ message: 'Product created successfully', id: result.insertId });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sku, category_id, description, unit_price, cost_price, stock_quantity, min_stock_level, unit, is_active } = req.body;

    // Check if product exists
    const [existing] = await pool.execute('SELECT id FROM products WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if SKU is being changed and if new SKU exists
    if (sku) {
      const [skuCheck] = await pool.execute('SELECT id FROM products WHERE sku = ? AND id != ?', [sku, id]);
      if (skuCheck.length > 0) {
        return res.status(400).json({ message: 'SKU already exists' });
      }
    }

    await pool.execute(
      `UPDATE products 
       SET name = COALESCE(?, name), 
           sku = COALESCE(?, sku), 
           category_id = ?, 
           description = COALESCE(?, description), 
           unit_price = COALESCE(?, unit_price), 
           cost_price = COALESCE(?, cost_price), 
           stock_quantity = COALESCE(?, stock_quantity), 
           min_stock_level = COALESCE(?, min_stock_level), 
           unit = COALESCE(?, unit),
           is_active = COALESCE(?, is_active)
       WHERE id = ?`,
      [name, sku, category_id, description, unit_price, cost_price, stock_quantity, min_stock_level, unit, is_active, id]
    );

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const [existing] = await pool.execute('SELECT id FROM products WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await pool.execute('DELETE FROM products WHERE id = ?', [id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getLowStockProducts = async (req, res) => {
  try {
    const [products] = await pool.execute(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.stock_quantity <= p.min_stock_level AND p.is_active = TRUE
       ORDER BY (p.stock_quantity / p.min_stock_level) ASC`
    );

    res.json(products);
  } catch (error) {
    console.error('Get low stock products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts
};

