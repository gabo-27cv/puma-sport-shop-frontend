import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, getTotal, getItemsCount } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={96} className="mx-auto text-gray-300 mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-8">¡Agrega algunos productos increíbles!</p>
          <Link to="/catalog" className="btn-primary">
            Ir a Comprar
          </Link>
        </div>
      </div>
    );
  }

  const shippingCost = getTotal() >= 100000 ? 0 : 5000;
  const finalTotal = getTotal() + shippingCost;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold gradient-text mb-8">
          🛒 Mi Carrito ({getItemsCount()} productos)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <div key={index} className="card p-6">
                <div className="flex gap-6">
                  {/* Image */}
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.product.images?.[0] ? (
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag size={32} className="text-purple-300" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <Link 
                      to={`/product/${item.product.slug}`}
                      className="font-bold text-lg text-gray-800 hover:text-primary-600 transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.variant.color} • {item.variant.size}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      SKU: {item.variant.sku}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.variant.sku, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.variant.sku, item.quantity + 1)}
                          disabled={item.quantity >= item.variant.stock}
                          className="w-8 h-8 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product._id, item.variant.sku)}
                        className="text-red-600 hover:text-red-700 flex items-center gap-2 font-semibold"
                      >
                        <Trash2 size={18} />
                        Eliminar
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="text-2xl font-bold gradient-text">
                      ${(item.variant.salePrice * item.quantity).toLocaleString('es-CO')}
                    </p>
                    <p className="text-sm text-gray-500">
                      ${item.variant.salePrice.toLocaleString('es-CO')} c/u
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Resumen del Pedido</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal:</span>
                  <span className="font-semibold">${getTotal().toLocaleString('es-CO')}</span>
                </div>
                
                <div className="flex justify-between text-gray-700">
                  <span>Envío:</span>
                  <span className="font-semibold">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">¡GRATIS!</span>
                    ) : (
                      `$${shippingCost.toLocaleString('es-CO')}`
                    )}
                  </span>
                </div>
                
                {getTotal() < 100000 && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                    💡 Agrega ${(100000 - getTotal()).toLocaleString('es-CO')} más para envío gratis
                  </div>
                )}
                
                <div className="border-t-2 border-gray-200 pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span className="gradient-text">TOTAL:</span>
                    <span className="gradient-text">${finalTotal.toLocaleString('es-CO')}</span>
                  </div>
                  <p className="text-sm text-gray-500 text-right">COP</p>
                </div>
              </div>

              <Link to="/checkout" className="btn-primary w-full flex items-center justify-center gap-2">
                Finalizar Compra
                <ArrowRight size={20} />
              </Link>

              <Link 
                to="/catalog" 
                className="btn-secondary w-full mt-3 text-center block"
              >
                Seguir Comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}