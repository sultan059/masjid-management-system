import api from './api';

const accountingService = {
  // Ledger endpoints
  getLedgerEntries: async (page = 0, size = 10) => {
    const response = await api.get(`/accounting/ledger?page=${page}&size=${size}`);
    return response.data;
  },

  getBalance: async () => {
    const response = await api.get('/accounting/ledger/balance');
    return response.data;
  },

  addLedgerEntry: async (data) => {
    const response = await api.post('/accounting/ledger', data);
    return response.data;
  },

  updateLedgerEntry: async (id, data) => {
    const response = await api.put(`/accounting/ledger/${id}`, data);
    return response.data;
  },

  deleteLedgerEntry: async (id) => {
    const response = await api.delete(`/accounting/ledger/${id}`);
    return response.data;
  },

  // Inventory endpoints
  getInventory: async (page = 0, size = 20) => {
    const response = await api.get(`/inventory?page=${page}&size=${size}`);
    return response.data;
  },

  addInventoryItem: async (data) => {
    const response = await api.post('/inventory', data);
    return response.data;
  },

  // Reports
  getDailyReport: async (date = null) => {
    const url = date ? `/reports/daily?date=${date}` : '/reports/daily';
    const response = await api.get(url);
    return response.data;
  }
};

export default accountingService;