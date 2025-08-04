import React from 'react';
import DataTable from './DataTable';
import { AuditLog } from '../../types/admin';

interface AuditSectionProps {
  auditLogs: AuditLog[];
  auditFilters: {
    type: string;
    user: string;
    dateFrom: string;
    dateTo: string;
  };
  onFilterChange: (filters: { type: string; user: string; dateFrom: string; dateTo: string }) => void;
}

const AuditSection: React.FC<AuditSectionProps> = ({
  auditLogs,
  auditFilters,
  onFilterChange
}) => {
  const filteredLogs = auditLogs.filter(log => {
    if (auditFilters.type && !log.type.toLowerCase().includes(auditFilters.type.toLowerCase())) return false;
    if (auditFilters.user && !log.user.toLowerCase().includes(auditFilters.user.toLowerCase())) return false;
    
    const logDate = new Date(log.timestamp);
    if (auditFilters.dateFrom) {
      const fromDate = new Date(auditFilters.dateFrom);
      if (logDate < fromDate) return false;
    }
    if (auditFilters.dateTo) {
      const toDate = new Date(auditFilters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      if (logDate > toDate) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Audit Logs</h2>
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {(['type', 'user', 'dateFrom', 'dateTo'] as const).map((field) => (
            <input 
              key={field} 
              type={field.includes('date') ? 'date' : 'text'} 
              placeholder={field.includes('date') ? '' : `Filter by ${field}`} 
              title={field.includes('date') ? `${field.replace('date', '').replace('From', 'From ').replace('To', 'To ')}date` : `Filter by ${field}`} 
              value={auditFilters[field]} 
              onChange={e => onFilterChange({ ...auditFilters, [field]: e.target.value })} 
              className="border border-gray-300 rounded-lg px-3 py-2"
              aria-label={field.includes('date') ? `Filter audit logs ${field.replace('date', '').replace('From', 'from ').replace('To', 'to ')}date` : `Filter audit logs by ${field}`}
            />
          ))}
        </div>
      </div>
      <DataTable
        data={filteredLogs}
        headers={['Type', 'User', 'Action', 'Timestamp', 'Details']}
        renderRow={(log) => (
          <tr key={log.id}>
            <td className="px-6 py-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                log.type === 'Login' ? 'bg-blue-100 text-blue-800' : 
                log.type === 'Product' ? 'bg-green-100 text-green-800' : 
                'bg-purple-100 text-purple-800'
              }`}>
                {log.type}
              </span>
            </td>
            <td className="px-6 py-4 text-gray-700">{log.user}</td>
            <td className="px-6 py-4 text-gray-700">{log.action}</td>
            <td className="px-6 py-4 text-gray-700">{log.timestamp}</td>
            <td className="px-6 py-4 text-gray-700">{log.details}</td>
          </tr>
        )}
      />
    </div>
  );
};

export default AuditSection;
