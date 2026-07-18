import axiosClient from "./api";

const costumeService = {
  // Lấy toàn bộ danh sách trang phục
  getAllCostumes: async () => {
    const response = await axiosClient.get('/costumes');
    return response.data;
  },

  // Tạo mới một trang phục (Payload là FormData chứa file đã nén)
  createCostume: async (formData) => {
    const response = await axiosClient.post('/costumes', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Cập nhật trang phục theo ID
  updateCostume: async (id, formData) => {
    const response = await axiosClient.put(`/costumes/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Xóa vĩnh viễn một trang phục
  deleteCostume: async (id) => {
    const response = await axiosClient.delete(`/costumes/${id}`);
    return response.data;
  }
};

export default costumeService;