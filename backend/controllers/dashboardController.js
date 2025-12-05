const pool = require('../config/database');

const getDashboardStats = async (req, res) => {
  try {
    // Total products
    const [productCount] = await pool.execute('SELECT COUNT(*) as total FROM products WHERE is_active = TRUE');
    
    // Low stock products
    const [lowStock] = await pool.execute(
      'SELECT COUNT(*) as total FROM products WHERE stock_quantity <= min_stock_level AND is_active = TRUE'
    );

    // Total sales today
    const [todaySales] = await pool.execute(
      `SELECT COUNT(*) as count, COALESCE(SUM(final_amount), 0) as total 
       FROM sales WHERE DATE(created_at) = CURDATE()`
    );

    // Total sales this month
    const [monthSales] = await pool.execute(
      `SELECT COUNT(*) as count, COALESCE(SUM(final_amount), 0) as total 
       FROM sales WHERE MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())`
    );

    // Total purchases this month
    const [monthPurchases] = await pool.execute(
      `SELECT COUNT(*) as count, COALESCE(SUM(final_amount), 0) as total 
       FROM purchases WHERE MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())`
    );

    // Recent sales
    const [recentSales] = await pool.execute(
      `SELECT s.*, u.full_name as user_name 
       FROM sales s 
       LEFT JOIN users u ON s.user_id = u.id 
       ORDER BY s.created_at DESC 
       LIMIT 5`
    );

    // Top selling products
    const [topProducts] = await pool.execute(
      `SELECT p.name, p.sku, SUM(si.quantity) as total_quantity, SUM(si.total_price) as total_revenue
       FROM sales_items si
       JOIN products p ON si.product_id = p.id
       JOIN sales s ON si.sale_id = s.id
       WHERE MONTH(s.created_at) = MONTH(CURDATE()) AND YEAR(s.created_at) = YEAR(CURDATE())
       GROUP BY p.id, p.name, p.sku
       ORDER BY total_quantity DESC
       LIMIT 5`
    );

    // Sales chart data (last 7 days)
    const [salesChart] = await pool.execute(
      `SELECT DATE(created_at) as date, COUNT(*) as count, COALESCE(SUM(final_amount), 0) as total
       FROM sales
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       GROUP BY DATE(created_at)
       ORDER BY date ASC`
    );

    res.json({
      stats: {
        total_products: productCount[0].total,
        low_stock_products: lowStock[0].total,
        today_sales: todaySales[0],
        month_sales: monthSales[0],
        month_purchases: monthPurchases[0]
      },
      recent_sales: recentSales,
      top_products: topProducts,
      sales_chart: salesChart
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDashboardStats };

