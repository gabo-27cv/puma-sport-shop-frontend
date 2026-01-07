import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart, Share2, Minus, Plus, Check } from 'lucide-react';
import { productService } from '../services/product.service';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [slug]);

  const loadProduct = async () => {
    try {
      const data = await productService.getProductBySlug(slug); // /slug/:slug
      setProduct(data);
      if (data.variantes?.length > 0) {
        setSelectedVariant(data.variantes[0]);
      }
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (selectedVariant) {
      addToCart(product, selectedVariant, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Producto no encontrado</h2>
          <button onClick={() => navigate('/catalog')} className="btn-primary">
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 font-semibold"
        >
          <ArrowLeft size={20} />
          Volver
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="card mb-4 overflow-hidden">
              <div className="h-96 bg-gradient-to-br from-purple-100 to-pink-100">
                {product.imagenes?.[selectedImage] ? (
                  <img 
                    src={product.imagenes[selectedImage]} 
                    alt={product.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingCart size={96} className="text-purple-300" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Thumbnails */}
            {product.imagenes?.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.imagenes.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`card overflow-hidden ${selectedImage === index ? 'ring-4 ring-primary-500' : ''}`}
                  >
                    <img src={img} alt="" className="w-full h-20 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Category & Featured */}
            <div className="flex items-center gap-2 mb-4">
              <span className="badge-primary">
                {product.categoria_nombre || 'Sin categoría'}
              </span>
              {product.destacado && (
                <span className="badge bg-yellow-500 text-white">⭐ Destacado</span>
              )}
              {product.nuevo && (
                <span className="badge bg-green-500 text-white">🆕 Nuevo</span>
              )}
            </div>

            {/* Name */}
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {product.nombre}
            </h1>

            {/* Price */}
            <div className="mb-6">
              <p className="text-4xl font-bold gradient-text">
                ${selectedVariant?.precio_venta?.toLocaleString('es-CO') || '0'}
              </p>
              <p className="text-gray-500">COP</p>
            </div>

            {/* Description */}
            <div className="bg-purple-50 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-lg mb-2 text-gray-800">Descripción</h3>
              <p className="text-gray-700 leading-relaxed">{product.descripcion}</p>
            </div>

            {/* Variants */}
            {product.variantes?.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-4 text-gray-800">Selecciona una opción:</h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.variantes.map(variant => (
                    <button
                      key={variant.sku}
                      onClick={() => setSelectedVariant(variant)}
                      disabled={variant.stock === 0}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedVariant?.sku === variant.sku
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                      } ${variant.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="font-semibold text-gray-800">
                        {variant.color} - {variant.talla}
                      </div>
                      <div className="text-sm text-gray-600">
                        {variant.stock > 0 ? `${variant.stock} disponibles` : 'Agotado'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Warning */}
            {selectedVariant && selectedVariant.stock < 10 && selectedVariant.stock > 0 && (
              <div className="bg-yellow-50 border-2 border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6">
                ⚠️ ¡Solo quedan {selectedVariant.stock} unidades!
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-4 text-gray-800">Cantidad:</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <Minus size={20} />
                </button>
                <span className="text-2xl font-bold w-16 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(selectedVariant?.stock || 999, quantity + 1))}
                  className="w-12 h-12 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock === 0 || added}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {added ? (
                  <>
                    <Check size={20} />
                    ¡Agregado!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    Agregar al Carrito
                  </>
                )}
              </button>
              
              <button className="w-14 h-14 rounded-lg border-2 border-primary-500 text-primary-600 hover:bg-primary-50 transition-colors flex items-center justify-center">
                <Heart size={24} />
              </button>
              
              <button className="w-14 h-14 rounded-lg border-2 border-primary-500 text-primary-600 hover:bg-primary-50 transition-colors flex items-center justify-center">
                <Share2 size={24} />
              </button>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  ✓
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Envío Gratis</div>
                  <div className="text-sm text-gray-600">En compras mayores a $100,000</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  🛡️
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Garantía de Calidad</div>
                  <div className="text-sm text-gray-600">Productos 100% originales</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
