import { useEffect, useState } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'

const Sales = () => {
  const [sales, setSales] = useState([])
  const [products, setProducts] = useState([])
  const [productGroups, setProductGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [cart, setCart] = useState([])
  const [customerInfo, setCustomerInfo] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: ''
  })
  const [discount, setDiscount] = useState(0)
  const [tax, setTax] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedGroup, setSelectedGroup] = useState(null)

  useEffect(() => {
    fetchSales()
    fetchProducts()
    fetchProductGroups()
  }, [])

  const fetchSales = async () => {
    try {
      const response = await api.get('/sales')
      setSales(response.data.sales)
    } catch (error) {
      toast.error('Failed to load sales')
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products')
      setProducts(response.data.products.filter(p => p.is_active && p.stock_quantity > 0))
    } catch (error) {
      console.error('Failed to load products')
    }
  }

  const fetchProductGroups = async () => {
    try {
      const response = await api.get('/product-groups')
      setProductGroups(response.data)
    } catch (error) {
      console.error('Failed to load product groups')
    }
  }

  const handleAddGroup = async () => {
    if (!selectedGroup) {
      toast.error('Please select a product group')
      return
    }

    try {
      const response = await api.get(`/product-groups/${selectedGroup}`)
      const group = response.data

      if (!group.products || group.products.length === 0) {
        toast.error('Selected group has no products')
        return
      }

      // Check stock availability for all products in group
      for (const item of group.products) {
        if (!item.is_active) {
          toast.error(`${item.product_name} is not active`)
          return
        }
        if (item.stock_quantity < item.quantity) {
          toast.error(`Insufficient stock for ${item.product_name}`)
          return
        }
      }

      // Add all products from group to cart
      const newItems = group.products.map(item => ({
        product_id: item.product_id,
        name: item.product_name,
        sku: item.sku,
        unit_price: parseFloat(item.unit_price),
        quantity: item.quantity,
        stock_quantity: item.stock_quantity
      }))

      // Merge with existing cart (if product already exists, update quantity)
      setCart(prevCart => {
        const updatedCart = [...prevCart]
        newItems.forEach(newItem => {
          const existingIndex = updatedCart.findIndex(item => item.product_id === newItem.product_id)
          if (existingIndex >= 0) {
            const newQuantity = updatedCart[existingIndex].quantity + newItem.quantity
            if (newQuantity > updatedCart[existingIndex].stock_quantity) {
              toast.error(`Cannot add more ${newItem.name} - insufficient stock`)
              return
            }
            updatedCart[existingIndex].quantity = newQuantity
          } else {
            updatedCart.push(newItem)
          }
        })
        return updatedCart
      })

      toast.success(`Added ${group.name} to cart`)
      setSelectedGroup(null)
    } catch (error) {
      toast.error('Failed to load group products')
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
    if (quantity > selectedProduct.stock_quantity) {
      toast.error('Insufficient stock')
      return
    }

    const existingItem = cart.find(item => item.product_id === selectedProduct.id)
    if (existingItem) {
      setCart(cart.map(item =>
        item.product_id === selectedProduct.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ))
    } else {
      setCart([...cart, {
        product_id: selectedProduct.id,
        name: selectedProduct.name,
        sku: selectedProduct.sku,
        unit_price: selectedProduct.unit_price,
        quantity: quantity,
        stock_quantity: selectedProduct.stock_quantity
      }])
    }
    setSelectedProduct(null)
    setQuantity(1)
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
    const item = cart.find(item => item.product_id === productId)
    if (newQuantity > item.stock_quantity) {
      toast.error('Insufficient stock')
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

    try {
      const totals = calculateTotal()
      const response = await api.post('/sales', {
        ...customerInfo,
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price
        })),
        discount,
        tax,
        payment_method: paymentMethod
      })

      toast.success('Sale completed successfully!')
      generateInvoice(response.data.sale)
      setShowModal(false)
      resetCart()
      fetchSales()
      fetchProducts()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Checkout failed')
    }
  }

  const generateInvoice = (sale) => {
    const doc = new jsPDF()
    doc.setFontSize(20)
    doc.text('INVOICE', 105, 20, { align: 'center' })
    
    doc.setFontSize(12)
    doc.text(`Invoice #: ${sale.invoice_number}`, 20, 40)
    doc.text(`Date: ${new Date(sale.created_at).toLocaleDateString()}`, 20, 50)
    
    if (sale.customer_name) {
      doc.text(`Customer: ${sale.customer_name}`, 20, 60)
    }

    let y = 80
    doc.setFontSize(10)
    doc.text('Item', 20, y)
    doc.text('Qty', 100, y)
    doc.text('Price', 130, y)
    doc.text('Total', 160, y)
    y += 10

    sale.items.forEach(item => {
      doc.text(item.product_name, 20, y)
      doc.text(item.quantity.toString(), 100, y)
      doc.text(`₹${item.unit_price}`, 130, y)
      doc.text(`₹${item.total_price}`, 160, y)
      y += 10
    })

    y += 10
    doc.text(`Subtotal: ₹${sale.total_amount}`, 130, y)
    y += 10
    if (sale.discount > 0) {
      doc.text(`Discount: ₹${sale.discount}`, 130, y)
      y += 10
    }
    if (sale.tax > 0) {
      doc.text(`Tax: ₹${sale.tax}`, 130, y)
      y += 10
    }
    doc.setFontSize(12)
    doc.text(`Total: ₹${sale.final_amount}`, 130, y)

    doc.save(`invoice-${sale.invoice_number}.pdf`)
  }

  const resetCart = () => {
    setCart([])
    setCustomerInfo({ customer_name: '', customer_email: '', customer_phone: '' })
    setDiscount(0)
    setTax(0)
    setPaymentMethod('cash')
    setSelectedGroup(null)
    setSelectedProduct(null)
    setQuantity(1)
  }

  const totals = calculateTotal()

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Sales</h1>
          <p className="text-gray-600 mt-2">Manage sales and billing</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New Sale
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : sales.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No sales found
                  </td>
                </tr>
              ) : (
                sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{sale.invoice_number}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{sale.customer_name || 'Walk-in'}</td>
                    <td className="px-6 py-4 text-sm text-right font-medium text-gray-800">
                      ₹{parseFloat(sale.final_amount || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">{sale.payment_method}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(sale.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <button
                        onClick={async () => {
                          try {
                            const response = await api.get(`/sales/${sale.id}`)
                            generateInvoice(response.data)
                          } catch (error) {
                            toast.error('Failed to generate invoice')
                          }
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Invoice
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* POS Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">Point of Sale</h2>
            </div>
            <div className="flex-1 overflow-hidden flex">
              {/* Product Selection */}
              <div className="w-1/2 border-r p-6 overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">Add Products</h3>
                
                {/* Product Groups Section */}
                {productGroups.length > 0 && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Or Select Product Group:
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={selectedGroup || ''}
                        onChange={(e) => setSelectedGroup(e.target.value ? parseInt(e.target.value) : null)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="">Select Product Group</option>
                        {productGroups.map(group => (
                          <option key={group.id} value={group.id}>
                            {group.name} ({group.product_count} products)
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleAddGroup}
                        disabled={!selectedGroup}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add Group
                      </button>
                    </div>
                  </div>
                )}

                <div className="mb-4 border-t pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Individual Product:
                  </label>
                  <div className="space-y-4">
                    <select
                      value={selectedProduct?.id || ''}
                      onChange={(e) => {
                        const product = products.find(p => p.id === parseInt(e.target.value))
                        setSelectedProduct(product)
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Select Product</option>
                      {products.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name} - ₹{product.unit_price} (Stock: {product.stock_quantity})
                        </option>
                      ))}
                    </select>
                    {selectedProduct && (
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min="1"
                          max={selectedProduct.stock_quantity}
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="Quantity"
                        />
                        <button
                          onClick={addToCart}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>
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

              {/* Checkout Panel */}
              <div className="w-1/2 p-6 overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">Checkout</h3>
                <div className="space-y-4 mb-6">
                  <input
                    type="text"
                    placeholder="Customer Name (Optional)"
                    value={customerInfo.customer_name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, customer_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="email"
                    placeholder="Customer Email (Optional)"
                    value={customerInfo.customer_email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, customer_email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="tel"
                    placeholder="Customer Phone (Optional)"
                    value={customerInfo.customer_phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, customer_phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="upi">UPI</option>
                      <option value="other">Other</option>
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
                    disabled={cart.length === 0}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Complete Sale
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

export default Sales

