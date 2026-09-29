import axios from 'axios';

// Get base URL from environment or default to localhost
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const apiBaseUrl = `${rawBaseUrl.replace(/\/+$/, '')}/api`;

// Create a base instance
const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach the JWT token to every request if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;