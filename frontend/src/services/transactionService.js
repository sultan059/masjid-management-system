import api from './api';

const transactionService = {
  getAllTransactions: async (page = 0, size = 10) => {
    const response = await api.get(`/transactions?page=${page}&size=${size}`);
    return response.data;
  },

  getTransactionStats: async () => {
    const response = await api.get('/transactions/stats');
    return response.data;
  },

  searchTransactions: async (query, page = 0, size = 10) => {
    const response = await api.get(`/transactions/search?q=${query}&page=${page}&size=${size}`);
    return response.data;
  },

  filterByType: async (type, page = 0, size = 10) => {
    const response = await api.get(`/transactions/filter?type=${type}&page=${page}&size=${size}`);
    return response.data;
  },

  createTransaction: async (data) => {
    const response = await api.post('/transactions', data);
    return response.data;
  }
};

export default transactionService;