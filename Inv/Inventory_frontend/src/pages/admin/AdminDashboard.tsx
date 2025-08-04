import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Package, DollarSign, TrendingUp, LogOut, FileText, Settings } from 'lucide-react';
import { useAdminData } from '../../hooks/useAdminData';
import { useAdminUI } from '../../hooks/useAdminUI';
import { useAdminForms } from '../../hooks/useAdminForms';
import { useAdminCRUD } from '../../hooks/useAdminCRUD';
import UserModal from '../../components/admin/UserModal';
import TokenDisplayModal from '../../components/admin/TokenDisplayModal';
import { useAdminSettings } from '../../hooks/useAdminSettings';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import OverviewSection from '../../components/admin/OverviewSection';
import InventoryTable from '../../components/admin/InventoryTable';
import PersonnelTable from '../../components/admin/PersonnelTable';
import CustomerTable from '../../components/admin/CustomerTable';
import SalesTable from '../../components/admin/SalesTable';
import AuditSection from '../../components/admin/AuditSection';
import SettingsSection from '../../components/admin/SettingsSection';
import FormModal from '../../components/admin/FormModal';
import Modal from '../../components/admin/Modal';
import ToastContainer from '../../components/ToastContainer';

const AdminDashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { stats, products, users, customers, sales, notifications, auditLogs, setProducts, setUsers, setCustomers, setAuditLogs, loading, refreshData } = useAdminData();
  const { activeTab, setActiveTab, showProductModal, setShowProductModal, showUserModal, setShowUserModal, showCustomerModal, setShowCustomerModal, showCustomerHistory, setShowCustomerHistory, selectedCustomer, setSelectedCustomer, filters, setFilters, auditFilters, setAuditFilters, getTheme } = useAdminUI();
  const { editingProduct, setEditingProduct, editingUser, setEditingUser, editingCustomer, setEditingCustomer, productForm, setProductForm, userForm, setUserForm, customerForm, setCustomerForm, resetForms } = useAdminForms();
  const { addProduct, updateProduct, deleteProduct, addUser, updateUser, deleteUser, generateUserToken, addCustomer, updateCustomer, deleteCustomer, addAuditLog } = useAdminCRUD();
  const { errors, removeError } = useErrorHandler();
  const { 
    settings, 
    settingsFields,
    taxRates,
    discountRules,
    workingHours,
    handleSaveSettings, 
    currencyOptions, 
    selectedCurrency, 
    updateCurrency, 
    timeZones, 
    selectedTimeZone, 
    updateTimeZone, 
    setDefaultTaxRate,
    toggleDiscountRule,
    toggleWorkingDay,
    updateWorkingHours,
    toggleFeature,
    getLowStockItems 
  } = useAdminSettings();

  // Token display state
  const [showTokenModal, setShowTokenModal] = React.useState(false);
  const [generatedTokenData, setGeneratedTokenData] = React.useState<{
    email: string;
    token: string;
  } | null>(null);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Package },
    { id: 'personnel', name: 'Personnel', icon: Users },
    { id: 'inventory', name: 'Inventory', icon: DollarSign },
    { id: 'sales', name: 'Sales', icon: TrendingUp },
    { id: 'customers', name: 'Customers', icon: Users },
    { id: 'audit', name: 'Audit Logs', icon: FileText },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const handleSubmit = async (e: React.FormEvent, type: 'product' | 'user' | 'customer') => {
    e.preventDefault();
    try {
      const handlers = {
        product: async () => {
          const data = { ...productForm, price: parseFloat(productForm.price) || 0, quantity: parseInt(productForm.quantity) || 0 };
          if (editingProduct) {
            await updateProduct(products, { ...editingProduct, ...data }, setProducts);
          } else {
            await addProduct(products, { ...data, id: 0 }, setProducts);
          }
          addAuditLog(auditLogs, 'Product', `${editingProduct ? 'Updated' : 'Created'} product: ${productForm.name}`, `${editingProduct ? 'Modified' : 'Added'} ${productForm.name}`, setAuditLogs, currentUser ? { username: currentUser.email } : undefined);
          setShowProductModal(false);
          resetForms();
        },
        user: async () => {
          const data = { ...userForm, token: '' };
          if (editingUser) {
            await updateUser(users, { ...editingUser, ...data }, setUsers);
            setShowUserModal(false);
            resetForms();
          } else {
            // Add new user with auto-token generation and data refresh
            const result = await addUser(users, { ...data, id: 0 }, setUsers, refreshData);
            
            // Show token popup if token was generated
            if (result.token) {
              setGeneratedTokenData({
                email: data.email,
                token: result.token
              });
              setShowTokenModal(true);
            }
            
            setShowUserModal(false);
            resetForms();
          }
        },
        customer: async () => {
          const data = { ...customerForm, join_date: editingCustomer?.join_date || new Date().toISOString().split('T')[0] };
          if (editingCustomer) {
            await updateCustomer(customers, { ...editingCustomer, ...data }, setCustomers);
          } else {
            await addCustomer(customers, { ...data, id: 0 }, setCustomers);
          }
          setShowCustomerModal(false);
          resetForms();
        }
      };
      await handlers[type]();
    } catch (error) {
      // Error handling is now done in the CRUD hooks
      // No need to do anything here as the user will see toast notifications
      console.error(`Operation failed for ${type}:`, error);
    }
  };

  const renderOverview = () => {
    function hasName(obj: { id: number; quantity: number; discontinued?: boolean; name?: unknown }): obj is { id: number; name: string; quantity: number; discontinued?: boolean } {
      return typeof obj.name === 'string';
    }
    const lowStockItems = getLowStockItems(products).map(item => {
      if (hasName(item)) {
        const prod = products.find(p => p.id === item.id);
        return { 
          id: item.id, 
          name: item.name, 
          quantity: item.quantity, 
          sku: prod?.sku || 'N/A' 
        };
      }
      const prod = products.find(p => p.id === item.id);
      return { 
        id: item.id, 
        name: String(prod?.name ?? 'Unknown'), 
        quantity: item.quantity, 
        sku: prod?.sku || 'N/A' 
      };
    });
    
    return stats ? (
      <OverviewSection
        stats={stats}
        lowStockItems={lowStockItems}
        notifications={notifications}
        lowStockThreshold={settings.lowStockThreshold}
        getTheme={getTheme}
      />
    ) : null;
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'inventory':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
              <button onClick={() => { resetForms(); setShowProductModal(true); }} className={`${getTheme().primaryBg} hover:${getTheme().primaryHoverBg} text-white px-4 py-2 rounded-lg font-semibold`}>
                Add Product
              </button>
            </div>
            <InventoryTable
              products={products}
              lowStockThreshold={settings.lowStockThreshold}
              onEdit={(product) => { 
                setEditingProduct(product as typeof editingProduct); 
                setProductForm({ 
                  ...product, 
                  price: product.price.toString(), 
                  quantity: product.quantity.toString(),
                  best_before: product.best_before || '',
                  discontinued: product.discontinued || false,
                  low_stock_threshold: product.low_stock_threshold || 0
                }); 
                setShowProductModal(true); 
              }}
              onDelete={async (id) => {
                try {
                  await deleteProduct(products, id, setProducts);
                } catch (error) {
                  // Error is handled in the CRUD hook
                }
              }}
              getTheme={getTheme}
            />
          </div>
        );
      case 'personnel':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Personnel Management</h2>
              <button onClick={() => { resetForms(); setShowUserModal(true); }} className={`${getTheme().primaryBg} hover:${getTheme().primaryHoverBg} text-white px-4 py-2 rounded-lg font-semibold`}>
                Add User
              </button>
            </div>
            <PersonnelTable
              users={users}
              onEdit={(user) => { 
                setEditingUser(user); 
                setUserForm({ 
                  email: user.email, 
                  role: user.role, 
                  password: '', 
                  active: user.active 
                }); 
                setShowUserModal(true); 
              }}
              onDelete={(id) => deleteUser(users, id, setUsers)}
              onGenerateToken={generateUserToken}
              onRefreshData={refreshData}
              getTheme={getTheme}
            />
          </div>
        );
      case 'customers':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Customer Management</h2>
              <button onClick={() => { resetForms(); setShowCustomerModal(true); }} className={`${getTheme().primaryBg} hover:${getTheme().primaryHoverBg} text-white px-4 py-2 rounded-lg font-semibold`}>
                Add Customer
              </button>
            </div>
            <CustomerTable
              customers={customers}
              onEdit={(customer) => { 
                setEditingCustomer(customer as typeof editingCustomer); 
                setCustomerForm({ 
                  ...customer, 
                  address: '', 
                  active: customer.active || true 
                }); 
                setShowCustomerModal(true); 
              }}
              onDelete={async (id) => {
                try {
                  await deleteCustomer(customers, id, setCustomers);
                } catch (error) {
                  // Error is handled in the CRUD hook
                }
              }}
              onViewHistory={(customer) => { setSelectedCustomer(customer as typeof selectedCustomer); setShowCustomerHistory(true); }}
              getTheme={getTheme}
            />
          </div>
        );
      case 'sales':
        return <SalesTable sales={sales} filters={filters} onFilterChange={setFilters} />;
      case 'audit':
        return <AuditSection auditLogs={auditLogs} auditFilters={auditFilters} onFilterChange={setAuditFilters} />;
      case 'settings':
        return (
          <SettingsSection
            handleSaveSettings={handleSaveSettings}
            currencyOptions={currencyOptions}
            selectedCurrency={selectedCurrency}
            updateCurrency={updateCurrency}
            timeZones={timeZones}
            selectedTimeZone={selectedTimeZone}
            updateTimeZone={updateTimeZone}
            taxRates={taxRates}
            setDefaultTaxRate={setDefaultTaxRate}
            discountRules={discountRules}
            toggleDiscountRule={toggleDiscountRule}
            workingHours={workingHours}
            toggleWorkingDay={toggleWorkingDay}
            updateWorkingHours={updateWorkingHours}
            features={settingsFields}
            toggleFeature={toggleFeature}
            getTheme={getTheme}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notifications */}
      <ToastContainer errors={errors} onRemove={removeError} />
      
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-700">Loading...</span>
          </div>
        </div>
      )}

      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">StockBuddy Admin</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {currentUser?.email}</span>
              <button onClick={logout} className="flex items-center text-red-600 hover:text-red-800">
                <LogOut className="h-4 w-4 mr-1" />Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === tab.id ? `${getTheme().primaryBg} text-white` : 'text-gray-600 hover:text-gray-900'}`}>
              <tab.icon className="h-4 w-4 mr-2" />{tab.name}
            </button>
          ))}
        </div>
        
        {renderContent()}
      </main>

      {/* Modals */}
      <FormModal
        show={showProductModal}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        onClose={() => { setShowProductModal(false); resetForms(); }}
        onSubmit={(e) => handleSubmit(e, 'product')}
        fields={[
          { field: 'name', type: 'text', required: true },
          { field: 'sku', type: 'text' },
          { field: 'price', type: 'number', step: '0.01' },
          { field: 'quantity', type: 'number' },
          { field: 'category', type: 'text' },
          { field: 'best_before', type: 'date', required: true },
          { field: 'low_stock_threshold', type: 'number' }
        ]}
        formData={productForm}
        onFieldChange={(field, value) => setProductForm({ ...productForm, [field]: value })}
        primaryTextClass={getTheme().primaryText}
        primaryBg={getTheme().primaryBg}
        primaryHoverBg={getTheme().primaryHoverBg}
        submitText={editingProduct ? 'Update Product' : 'Add Product'}
      />

      <UserModal
        show={showUserModal}
        title={editingUser ? 'Edit User' : 'Add User'}
        onClose={() => { setShowUserModal(false); resetForms(); }}
        onSubmit={(e) => handleSubmit(e, 'user')}
        userForm={userForm}
        onFieldChange={(field, value) => setUserForm({ ...userForm, [field]: value })}
        onGenerateToken={generateUserToken}
        editingUser={editingUser}
        primaryBg={getTheme().primaryBg}
        primaryHoverBg={getTheme().primaryHoverBg}
        submitText={editingUser ? 'Update User' : 'Add User'}
      />

      <FormModal
        show={showCustomerModal}
        title={editingCustomer ? 'Edit Customer' : 'Add Customer'}
        onClose={() => { setShowCustomerModal(false); resetForms(); }}
        onSubmit={(e) => handleSubmit(e, 'customer')}
        fields={[
          { field: 'name', type: 'text', required: true },
          { field: 'email', type: 'email', required: true },
          { field: 'phone', type: 'tel' },
          { field: 'address', type: 'textarea', rows: 3 }
        ]}
        formData={customerForm}
        onFieldChange={(field, value) => setCustomerForm({ ...customerForm, [field]: value })}
        primaryTextClass={getTheme().primaryText}
        primaryBg={getTheme().primaryBg}
        primaryHoverBg={getTheme().primaryHoverBg}
        submitText={editingCustomer ? 'Update Customer' : 'Add Customer'}
      />

      {showCustomerHistory && selectedCustomer && (
        <Modal show={true} title={`Purchase History - ${selectedCustomer.name}`} onClose={() => { setShowCustomerHistory(false); setSelectedCustomer(null); }} primaryTextClass={getTheme().primaryText}>
          <div className="max-h-96 overflow-y-auto">
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Email: {selectedCustomer.email}</p>
              <p className="text-sm text-gray-600">Phone: {selectedCustomer.phone}</p>
            </div>
            <div className="text-center py-8 text-gray-500">No purchase history available.</div>
          </div>
        </Modal>
      )}

      <TokenDisplayModal
        show={showTokenModal}
        onClose={() => {
          setShowTokenModal(false);
          setGeneratedTokenData(null);
        }}
        userEmail={generatedTokenData?.email || ''}
        token={generatedTokenData?.token || ''}
        primaryBg={getTheme().primaryBg}
        primaryHoverBg={getTheme().primaryHoverBg}
      />
    </div>
  );
};

export default AdminDashboard;
