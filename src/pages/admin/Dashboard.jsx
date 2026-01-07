import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div>
      <h1>Panel de Administración</h1>

      <ul>
        <li><Link to="/admin/products">Productos</Link></li>
        <li><Link to="/admin/orders">Órdenes</Link></li>
      </ul>
    </div>
  );
}
