import axios from 'axios';

// Định nghĩa Base URL tập trung tại đây
// Tự động lấy link từ biến môi trường của Vercel, nếu không có (chạy local) thì dùng cổng 5000
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tự động đính kèm Token vào Header nếu có (phục vụ cho các chức năng cần bảo mật sau này)
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;