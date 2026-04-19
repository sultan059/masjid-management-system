import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your physical machine IP if testing on a real device
const BASE_URL = 'http://localhost:8080/api'; 

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token to every request
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Handle session expiry: clear storage or redirect
      await AsyncStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api;
