import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Layout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/products', label: 'Products', icon: '📦' },
    { path: '/categories', label: 'Categories', icon: '📁' },
    { path: '/product-groups', label: 'Product Groups', icon: '📚', roles: ['admin', 'manager'] },
    { path: '/sales', label: 'Sales', icon: '💰' },
    { path: '/purchases', label: 'Purchases', icon: '🛒' },
    { path: '/suppliers', label: 'Suppliers', icon: '🏢' },
    { path: '/reports', label: 'Reports', icon: '📈' }
  ].filter(item => !item.roles || item.roles.includes(user?.role))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-800">
            <h1 className="text-2xl font-bold">Stationery Shop</h1>
            <p className="text-sm text-gray-400 mt-1">Management System</p>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                {user?.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{user?.full_name || 'User'}</p>
                <p className="text-xs text-gray-400">{user?.role || 'staff'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <Outlet />
      </div>
    </div>
  )
}

export default Layout

