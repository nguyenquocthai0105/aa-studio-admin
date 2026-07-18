import axiosClient from './api';

const albumService = {
  getAllAlbums: async () => {
    const response = await axiosClient.get('/albums');
    return response.data;
  },

  createAlbum: async (formData) => {
    const response = await axiosClient.post('/albums', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateAlbum: async (id, formData) => {
    const response = await axiosClient.put(`/albums/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteAlbum: async (id) => {
    const response = await axiosClient.delete(`/albums/${id}`);
    return response.data;
  }
};

export default albumService;