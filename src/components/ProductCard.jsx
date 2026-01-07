import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addItem } = useCart();

  // Soportar ambos formatos (PostgreSQL y adaptado)
  const productName = product.nombre || product.name;
  const productSlug = product.slug;
  const productDescription = product.descripcion || product.description;
  const productCategory = product.categoria_nombre || product.category?.name || 'Sin categoría';
  const productFeatured = product.destacado ?? product.featured ?? false;
  const productNew = product.nuevo ?? product.isNew ?? false;

  // Calcular precio desde variantes o usar precio base
  let minPrice = product.precio || 150000; // Precio por defecto
  const productVariants = product.variantes || product.variants || [];
  
  if (productVariants && productVariants.length > 0) {
    const prices = productVariants
      .map(v => v.precio_venta || v.salePrice || 0)
      .filter(p => p > 0);
    if (prices.length > 0) {
      minPrice = Math.min(...prices);
    }
  }

  // Imagen principal
  const productImages = product.imagenes || product.images || [];
  const mainImage = productImages[0] || 
    `https://via.placeholder.com/400x400/d946ef/ffffff?text=${encodeURIComponent(productName?.substring(0, 15) || 'Producto')}`;

  // Stock total
  const totalStock = productVariants.reduce((sum, v) => sum + (v.stock || 0), 0);

  return (
    <div className="card group">
      <Link to={`/product/${productSlug}`}>
        {/* Imagen */}
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
          <img 
            src={mainImage} 
            alt={productName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/400x400/d946ef/ffffff?text=${encodeURIComponent(productName?.substring(0, 15) || 'Producto')}`;
            }}
          />
          
          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {productFeatured && (
              <span className="badge-primary animate-pulse">⭐ Destacado</span>
            )}
            {productNew && (
              <span className="badge bg-green-500 text-white">🆕 Nuevo</span>
            )}
          </div>

          {/* Stock bajo */}
          {totalStock > 0 && totalStock < 10 && (
            <div className="absolute bottom-3 left-3">
              <span className="badge-warning">⚠️ Solo {totalStock} disponibles</span>
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-5">
          {/* Categoría */}
          <p className="text-sm text-primary-600 font-semibold mb-2 uppercase tracking-wide">
            {productCategory}
          </p>

          {/* Nombre */}
          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {productName}
          </h3>

          {/* Descripción */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {productDescription}
          </p>

          {/* Precio */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-2xl font-bold gradient-text">
                ${minPrice.toLocaleString('es-CO')}
              </p>
              <p className="text-xs text-gray-500">COP</p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-4 pb-4 border-b border-purple-100">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
            ))}
            <span className="text-xs text-gray-500 ml-2">(4.8)</span>
          </div>
        </div>
      </Link>

      {/* Botón fuera del Link para que no navegue */}
      <div className="px-5 pb-5">
        <button
          className="btn-primary w-full flex items-center justify-center gap-2"
          onClick={(e) => {
            e.preventDefault();
            addItem(product, 1);
          }}
        >
          <ShoppingCart size={20} />
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}

export default ProductCard;