import React from 'react';
import DataTable from './DataTable';
import { Sale } from '../../types/admin';

interface SalesTableProps {
  sales: Sale[];
  filters: {
    user: string;
    date: string;
    product: string;
  };
  onFilterChange: (filters: { user: string; date: string; product: string }) => void;
}

const SalesTable: React.FC<SalesTableProps> = ({
  sales,
  filters,
  onFilterChange
}) => {
  const filteredSales = sales.filter(sale => {
    if (filters.user && !sale.user.toLowerCase().includes(filters.user.toLowerCase())) return false;
    if (filters.product && !sale.product.toLowerCase().includes(filters.product.toLowerCase())) return false;
    if (filters.date && sale.date !== filters.date) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Sales Overview</h2>
      <div className="flex gap-4 mb-4">
        <input 
          type="text" 
          placeholder="Filter by user" 
          value={filters.user} 
          onChange={e => onFilterChange({ ...filters, user: e.target.value })} 
          className="border border-gray-300 rounded-lg px-3 py-2"
          aria-label="Filter sales by user"
        />
        <input 
          type="date" 
          title="Filter by date" 
          value={filters.date} 
          onChange={e => onFilterChange({ ...filters, date: e.target.value })} 
          className="border border-gray-300 rounded-lg px-3 py-2"
          aria-label="Filter sales by date"
        />
        <input 
          type="text" 
          placeholder="Filter by product" 
          value={filters.product} 
          onChange={e => onFilterChange({ ...filters, product: e.target.value })} 
          className="border border-gray-300 rounded-lg px-3 py-2"
          aria-label="Filter sales by product"
        />
      </div>
      <DataTable
        data={filteredSales}
        headers={['ID', 'User', 'Product', 'Date', 'Amount', 'Status']}
        renderRow={(sale) => (
          <tr key={sale.id}>
            <td className="px-6 py-4 font-medium text-gray-900">{sale.id}</td>
            <td className="px-6 py-4 text-gray-700">{sale.user}</td>
            <td className="px-6 py-4 text-gray-700">{sale.product}</td>
            <td className="px-6 py-4 text-gray-700">{sale.date}</td>
            <td className="px-6 py-4 text-gray-700">GH₵{sale.amount}</td>
            <td className="px-6 py-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                sale.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                sale.status === 'Refunded' ? 'bg-orange-100 text-orange-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {sale.status}
              </span>
            </td>
          </tr>
        )}
      />
    </div>
  );
};

export default SalesTable;
