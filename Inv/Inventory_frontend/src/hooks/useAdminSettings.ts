import { useState } from 'react';
import { 
  SettingsField, 
  NotificationField, 
  SystemInfo, 
  SystemButton, 
  AdminSettings,
  CurrencyOption,
  TaxRate,
  DiscountRule,
  WorkingHours,
  TimeZone 
} from '../types';

export const useAdminSettings = () => {
  const [settings, setSettings] = useState<AdminSettings>({
    currencySymbol: 'GH₵',
    taxRate: 12.5,
    sessionTimeout: 30,
    passwordExpiry: true,
    lowStockThreshold: 10,
  });

  const [selectedCurrency, setSelectedCurrency] = useState('GHS');
  const [selectedTimeZone, setSelectedTimeZone] = useState('GMT');

  const [taxRates, setTaxRates] = useState<TaxRate[]>([
    { id: '1', name: 'Standard VAT', rate: 12.5, isDefault: true },
    { id: '2', name: 'Reduced VAT', rate: 5.0, isDefault: false },
    { id: '3', name: 'Zero VAT', rate: 0.0, isDefault: false },
  ]);

  const [discountRules, setDiscountRules] = useState<DiscountRule[]>([
    { id: '1', name: 'Bulk Order (10+ items)', type: 'percentage', value: 10, minAmount: 500, isActive: true },
    { id: '2', name: 'New Customer', type: 'fixed', value: 50, isActive: true },
    { id: '3', name: 'VIP Customer', type: 'percentage', value: 15, minAmount: 1000, isActive: false },
  ]);

  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([
    { day: 'Monday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
    { day: 'Tuesday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
    { day: 'Wednesday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
    { day: 'Thursday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
    { day: 'Friday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
    { day: 'Saturday', isOpen: true, openTime: '10:00', closeTime: '14:00' },
    { day: 'Sunday', isOpen: false, openTime: '10:00', closeTime: '14:00' },
  ]);

  const currencyOptions: CurrencyOption[] = [
    { code: 'GHS', symbol: 'GH₵', name: 'Ghana Cedi' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  ];

  const timeZones: TimeZone[] = [
    { id: 'GMT', name: 'Greenwich Mean Time', offset: '+00:00' },
    { id: 'WAT', name: 'West Africa Time', offset: '+01:00' },
    { id: 'EST', name: 'Eastern Standard Time', offset: '-05:00' },
    { id: 'PST', name: 'Pacific Standard Time', offset: '-08:00' },
  ];

  const [features, setFeatures] = useState<Record<string, boolean>>({
    inventoryAlerts: true,
    salesReports: true,
    customerTracking: true,
    multiCurrency: false,
    barcodeScanning: false,
  });

  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    lowStock: true,
    newOrders: true,
    systemUpdates: false,
    emailAlerts: true,
  });

  const settingsFields: SettingsField[] = [
    { key: 'inventoryAlerts', label: 'Inventory Alerts', enabled: features.inventoryAlerts },
    { key: 'salesReports', label: 'Sales Reports', enabled: features.salesReports },
    { key: 'customerTracking', label: 'Customer Tracking', enabled: features.customerTracking },
    { key: 'multiCurrency', label: 'Multi Currency', enabled: features.multiCurrency },
    { key: 'barcodeScanning', label: 'Barcode Scanning', enabled: features.barcodeScanning },
  ];

  const notificationFields: NotificationField[] = [
    { key: 'lowStock', label: 'Low Stock Alerts', enabled: notifications.lowStock },
    { key: 'newOrders', label: 'New Orders', enabled: notifications.newOrders },
    { key: 'systemUpdates', label: 'System Updates', enabled: notifications.systemUpdates },
    { key: 'emailAlerts', label: 'Email Alerts', enabled: notifications.emailAlerts },
  ];

  const systemInfo: SystemInfo[] = [
    { label: 'System Version', value: 'StockBuddy v2.1.0' },
    { label: 'Last Updated', value: 'August 3, 2025' },
    { label: 'Database Status', value: 'Connected', color: 'text-green-600' },
    { label: 'Active Users', value: '3' }
  ];

  // System action handlers
  const handleCheckForUpdates = () => {
    alert('Checking for updates...\n\nSystem is up to date!\nStockBuddy v2.1.0 is the latest version.');
  };

  const handleClearCache = () => {
    if (window.confirm('Are you sure you want to clear the system cache? This action cannot be undone.')) {
      localStorage.clear();
      sessionStorage.clear();
      alert('Cache cleared successfully!\n\nThe application cache has been cleared. Some settings may be reset to defaults.');
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone and will affect:\n\n• Theme settings\n• Currency configuration\n• Tax rates\n• Discount rules\n• Feature toggles\n• Working hours\n• Notification preferences\n• Security settings') && 
        window.confirm('This is your final warning. Are you absolutely sure you want to reset ALL settings to factory defaults?')) {
      
      // Reset all settings to defaults
      setSettings({
        currencySymbol: 'GH₵',
        taxRate: 12.5,
        sessionTimeout: 30,
        passwordExpiry: true,
        lowStockThreshold: 10,
      });
      
      setSelectedCurrency('GHS');
      setSelectedTimeZone('GMT');
      
      setFeatures({
        inventoryAlerts: true,
        salesReports: true,
        customerTracking: true,
        multiCurrency: false,
        barcodeScanning: false,
      });
      
      setNotifications({
        lowStock: true,
        newOrders: true,
        systemUpdates: false,
        emailAlerts: true,
      });

      setTaxRates([
        { id: '1', name: 'Standard VAT', rate: 12.5, isDefault: true },
        { id: '2', name: 'Reduced VAT', rate: 5.0, isDefault: false },
        { id: '3', name: 'Zero VAT', rate: 0.0, isDefault: false },
      ]);

      setDiscountRules([
        { id: '1', name: 'Bulk Order (10+ items)', type: 'percentage', value: 10, minAmount: 500, isActive: true },
        { id: '2', name: 'New Customer', type: 'fixed', value: 50, isActive: true },
        { id: '3', name: 'VIP Customer', type: 'percentage', value: 15, minAmount: 1000, isActive: false },
      ]);

      setWorkingHours([
        { day: 'Monday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
        { day: 'Tuesday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
        { day: 'Wednesday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
        { day: 'Thursday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
        { day: 'Friday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
        { day: 'Saturday', isOpen: true, openTime: '10:00', closeTime: '14:00' },
        { day: 'Sunday', isOpen: false, openTime: '10:00', closeTime: '14:00' },
      ]);
      
      localStorage.removeItem('stockbuddy-settings');
      alert('Settings reset successfully!\n\nAll system settings have been restored to factory defaults. Please refresh the page to see the changes.');
    }
  };

  const systemButtons: SystemButton[] = [
    { label: 'Check for Updates', onClick: handleCheckForUpdates, color: 'bg-green-600 hover:bg-green-700' },
    { label: 'Clear Cache', onClick: handleClearCache, color: 'bg-orange-600 hover:bg-orange-700' },
    { label: 'Reset to Defaults', onClick: handleResetToDefaults, color: 'bg-red-600 hover:bg-red-700' }
  ];

  const handleSaveSettings = () => {
    // Save settings to localStorage
    localStorage.setItem('stockbuddy-settings', JSON.stringify({
      settings,
      features,
      notifications,
      selectedCurrency,
      selectedTimeZone,
      taxRates,
      discountRules,
      workingHours,
    }));
    alert('Settings saved successfully!\n\nAll configuration changes have been saved including:\n• Currency settings\n• Tax rates\n• Discount rules\n• Feature toggles\n• Working hours\n• Notification preferences');
  };

  const updateSetting = (key: keyof AdminSettings, value: string | number | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleFeature = (key: string) => {
    setFeatures(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleNotification = (key: string) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Currency handlers
  const updateCurrency = (currencyCode: string) => {
    setSelectedCurrency(currencyCode);
    const currency = currencyOptions.find(c => c.code === currencyCode);
    if (currency) {
      updateSetting('currencySymbol', currency.symbol);
    }
  };

  // Tax rate handlers
  const addTaxRate = (name: string, rate: number) => {
    const newTaxRate: TaxRate = {
      id: Date.now().toString(),
      name,
      rate,
      isDefault: false,
    };
    setTaxRates(prev => [...prev, newTaxRate]);
  };

  const updateTaxRate = (id: string, updates: Partial<TaxRate>) => {
    setTaxRates(prev => prev.map(tax => tax.id === id ? { ...tax, ...updates } : tax));
  };

  const deleteTaxRate = (id: string) => {
    setTaxRates(prev => prev.filter(tax => tax.id !== id));
  };

  const setDefaultTaxRate = (id: string) => {
    setTaxRates(prev => prev.map(tax => ({ ...tax, isDefault: tax.id === id })));
    const defaultTax = taxRates.find(tax => tax.id === id);
    if (defaultTax) {
      updateSetting('taxRate', defaultTax.rate);
    }
  };

  // Discount rule handlers
  const addDiscountRule = (rule: Omit<DiscountRule, 'id'>) => {
    const newRule: DiscountRule = {
      ...rule,
      id: Date.now().toString(),
    };
    setDiscountRules(prev => [...prev, newRule]);
  };

  const updateDiscountRule = (id: string, updates: Partial<DiscountRule>) => {
    setDiscountRules(prev => prev.map(rule => rule.id === id ? { ...rule, ...updates } : rule));
  };

  const deleteDiscountRule = (id: string) => {
    setDiscountRules(prev => prev.filter(rule => rule.id !== id));
  };

  const toggleDiscountRule = (id: string) => {
    setDiscountRules(prev => prev.map(rule => 
      rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  // Working hours handlers
  const updateWorkingHours = (day: string, updates: Partial<WorkingHours>) => {
    setWorkingHours(prev => prev.map(hours => 
      hours.day === day ? { ...hours, ...updates } : hours
    ));
  };

  const toggleWorkingDay = (day: string) => {
    setWorkingHours(prev => prev.map(hours => 
      hours.day === day ? { ...hours, isOpen: !hours.isOpen } : hours
    ));
  };

  const updateTimeZone = (timeZoneId: string) => {
    setSelectedTimeZone(timeZoneId);
  };

  // Low stock management
  const getLowStockItems = (products: Array<{id: number; quantity: number; discontinued?: boolean; low_stock_threshold?: number}>) => {
    return products.filter(product => 
      product.quantity <= (product.low_stock_threshold || settings.lowStockThreshold) && !product.discontinued
    );
  };

  const updateLowStockThreshold = (threshold: number) => {
    updateSetting('lowStockThreshold', threshold);
  };

  return {
    // Settings state
    settings,
    features,
    notifications,
    selectedCurrency,
    selectedTimeZone,
    taxRates,
    discountRules,
    workingHours,
    
    // Data arrays
    settingsFields,
    notificationFields,
    systemInfo,
    systemButtons,
    currencyOptions,
    timeZones,
    
    // Basic settings handlers
    handleSaveSettings,
    updateSetting,
    toggleFeature,
    toggleNotification,
    
    // Currency handlers
    updateCurrency,
    
    // Tax rate handlers
    addTaxRate,
    updateTaxRate,
    deleteTaxRate,
    setDefaultTaxRate,
    
    // Discount rule handlers
    addDiscountRule,
    updateDiscountRule,
    deleteDiscountRule,
    toggleDiscountRule,
    
    // Working hours handlers
    updateWorkingHours,
    toggleWorkingDay,
    updateTimeZone,
    
    // Low stock management
    getLowStockItems,
    updateLowStockThreshold,
  };
};
