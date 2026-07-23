import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import CreateAlbum from "../pages/CreateAlbum/CreateAlbum";
import EditAlbum from "../pages/Albums/EditAlbum";
import CreateCostume from "../pages/CreateCostume/CreateCostume";
import EditCostume from "../pages/EditCostume/EditCostume";
import CreateSlider from "../pages/CreateSlider/CreateSlider";

function AppRoutes() {
  return (
    <Routes>
      {/* Trang chủ tự động điều hướng sang login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={<Dashboard />} />

      {/* Quản lý Album */}
      <Route path="/albums/new" element={<CreateAlbum />} />
      <Route path="/albums/edit/:id" element={<EditAlbum />} />

      {/* Quản lý Trang Phục */}
      <Route path="/costumes/new" element={<CreateCostume />} />
      <Route path="/costumes/edit/:id" element={<EditCostume />} />

      {/* 2. ROUTE QUẢN LÝ SLIDER MỚI */}
      <Route path="/slider" element={<CreateSlider />} />

      {/* 3. Bẫy các đường dẫn lạ (LUÔN ĐẶT Ở CUỐI CÙNG) */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;