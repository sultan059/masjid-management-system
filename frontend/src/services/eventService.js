import api from './api';

const eventService = {
  getAllEvents: async (page = 0, size = 10) => {
    const response = await api.get(`/events?page=${page}&size=${size}`);
    return response.data;
  },

  getUpcomingEvents: async () => {
    const response = await api.get('/events/upcoming');
    return response.data;
  },

  getFeaturedEvents: async () => {
    const response = await api.get('/events/featured');
    return response.data;
  },

  getEventById: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  createEvent: async (data) => {
    const response = await api.post('/events', data);
    return response.data;
  },

  updateEvent: async (id, data) => {
    const response = await api.put(`/events/${id}`, data);
    return response.data;
  },

  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  }
};

export default eventService;