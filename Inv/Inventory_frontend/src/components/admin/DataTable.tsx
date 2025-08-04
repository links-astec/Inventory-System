import React from 'react';

interface DataTableProps<T> {
  data: T[];
  headers: string[];
  renderRow: (item: T) => React.ReactNode;
  emptyMessage?: string;
}

const DataTable = <T,>({ 
  data, 
  headers, 
  renderRow, 
  emptyMessage = "No data found." 
}: DataTableProps<T>) => (
  <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          {headers.map(header => (
            <th 
              key={header} 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.length === 0 ? (
          <tr>
            <td 
              colSpan={headers.length} 
              className="text-center py-8 text-gray-500"
            >
              {emptyMessage}
            </td>
          </tr>
        ) : (
          data.map(renderRow)
        )}
      </tbody>
    </table>
  </div>
);

export default DataTable;
