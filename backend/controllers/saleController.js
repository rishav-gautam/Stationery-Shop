const pool = require('../config/database');

const generateInvoiceNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${year}${month}${day}-${random}`;
};

const getAllSales = async (req, res) => {
  try {
    const { page = 1, limit = 10, start_date = '', end_date = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT s.*, u.full_name as user_name 
      FROM sales s 
      LEFT JOIN users u ON s.user_id = u.id 
      WHERE 1=1
    `;
    const params = [];

    if (start_date) {
      query += ` AND DATE(s.created_at) >= ?`;
      params.push(start_date);
    }

    if (end_date) {
      query += ` AND DATE(s.created_at) <= ?`;
      params.push(end_date);
    }

    // LIMIT and OFFSET must be integers, not parameters
    const limitInt = parseInt(limit) || 10;
    const offsetInt = parseInt(offset) || 0;
    query += ` ORDER BY s.created_at DESC LIMIT ${limitInt} OFFSET ${offsetInt}`;

    const [sales] = await pool.execute(query, params.length > 0 ? params : undefined);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM sales WHERE 1=1';
    const countParams = [];
    if (start_date) {
      countQuery += ` AND DATE(created_at) >= ?`;
      countParams.push(start_date);
    }
    if (end_date) {
      countQuery += ` AND DATE(created_at) <= ?`;
      countParams.push(end_date);
    }
    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      sales,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get sales error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getSaleById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get sale details
    const [sales] = await pool.execute(
      `SELECT s.*, u.full_name as user_name 
       FROM sales s 
       LEFT JOIN users u ON s.user_id = u.id 
       WHERE s.id = ?`,
      [id]
    );

    if (sales.length === 0) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    // Get sale items
    const [items] = await pool.execute(
      `SELECT si.*, p.name as product_name, p.sku 
       FROM sales_items si 
       JOIN products p ON si.product_id = p.id 
       WHERE si.sale_id = ?`,
      [id]
    );

    res.json({
      ...sales[0],
      items
    });
  } catch (error) {
    console.error('Get sale error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createSale = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { customer_name, customer_email, customer_phone, items, discount = 0, tax = 0, payment_method = 'cash' } = req.body;

    // Validate items
    if (!items || items.length === 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'Sale must have at least one item' });
    }

    // Calculate totals
    let totalAmount = 0;
    const saleItems = [];

    for (const item of items) {
      const [products] = await connection.execute('SELECT * FROM products WHERE id = ? AND is_active = TRUE', [item.product_id]);
      if (products.length === 0) {
        await connection.rollback();
        return res.status(400).json({ message: `Product with id ${item.product_id} not found` });
      }

      const product = products[0];
      if (product.stock_quantity < item.quantity) {
        await connection.rollback();
        return res.status(400).json({ message: `Insufficient stock for product ${product.name}` });
      }

      const itemTotal = item.quantity * item.unit_price;
      totalAmount += itemTotal;

      saleItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: itemTotal,
        product: product
      });
    }

    const finalAmount = totalAmount - discount + tax;

    // Generate invoice number
    let invoiceNumber = generateInvoiceNumber();
    let [existing] = await connection.execute('SELECT id FROM sales WHERE invoice_number = ?', [invoiceNumber]);
    while (existing.length > 0) {
      invoiceNumber = generateInvoiceNumber();
      [existing] = await connection.execute('SELECT id FROM sales WHERE invoice_number = ?', [invoiceNumber]);
    }

    // Create sale
    const [saleResult] = await connection.execute(
      `INSERT INTO sales (invoice_number, customer_name, customer_email, customer_phone, total_amount, discount, tax, final_amount, payment_method, user_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [invoiceNumber, customer_name || null, customer_email || null, customer_phone || null, totalAmount, discount, tax, finalAmount, payment_method, req.user.id]
    );

    const saleId = saleResult.insertId;

    // Create sale items and update stock
    for (const item of saleItems) {
      await connection.execute(
        'INSERT INTO sales_items (sale_id, product_id, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?)',
        [saleId, item.product_id, item.quantity, item.unit_price, item.total_price]
      );

      // Update product stock
      await connection.execute(
        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    await connection.commit();

    // Get complete sale details
    const [newSale] = await connection.execute(
      `SELECT s.*, u.full_name as user_name 
       FROM sales s 
       LEFT JOIN users u ON s.user_id = u.id 
       WHERE s.id = ?`,
      [saleId]
    );

    const [saleItemsData] = await connection.execute(
      `SELECT si.*, p.name as product_name, p.sku 
       FROM sales_items si 
       JOIN products p ON si.product_id = p.id 
       WHERE si.sale_id = ?`,
      [saleId]
    );

    connection.release();

    res.status(201).json({
      message: 'Sale created successfully',
      sale: {
        ...newSale[0],
        items: saleItemsData
      }
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error('Create sale error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getSalesStats = async (req, res) => {
  try {
    const { start_date = '', end_date = '' } = req.query;

    let dateFilter = '';
    const params = [];

    if (start_date && end_date) {
      dateFilter = 'WHERE DATE(created_at) BETWEEN ? AND ?';
      params.push(start_date, end_date);
    } else if (start_date) {
      dateFilter = 'WHERE DATE(created_at) >= ?';
      params.push(start_date);
    } else if (end_date) {
      dateFilter = 'WHERE DATE(created_at) <= ?';
      params.push(end_date);
    }

    // Total sales
    const [totalSales] = await pool.execute(
      `SELECT COUNT(*) as count, COALESCE(SUM(final_amount), 0) as total 
       FROM sales ${dateFilter}`,
      params
    );

    // Today's sales
    const [todaySales] = await pool.execute(
      `SELECT COUNT(*) as count, COALESCE(SUM(final_amount), 0) as total 
       FROM sales WHERE DATE(created_at) = CURDATE()`
    );

    // Top selling products
    const [topProducts] = await pool.execute(
      `SELECT p.name, p.sku, SUM(si.quantity) as total_quantity, SUM(si.total_price) as total_revenue
       FROM sales_items si
       JOIN products p ON si.product_id = p.id
       JOIN sales s ON si.sale_id = s.id
       ${dateFilter.replace('created_at', 's.created_at')}
       GROUP BY p.id, p.name, p.sku
       ORDER BY total_quantity DESC
       LIMIT 10`,
      params
    );

    res.json({
      total_sales: totalSales[0],
      today_sales: todaySales[0],
      top_products: topProducts
    });
  } catch (error) {
    console.error('Get sales stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllSales,
  getSaleById,
  createSale,
  getSalesStats
};

