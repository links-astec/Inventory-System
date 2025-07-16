import { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';
import ReusableModal from '../components/ReusableModal';

interface Transaction {
  id: number;
  buyer_name: string;
  product_name: string;
  quantity_sold: number;
  price_per_item: number;
  total_price: number;
  date_sold: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Buyer {
  id: number;
  name: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [buyers, setBuyers] = useState<Buyer[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedBuyer, setSelectedBuyer] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
    fetchProducts();
    fetchBuyers();
  }, []);

  const fetchTransactions = () => {
    api.get<Transaction[]>('transactions/')
      .then(res => setTransactions(res.data))
      .catch(() => alert('Failed to fetch transactions.'))
      .finally(() => setLoading(false));
  };

  const fetchProducts = () => {
    api.get<Product[]>('products/')
      .then(res => setProducts(res.data));
  };

  const fetchBuyers = () => {
    api.get<Buyer[]>('buyers/')
      .then(res => setBuyers(res.data));
  };

  const handleProductSelect = (productId: string) => {
    setSelectedProduct(productId);
    const product = products.find(p => String(p.id) === productId);
    if (product) {
      setPrice(String(product.price));  // Autofill price
    }
  };

  const handleAddTransaction = () => {
    if (!selectedProduct || !selectedBuyer || !quantity || !price) {
      alert('Please fill all fields.');
      return;
    }

    api.post('transactions/', {
      product: selectedProduct,
      buyer: selectedBuyer,
      quantity_sold: quantity,
      price_per_item: price,
    })
      .then(() => {
        fetchTransactions();
        setIsModalOpen(false);
        resetForm();
      })
      .catch(() => alert('Failed to add transaction.'));
  };

  const resetForm = () => {
    setSelectedProduct('');
    setSelectedBuyer('');
    setQuantity('');
    setPrice('');
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Transactions</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Transaction
        </button>
      </div>

      {loading ? (
        <p>Loading transactions...</p>
      ) : transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <table className="w-full bg-white rounded shadow text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Buyer</th>
              <th className="p-2 text-left">Product</th>
              <th className="p-2 text-right">Qty</th>
              <th className="p-2 text-right">Price</th>
              <th className="p-2 text-right">Total</th>
              <th className="p-2 text-right">Date</th>
            </tr>
          </thead>
          <tbody>
  {transactions.map(txn => (
    <tr key={txn.id} className="border-t">
      <td className="p-2">{txn.buyer_name}</td>
      <td className="p-2">{txn.product_name}</td>
      <td className="p-2 text-right">{txn.quantity_sold}</td>
      <td className="p-2 text-right">₵{Number(txn.price_per_item).toFixed(2)}</td>
      <td className="p-2 text-right">₵{Number(txn.total_price).toFixed(2)}</td>
<td>{txn.date_sold ? new Date(txn.date_sold).toLocaleString() : 'No Date'}</td>
    </tr>
  ))}
</tbody>

        </table>
      )}

      <ReusableModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        title="Add Transaction"
      >
        <div className="space-y-4">
          <select
            value={selectedProduct}
            onChange={e => handleProductSelect(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Product</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name} (Stock: {product.quantity})
              </option>
            ))}
          </select>

          <select
            value={selectedBuyer}
            onChange={e => setSelectedBuyer(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Buyer</option>
            {buyers.map(buyer => (
              <option key={buyer.id} value={buyer.id}>
                {buyer.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Quantity Sold"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Price per Item"
            value={price}
            onChange={e => setPrice(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <button
            onClick={handleAddTransaction}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
          >
            Save Transaction
          </button>
        </div>
      </ReusableModal>
    </Layout>
  );
}
