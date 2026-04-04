import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  FaUserShield, FaHome, FaMapMarkerAlt, FaFlag, FaPlane, FaCalendarAlt, 
  FaFileInvoiceDollar, FaMoneyBillWave, FaPercent, FaUsersCog, FaChartLine, 
  FaGlobeAsia, FaSignOutAlt 
} from 'react-icons/fa';

const Adminlayout = () => {
  const location = useLocation();

  // Component con giúp tự động thêm class Active cho Menu
  const NavLink = ({ to, icon: Icon, children }) => {
    const active = location.pathname === to;
    return (
      <Link 
        to={to} 
        className={`flex items-center text-[#f6e9e9] py-[15px] pr-[20px] border-b border-white/5 transition-all duration-300 no-underline ${active ? 'bg-[#3b5998] pl-[25px] text-white' : 'pl-[20px] hover:bg-[#3b5998] hover:pl-[25px] hover:text-white'}`}
      >
        <Icon className="mr-2 text-[1.1rem] shrink-0" />
        <span className="whitespace-normal leading-tight">{children}</span>
      </Link>
    );
  };

  return (
    // Áp dụng font Nunito giống Blade cho toàn bộ trang Admin
    <div className="flex min-h-screen bg-[#f8f9fa]" style={{ fontFamily: "'Nunito', sans-serif" }}>
      
      {/* CSS ẩn thanh cuộn xấu xí của Windows để Sidebar không bị hẹp lại */}
      <style>{`
        .sidebar-hide-scroll::-webkit-scrollbar { display: none; }
        .sidebar-hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* ================= SIDEBAR ================= */}
      <div className="w-[250px] bg-[#1e3c72] flex flex-col fixed h-screen z-50 overflow-y-auto sidebar-hide-scroll">
        
        <div className="p-5 text-center border-b border-white/10 bg-black/10 shrink-0">
          <h4 className="flex items-center justify-center gap-2 m-0 mb-1 text-xl font-bold text-white">
            <FaUserShield className="text-2xl" /> ADMIN
          </h4>
          <small className="text-white/80">Xin chào, Admin</small>
        </div>

        <nav className="flex-grow pb-4">
          <NavLink to="/admin" icon={FaHome}>Dashboard</NavLink>

          <div className="pt-[15px] px-[20px] pb-[5px] text-[0.75rem] font-bold text-[#adb5bd] uppercase">Vận Hành Bay</div>
          <NavLink to="/admin/san-bay" icon={FaMapMarkerAlt}>Sân Bay</NavLink>
          <NavLink to="/admin/hang-hang-khong" icon={FaFlag}>Hãng Hàng Không</NavLink>
          <NavLink to="/admin/may-bay" icon={FaPlane}>Đội Tàu Bay</NavLink>
          <NavLink to="/admin/chuyen-bay" icon={FaCalendarAlt}>Lịch Chuyến Bay</NavLink>

          <div className="pt-[15px] px-[20px] pb-[5px] text-[0.75rem] font-bold text-[#adb5bd] uppercase">Kinh Doanh</div>
          <NavLink to="/admin/don-hang" icon={FaFileInvoiceDollar}>Quản lý Đơn Hàng</NavLink>
          <NavLink to="/admin/gia-ve" icon={FaMoneyBillWave}>Cấu Hình Giá Vé</NavLink>
          <NavLink to="/admin/khuyen-mai" icon={FaPercent}>Mã Giảm Giá</NavLink>

          <div className="pt-[15px] px-[20px] pb-[5px] text-[0.75rem] font-bold text-[#adb5bd] uppercase">Hệ Thống</div>
          <NavLink to="/admin/tai-khoan" icon={FaUsersCog}>Tài khoản & Phân quyền</NavLink>

          <div className="pt-[15px] px-[20px] pb-[5px] text-[0.75rem] font-bold text-[#adb5bd] uppercase">Báo Cáo</div>
          <NavLink to="/admin/doanh-thu" icon={FaChartLine}>Quản Lý Doanh Thu</NavLink>
        </nav>

        <div className="mt-auto shrink-0">
          <Link to="/" className="flex items-center justify-center py-[12px] px-[20px] text-white bg-[#17a2b8] hover:bg-[#138496] hover:pl-[25px] transition-all duration-300 border-b border-black/10 no-underline">
            <FaGlobeAsia className="mr-2" /> Về Trang Khách Hàng
          </Link>
          <button className="flex items-center justify-center w-full py-[15px] px-[20px] text-white bg-[#dc3545] hover:bg-[#bb2d3b] transition-all duration-300 no-underline border-none cursor-pointer">
            <FaSignOutAlt className="mr-2" /> Đăng Xuất
          </button>
        </div>
      </div>

      {/* ================= CONTENT WRAPPER ================= */}
      <div className="flex-1 w-full p-[30px] ml-[250px]">
        <Outlet />
      </div>

    </div>
  );
};

export default Adminlayout;