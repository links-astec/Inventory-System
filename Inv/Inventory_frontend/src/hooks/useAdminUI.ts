import { useState } from 'react';
import { Customer } from '../types/admin';

export const useAdminUI = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showCustomerHistory, setShowCustomerHistory] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [currentTheme, setCurrentTheme] = useState('blue');
  const [filters, setFilters] = useState({ user: '', date: '', product: '' });
  const [auditFilters, setAuditFilters] = useState({ type: '', user: '', dateFrom: '', dateTo: '' });

  const themes = {
    blue: { name: 'Ocean Blue', primary: 'blue', primaryBg: 'bg-blue-600', primaryHoverBg: 'bg-blue-700', primaryText: 'text-blue-600', gradient: 'from-blue-600 to-cyan-600', accentBg: 'bg-emerald-500' }
  };

  return {
    activeTab, setActiveTab,
    showProductModal, setShowProductModal,
    showUserModal, setShowUserModal,
    showCustomerModal, setShowCustomerModal,
    showCustomerHistory, setShowCustomerHistory,
    selectedCustomer, setSelectedCustomer,
    currentTheme, setCurrentTheme,
    filters, setFilters,
    auditFilters, setAuditFilters,
    themes,
    getTheme: () => themes[currentTheme as keyof typeof themes]
  };
};
