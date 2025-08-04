import React from 'react';
import { AlertTriangle, Package, DollarSign, TrendingUp, Users } from 'lucide-react';
import StatCard from './StatCard';
import { Notification } from '../../types/admin';

interface LowStockItem {
  id: number;
  name: string;
  quantity: number;
  sku: string;
}

interface Stats {
  totalItems: number;
  totalSales: number;
  totalRevenue: number;
  activeSalesPersonnel: number;
  lowStockItems: LowStockItem[];
}

interface ThemeConfig {
  primary: string;
  accentBg: string;
  primaryBg: string;
  primaryHoverBg: string;
  primaryText: string;
}

interface ThemeConfig {
  primary: string;
  accentBg: string;
  primaryBg: string;
  primaryHoverBg: string;
  primaryText: string;
}

interface OverviewSectionProps {
  stats: Stats;
  lowStockItems: LowStockItem[];
  notifications: Notification[];
  lowStockThreshold: number;
  getTheme: () => ThemeConfig;
}

const OverviewSection: React.FC<OverviewSectionProps> = ({
  stats,
  lowStockItems,
  notifications,
  lowStockThreshold,
  getTheme
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Items" 
          value={stats.totalItems} 
          icon={Package} 
          color={`bg-${getTheme().primary}-500`} 
        />
        <StatCard 
          title="Total Sales" 
          value={`GH₵${stats.totalSales}`} 
          icon={DollarSign} 
          color={getTheme().accentBg} 
        />
        <StatCard 
          title="Revenue" 
          value={`GH₵${stats.totalRevenue.toLocaleString()}`} 
          icon={TrendingUp} 
          color="bg-purple-500" 
        />
        <StatCard 
          title="Active Personnel" 
          value={stats.activeSalesPersonnel} 
          icon={Users} 
          color="bg-orange-500" 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
            Low Stock Alert
            <span className="ml-2 text-sm text-gray-500">(≤ {lowStockThreshold} items)</span>
          </h3>
          <div className="space-y-3">
            {lowStockItems.length > 0 ? (
              lowStockItems.map(item => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="font-medium">{item.name}</span>
                  <span className={`font-bold ${item.quantity === 0 ? 'text-red-600' : 'text-orange-600'}`}>
                    {item.quantity === 0 ? 'Out of Stock' : `${item.quantity} left`}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <Package className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>All items are well stocked!</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Notifications</h3>
          <div className="space-y-3">
            {notifications.map(notif => (
              <div 
                key={notif.id} 
                className={`p-3 rounded-lg ${
                  notif.type === 'success' 
                    ? 'bg-green-50 text-green-800' 
                    : notif.type === 'warning'
                    ? 'bg-yellow-50 text-yellow-800'
                    : 'bg-blue-50 text-blue-800'
                }`}
              >
                {notif.message}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;
