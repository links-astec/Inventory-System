import React from 'react';
import { AlertTriangle } from 'lucide-react';
import DataTable from './DataTable';
import { Product } from '../../types/admin';

interface InventoryTableProps {
  products: Product[];
  lowStockThreshold: number;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  getTheme: () => { primaryText: string };
}

const InventoryTable: React.FC<InventoryTableProps> = ({
  products,
  lowStockThreshold,
  onEdit,
  onDelete,
  getTheme
}) => {
  return (
    <DataTable
      data={products}
      headers={['Name', 'SKU', 'Price', 'Quantity', 'Category', 'Status', 'Actions']}
      renderRow={(product) => {
        const threshold = product.low_stock_threshold || lowStockThreshold;
        const isLowStock = product.quantity <= threshold && !product.discontinued;
        return (
          <tr key={product.id} className={isLowStock ? 'bg-orange-50' : ''}>
            <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
            <td className="px-6 py-4 text-gray-700">{product.sku}</td>
            <td className="px-6 py-4 text-gray-700">GH₵{product.price}</td>
            <td className="px-6 py-4">
              <span className={`font-medium ${isLowStock ? (product.quantity === 0 ? 'text-red-600' : 'text-orange-600') : 'text-gray-700'}`}>
                {product.quantity}
                {isLowStock && (
                  <span className="ml-2">
                    <AlertTriangle className="h-4 w-4 inline text-orange-500" />
                  </span>
                )}
              </span>
            </td>
            <td className="px-6 py-4 text-gray-700">{product.category}</td>
            <td className="px-6 py-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.discontinued ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                {product.discontinued ? 'Discontinued' : 'Active'}
              </span>
            </td>
            <td className="px-6 py-4 flex gap-2">
              <button onClick={() => onEdit(product)} className={`${getTheme().primaryText} hover:underline text-sm`}>Edit</button>
              <button onClick={() => onDelete(product.id)} className="text-red-600 hover:underline text-sm">Delete</button>
            </td>
          </tr>
        );
      }}
    />
  );
};

export default InventoryTable;
