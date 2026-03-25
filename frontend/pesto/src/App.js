import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/Login';
import Register from './pages/Register';
import Setup from './pages/setup';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import AdminUsers from './pages/AdminUsers';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/login"         element={<Login />} />
          <Route path="/register"      element={<Register />} />
          <Route path="/setup"         element={<Setup />} />
          <Route path="/checkout"      element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/profile"       element={<Profile />} />
          <Route path="/admin"         element={<AdminDashboard />} />
          <Route path="/admin/orders"  element={<AdminOrders />} />
          <Route path="/admin/users"   element={<AdminUsers />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;