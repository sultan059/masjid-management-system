import api from './api';

const inventoryService = {
  getAllItems: async (page = 0, size = 20) => {
    const response = await api.get(`/accounting/inventory?page=${page}&size=${size}`);
    return response.data;
  },

  getLowStockItems: async () => {
    const response = await api.get('/accounting/inventory/low-stock');
    return response.data;
  },

  getItemById: async (id) => {
    const response = await api.get(`/accounting/inventory/${id}`);
    return response.data;
  },

  createItem: async (data) => {
    const response = await api.post('/accounting/inventory', data);
    return response.data;
  },

  updateItem: async (id, data) => {
    const response = await api.put(`/accounting/inventory/${id}`, data);
    return response.data;
  },

  deleteItem: async (id) => {
    const response = await api.delete(`/accounting/inventory/${id}`);
    return response.data;
  },

  updateQuantity: async (id, quantity) => {
    const response = await api.patch(`/accounting/inventory/${id}/quantity?quantity=${quantity}`);
    return response.data;
  }
};

export default inventoryService;