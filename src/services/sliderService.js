// src/services/sliderService.js
import api from './api';

export const sliderService = {
  getAll: async () => {
    const response = await api.get('/sliders');
    return response.data;
  },

  create: async (formData) => {
    const response = await api.post('/sliders', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Cập nhật lại thứ tự hàng loạt
  updateOrders: async (items) => {
    const response = await api.put('/sliders/reorder', { items });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/sliders/${id}`);
    return response.data;
  },
};