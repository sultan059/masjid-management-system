import api from './api';

const reportService = {
  getDailyReport: async (date = null) => {
    const url = date ? `/reports/daily?date=${date}` : '/reports/daily';
    const response = await api.get(url);
    return response.data;
  },

  getReportStats: async () => {
    const response = await api.get('/reports/stats');
    return response.data;
  },

  getLedgerBalance: async () => {
    const response = await api.get('/accounting/ledger/balance');
    return response.data;
  }
};

export default reportService;