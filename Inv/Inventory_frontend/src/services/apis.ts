import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  // LOGIN (for both admin and salesperson)
  login: async (email: string, password: string, accessToken?: string) => {
    const response = await apiClient.post('/login/', {
      email,
      password,
      access_token: accessToken,
    });
    const { access, refresh, ...rest } = response.data;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    return rest;
  },

  // REGISTER ADMIN
  registerAdmin: async (email: string, password: string) => {
    const response = await apiClient.post('/register/', {
      email,
      password,
    });
    return response.data;
  },

  getProducts: async () => {
    const response = await apiClient.get('/products/');
    return response.data;
  },

  createProduct: async (productData: any) => {
    const response = await apiClient.post('/products/', productData);
    return response.data;
  },

  getCustomers: async () => {
    const response = await apiClient.get('/customers/');
    return response.data;
  },

  createCustomer: async (customerData: any) => {
    const response = await apiClient.post('/customers/', customerData);
    return response.data;
  },

  getSales: async () => {
    const response = await apiClient.get('/sales/');
    return response.data;
  },

  createSale: async (saleData: any) => {
    const response = await apiClient.post('/sales/', saleData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/me/');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
};

export default apiClient;
