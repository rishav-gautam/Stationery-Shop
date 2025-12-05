const pool = require('../config/database');

const generatePurchaseInvoiceNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `PUR-${year}${month}${day}-${random}`;
};

const getAllPurchases = async (req, res) => {
  try {
    const { page = 1, limit = 10, start_date = '', end_date = '', supplier_id = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT p.*, s.name as supplier_name, u.full_name as user_name 
      FROM purchases p 
      LEFT JOIN suppliers s ON p.supplier_id = s.id 
      LEFT JOIN users u ON p.user_id = u.id 
      WHERE 1=1
    `;
    const params = [];

    if (start_date) {
      query += ` AND DATE(p.created_at) >= ?`;
      params.push(start_date);
    }

    if (end_date) {
      query += ` AND DATE(p.created_at) <= ?`;
      params.push(end_date);
    }

    if (supplier_id) {
      query += ` AND p.supplier_id = ?`;
      params.push(supplier_id);
    }

    // LIMIT and OFFSET must be integers, not parameters
    const limitInt = parseInt(limit) || 10;
    const offsetInt = parseInt(offset) || 0;
    query += ` ORDER BY p.created_at DESC LIMIT ${limitInt} OFFSET ${offsetInt}`;

    const [purchases] = await pool.execute(query, params.length > 0 ? params : undefined);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM purchases WHERE 1=1';
    const countParams = [];
    if (start_date) {
      countQuery += ` AND DATE(created_at) >= ?`;
      countParams.push(start_date);
    }
    if (end_date) {
      countQuery += ` AND DATE(created_at) <= ?`;
      countParams.push(end_date);
    }
    if (supplier_id) {
      countQuery += ` AND supplier_id = ?`;
      countParams.push(supplier_id);
    }
    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      purchases,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get purchases error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getPurchaseById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get purchase details
    const [purchases] = await pool.execute(
      `SELECT p.*, s.name as supplier_name, s.contact_person, s.email as supplier_email, s.phone as supplier_phone, u.full_name as user_name 
       FROM purchases p 
       LEFT JOIN suppliers s ON p.supplier_id = s.id 
       LEFT JOIN users u ON p.user_id = u.id 
       WHERE p.id = ?`,
      [id]
    );

    if (purchases.length === 0) {
      return res.status(404).json({ message: 'Purchase not found' });
    }

    // Get purchase items
    const [items] = await pool.execute(
      `SELECT pi.*, pr.name as product_name, pr.sku 
       FROM purchase_items pi 
       JOIN products pr ON pi.product_id = pr.id 
       WHERE pi.purchase_id = ?`,
      [id]
    );

    res.json({
      ...purchases[0],
      items
    });
  } catch (error) {
    console.error('Get purchase error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createPurchase = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { supplier_id, items, discount = 0, tax = 0, payment_status = 'pending' } = req.body;

    // Validate supplier
    const [suppliers] = await connection.execute('SELECT id FROM suppliers WHERE id = ? AND is_active = TRUE', [supplier_id]);
    if (suppliers.length === 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'Supplier not found or inactive' });
    }

    // Validate items
    if (!items || items.length === 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'Purchase must have at least one item' });
    }

    // Calculate totals
    let totalAmount = 0;
    const purchaseItems = [];

    for (const item of items) {
      const [products] = await connection.execute('SELECT * FROM products WHERE id = ?', [item.product_id]);
      if (products.length === 0) {
        await connection.rollback();
        return res.status(400).json({ message: `Product with id ${item.product_id} not found` });
      }

      const itemTotal = item.quantity * item.unit_price;
      totalAmount += itemTotal;

      purchaseItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: itemTotal
      });
    }

    const finalAmount = totalAmount - discount + tax;

    // Generate invoice number
    let invoiceNumber = generatePurchaseInvoiceNumber();
    let [existing] = await connection.execute('SELECT id FROM purchases WHERE invoice_number = ?', [invoiceNumber]);
    while (existing.length > 0) {
      invoiceNumber = generatePurchaseInvoiceNumber();
      [existing] = await connection.execute('SELECT id FROM purchases WHERE invoice_number = ?', [invoiceNumber]);
    }

    // Create purchase
    const [purchaseResult] = await connection.execute(
      `INSERT INTO purchases (invoice_number, supplier_id, total_amount, discount, tax, final_amount, payment_status, user_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [invoiceNumber, supplier_id, totalAmount, discount, tax, finalAmount, payment_status, req.user.id]
    );

    const purchaseId = purchaseResult.insertId;

    // Create purchase items and update stock
    for (const item of purchaseItems) {
      await connection.execute(
        'INSERT INTO purchase_items (purchase_id, product_id, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?)',
        [purchaseId, item.product_id, item.quantity, item.unit_price, item.total_price]
      );

      // Update product stock
      await connection.execute(
        'UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    await connection.commit();

    // Get complete purchase details
    const [newPurchase] = await connection.execute(
      `SELECT p.*, s.name as supplier_name, u.full_name as user_name 
       FROM purchases p 
       LEFT JOIN suppliers s ON p.supplier_id = s.id 
       LEFT JOIN users u ON p.user_id = u.id 
       WHERE p.id = ?`,
      [purchaseId]
    );

    const [purchaseItemsData] = await connection.execute(
      `SELECT pi.*, pr.name as product_name, pr.sku 
       FROM purchase_items pi 
       JOIN products pr ON pi.product_id = pr.id 
       WHERE pi.purchase_id = ?`,
      [purchaseId]
    );

    connection.release();

    res.status(201).json({
      message: 'Purchase created successfully',
      purchase: {
        ...newPurchase[0],
        items: purchaseItemsData
      }
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error('Create purchase error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updatePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status } = req.body;

    // Check if purchase exists
    const [existing] = await pool.execute('SELECT id FROM purchases WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Purchase not found' });
    }

    await pool.execute(
      'UPDATE purchases SET payment_status = COALESCE(?, payment_status) WHERE id = ?',
      [payment_status, id]
    );

    res.json({ message: 'Purchase updated successfully' });
  } catch (error) {
    console.error('Update purchase error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllPurchases,
  getPurchaseById,
  createPurchase,
  updatePurchase
};

