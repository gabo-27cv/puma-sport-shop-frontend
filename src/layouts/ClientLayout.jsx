import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function ClientLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      <Navbar />
      <main>
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-purple-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <img src="/logo-pumas.png" alt="Logo" className="h-16 w-16 mb-4" />
              <p className="text-purple-200 text-sm">
                Tallados en cada una de tus metas
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Tienda</h3>
              <ul className="space-y-2 text-purple-200 text-sm">
                <li><a href="/catalog" className="hover:text-white">Productos</a></li>
                <li><a href="/catalog?featured=true" className="hover:text-white">Ofertas</a></li>
                <li><a href="/catalog" className="hover:text-white">Novedades</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Ayuda</h3>
              <ul className="space-y-2 text-purple-200 text-sm">
                <li><a href="#" className="hover:text-white">Envíos</a></li>
                <li><a href="#" className="hover:text-white">Devoluciones</a></li>
                <li><a href="#" className="hover:text-white">Contacto</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Síguenos</h3>
              <div className="flex gap-4">
                <a href="#" className="text-2xl hover:text-pink-400">📘</a>
                <a href="#" className="text-2xl hover:text-pink-400">📷</a>
                <a href="#" className="text-2xl hover:text-pink-400">🐦</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-purple-700 mt-8 pt-8 text-center text-purple-300 text-sm">
            © 2024 Puma Sport Shop. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}