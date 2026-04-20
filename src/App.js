import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. Import Layouts
import UserLayout from './layouts/Userlayout';
import AdminLayout from './layouts/Adminlayout';

// 2. Import Pages - Nhóm Admin
import AdminHome from './pages/admin/Adminhome';
import ChuyenBayList from './pages/admin/chuyen-bay/ChuyenBayList';
import ChuyenBayForm from './pages/admin/chuyen-bay/ChuyenBayForm';
import OrderList from './pages/admin/don-hang/Orderlist';
import OrderForm from './pages/admin/don-hang/OrderForm';
import TaiKhoanForm from './pages/admin/tai-khoan/TaiKhoanForm';
import TaiKhoanList from './pages/admin/tai-khoan/TaiKhoanList';
import TaiKhoanShow from './pages/admin/tai-khoan/TaiKhoanShow';
import MayBayList from './pages/admin/may-bay/MayBayList';
import MayBayForm from './pages/admin/may-bay/MayBayForm';
import HangHangKhongList from './pages/admin/hang-bay/HangHangKhongList';
import HangHangKhongForm from './pages/admin/hang-bay/HangHangKhongForm';
import SanBayList from './pages/admin/sanbay/SanBayList';
import SanBayForm from './pages/admin/sanbay/SanBayForm';
import GiaVeList from './pages/admin/gia-ve/GiaVeList';
import GiaVeForm from './pages/admin/gia-ve/GiaVeForm';
import KhuyenMaiList from './pages/admin/khuyen-mai/KhuyenMaiList';
import KhuyenMaiForm from './pages/admin/khuyen-mai/KhuyenMaiForm';
import DoanhThu from './pages/admin/doanh-thu/DoanhThu';

// 3. Import Pages - Nhóm User & Auth
import Home from './pages/user/Home'; 
import Users from './Users'; 
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import TimKiemChuyenBay from './pages/user/dat-ve/TimKiemChuyenBay';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import ProtectedRoute from './components/admin/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* ==========================================
            NHÓM USER (Hiển thị Header và Footer) 
            ========================================== */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="users" element={<Users />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="dat-ve/tim-kiem" element={<TimKiemChuyenBay />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminHome />} />
          
            {/* Quản lý Chuyến Bay */}
            <Route path="chuyen-bay" element={<ChuyenBayList />} />
            <Route path="chuyen-bay/tao" element={<ChuyenBayForm />} />
            <Route path="chuyen-bay/sua/:id" element={<ChuyenBayForm />} />

            {/* Quản lý Đơn Hàng */}
            <Route path="don-hang" element={<OrderList />} />
            <Route path="don-hang/:id" element={<OrderForm />} />

            {/* Quản lý Tài Khoản */}
            <Route path="tai-khoan" element={<TaiKhoanList />} />
            <Route path="tai-khoan/tao" element={<TaiKhoanForm />} />
            <Route path="tai-khoan/sua/:id" element={<TaiKhoanForm />} />
            <Route path="tai-khoan/xem/:id" element={<TaiKhoanShow />} />

            {/* Quản lý Máy Bay */}
            <Route path="may-bay" element={<MayBayList/>} />
            <Route path="may-bay/tao" element={<MayBayForm />} />
            <Route path="may-bay/sua/:id" element={<MayBayForm />} />

            {/* Quản lý Hãng Hàng Không */}
            <Route path="hang-hang-khong" element={<HangHangKhongList />} />
            <Route path="hang-hang-khong/tao" element={<HangHangKhongForm />} />
            <Route path="hang-hang-khong/sua/:id" element={<HangHangKhongForm />} />

            {/* Quản lý Sân bay */}
            <Route path="san-bay" element={<SanBayList />} />
            <Route path="san-bay/tao" element={<SanBayForm />} />
            <Route path="san-bay/sua/:id" element={<SanBayForm />} />
          
            {/* Quản lý Giá Vé */}
            <Route path="gia-ve" element={<GiaVeList />} />
            <Route path="gia-ve/tao" element={<GiaVeForm />} />
            <Route path="gia-ve/sua/:id" element={<GiaVeForm />} />

            {/* Quản lý Khuyến Mãi */}
            <Route path="khuyen-mai" element={<KhuyenMaiList />} />
            <Route path="khuyen-mai/tao" element={<KhuyenMaiForm />} />
            <Route path="khuyen-mai/sua/:id" element={<KhuyenMaiForm />} />
          
            {/* Quản lý Doanh Thu */}
            <Route path="doanh-thu" element={<DoanhThu />} />
          </Route>            
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;