// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import StartingPage from './components/StartingPage';
import Login from './components/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import SalesDashboard from './components/SalesDashboard';

const AppContent: React.FC = () => {
  const { currentUser, showStartingPage } = useAuth();

  if (showStartingPage) {
    return <StartingPage />;
  }

  if (!currentUser) {
    return <Login />;
  }

  return (
    <Routes>
      <Route
        path="/admin"
        element={
          currentUser.role === 'admin' ? (
            <AdminDashboard />
          ) : (
            <Navigate to="/sales" replace />
          )
        }
      />
      <Route
        path="/sales"
        element={
          currentUser.role === 'sales' ? (
            <SalesDashboard />
          ) : (
            <Navigate to="/admin" replace />
          )
        }
      />
      <Route
        path="*"
        element={
          currentUser.role === 'admin' ? (
            <Navigate to="/admin" replace />
          ) : (
            <Navigate to="/sales" replace />
          )
        }
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
