import React from 'react';

export interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  category: string;
  best_before: string;
  discontinued: boolean;
  low_stock_threshold: number;
}

export interface User {
  id: number;
  email: string;
  role: string;
  token: string;
  active: boolean;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  active: boolean;
  join_date: string;
}

export interface Sale {
  id: number;
  user: string;
  product: string;
  date: string;
  amount: number;
  status: string;
  customerId: number;
}

export interface Notification {
  id: number;
  message: string;
  type: string;
  created_at: string;
}

export interface AuditLog {
  id: number;
  type: string;
  user: string;
  action: string;
  timestamp: string;
  ip_address: string;
  details: string;
}

export interface DashboardStats {
  totalItems: number;
  totalSales: number;
  totalRevenue: number;
  activeSalesPersonnel: number;
  lowStockItems: { id: number; name: string; quantity: number; sku: string; }[];
}

export interface Tab {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string; size?: number | string; }>;
}
