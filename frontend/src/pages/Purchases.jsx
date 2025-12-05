import { useEffect, useState } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const Purchases = () => {
  const [purchases, setPurchases] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [cart, setCart] = useState([])
  const [selectedSupplier, setSelectedSupplier] = useState('')
  const [discount, setDiscount] = useState(0)
  const [tax, setTax] = useState(0)
  const [paymentStatus, setPaymentStatus] = useState('pending')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [unitPrice, setUnitPrice] = useState(0)

  useEffect(() => {
    fetchPurchases()
    fetchSuppliers()
    fetchProducts()
  }, [])

  const fetchPurchases = async () => {
    try {
      const response = await api.get('/purchases')
      setPurchases(response.data.purchases)
    } catch (error) {
      toast.error('Failed to load purchases')
    } finally {
      setLoading(false)
    }
  }

  const fetchSuppliers = async () => {
    try {
      const response = await api.get('/suppliers')
      setSuppliers(response.data.suppliers)
    } catch (error) {
      console.error('Failed to load suppliers')
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products')
      setProducts(response.data.products)
    } catch (error) {
      console.error('Failed to load products')
    }
  }

  const addToCart = () => {
    if (!selectedProduct) {
      toast.error('Please select a product')
      return
    }
    if (quantity <= 0) {
      toast.error('Quantity must be greater than 0')
      return
    }
    if (unitPrice <= 0) {
      toast.error('Unit price must be greater than 0')
      return
    }

    const existingItem = cart.find(item => item.product_id === selectedProduct.id)
    if (existingItem) {
      setCart(cart.map(item =>
        item.product_id === selectedProduct.id
          ? { ...item, quantity: item.quantity + quantity, unit_price: unitPrice }
          : item
      ))
    } else {
      setCart([...cart, {
        product_id: selectedProduct.id,
        name: selectedProduct.name,
        sku: selectedProduct.sku,
        unit_price: unitPrice,
        quantity: quantity
      }])
    }
    setSelectedProduct(null)
    setQuantity(1)
    setUnitPrice(0)
    toast.success('Product added to cart')
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product_id !== productId))
  }

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(cart.map(item =>
      item.product_id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ))
  }

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0)
    return {
      subtotal,
      discount,
      tax,
      total: subtotal - discount + tax
    }
  }

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty')
      return
    }
    if (!selectedSupplier) {
      toast.error('Please select a supplier')
      return
    }

    try {
      const totals = calculateTotal()
      await api.post('/purchases', {
        supplier_id: selectedSupplier,
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price
        })),
        discount,
        tax,
        payment_status: paymentStatus
      })

      toast.success('Purchase completed successfully!')
      setShowModal(false)
      resetCart()
      fetchPurchases()
      fetchProducts()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Checkout failed')
    }
  }

  const resetCart = () => {
    setCart([])
    setSelectedSupplier('')
    setDiscount(0)
    setTax(0)
    setPaymentStatus('pending')
  }

  const totals = calculateTotal()

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Purchases</h1>
          <p className="text-gray-600 mt-2">Manage purchase orders</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New Purchase
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : purchases.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No purchases found
                  </td>
                </tr>
              ) : (
                purchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{purchase.invoice_number}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{purchase.supplier_name}</td>
                    <td className="px-6 py-4 text-sm text-right font-medium text-gray-800">
                      ₹{parseFloat(purchase.final_amount || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        purchase.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                        purchase.payment_status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {purchase.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(purchase.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Purchase Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">New Purchase Order</h2>
            </div>
            <div className="flex-1 overflow-hidden flex">
              <div className="w-1/2 border-r p-6 overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">Add Products</h3>
                <div className="space-y-4 mb-4">
                  <select
                    value={selectedProduct?.id || ''}
                    onChange={(e) => {
                      const product = products.find(p => p.id === parseInt(e.target.value))
                      setSelectedProduct(product)
                      if (product) setUnitPrice(product.cost_price || 0)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Product</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {product.sku}
                      </option>
                    ))}
                  </select>
                  {selectedProduct && (
                    <div className="space-y-2">
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Quantity"
                      />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={unitPrice}
                        onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Unit Price"
                      />
                      <button
                        onClick={addToCart}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.product_id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">₹{item.unit_price} × {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateCartQuantity(item.product_id, item.quantity - 1)}
                          className="px-2 py-1 bg-gray-200 rounded"
                        >
                          -
                        </button>
                        <span className="w-12 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.product_id, item.quantity + 1)}
                          className="px-2 py-1 bg-gray-200 rounded"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product_id)}
                          className="ml-2 text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-1/2 p-6 overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">Purchase Details</h3>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Supplier *</label>
                    <select
                      value={selectedSupplier}
                      onChange={(e) => setSelectedSupplier(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      required
                    >
                      <option value="">Select Supplier</option>
                      {suppliers.filter(s => s.is_active).map(supplier => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Payment Status</label>
                    <select
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="partial">Partial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Discount (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={discount}
                      onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tax (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={tax}
                      onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>+₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-2 border-t">
                    <span>Total:</span>
                    <span>₹{totals.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <button
                    onClick={handleCheckout}
                    disabled={cart.length === 0 || !selectedSupplier}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Complete Purchase
                  </button>
                  <button
                    onClick={() => {
                      setShowModal(false)
                      resetCart()
                    }}
                    className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Purchases

