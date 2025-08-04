// service/apiClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/', // ✅ Your backend base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
