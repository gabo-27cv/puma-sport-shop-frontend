import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Filter } from 'lucide-react';
import api from '../../api/axios';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    loadProducts();
  }, [category]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      // 🔥 CAMBIO: Usar endpoint de admin que trae variantes completas
      const response = await api.get('/admin/products');
      const productsData = response.data || [];

      console.log('✅ Productos cargados desde admin:', productsData);

      // Filtramos por categoría si aplica
      const filteredByCategory =
        category === 'all'
          ? productsData
          : productsData.filter(p => p.categoria_nombre === category || p.category?.name === category);

      setProducts(filteredByCategory);
    } catch (error) {
      console.error('❌ Error cargando productos:', error);
      console.error('❌ Error completo:', error.response?.data);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Calcula stock total (sumando variantes si existen)
  const getTotalStock = (product) => {
    if (product.variantes && Array.isArray(product.variantes)) {
      // Filtrar variantes nulas y sumar stock
      const validVariantes = product.variantes.filter(v => v !== null);
      return validVariantes.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
    }
    return 0;
  };

  // Obtiene precio mínimo
  const getMinPrice = (product) => {
    if (product.variantes && Array.isArray(product.variantes) && product.variantes.length > 0) {
      // Filtrar variantes nulas y obtener precios válidos
      const validVariantes = product.variantes.filter(v => v !== null && v.precio_venta);
      const prices = validVariantes.map(v => Number(v.precio_venta) || 0).filter(p => p > 0);
      return prices.length > 0 ? Math.min(...prices) : 0;
    }
    return product.precio || 0;
  };

 const handleDelete = async (product) => {
  if (!confirm(`¿Estás seguro de eliminar "${product.nombre}"?`)) return;

  try {
    await api.delete(`/admin/products/${product.slug}`); // usar slug
    setProducts(products.filter(p => p.id !== product.id)); // actualizar estado
    alert('Producto eliminado exitosamente');
  } catch (error) {
    console.error('❌ Error eliminando producto:', error);
    alert('Error al eliminar producto');
  }
};


  const filteredProducts = products.filter(product =>
    (product.nombre || product.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Mis Productos</h1>
          <p className="text-gray-600">Gestiona tu inventario</p>
        </div>
        <Link to="/admin/products/new" className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Nuevo Producto
        </Link>
      </div>

      {/* Filtros */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="input-field pl-10 appearance-none"
            >
              <option value="all">Todas las categorías</option>
              <option value="Patines">Patines</option>
              <option value="Cascos">Cascos</option>
              <option value="Protecciones">Protecciones</option>
              <option value="Accesorios">Accesorios</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando productos...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-600">No se encontraron productos</p>
            <Link to="/admin/products/new" className="btn-primary mt-4 inline-flex items-center gap-2">
              <Plus size={20} /> Agregar primer producto
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">ID</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Producto</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Categoría</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Stock</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Precio</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Estado</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => {
                  const totalStock = getTotalStock(product);
                  const minPrice = getMinPrice(product);

                  return (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-purple-50 transition-colors">
                      <td className="py-4 px-6">#{product.id}</td>
                      <td className="py-4 px-6">
                        <p className="font-semibold text-gray-800">{product.nombre}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{product.descripcion}</p>
                      </td>
                      <td className="py-4 px-6">
                        <span className="badge-primary">
                          {product.categoria_nombre || product.category?.name || 'Sin categoría'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`font-bold ${totalStock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                          {totalStock}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold gradient-text">
                          ${minPrice.toLocaleString('es-CO')}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {product.destacado && <span className="badge bg-yellow-100 text-yellow-700">⭐</span>}
                          {product.nuevo && <span className="badge bg-green-100 text-green-700">🆕</span>}
                          {!product.destacado && !product.nuevo && <span className="text-gray-400">-</span>}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/products/edit/${product.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(product)} // pasar todo el producto
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                          
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}