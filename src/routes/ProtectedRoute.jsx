import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  console.log('🔒 ProtectedRoute check:', { user, loading, adminOnly });

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!user) {
    console.log('❌ No hay usuario, redirigiendo a login');
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.rol !== 'admin') {
    console.log('❌ Usuario no es admin, redirigiendo al home');
    return <Navigate to="/catalogo" replace />;
  }

  console.log('✅ Acceso permitido');
  return children;
}
