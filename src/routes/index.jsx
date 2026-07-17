import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import CreateAlbum from "../pages/CreateAlbum/CreateAlbum";

function AppRoutes() {
  return (
    <Routes>
      {/* Vào trang chủ tự động điều hướng sang login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/albums/new" element={<CreateAlbum />} />
      
      {/* Bẫy các đường dẫn lạ để tránh lỗi trắng trang */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;