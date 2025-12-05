const pool = require('../config/database');

const getAllGroups = async (req, res) => {
  try {
    const [groups] = await pool.execute(
      `SELECT pg.*, 
       COUNT(pgi.id) as product_count
       FROM product_groups pg
       LEFT JOIN product_group_items pgi ON pg.id = pgi.group_id
       WHERE pg.is_active = TRUE
       GROUP BY pg.id
       ORDER BY pg.created_at DESC`
    );

    res.json(groups);
  } catch (error) {
    console.error('Get groups error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getGroupById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get group details
    const [groups] = await pool.execute(
      'SELECT * FROM product_groups WHERE id = ?',
      [id]
    );

    if (groups.length === 0) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Get group products
    const [items] = await pool.execute(
      `SELECT pgi.*, p.name as product_name, p.sku, p.unit_price, p.stock_quantity, p.is_active
       FROM product_group_items pgi
       JOIN products p ON pgi.product_id = p.id
       WHERE pgi.group_id = ?`,
      [id]
    );

    res.json({
      ...groups[0],
      products: items
    });
  } catch (error) {
    console.error('Get group error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createGroup = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { name, description, products } = req.body;

    if (!name) {
      await connection.rollback();
      return res.status(400).json({ message: 'Group name is required' });
    }

    if (!products || products.length === 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'Group must have at least one product' });
    }

    // Create group
    const [groupResult] = await connection.execute(
      'INSERT INTO product_groups (name, description) VALUES (?, ?)',
      [name, description || null]
    );

    const groupId = groupResult.insertId;

    // Add products to group
    for (const item of products) {
      await connection.execute(
        'INSERT INTO product_group_items (group_id, product_id, quantity) VALUES (?, ?, ?)',
        [groupId, item.product_id, item.quantity || 1]
      );
    }

    await connection.commit();

    // Get complete group details
    const [newGroup] = await connection.execute(
      'SELECT * FROM product_groups WHERE id = ?',
      [groupId]
    );

    const [groupItems] = await connection.execute(
      `SELECT pgi.*, p.name as product_name, p.sku, p.unit_price, p.stock_quantity
       FROM product_group_items pgi
       JOIN products p ON pgi.product_id = p.id
       WHERE pgi.group_id = ?`,
      [groupId]
    );

    connection.release();

    res.status(201).json({
      message: 'Product group created successfully',
      group: {
        ...newGroup[0],
        products: groupItems
      }
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error('Create group error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateGroup = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const { name, description, products, is_active } = req.body;

    // Check if group exists
    const [existing] = await connection.execute(
      'SELECT id FROM product_groups WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({ message: 'Group not found' });
    }

    // Update group
    await connection.execute(
      'UPDATE product_groups SET name = COALESCE(?, name), description = COALESCE(?, description), is_active = COALESCE(?, is_active) WHERE id = ?',
      [name, description, is_active, id]
    );

    // Update products if provided
    if (products && Array.isArray(products)) {
      // Delete existing items
      await connection.execute('DELETE FROM product_group_items WHERE group_id = ?', [id]);

      // Add new items
      for (const item of products) {
        await connection.execute(
          'INSERT INTO product_group_items (group_id, product_id, quantity) VALUES (?, ?, ?)',
          [id, item.product_id, item.quantity || 1]
        );
      }
    }

    await connection.commit();
    connection.release();

    res.json({ message: 'Product group updated successfully' });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error('Update group error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if group exists
    const [existing] = await pool.execute(
      'SELECT id FROM product_groups WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Group not found' });
    }

    await pool.execute('DELETE FROM product_groups WHERE id = ?', [id]);
    res.json({ message: 'Product group deleted successfully' });
  } catch (error) {
    console.error('Delete group error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup
};

