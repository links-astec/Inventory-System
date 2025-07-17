import { Link, useNavigate } from 'react-router-dom';

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <div className="font-bold text-lg">Inventory Manager</div>
        <div className="space-x-4">
          <Link to="/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
          <Link to="/products" className="text-blue-600 hover:underline">Products</Link>
          <Link to="/buyers" className="text-blue-600 hover:underline">Buyers</Link>
          <Link to="/transactions" className="text-blue-600 hover:underline">Transactions</Link>
          <button onClick={logout} className="text-red-600 hover:underline ml-4">Logout</button>
        </div>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  );
}
