import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, LogOut, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/products', icon: Package, label: 'Productos' },
    { path: '/admin/orders', icon: ShoppingBag, label: 'Órdenes' }
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      {/* Top Bar */}
      <div className="bg-white shadow-lg border-b-4 border-gradient-to-r from-primary-500 to-secondary-500">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <img src="/logo-pumas.png" alt="Logo" className="h-12 w-12" />
              <div>
                <h1 className="text-xl font-bold gradient-text">Panel de Administración</h1>
                <p className="text-sm text-gray-500">Puma Sport Shop</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <Home size={20} />
                <span className="hidden md:inline">Ver Tienda</span>
              </Link>
              
              <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-primary-600 font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline font-semibold">{user?.name}</span>
              </div>

              <button
                onClick={logout}
                className="p-2 text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <nav className="card p-4 sticky top-8">
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path, item.exact);
                  
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-semibold ${
                          active
                            ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                            : 'text-gray-700 hover:bg-purple-50'
                        }`}
                      >
                        <Icon size={20} />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}