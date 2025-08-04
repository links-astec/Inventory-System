import { useState } from 'react';
import { Product, User, Customer } from '../types/admin';

export const useAdminForms = () => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  
  const [productForm, setProductForm] = useState({
    name: '', price: '', quantity: '', category: '', best_before: new Date().toISOString().split('T')[0], sku: '', discontinued: false, low_stock_threshold: 10
  });
  
  const [userForm, setUserForm] = useState({
    email: '', role: 'viewer', password: '', active: true
  });
  
  const [customerForm, setCustomerForm] = useState({
    name: '', email: '', phone: '', address: '', active: true
  });

  const resetForms = () => {
    setProductForm({ name: '', price: '', quantity: '', category: '', best_before: new Date().toISOString().split('T')[0], sku: '', discontinued: false, low_stock_threshold: 10 });
    setUserForm({ email: '', role: 'viewer', password: '', active: true });
    setCustomerForm({ name: '', email: '', phone: '', address: '', active: true });
    setEditingProduct(null);
    setEditingUser(null);
    setEditingCustomer(null);
  };

  return {
    editingProduct, setEditingProduct,
    editingUser, setEditingUser,
    editingCustomer, setEditingCustomer,
    productForm, setProductForm,
    userForm, setUserForm,
    customerForm, setCustomerForm,
    resetForms
  };
};
