import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ProductsPage from './pages/ProductsPage';
import BuyersPage from './pages/BuyersPage';
import TransactionsPage from './pages/TransactionsPage';
import NotificationsPage from './pages/NotificationsPanel';  // ✅ Add this import
import PrivateRoute from './components/PrivateRoute';
import { ToastContainer } from 'react-toastify';

export default function App() {
  const isAuthenticated = !!localStorage.getItem('access_token');

  return (
    <>
      {/* Global Toast Notifications */}
      <ToastContainer position="top-right" autoClose={5000} />

      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={<PrivateRoute><Dashboard /></PrivateRoute>}
        />
        <Route
          path="/products"
          element={<PrivateRoute><ProductsPage /></PrivateRoute>}
        />
        <Route
          path="/buyers"
          element={<PrivateRoute><BuyersPage /></PrivateRoute>}
        />
        <Route
          path="/transactions"
          element={<PrivateRoute><TransactionsPage /></PrivateRoute>}
        />
        <Route
          path="/notifications"  // ✅ New route for notifications
          element={<PrivateRoute><NotificationsPage /></PrivateRoute>}
        />
      </Routes>
    </>
  );
}
