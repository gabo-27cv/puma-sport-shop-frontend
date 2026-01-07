import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Home, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { getItemsCount } = useCart();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b-4 border-gradient-to-r from-primary-500 to-secondary-500">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/logo-pumas.png" 
              alt="Puma Sport Shop" 
              className="h-14 w-14 group-hover:scale-110 transition-transform duration-300"
            />
            <div>
              <h1 className="text-2xl font-bold gradient-text">
                PUMA SPORT SHOP
              </h1>
              <p className="text-xs text-gray-500">Tallados en cada una de tus metas</p>
            </div>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              <Home size={20} />
              <span>Inicio</span>
            </Link>
            <Link 
              to="/catalog" 
              className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              <Package size={20} />
              <span>Productos</span>
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link 
              to="/cart" 
              className="relative p-2 hover:bg-purple-50 rounded-lg transition-colors"
            >
              <ShoppingCart className="text-gray-700" size={24} />
              {getItemsCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg">
                  {getItemsCount()}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link 
                  to={user?.role === 'admin' ? '/admin' : '/profile'}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  <User size={20} />
                  <span className="hidden md:inline">{user?.name}</span>
                </Link>
                <button 
                  onClick={logout}
                  className="p-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="btn-primary"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}