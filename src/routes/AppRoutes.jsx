import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Catalog from "../pages/Catalog";
import ProductDetail from "../pages/ProductDetail";
import Login from "../pages/Login";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Register from "../pages/Register";
import ProtectedRoute from "./ProtectedRoute";

// Admin Pages (si las tienes)
import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/admin/Products";
import NewProduct from "../pages/admin/NewProduct";
import Orders from "../pages/admin/Orders";

// Layouts
import AdminLayout from "../layouts/AdminLayout";

const AppRoutes = () => (
  <Routes>
    {/* Rutas públicas */}
    <Route path="/" element={<Home />} />
    <Route path="/catalogo" element={<Catalog />} />
    <Route path="/catalog" element={<Catalog />} /> {/* Alias por si acaso */}
    <Route path="/catalogo/:categoria" element={<Catalog />} />
    <Route path="/login" element={<Login />} />
    <Route path="/producto/:slug" element={<ProductDetail />} />
    <Route path="/product/:slug" element={<ProductDetail />} /> {/* Alias */}
    <Route path="/carrito" element={<Cart />} />
    <Route path="/cart" element={<Cart />} /> {/* Alias */}
    <Route path="/checkout" element={<Checkout />} />
    <Route path="/register" element={<Register />} />

    {/* Rutas de Admin */}
    <Route 
      path="/admin/*" 
      element={
        <ProtectedRoute adminOnly>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Dashboard />} />
      <Route path="products" element={<Products />} />
      <Route path="products/new" element={<NewProduct />} />
      <Route path="products/edit/:id" element={<NewProduct />} />
      <Route path="orders" element={<Orders />} />
    </Route>

    {/* Redirección para /admin sin /* */}
    <Route 
      path="/admin" 
      element={
        <ProtectedRoute adminOnly>
          <Navigate to="/admin/" replace />
        </ProtectedRoute>
      } 
    />

    {/* 404 - Redirigir al home */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;