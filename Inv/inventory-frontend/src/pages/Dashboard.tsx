import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';

export default function Dashboard() {
  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <Link to="/notifications" className="text-blue-600 hover:text-blue-800">
          <FaBell size={22} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/products"
          className="bg-blue-600 text-white p-6 rounded-xl shadow hover:bg-blue-700 transition"
        >
          <h2 className="text-lg font-semibold">Manage Products</h2>
          <p className="mt-2 text-sm">Add, update, or remove inventory items.</p>
        </Link>

        <Link
          to="/buyers"
          className="bg-green-600 text-white p-6 rounded-xl shadow hover:bg-green-700 transition"
        >
          <h2 className="text-lg font-semibold">Manage Buyers</h2>
          <p className="mt-2 text-sm">View and manage your customers easily.</p>
        </Link>

        <Link
          to="/transactions"
          className="bg-purple-600 text-white p-6 rounded-xl shadow hover:bg-purple-700 transition"
        >
          <h2 className="text-lg font-semibold">View Transactions</h2>
          <p className="mt-2 text-sm">Track all your sales and transactions.</p>
        </Link>
      </div>
    </Layout>
  );
}
