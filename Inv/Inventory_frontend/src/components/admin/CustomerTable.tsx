import React from 'react';
import DataTable from './DataTable';
import { Customer } from '../../types/admin';

interface CustomerTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: number) => void;
  onViewHistory: (customer: Customer) => void;
  getTheme: () => { primaryText: string };
}

const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  onEdit,
  onDelete,
  onViewHistory,
  getTheme
}) => {
  return (
    <DataTable
      data={customers}
      headers={['Name', 'Email', 'Phone', 'Status', 'Actions']}
      renderRow={(customer) => (
        <tr key={customer.id}>
          <td className="px-6 py-4 font-medium text-gray-900">{customer.name}</td>
          <td className="px-6 py-4 text-gray-700">{customer.email}</td>
          <td className="px-6 py-4 text-gray-700">{customer.phone}</td>
          <td className="px-6 py-4">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${customer.active ? 'bg-green-100 text-green-800' : 'bg-gray-300 text-gray-700'}`}>
              {customer.active ? 'Active' : 'Inactive'}
            </span>
          </td>
          <td className="px-6 py-4 flex gap-2">
            <button onClick={() => onEdit(customer)} className={`${getTheme().primaryText} hover:underline text-sm`}>Edit</button>
            <button onClick={() => onViewHistory(customer)} className="text-purple-600 hover:underline text-sm">History</button>
            <button onClick={() => onDelete(customer.id)} className="text-red-600 hover:underline text-sm">Delete</button>
          </td>
        </tr>
      )}
    />
  );
};

export default CustomerTable;
