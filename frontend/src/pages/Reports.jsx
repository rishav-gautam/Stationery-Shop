import { useEffect, useState } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

const Reports = () => {
  const [salesStats, setSalesStats] = useState(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSalesStats()
  }, [])

  const fetchSalesStats = async () => {
    try {
      const params = new URLSearchParams()
      if (startDate) params.append('start_date', startDate)
      if (endDate) params.append('end_date', endDate)
      const response = await api.get(`/sales/stats?${params}`)
      setSalesStats(response.data)
    } catch (error) {
      toast.error('Failed to load sales statistics')
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = () => {
    setLoading(true)
    fetchSalesStats()
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
        <p className="text-gray-600 mt-2">Sales analytics and insights</p>
      </div>

      {/* Date Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filter by Date Range</h2>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleFilter}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Apply Filter
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm text-gray-600 mb-2">Total Sales</h3>
          <p className="text-3xl font-bold text-gray-800">
            ₹{parseFloat(salesStats?.total_sales?.total || 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {salesStats?.total_sales?.count || 0} transactions
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm text-gray-600 mb-2">Today's Sales</h3>
          <p className="text-3xl font-bold text-gray-800">
            ₹{parseFloat(salesStats?.today_sales?.total || 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {salesStats?.today_sales?.count || 0} transactions
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm text-gray-600 mb-2">Average Sale</h3>
          <p className="text-3xl font-bold text-gray-800">
            ₹{salesStats?.total_sales?.count > 0
              ? (parseFloat(salesStats.total_sales.total) / salesStats.total_sales.count).toFixed(2)
              : 0}
          </p>
        </div>
      </div>

      {/* Top Products Chart */}
      {salesStats?.top_products && salesStats.top_products.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Top Selling Products</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={salesStats.top_products}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total_quantity" fill="#3b82f6" name="Quantity Sold" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top Products Table */}
      {salesStats?.top_products && salesStats.top_products.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Top Products Details</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-gray-700">Product</th>
                  <th className="text-left p-3 text-gray-700">SKU</th>
                  <th className="text-right p-3 text-gray-700">Quantity Sold</th>
                  <th className="text-right p-3 text-gray-700">Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                {salesStats.top_products.map((product, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-gray-800">{product.name}</td>
                    <td className="p-3 text-gray-600">{product.sku}</td>
                    <td className="p-3 text-right text-gray-800">{product.total_quantity}</td>
                    <td className="p-3 text-right font-medium text-gray-800">
                      ₹{parseFloat(product.total_revenue || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(!salesStats || salesStats.top_products?.length === 0) && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500">No sales data available for the selected period</p>
        </div>
      )}
    </div>
  )
}

export default Reports

