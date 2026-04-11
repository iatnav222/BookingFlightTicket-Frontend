import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. Import Layouts (Khung giao diện)
import UserLayout from './layouts/Userlayout';
import AdminLayout from './layouts/Adminlayout';
import ChuyenBayList from './pages/admin/chuyen-bay/ChuyenBayList';
import ChuyenBayForm from './pages/admin/chuyen-bay/ChuyenBayForm';
<<<<<<< HEAD
import OrderList from './pages/admin/don-hang/Orderlist';
import OrderForm from './pages/admin/don-hang/OrderForm';
import AccountList from './pages/admin/tai-khoan/AccountList';
import AccountForm from './pages/admin/tai-khoan/AccountForm';

=======
import MayBayList from './pages/admin/may-bay/MayBayList';
import MayBayForm from './pages/admin/may-bay/MayBayForm';
import HangHangKhongList from './pages/admin/hang-bay/HangHangKhongList';
import HangHangKhongForm from './pages/admin/hang-bay/HangHangKhongForm';
>>>>>>> b2d3549e2845f49a057ca46f078ba01cd8f66888
// 2. Import Pages - Nhóm User (Khách hàng)
// Lưu ý: Đảm bảo bạn đã di chuyển Home.jsx vào thư mục src/pages/user/
import Home from './pages/user/Home'; 
import Users from './Users'; // Tạm thời giữ nguyên đường dẫn nếu file này nằm ở src/

// 3. Import Pages - Nhóm Auth (Xác thực)
// Lưu ý: Đảm bảo bạn đã di chuyển Login và Register vào thư mục src/pages/auth/
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// 4. Import Pages - Nhóm Admin (Quản trị)
import AdminHome from './pages/admin/Adminhome';

function App() {
  return (
    <Router>
      <Routes>
        {/* ==========================================
            NHÓM USER (Hiển thị Header và Footer) 
            ========================================== */}
        {/* Bất kỳ route nào nằm trong khối này đều sẽ được bọc bởi UserLayout */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="users" element={<Users />} />
          {/* Thêm các route khác của User ở đây (vd: /khuyen-mai) */}
        </Route>

        {/* ==========================================
            NHÓM ADMIN (Hiển thị Sidebar Admin) 
            ========================================== */}
        {/* Bất kỳ route nào nằm trong khối này đều sẽ được bọc bởi AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path="chuyen-bay" element={<ChuyenBayList />} />
          <Route path="chuyen-bay/tao" element={<ChuyenBayForm />} />
          <Route path="chuyen-bay/sua/:id" element={<ChuyenBayForm />} />
<<<<<<< HEAD
          <Route path="/admin/don-hang" element={<OrderList />} />
          <Route path="/admin/don-hang/:id" element={<OrderForm />} />
          <Route path="/admin/tai-khoan" element={<AccountList />} />
          <Route path="/admin/tai-khoan/tao" element={<AccountForm />} />
          <Route path="/admin/tai-khoan/:id" element={<AccountForm />} />
          
=======
          <Route path="may-bay" element={<MayBayList/>} />
          <Route path="may-bay/tao" element={<MayBayForm />} />
          <Route path="may-bay/sua/:id" element={<MayBayForm />} />
          <Route path="hang-hang-khong" element={<HangHangKhongList />} />
          <Route path="hang-hang-khong/tao" element={<HangHangKhongForm />} />
          <Route path="hang-hang-khong/sua/:id" element={<HangHangKhongForm />} />
>>>>>>> b2d3549e2845f49a057ca46f078ba01cd8f66888
          {/* Thêm các route khác của Admin ở đây (vd: /admin/khuyen-mai) */}
        </Route>

        {/* ==========================================
            NHÓM AUTH (Không hiển thị Header/Footer) 
            ========================================== */}
        {/* Vì trong file Login.jsx và Register.jsx bạn đã bọc sẵn component <Authlayout> rồi, nên ở đây chỉ cần gọi thẳng Page */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      </Routes>
    </Router>
  );
}

export default App;