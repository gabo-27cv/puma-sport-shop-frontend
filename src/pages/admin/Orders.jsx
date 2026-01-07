import { useState } from 'react';
import { Eye, Filter } from 'lucide-react';

export default function Orders() {
  const [filter, setFilter] = useState('all');
  
  // Datos de ejemplo - conectar con API real
  const orders = [
    {
      id: 'ORD-2412-0001',
      customer: { name: 'Juan Pérez', email: 'juan@email.com', phone: '0999999999' },
      items: [
        { name: 'Black Magic Pro', quantity: 1, price: 430000 },
        { name: 'Casco B3-30', quantity: 2, price: 230000 }
      ],
      total: 895000,
      status: 'pending',
      paymentMethod: 'transfer',
      address: 'Av. Principal 123, Portoviejo',
      date: '2024-12-29T10:30:00'
    },
    {
      id: 'ORD-2412-0002',
      customer: { name: 'María López', email: 'maria@email.com', phone: '0988888888' },
      items: [
        { name: 'Casco B3-30', quantity: 1, price: 230000 }
      ],
      total: 230000,
      status: 'shipped',
      paymentMethod: 'cash',
      address: 'Calle Secundaria 456, Manta',
      date: '2024-12-28T15:20:00'
    },
    {
      id: 'ORD-2412-0003',
      customer: { name: 'Carlos Ruiz', email: 'carlos@email.com', phone: '0977777777' },
      items: [
        { name: 'Black Magic Pro', quantity: 1, price: 430000 }
      ],
      total: 430000,
      status: 'delivered',
      paymentMethod: 'transfer',
      address: 'Barrio Centro, Portoviejo',
      date: '2024-12-27T09:15:00'
    }
  ];

  const statusConfig = {
    pending: { label: 'Pendiente', color: 'badge-warning' },
    confirmed: { label: 'Confirmada', color: 'bg-blue-100 text-blue-700' },
    shipped: { label: 'Enviada', color: 'bg-purple-100 text-purple-700' },
    delivered: { label: 'Entregada', color: 'badge-success' },
    cancelled: { label: 'Cancelada', color: 'bg-red-100 text-red-700' }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  const handleStatusChange = (orderId, newStatus) => {
    console.log('Cambiar estado:', orderId, newStatus);
    alert(`Estado de orden ${orderId} cambiado a: ${statusConfig[newStatus].label}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">Órdenes</h1>
        <p className="text-gray-600">Gestiona los pedidos de tus clientes</p>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="flex items-center gap-4 flex-wrap">
          <Filter className="text-gray-400" size={20} />
          {[
            { value: 'all', label: 'Todas' },
            { value: 'pending', label: 'Pendientes' },
            { value: 'confirmed', label: 'Confirmadas' },
            { value: 'shipped', label: 'Enviadas' },
            { value: 'delivered', label: 'Entregadas' }
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === value
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                  : 'bg-purple-50 text-gray-700 hover:bg-purple-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-gray-600">No hay órdenes en esta categoría</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="card p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{order.id}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.date).toLocaleString('es-EC', {
                      dateStyle: 'long',
                      timeStyle: 'short'
                    })}
                  </p>
                </div>
                <span className={`badge ${statusConfig[order.status].color}`}>
                  {statusConfig[order.status].label}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Customer Info */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-bold text-gray-800 mb-3">👤 Cliente</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-semibold">Nombre:</span> {order.customer.name}</p>
                    <p><span className="font-semibold">Email:</span> {order.customer.email}</p>
                    <p><span className="font-semibold">Teléfono:</span> {order.customer.phone}</p>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-bold text-gray-800 mb-3">📦 Entrega</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-semibold">Dirección:</span> {order.address}</p>
                    <p>
                      <span className="font-semibold">Pago:</span>{' '}
                      {order.paymentMethod === 'transfer' ? 'Transferencia' : 'Contra entrega'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="mb-6">
                <h4 className="font-bold text-gray-800 mb-3">🛒 Productos</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <div>
                        <span className="font-semibold text-gray-800">{item.name}</span>
                        <span className="text-gray-600 ml-2">x{item.quantity}</span>
                      </div>
                      <span className="font-bold gradient-text">
                        ${(item.price * item.quantity).toLocaleString('es-CO')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total and Actions */}
              <div className="flex items-center justify-between pt-4 border-t-2 border-purple-100">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total</p>
                  <p className="text-3xl font-bold gradient-text">
                    ${order.total.toLocaleString('es-CO')}
                  </p>
                </div>

                <div className="flex gap-3">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="input-field"
                  >
                    <option value="pending">Pendiente</option>
                    <option value="confirmed">Confirmada</option>
                    <option value="shipped">Enviada</option>
                    <option value="delivered">Entregada</option>
                    <option value="cancelled">Cancelada</option>
                  </select>

                  <button className="btn-secondary flex items-center gap-2">
                    <Eye size={20} />
                    Ver Detalle
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}