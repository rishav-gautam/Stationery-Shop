const pool = require('../config/database');

const getAllSuppliers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM suppliers WHERE 1=1';
    const params = [];

    if (search) {
      query += ` AND (name LIKE ? OR contact_person LIKE ? OR email LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // LIMIT and OFFSET must be integers, not parameters
    const limitInt = parseInt(limit) || 10;
    const offsetInt = parseInt(offset) || 0;
    query += ` ORDER BY created_at DESC LIMIT ${limitInt} OFFSET ${offsetInt}`;

    const [suppliers] = await pool.execute(query, params.length > 0 ? params : undefined);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM suppliers WHERE 1=1';
    const countParams = [];
    if (search) {
      countQuery += ` AND (name LIKE ? OR contact_person LIKE ? OR email LIKE ?)`;
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      suppliers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get suppliers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;
    const [suppliers] = await pool.execute('SELECT * FROM suppliers WHERE id = ?', [id]);

    if (suppliers.length === 0) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.json(suppliers[0]);
  } catch (error) {
    console.error('Get supplier error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createSupplier = async (req, res) => {
  try {
    const { name, contact_person, email, phone, address } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO suppliers (name, contact_person, email, phone, address) VALUES (?, ?, ?, ?, ?)',
      [name, contact_person || null, email || null, phone || null, address || null]
    );

    res.status(201).json({ message: 'Supplier created successfully', id: result.insertId });
  } catch (error) {
    console.error('Create supplier error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact_person, email, phone, address, is_active } = req.body;

    // Check if supplier exists
    const [existing] = await pool.execute('SELECT id FROM suppliers WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    await pool.execute(
      `UPDATE suppliers 
       SET name = COALESCE(?, name), 
           contact_person = COALESCE(?, contact_person), 
           email = COALESCE(?, email), 
           phone = COALESCE(?, phone), 
           address = COALESCE(?, address),
           is_active = COALESCE(?, is_active)
       WHERE id = ?`,
      [name, contact_person, email, phone, address, is_active, id]
    );

    res.json({ message: 'Supplier updated successfully' });
  } catch (error) {
    console.error('Update supplier error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if supplier exists
    const [existing] = await pool.execute('SELECT id FROM suppliers WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    // Check if supplier has purchases
    const [purchases] = await pool.execute('SELECT id FROM purchases WHERE supplier_id = ? LIMIT 1', [id]);
    if (purchases.length > 0) {
      return res.status(400).json({ message: 'Supplier has purchase records and cannot be deleted' });
    }

    await pool.execute('DELETE FROM suppliers WHERE id = ?', [id]);
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Delete supplier error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
};

