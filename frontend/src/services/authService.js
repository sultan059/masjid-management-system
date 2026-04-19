import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user || { email }));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: async () => {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  }
};

export default authService;
