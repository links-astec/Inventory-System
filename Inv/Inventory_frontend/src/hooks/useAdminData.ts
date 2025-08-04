import { useState, useEffect } from 'react';
import { Product, User, Customer, Sale, Notification, AuditLog, DashboardStats } from '../types/admin';
import { 
  fetchDashboardStats, 
  fetchProducts, 
  fetchUsers,
  fetchCustomers, 
  fetchSales, 
  fetchNotifications, 
  fetchAuditLogs 
} from '../services/api';
import { useErrorHandler } from './useErrorHandler';

export const useAdminData = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleApiError, showSuccess } = useErrorHandler();

  const loadData = async () => {
    try {
      setLoading(true);

      // Load dashboard stats
      try {
        const statsData = await fetchDashboardStats();
        setStats(statsData);
      } catch (err) {
        handleApiError(err, 'Loading dashboard statistics');
      }

      // Load products
      try {
        const productsData = await fetchProducts();
        setProducts(productsData);
      } catch (err) {
        handleApiError(err, 'Loading products');
      }

      // Load users
      try {
        const usersData = await fetchUsers();
        setUsers(usersData);
      } catch (err) {
        handleApiError(err, 'Loading users');
      }

      // Load customers
      try {
        const customersData = await fetchCustomers();
        setCustomers(customersData);
      } catch (err) {
        handleApiError(err, 'Loading customers');
      }

      // Load sales
      try {
        const salesData = await fetchSales();
        setSales(salesData);
      } catch (err) {
        handleApiError(err, 'Loading sales data');
      }

      // Load notifications
      try {
        const notificationsData = await fetchNotifications();
        setNotifications(notificationsData);
      } catch (err) {
        handleApiError(err, 'Loading notifications');
      }

      // Load audit logs
      try {
        const auditLogsData = await fetchAuditLogs();
        setAuditLogs(auditLogsData);
      } catch (err) {
        handleApiError(err, 'Loading audit logs');
      }

      showSuccess('Data loaded successfully');

    } catch (err) {
      handleApiError(err, 'Loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    stats, setStats,
    products, setProducts,
    users, setUsers,
    customers, setCustomers,
    sales, setSales,
    notifications, setNotifications,
    auditLogs, setAuditLogs,
    loading,
    refreshData: loadData
  };
};
