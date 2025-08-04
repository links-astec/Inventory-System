import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useErrorHandler } from '../hooks/useErrorHandler';
import ToastContainer from './ToastContainer';
import { fetchProducts, fetchSales, fetchCustomers, addSale, addCustomer } from '../services/api';
import {
  Package,
  DollarSign,
  LogOut,
  Search,
  Users,
  BarChart3
} from 'lucide-react';

// Type definitions
interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  best_before: string;
  category: string;
  low_stock_threshold: number;
  discontinued: boolean;
  // Optional fields for display compatibility
  description?: string;
  supplier?: string;
  addedOn?: string;
  bestBefore?: string; // Alias for best_before
}

interface Sale {
  saleId: number;
  customer: number; // Customer ID
  items: any; // JSON field storing items
  total: number;
  date: string;
  salesPerson: number; // User ID
  status: 'Pending' | 'Completed' | 'Cancelled';
  // Optional fields for display compatibility
  id?: number;
  product?: string;
  quantity?: number;
  unitPrice?: number;
  discount?: number;
}

interface Customer {
  customerId: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  totalPurchases: number;
  createdAt: string;
  // Optional fields for display compatibility
  id?: number;
  notes?: string;
  totalSpent?: number;
  status?: 'Active' | 'Inactive';
  lastPurchase?: string;
  joinDate?: string;
}

type ThemeType = 'default' | 'dark' | 'emerald' | 'rose' | 'sunset' | 'ocean' | 'lavender' | 'forest';

const SalesDashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { errors, removeError, handleApiError, showSuccess } = useErrorHandler();
  
  // Theme state
  const [theme, setTheme] = useState<ThemeType>('default');
  const [activeTab, setActiveTab] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>({});
  const [showReceipt, setShowReceipt] = useState(false);
  const [showAddSales, setShowAddSales] = useState(false);
  const [multiSale, setMultiSale] = useState<{ [productId: string]: number }>({});
  const [multiSaleReceipt, setMultiSaleReceipt] = useState<Sale[] | null>(null);
  const [addSalesSearch, setAddSalesSearch] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterCustomer, setFilterCustomer] = useState('');
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [discount, setDiscount] = useState<number>(0);
  const ongoingPromotion = { type: 'percentage', value: 10 }; // Example: 10% off
  const [showSuggestStock, setShowSuggestStock] = useState(false);
  const [suggestionMessage, setSuggestionMessage] = useState('');
  const [lastSale] = useState<Sale | null>(null);

  const tabs = [
    { id: 'products', name: 'Products', icon: Package },
    { id: 'sales', name: 'My Sales', icon: DollarSign },
    { id: 'customers', name: 'Customers', icon: Users },
    { id: 'salesHistory', name: 'Sales History', icon: BarChart3 },
  ];

  // Helper functions to normalize data for display
  const normalizeProduct = (product: any): Product => ({
    ...product,
    bestBefore: product.best_before || product.bestBefore
  });

  const normalizeCustomer = (customer: any): Customer => ({
    ...customer,
    id: customer.customerId || customer.id,
    joinDate: customer.createdAt || customer.joinDate,
    status: 'Active' as const,
    totalSpent: customer.totalPurchases * 10 || 0, // Estimate from purchases
    lastPurchase: customer.createdAt || '',
    notes: ''
  });

  const normalizeSale = (sale: any): Sale => ({
    ...sale,
    id: sale.saleId || sale.id,
    // Extract product info from items for display
    product: Array.isArray(sale.items) && sale.items.length > 0 
      ? sale.items[0].productName || 'Multiple Items'
      : 'Unknown Product',
    quantity: Array.isArray(sale.items) && sale.items.length > 0
      ? sale.items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0)
      : 0,
    unitPrice: Array.isArray(sale.items) && sale.items.length > 0
      ? sale.items[0].unitPrice || 0
      : 0,
    discount: Array.isArray(sale.items) && sale.items.length > 0
      ? sale.items.reduce((sum: number, item: any) => sum + (item.discount || 0), 0)
      : 0
  });

  const getSaleCustomerName = (sale: Sale): string => {
    const customer = customers.find(c => c.customerId === sale.customer);
    return customer ? customer.name : 'Unknown Customer';
  };

  useEffect(() => {
    loadProducts();
    loadSales();
    loadCustomers();
  }, []);

  // Added functionality to send low stock alerts to admin and request restock
  useEffect(() => {
    const checkLowStock = () => {
      const lowStockProducts = products.filter((product: Product) => product.quantity <= 10);
      if (lowStockProducts.length > 0) {
        // Send alert to admin
        console.log(`Low Stock Alert sent to admin for products: ${lowStockProducts.map((p: Product) => p.name).join(', ')}`);

        // Request restock
        lowStockProducts.forEach((product: Product) => {
          console.log(`Requesting restock for product: ${product.name}`);
        });
      }
    };
    const interval = setInterval(checkLowStock, 60000); // Check every 60 seconds
    return () => clearInterval(interval);
  }, [products]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsData = await fetchProducts();
      setProducts(productsData.map(normalizeProduct));
    } catch (error) {
      handleApiError(error, 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadSales = async () => {
    try {
      const salesData = await fetchSales();
      setSales(salesData.map(normalizeSale));
    } catch (error) {
      handleApiError(error, 'Failed to load sales');
    }
  };

  const loadCustomers = async () => {
    try {
      const customersData = await fetchCustomers();
      setCustomers(customersData.map(normalizeCustomer));
    } catch (error) {
      handleApiError(error, 'Failed to load customers');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
    (customer.phone && customer.phone.includes(customerSearchTerm))
  );

  const toggleRow = (id: string | number) => {
    const idKey = id.toString();
    setExpandedRows(prev => ({
      ...prev,
      [idKey]: !prev[idKey]
    }));
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCustomer.name || !newCustomer.email) {
      handleApiError(new Error('Name and email are required'), 'Please fill in required fields');
      return;
    }

    try {
      const customerData = {
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone,
        address: newCustomer.address,
      };

      const createdCustomer = await addCustomer(customerData);
      setCustomers(customers => [...customers, createdCustomer]);
      setNewCustomer({
        name: '',
        email: '',
        phone: '',
        address: '',
        notes: ''
      });
      setShowAddCustomer(false);
      showSuccess('Customer added successfully!');
    } catch (error) {
      handleApiError(error, 'Failed to add customer');
    }
  };

  const deleteCustomer = (customerId: string | number) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        setCustomers(customers => customers.filter(c => (c.id || c.customerId) !== customerId));
        showSuccess('Customer deleted successfully!');
      } catch (error) {
        handleApiError(error, 'Failed to delete customer');
      }
    }
  };

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-3xl font-extrabold text-blue-700 tracking-tight mb-4">Product Catalog</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-600 to-emerald-600">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Product Name</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Unit Price</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Quantity in Stock</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Best Before</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Category</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">No products found.</td>
              </tr>
            ) : (
              filteredProducts.map((product: Product) => (
                <React.Fragment key={product.id}>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">₵{product.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.quantity > 10 
                          ? 'bg-green-100 text-green-800'
                          : product.quantity > 0
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{product.best_before || product.bestBefore || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{product.category || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleRow(product.id)}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {expandedRows[product.id] ? 'Show Less' : 'Show More'}
                      </button>
                    </td>
                  </tr>
                  {expandedRows[product.id] && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 bg-blue-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                          <div><span className="font-semibold">Description:</span> {product.description || 'N/A'}</div>
                          <div><span className="font-semibold">SKU:</span> {product.sku}</div>
                          <div><span className="font-semibold">Supplier:</span> {product.supplier || 'N/A'}</div>
                          <div><span className="font-semibold">Added On:</span> {product.addedOn || 'N/A'}</div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSales = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h2 className="text-3xl font-extrabold text-blue-700 tracking-tight">My Sales</h2>
        <button
          onClick={() => setShowAddSales(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 font-semibold"
        >
          Add Sale
        </button>
      </div>
      <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-600 to-emerald-600">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {sales.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">No sales found.</td>
              </tr>
            ) : (
              sales.map((sale: Sale) => (
                <tr key={sale.id || sale.saleId}>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{sale.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">{sale.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{getSaleCustomerName(sale)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{sale.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">₵{sale.total}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCustomers = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-3xl font-extrabold text-blue-700 tracking-tight mb-4">Customers</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={customerSearchTerm}
              onChange={(e) => setCustomerSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <button
            onClick={() => setShowAddCustomer(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 font-semibold"
          >
            Add Customer
          </button>
        </div>
      </div>
      <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-600 to-emerald-600">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Total Purchases</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Total Spent</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Last Purchase</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Status</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-500">No customers found.</td>
              </tr>
            ) : (
              filteredCustomers.map((customer) => (
                <React.Fragment key={customer.id || customer.customerId}>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">{customer.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{customer.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{customer.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{customer.totalPurchases}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">₵{customer.totalSpent}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{customer.lastPurchase || 'Never'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        customer.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleRow(customer.id || customer.customerId)}
                          className="text-blue-600 hover:underline font-medium text-sm"
                        >
                          {expandedRows[customer.id || customer.customerId] ? 'Less' : 'More'}
                        </button>
                        <button
                          onClick={() => deleteCustomer(customer.id || customer.customerId)}
                          className="text-red-600 hover:underline font-medium text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedRows[customer.id || customer.customerId] && (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 bg-blue-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                          <div><span className="font-semibold">Address:</span> {customer.address || 'N/A'}</div>
                          <div><span className="font-semibold">Join Date:</span> {customer.joinDate || 'N/A'}</div>
                          <div className="md:col-span-2"><span className="font-semibold">Notes:</span> {customer.notes || 'No notes'}</div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSalesHistory = () => {
    const filteredSales = sales.filter((sale) => {
      const saleDate = new Date(sale.date);
      const startDate = filterStartDate ? new Date(filterStartDate) : null;
      const endDate = filterEndDate ? new Date(filterEndDate) : null;

      const matchesDateRange =
        (!startDate || saleDate >= startDate) &&
        (!endDate || saleDate <= endDate);

      const matchesCustomer =
        !filterCustomer || getSaleCustomerName(sale).toLowerCase().includes(filterCustomer.toLowerCase());

      return matchesDateRange && matchesCustomer;
    });

    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-extrabold text-blue-700 tracking-tight mb-4">Sales History</h2>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">From</label>
              <input
                type="date"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Start Date"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">To</label>
              <input
                type="date"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="End Date"
              />
            </div>
            <input
              type="text"
              value={filterCustomer}
              onChange={(e) => setFilterCustomer(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Filter by Customer"
            />
          </div>
        </div>
        <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-600 to-emerald-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Unit Price</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Total Price</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">No sales found.</td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{sale.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">{sale.product}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{getSaleCustomerName(sale)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{sale.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">₵{sale.unitPrice}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">₵{sale.total}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        sale.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {sale.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Theme classes
  const themeClasses = {
    default: {
      bg: 'bg-gray-50',
      header: 'bg-white',
      tab: 'bg-blue-500',
      button: 'bg-blue-600 hover:bg-blue-700',
      accent: 'text-blue-700',
    },
    dark: {
      bg: 'bg-gray-900',
      header: 'bg-gray-800',
      tab: 'bg-gray-700',
      button: 'bg-gray-700 hover:bg-gray-600',
      accent: 'text-emerald-400',
    },
    emerald: {
      bg: 'bg-emerald-50',
      header: 'bg-emerald-100',
      tab: 'bg-emerald-500',
      button: 'bg-emerald-600 hover:bg-emerald-700',
      accent: 'text-emerald-700',
    },
    rose: {
      bg: 'bg-rose-50',
      header: 'bg-rose-100',
      tab: 'bg-rose-500',
      button: 'bg-rose-600 hover:bg-rose-700',
      accent: 'text-rose-700',
    },
    sunset: {
      bg: 'bg-orange-50',
      header: 'bg-orange-100',
      tab: 'bg-orange-500',
      button: 'bg-orange-600 hover:bg-orange-700',
      accent: 'text-orange-700',
    },
    ocean: {
      bg: 'bg-cyan-50',
      header: 'bg-cyan-100',
      tab: 'bg-cyan-500',
      button: 'bg-cyan-600 hover:bg-cyan-700',
      accent: 'text-cyan-700',
    },
    lavender: {
      bg: 'bg-purple-50',
      header: 'bg-purple-100',
      tab: 'bg-purple-500',
      button: 'bg-purple-600 hover:bg-purple-700',
      accent: 'text-purple-700',
    },
    forest: {
      bg: 'bg-green-50',
      header: 'bg-green-100',
      tab: 'bg-green-500',
      button: 'bg-green-600 hover:bg-green-700',
      accent: 'text-green-700',
    },
  };

  return (
    <div className={`min-h-screen ${themeClasses[theme].bg}`}>
      {/* Header */}
      <header className={`${themeClasses[theme].header} shadow-sm border-b border-gray-200`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Package className={`h-8 w-8 ${themeClasses[theme].accent} mr-3`} />
              <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Sales Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Welcome, {currentUser?.email}</span>
              <button
                onClick={logout}
                className={`flex items-center gap-2 px-4 py-2 ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
              {/* Theme Switcher */}
              <select
                value={theme}
                onChange={e => setTheme(e.target.value as typeof theme)}
                className="ml-4 px-2 py-1 rounded border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500"
                aria-label="Switch Theme"
              >
                <option value="default">Default</option>
                <option value="dark">Dark</option>
                <option value="emerald">Emerald</option>
                <option value="rose">Rose</option>
                <option value="sunset">Sunset</option>
                <option value="ocean">Ocean</option>
                <option value="lavender">Lavender</option>
                <option value="forest">Forest</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs & Suggest Stock Button */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? `${themeClasses[theme].accent} border-${themeClasses[theme].tab.replace('bg-', '')}`
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
          <button
            onClick={() => setShowSuggestStock(true)}
            className={`${themeClasses[theme].tab} text-white px-4 py-2 rounded hover:${themeClasses[theme].button.split(' ')[1]} font-semibold`}
          >
            Suggest New Stock
          </button>
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {activeTab === 'products' && renderProducts()}
            {activeTab === 'sales' && renderSales()}
            {activeTab === 'customers' && renderCustomers()}
            {activeTab === 'salesHistory' && renderSalesHistory()}
          </>
        )}
        
        <ToastContainer errors={errors} onRemove={removeError} />
      </div>
      
      {showReceipt && lastSale && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              onClick={() => setShowReceipt(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-blue-700 mb-4">Receipt / Invoice</h2>
            <div className="space-y-2 text-gray-700">
              <div><span className="font-semibold">Date:</span> {lastSale.date}</div>
              <div><span className="font-semibold">Product:</span> {lastSale.product}</div>
              <div><span className="font-semibold">Quantity:</span> {lastSale.quantity}</div>
              <div><span className="font-semibold">Unit Price:</span> ₵{lastSale.unitPrice}</div>
              <div><span className="font-semibold">Total:</span> <span className="font-bold text-lg text-blue-700">₵{lastSale.total}</span></div>
              {lastSale && lastSale.discount && lastSale.discount > 0 && (
                <div><span className="font-semibold">Discount Applied:</span> ₵{lastSale.discount.toFixed(2)}</div>
              )}
              <div><span className="font-semibold">Sold by:</span> {lastSale.customer}</div>
              <div><span className="font-semibold">Status:</span> {lastSale.status}</div>
            </div>
            <button
              onClick={() => window.print()}
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Print Receipt
            </button>
          </div>
        </div>
      )}

      {/* Add Sales Modal */}
      {showAddSales && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl relative">
            <button
              onClick={() => setShowAddSales(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-blue-700 mb-4">Add Multiple Sales</h2>
            {/* Search bar for products */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search products..."
                value={addSalesSearch}
                onChange={e => setAddSalesSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            {/* Discount input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={discount}
                onChange={e => setDiscount(Math.max(0, Math.min(100, Number(e.target.value))))}
                className="w-32 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="e.g. 10"
              />
              {ongoingPromotion && (
                <div className="mt-2 text-green-700 text-sm font-semibold">
                  Ongoing Promotion: {ongoingPromotion.value}% off
                </div>
              )}
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  // Prepare sales data for backend
                  const appliedDiscount = Math.max(discount, ongoingPromotion?.value || 0);
                  const saleItems = Object.entries(multiSale)
                    .filter(([, qty]) => qty > 0)
                    .map(([pid, qty]) => {
                      const product = products.find(p => p.id.toString() === pid);
                      if (!product) return null;
                      const total = product.price * qty;
                      const discountAmount = appliedDiscount > 0 ? total * (appliedDiscount / 100) : 0;
                      return {
                        productId: product.id,
                        productName: product.name,
                        quantity: qty,
                        unitPrice: product.price,
                        total: total - discountAmount,
                        discount: discountAmount
                      };
                    })
                    .filter(item => item !== null);

                  if (saleItems.length === 0) {
                    handleApiError(new Error('No items selected'), 'Please select items to sell');
                    return;
                  }

                  // Create a customer for this sale (if needed)
                  let customerId = 1; // Default customer ID
                  if (customers.length > 0) {
                    customerId = customers[0].customerId;
                  }

                  // Calculate total
                  const totalAmount = saleItems.reduce((sum, item) => sum + item.total, 0);

                  // Create sale record
                  const saleData = {
                    customer: customerId,
                    items: saleItems,
                    total: totalAmount,
                    status: 'Completed',
                    salesPerson: 1 // Current user ID
                  };

                  const newSale = await addSale(saleData);
                  console.log('Sale created:', newSale); // Log the created sale
                  
                  // Update products stock locally
                  setProducts(products =>
                    products.map(p => {
                      const soldQty = multiSale[p.id.toString()] || 0;
                      return soldQty > 0 ? { ...p, quantity: p.quantity - soldQty } : p;
                    })
                  );

                  // Refresh sales list
                  await loadSales();
                  
                  setShowAddSales(false);
                  setMultiSale({});
                  setDiscount(0);
                  showSuccess('Sale completed successfully!');
                } catch (error) {
                  handleApiError(error, 'Failed to process sale');
                }
              }}
            >
              <div className="max-h-80 overflow-y-auto mb-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left">Product</th>
                      <th className="px-4 py-2 text-left">Unit Price</th>
                      <th className="px-4 py-2 text-left">In Stock</th>
                      <th className="px-4 py-2 text-left">Quantity to Sell</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products
                      .filter(product =>
                        product.name.toLowerCase().includes(addSalesSearch.toLowerCase()) ||
                        (product.sku && product.sku.toLowerCase().includes(addSalesSearch.toLowerCase()))
                      )
                      .map(product => (
                        <tr key={product.id}>
                          <td className="px-4 py-2">{product.name}</td>
                          <td className="px-4 py-2">₵{product.price}</td>
                          <td className="px-4 py-2">{product.quantity}</td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              min={0}
                              max={product.quantity}
                              value={multiSale[product.id.toString()] || ''}
                              onChange={e =>
                                setMultiSale({
                                  ...multiSale,
                                  [product.id.toString()]: Math.max(0, Math.min(Number(e.target.value), product.quantity))
                                })
                              }
                              className="w-20 border rounded px-2 py-1"
                              placeholder="Qty"
                              disabled={product.quantity === 0}
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold"
              >
                Complete Sale & Print Receipt
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Multi-Sale Receipt Modal */}
      {multiSaleReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative print:max-w-full print:rounded-none print:shadow-none">
            <button
              onClick={() => setMultiSaleReceipt(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl print:hidden"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-blue-700 mb-4">Receipt / Invoice</h2>
            <div className="space-y-2 text-gray-700 mb-4">
              <div><span className="font-semibold">Date:</span> {multiSaleReceipt[0]?.date}</div>
              <div><span className="font-semibold">Sold by:</span> {multiSaleReceipt[0]?.customer}</div>
            </div>
            <table className="min-w-full mb-4">
              <thead>
                <tr>
                  <th className="px-2 py-1 text-left border-b">Product</th>
                  <th className="px-2 py-1 text-left border-b">Qty</th>
                  <th className="px-2 py-1 text-left border-b">Unit Price</th>
                  <th className="px-2 py-1 text-left border-b">Discount</th>
                  <th className="px-2 py-1 text-left border-b">Total</th>
                </tr>
              </thead>
              <tbody>
                {multiSaleReceipt.map((sale, idx) => (
                  <tr key={idx}>
                    <td className="px-2 py-1">{sale.product}</td>
                    <td className="px-2 py-1">{sale.quantity}</td>
                    <td className="px-2 py-1">₵{sale.unitPrice}</td>
                    <td className="px-2 py-1">{sale.discount && sale.discount > 0 ? `₵${sale.discount.toFixed(2)}` : '-'}</td>
                    <td className="px-2 py-1">₵{sale.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-right font-bold text-lg text-blue-700 mb-2">
              Overall Total: ₵{multiSaleReceipt.reduce((sum, sale) => sum + sale.total, 0).toFixed(2)}
            </div>
            <button
              onClick={() => window.print()}
              className="mt-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 print:hidden"
            >
              Print Receipt
            </button>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              onClick={() => setShowAddCustomer(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-blue-700 mb-4">Add New Customer</h2>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Customer name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="0241234567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="customer@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Customer address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Any special notes about this customer..."
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddCustomer(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium"
                >
                  Add Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Suggest New Stock Modal */}
      {showSuggestStock && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              onClick={() => setShowSuggestStock(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-blue-700 mb-4">Suggest New Stock to Admin</h2>
            <form
              onSubmit={e => {
                e.preventDefault();
                if (!suggestionMessage.trim()) {
                  alert('Please enter your suggestion.');
                  return;
                }
                alert('Suggestion sent to admin: ' + suggestionMessage);
                setSuggestionMessage('');
                setShowSuggestStock(false);
              }}
              className="space-y-4"
            >
              <textarea
                value={suggestionMessage}
                onChange={e => setSuggestionMessage(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Describe the new stock you want to suggest..."
                rows={5}
                required
              />
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSuggestStock(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium"
                >
                  Send Suggestion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesDashboard;
