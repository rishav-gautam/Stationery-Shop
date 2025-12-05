import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [recentSales, setRecentSales] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [salesChart, setSalesChart] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/stats')
      setStats(response.data.stats)
      setRecentSales(response.data.recent_sales)
      setTopProducts(response.data.top_products)
      setSalesChart(response.data.sales_chart)
    } catch (error) {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Products',
      value: stats?.total_products || 0,
      icon: '📦',
      color: 'bg-blue-500'
    },
    {
      title: 'Low Stock Items',
      value: stats?.low_stock_products || 0,
      icon: '⚠️',
      color: 'bg-yellow-500'
    },
    {
      title: "Today's Sales",
      value: `₹${parseFloat(stats?.today_sales?.total || 0).toLocaleString()}`,
      icon: '💰',
      color: 'bg-green-500'
    },
    {
      title: 'Monthly Sales',
      value: `₹${parseFloat(stats?.month_sales?.total || 0).toLocaleString()}`,
      icon: '📊',
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} w-12 h-12 rounded-full flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Sales Trend (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesChart.map(item => ({ ...item, total: parseFloat(item.total || 0) }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Top Selling Products</h2>
          <div className="space-y-3">
            {topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">{product.total_quantity} sold</p>
                    <p className="text-sm text-gray-600">₹{parseFloat(product.total_revenue || 0).toFixed(2)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No sales data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Sales */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Recent Sales</h2>
          <Link to="/sales" className="text-blue-600 hover:text-blue-700 text-sm">
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 text-gray-700">Invoice</th>
                <th className="text-left p-3 text-gray-700">Customer</th>
                <th className="text-right p-3 text-gray-700">Amount</th>
                <th className="text-left p-3 text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentSales.length > 0 ? (
                recentSales.map((sale) => (
                  <tr key={sale.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-gray-800">{sale.invoice_number}</td>
                    <td className="p-3 text-gray-600">{sale.customer_name || 'Walk-in'}</td>
                    <td className="p-3 text-right font-medium text-gray-800">
                      ₹{parseFloat(sale.final_amount || 0).toFixed(2)}
                    </td>
                    <td className="p-3 text-gray-600">
                      {new Date(sale.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    No recent sales
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

