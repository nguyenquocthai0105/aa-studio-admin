import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes"; // Đi thẳng vào thư mục routes để lấy file index

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;