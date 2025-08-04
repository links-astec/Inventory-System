import { Product, User, Customer, AuditLog } from '../types/admin';
import { 
  addProduct as apiAddProduct, 
  updateProduct as apiUpdateProduct, 
  deleteProduct as apiDeleteProduct,
  addUser as apiAddUser,
  updateUser as apiUpdateUser,
  deleteUser as apiDeleteUser,
  generateUserToken as apiGenerateUserToken,
  addCustomer as apiAddCustomer, 
  updateCustomer as apiUpdateCustomer, 
  deleteCustomer as apiDeleteCustomer
} from '../services/api';
import { useErrorHandler } from './useErrorHandler';

export const useAdminCRUD = () => {
  const { handleApiError, showSuccess } = useErrorHandler();

  const addProduct = async (products: Product[], product: Product, setProducts: (products: Product[]) => void) => {
    try {
      const newProduct = await apiAddProduct(product);
      setProducts([...products, newProduct]);
      showSuccess(`Product "${product.name}" has been added successfully.`);
      return newProduct;
    } catch (error) {
      handleApiError(error, `Adding product "${product.name}"`);
      throw error;
    }
  };

  const updateProduct = async (products: Product[], product: Product, setProducts: (products: Product[]) => void) => {
    try {
      const updatedProduct = await apiUpdateProduct(product.id, product);
      setProducts(products.map(p => p.id === product.id ? updatedProduct : p));
      showSuccess(`Product "${product.name}" has been updated successfully.`);
      return updatedProduct;
    } catch (error) {
      handleApiError(error, `Updating product "${product.name}"`);
      throw error;
    }
  };

  const deleteProduct = async (products: Product[], id: number, setProducts: (products: Product[]) => void) => {
    try {
      const product = products.find(p => p.id === id);
      await apiDeleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      showSuccess(`Product ${product?.name ? `"${product.name}"` : ''} has been deleted successfully.`);
    } catch (error) {
      const product = products.find(p => p.id === id);
      handleApiError(error, `Deleting product ${product?.name ? `"${product.name}"` : ''}`);
      throw error;
    }
  };

  // User operations with API integration
  const addUser = async (users: User[], user: User, setUsers: (users: User[]) => void, onRefreshData?: () => void) => {
    try {
      const newUser = await apiAddUser(user);
      setUsers([...users, newUser]);
      
      // Auto-generate token for sales users
      let generatedToken = '';
      if (newUser.role === 'sales') {
        try {
          const tokenResponse = await apiGenerateUserToken(newUser.id);
          generatedToken = tokenResponse.token;
          // Update the user with the new token
          const updatedUser = { ...newUser, token: generatedToken };
          setUsers([...users, updatedUser]);
        } catch (tokenError) {
          console.warn('Failed to auto-generate token:', tokenError);
        }
      }
      
      showSuccess(`User "${user.email}" has been added successfully.`);
      
      // Refresh overview data if callback provided
      if (onRefreshData) {
        onRefreshData();
      }
      
      return { user: newUser, token: generatedToken };
    } catch (error) {
      handleApiError(error, `Adding user "${user.email}"`);
      throw error;
    }
  };

  const updateUser = async (users: User[], user: User, setUsers: (users: User[]) => void) => {
    try {
      const updatedUser = await apiUpdateUser(user.id, user);
      setUsers(users.map(u => u.id === user.id ? updatedUser : u));
      showSuccess(`User "${user.email}" has been updated successfully.`);
      return updatedUser;
    } catch (error) {
      handleApiError(error, `Updating user "${user.email}"`);
      throw error;
    }
  };

  const deleteUser = async (users: User[], id: number, setUsers: (users: User[]) => void) => {
    try {
      const user = users.find(u => u.id === id);
      await apiDeleteUser(id);
      setUsers(users.filter(u => u.id !== id));
      showSuccess(`User ${user?.email ? `"${user.email}"` : ''} has been deleted successfully.`);
    } catch (error) {
      const user = users.find(u => u.id === id);
      handleApiError(error, `Deleting user ${user?.email ? `"${user.email}"` : ''}`);
      throw error;
    }
  };

  const generateUserToken = async (userId: number) => {
    try {
      const response = await apiGenerateUserToken(userId);
      showSuccess('Token generated successfully!');
      return response.token; // Return the token from the response
    } catch (error) {
      handleApiError(error, 'Generating user token');
      throw error;
    }
  };

  const addCustomer = async (customers: Customer[], customer: Customer, setCustomers: (customers: Customer[]) => void) => {
    try {
      const newCustomer = await apiAddCustomer(customer);
      setCustomers([...customers, newCustomer]);
      showSuccess(`Customer "${customer.name}" has been added successfully.`);
      return newCustomer;
    } catch (error) {
      handleApiError(error, `Adding customer "${customer.name}"`);
      throw error;
    }
  };

  const updateCustomer = async (customers: Customer[], customer: Customer, setCustomers: (customers: Customer[]) => void) => {
    try {
      const updatedCustomer = await apiUpdateCustomer(customer.id, customer);
      setCustomers(customers.map(c => c.id === customer.id ? updatedCustomer : c));
      showSuccess(`Customer "${customer.name}" has been updated successfully.`);
      return updatedCustomer;
    } catch (error) {
      handleApiError(error, `Updating customer "${customer.name}"`);
      throw error;
    }
  };

  const deleteCustomer = async (customers: Customer[], id: number, setCustomers: (customers: Customer[]) => void) => {
    try {
      const customer = customers.find(c => c.id === id);
      await apiDeleteCustomer(id);
      setCustomers(customers.filter(c => c.id !== id));
      showSuccess(`Customer ${customer?.name ? `"${customer.name}"` : ''} has been deleted successfully.`);
    } catch (error) {
      const customer = customers.find(c => c.id === id);
      handleApiError(error, `Deleting customer ${customer?.name ? `"${customer.name}"` : ''}`);
      throw error;
    }
  };

  const addAuditLog = (logs: AuditLog[], type: string, action: string, details: string, setLogs: (logs: AuditLog[]) => void, currentUser?: { username: string }) => {
    try {
      const newLog: AuditLog = {
        id: Date.now(),
        type,
        user: currentUser?.username || 'system',
        action,
        timestamp: new Date().toLocaleString(),
        ip_address: '192.168.1.' + Math.floor(Math.random() * 200 + 1),
        details,
      };
      setLogs([newLog, ...logs]);
    } catch (error) {
      handleApiError(error, 'Adding audit log entry');
    }
  };

  return {
    addProduct, updateProduct, deleteProduct,
    addUser, updateUser, deleteUser, generateUserToken,
    addCustomer, updateCustomer, deleteCustomer,
    addAuditLog
  };
};
