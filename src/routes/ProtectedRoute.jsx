import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth();

  console.log('🔒 ProtectedRoute check:', { user, loading, adminOnly, isAdmin });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('❌ No hay usuario, redirigiendo a login');
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    console.log('❌ Usuario no es admin, redirigiendo al home');
    return <Navigate to="/" replace />;
  }

  console.log('✅ Acceso permitido');
  return children;
}