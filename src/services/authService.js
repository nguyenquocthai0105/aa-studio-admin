import axiosClient from "./api";

const authService = {
  /**
   * Gửi yêu cầu đăng nhập Admin lên Backend
   * @param {Object} credentials - { username, password }
   */
  login: async (credentials) => {
    const response = await axiosClient.post("/auth/login", credentials);
    return response.data;
  },

  /**
   * Xóa token khỏi bộ nhớ khi đăng xuất
   */
  logout: () => {
    localStorage.removeItem("token");
  }
};

export default authService;