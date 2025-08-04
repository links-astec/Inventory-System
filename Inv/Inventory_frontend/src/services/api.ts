// src/services/api.ts

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'; 

export async function registerAdmin(email: string, password: string) {
  const res = await fetch(`${API_BASE}/admin/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Failed to register');
  return res.json();
}

export async function loginAdmin(email: string, password: string) {
  const res = await fetch(`${API_BASE}/admin/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Failed to login');
  return res.json();
}

export async function authSalesperson(email: string, password: string, token: string) {
  const res = await fetch(`${API_BASE}/salesperson/auth/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, token }),
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const errorMessage = errorData.error || 'Failed to login';
    throw new Error(errorMessage);
  }
  
  return res.json();
}


export function logout() {
  localStorage.removeItem('token');
}


// ---------- DASHBOARD ----------

export async function fetchDashboardStats() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/dashboard-stats/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch dashboard stats');
  return res.json();
}

// ---------- CUSTOMERS ----------

export async function fetchCustomers() {
  const res = await fetch(`${API_BASE}/customers/`);
  if (!res.ok) throw new Error('Failed to fetch customers');
  return res.json();
}

export async function addCustomer(customer: any) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/customers/`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(customer),
  });
  if (!res.ok) throw new Error('Failed to add customer');
  return res.json();
}

export async function updateCustomer(id: number, customer: any) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/customers/${id}/`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(customer),
  });
  if (!res.ok) throw new Error('Failed to update customer');
  return res.json();
}

export async function deleteCustomer(id: number) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/customers/${id}/`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to delete customer');
}

// ---------- SALES ----------

export async function fetchSales() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/sales/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch sales');
  return res.json();
}

export async function addSale(sale: any) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/sales/`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(sale),
  });
  if (!res.ok) throw new Error('Failed to add sale');
  return res.json();
}

// ---------- PRODUCTS ----------

export async function fetchProducts() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/products/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function addProduct(product: any) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/products/`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error('Failed to add product');
  return res.json();
}

export async function updateProduct(id: number, product: any) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/products/${id}/`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error('Failed to update product');
  return res.json();
}

export async function deleteProduct(id: number) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/products/${id}/`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to delete product');
}

// ---------- TOKEN GENERATION ----------

export async function generateAccessToken() {
  const res = await fetch(`${API_BASE}/generate-token/`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to generate token');
  return res.json();
}

// ---------- AUDIT LOGS ----------

export async function fetchAuditLogs() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/audit-logs/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch audit logs');
  return res.json();
}

// ---------- NOTIFICATIONS ----------

export async function fetchNotifications() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/notifications/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
}

// ---------- SYSTEM SETTINGS ----------

export async function fetchSystemSettings() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/system-settings/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch system settings');
  return res.json();
}

export async function updateSystemSettings(settings: any) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/system-settings/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error('Failed to update system settings');
  return res.json();
}

// User Management API functions
export async function fetchUsers() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/users/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function addUser(user: any) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/users/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error('Failed to add user');
  return res.json();
}

export async function updateUser(id: number, user: any) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/users/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error('Failed to update user');
  return res.json();
}

export async function deleteUser(id: number) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/users/${id}/`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to delete user');
}

export async function generateUserToken(userId: number) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/users/generate-token/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ user_id: userId }),
  });
  if (!res.ok) throw new Error('Failed to generate user token');
  return res.json();
}