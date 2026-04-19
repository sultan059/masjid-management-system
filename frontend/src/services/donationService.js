import api from './api';

const donationService = {
  getAllDonations: async (page = 0, size = 10) => {
    const response = await api.get(`/payments?page=${page}&size=${size}`);
    return response.data;
  },

  getDonationStats: async () => {
    const response = await api.get('/payments/stats');
    return response.data;
  },

  getDonationById: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  createDonation: async (data) => {
    const response = await api.post('/payments', data);
    return response.data;
  },

  getDonationsByType: async (type, page = 0, size = 10) => {
    const response = await api.get(`/payments/type/${type}?page=${page}&size=${size}`);
    return response.data;
  }
};

export default donationService;