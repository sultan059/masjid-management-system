import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_EXPIRY_KEY = 'tokenExpiry';
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;

const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('tokenExpiry', (Date.now() + TOKEN_EXPIRY_MS).toString());
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user || { email }));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('tokenExpiry');
    await AsyncStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: async () => {
    const token = await AsyncStorage.getItem('token');
    const expiry = await AsyncStorage.getItem('tokenExpiry');
    if (!token || !expiry) return false;
    return Date.now() < parseInt(expiry);
  },

  requestPasswordReset: async (email) => {
    try {
      const response = await api.post('/auth/password-reset', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to request password reset';
    }
  },

  confirmPasswordReset: async (token, newPassword) => {
    try {
      const response = await api.post('/auth/password-reset/confirm', { token, newPassword });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to reset password';
    }
  },

  changePassword: async (oldPassword, newPassword) => {
    try {
      const response = await api.post('/auth/change-password', { oldPassword, newPassword });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to change password';
    }
  }
};

export default authService;
