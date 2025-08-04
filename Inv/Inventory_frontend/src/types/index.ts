export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'sales';
  token?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  sku: string;
  description?: string;
  assignedTo?: string; // sales person id
  lastUpdated: Date;
}

export interface Sale {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  totalAmount: number;
  salesPersonId: string;
  salesPersonName: string;
  date: Date;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface DashboardStats {
  totalItems: number;
  totalSales: number;
  totalRevenue: number;
  activeSalesPersonnel: number;
  lowStockItems: number;
}

export interface SettingsField {
  key: string;
  label: string;
  enabled: boolean;
}

export interface NotificationField {
  key: string;
  label: string;
  enabled: boolean;
}

export interface SystemInfo {
  label: string;
  value: string;
  color?: string;
}

export interface SystemButton {
  label: string;
  onClick: () => void;
  color: string;
}

export interface AdminSettings {
  currencySymbol: string;
  taxRate: number;
  sessionTimeout: number;
  passwordExpiry: boolean;
  lowStockThreshold: number;
}

export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
}

export interface TaxRate {
  id: string;
  name: string;
  rate: number;
  isDefault: boolean;
}

export interface DiscountRule {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  minAmount?: number;
  maxAmount?: number;
  isActive: boolean;
}

export interface WorkingHours {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface TimeZone {
  id: string;
  name: string;
  offset: string;
}

export interface Feature {
  key: string;
  label: string;
  enabled: boolean;
}