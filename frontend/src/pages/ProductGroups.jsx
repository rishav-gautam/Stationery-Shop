import { useEffect, useState } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const ProductGroups = () => {
  const { user } = useAuth()
  const [groups, setGroups] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingGroup, setEditingGroup] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    products: []
  })
  const [selectedProducts, setSelectedProducts] = useState([])

  const isAdminOrManager = user?.role === 'admin' || user?.role === 'manager'

  useEffect(() => {
    fetchGroups()
    fetchProducts()
  }, [])

  const fetchGroups = async () => {
    try {
      const response = await api.get('/product-groups')
      setGroups(response.data)
    } catch (error) {
      toast.error('Failed to load product groups')
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products')
      setProducts(response.data.products.filter(p => p.is_active))
    } catch (error) {
      console.error('Failed to load products')
    }
  }

  const handleAddProduct = () => {
    const productSelect = document.getElementById('product-select')
    const quantityInput = document.getElementById('product-quantity')
    
    if (!productSelect.value) {
      toast.error('Please select a product')
      return
    }

    const product = products.find(p => p.id === parseInt(productSelect.value))
    if (!product) return

    const quantity = parseInt(quantityInput.value) || 1

    // Check if product already added
    if (selectedProducts.find(p => p.product_id === product.id)) {
      toast.error('Product already added to group')
      return
    }

    setSelectedProducts([...selectedProducts, {
      product_id: product.id,
      product_name: product.name,
      sku: product.sku,
      quantity: quantity
    }])

    productSelect.value = ''
    quantityInput.value = '1'
  }

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => p.product_id !== productId))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (selectedProducts.length === 0) {
      toast.error('Please add at least one product to the group')
      return
    }

    try {
      const payload = {
        ...formData,
        products: selectedProducts
      }

      if (editingGroup) {
        await api.put(`/product-groups/${editingGroup.id}`, payload)
        toast.success('Product group updated successfully')
      } else {
        await api.post('/product-groups', payload)
        toast.success('Product group created successfully')
      }
      
      setShowModal(false)
      resetForm()
      fetchGroups()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    }
  }

  const handleEdit = async (groupId) => {
    try {
      const response = await api.get(`/product-groups/${groupId}`)
      const group = response.data
      setEditingGroup(group)
      setFormData({
        name: group.name,
        description: group.description || '',
        products: []
      })
      setSelectedProducts(group.products.map(p => ({
        product_id: p.product_id,
        product_name: p.product_name,
        sku: p.sku,
        quantity: p.quantity
      })))
      setShowModal(true)
    } catch (error) {
      toast.error('Failed to load group details')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product group?')) return
    try {
      await api.delete(`/product-groups/${id}`)
      toast.success('Product group deleted successfully')
      fetchGroups()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed')
    }
  }

  const resetForm = () => {
    setFormData({ name: '', description: '', products: [] })
    setSelectedProducts([])
    setEditingGroup(null)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Product Groups</h1>
          <p className="text-gray-600 mt-2">Manage product bundles and groups</p>
        </div>
        {isAdminOrManager && (
          <button
            onClick={() => {
              resetForm()
              setShowModal(true)
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add Group
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : groups.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No product groups found
                  </td>
                </tr>
              ) : (
                groups.map((group) => (
                  <tr key={group.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{group.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{group.description || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{group.product_count || 0} products</td>
                    <td className="px-6 py-4 text-sm text-right space-x-2">
                      {isAdminOrManager && (
                        <>
                          <button
                            onClick={() => handleEdit(group.id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                          {user?.role === 'admin' && (
                            <button
                              onClick={() => handleDelete(group.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && isAdminOrManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingGroup ? 'Edit Product Group' : 'Add Product Group'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., Class 10 Books Group"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="Group description..."
                />
              </div>

              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Products in Group *</label>
                <div className="flex gap-2 mb-4">
                  <select
                    id="product-select"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Product</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {product.sku}
                      </option>
                    ))}
                  </select>
                  <input
                    id="product-quantity"
                    type="number"
                    min="1"
                    defaultValue="1"
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Qty"
                  />
                  <button
                    type="button"
                    onClick={handleAddProduct}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedProducts.map((item) => (
                    <div key={item.product_id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.product_name}</p>
                        <p className="text-sm text-gray-600">SKU: {item.sku} | Quantity: {item.quantity}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(item.product_id)}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {selectedProducts.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No products added yet</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingGroup ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductGroups

