import React, { useState, useEffect, useRef} from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [user, setUser] = useState(null);
  const [ isdropdown, setisDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  useEffect(() => {
    const handleClickOusite = (event) =>{
      if(dropdownRef.current && !dropdownRef.current.contains(event.target)){
        setisDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOusite);
    return () => document.removeEventListener("mousedown", handleClickOusite);
    },[]);
    const handleLogout = () => {
    // Xóa thông tin khỏi trình duyệt
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // Xóa token nếu bạn có lưu    
    // Reset state
    setUser(null);
    setisDropdown(false);
    
    // Chuyển hướng về trang chủ
    navigate('/'); 
  };
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 bg-white shadow-md">
    
      {/* Logo */}
      <Link to="/" className="flex items-center text-2xl font-bold text-blue-600">
        <i className="mr-2 fas fa-paper-plane"></i> FLYNOW
      </Link>

      {/* Menu Điều Hướng */}
      <nav className="hidden gap-6 font-semibold text-gray-600 md:flex">
        <Link to="/" className="transition hover:text-blue-600">Trang Chủ</Link>
        <Link to="/khuyen-mai" className="transition hover:text-blue-600">Khuyến Mãi</Link>
        <Link to="/ho-tro" className="transition hover:text-blue-600">Hỗ Trợ</Link>
      </nav>
      
      {/* Cụm Nút Đăng Nhập / Đăng Ký */}
      <div className="flex gap-4">
        {user ? (<div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setisDropdown(!isdropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-50 transition border border-transparent hover:border-gray-200 focus:outline-none"
            >
              {/* Hiển thị avatar nếu có (VD: từ Google Login), không có thì dùng Icon mặc định */}
              {user.avatar || user.picture ? (
                <img src={user.avatar || user.picture} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-gray-200" />
              ) : (
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  <i className="fas fa-user"></i>
                </div>
              )}
              
              <span className="font-medium text-gray-700">
                Chào, {user.name || user.username || 'Bạn'}
              </span>
              
              <i className={`fas fa-chevron-down text-xs text-gray-400 transition-transform duration-200 ${isdropdown ? 'rotate-180' : ''}`}></i>
            </button>
            {/* Dropdown Menu */}
            {isdropdown && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                  <p className="text-sm font-semibold text-gray-800">{user.name || user.username}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email || 'Thành viên FlyNow'}</p>
                </div>
                
                <div className="py-1">
                  <Link 
                    to="/thong-tin-ca-nhan" 
                    onClick={() => setisDropdown(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <i className="fas fa-id-card w-4 text-center"></i> Thông tin cá nhân
                  </Link>
                  <Link 
                    to="/don-hang-cua-toi" 
                    onClick={() => setisDropdown(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <i className="fas fa-ticket-alt w-4 text-center"></i> Vé của tôi
                  </Link>
                </div>
                
                <div className="border-t border-gray-100 py-1">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                  >
                    <i className="fas fa-sign-out-alt w-4 text-center"></i> Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
        <>
            <Link 
              to="/login" 
              className="px-5 py-2 font-medium text-blue-600 transition border border-blue-600 rounded-full hover:bg-blue-600 hover:text-white"
            >
              Đăng Nhập
            </Link>
            <Link 
              to="/register" 
              className="px-5 py-2 font-medium text-white transition bg-orange-500 rounded-full shadow-lg hover:bg-orange-600"
            >
              Đăng Ký
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;