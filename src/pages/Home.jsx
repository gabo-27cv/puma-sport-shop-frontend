import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Sparkles, Shield, Truck, CreditCard } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/product.service';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

 const loadFeaturedProducts = async () => {
  try {
    const data = await productService.getProducts({ featured: true, limit: 4 });
    const products = Array.isArray(data) ? data : data.products || [];
    setFeaturedProducts(products);
  } catch (error) {
    console.error('Error loading products:', error);
  } finally {
    setLoading(false);
  }
};


  const categories = [
    { name: 'Patines', icon: '🛼', color: 'from-pink-500 to-purple-500' },
    { name: 'Cascos', icon: '🪖', color: 'from-purple-500 to-indigo-500' },
    { name: 'Protecciones', icon: '🛡️', color: 'from-indigo-500 to-blue-500' },
    { name: 'Accesorios', icon: '🧤', color: 'from-blue-500 to-cyan-500' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-secondary-600 to-purple-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Sparkles size={20} />
                <span className="text-sm font-semibold">¡Nuevos productos cada semana!</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Aliados en cada una
                <span className="block text-cyan-300">de tus metas</span>
              </h1>
              
              <p className="text-xl mb-8 text-purple-100">
                Descubre los mejores patines y accesorios para llevar tu pasión al siguiente nivel
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Link to="/catalogo" className="bg-white text-primary-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  Ver Productos
                  <ChevronRight className="inline ml-2" />
                </Link>
                <Link to="/catalogo?featured=true" className="border-2 border-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-primary-600 transition-all duration-300">
                  Ofertas Especiales
                </Link>
              </div>
            </div>
            
            <div className="flex-1">
              <img 
                src="/logo-pumas.png" 
                alt="Puma Sport Shop" 
                className="w-full max-w-md mx-auto drop-shadow-2xl animate-float"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 gradient-text">
          Explora por Categoría
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link 
              key={index}
              to={`/catalogo?category=${category.name}`}
              className="card-gradient p-8 text-center hover:scale-105 transition-transform duration-300"
            >
              <div className={`text-6xl mb-4 bg-gradient-to-br ${category.color} bg-clip-text`}>
                {category.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800">{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold gradient-text">
              🌟 Productos Destacados
            </h2>
            <Link 
              to="/catalogo" 
              className="text-primary-600 font-semibold hover:text-secondary-600 flex items-center gap-2"
            >
              Ver todos
              <ChevronRight size={20} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-64 bg-purple-200"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-purple-200 rounded"></div>
                    <div className="h-6 bg-purple-200 rounded"></div>
                    <div className="h-4 bg-purple-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Quick Login Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-md">
          <div className="card p-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold gradient-text mb-2">¿Ya tienes cuenta?</h2>
              <p className="text-gray-600">Inicia sesión para continuar comprando</p>
            </div>
            
            <div className="space-y-4">
              <Link 
                to="/login" 
                className="btn-primary w-full text-center block"
              >
                Iniciar Sesión
              </Link>
              
              <Link 
                to="/register" 
                className="btn-secondary w-full text-center block"
              >
                Crear Cuenta Nueva
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: 'Calidad Garantizada', desc: 'Productos originales y certificados' },
              { icon: Truck, title: 'Envío Gratis', desc: 'En compras mayores a $100,000' },
              { icon: CreditCard, title: 'Pago Seguro', desc: 'Múltiples métodos de pago' },
              { icon: Sparkles, title: 'Soporte 24/7', desc: 'Estamos aquí para ayudarte' }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-br from-primary-500 to-secondary-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <feature.icon className="text-white" size={28} />
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
