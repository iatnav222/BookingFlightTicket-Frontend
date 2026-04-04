import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
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
      </div>
    </header>
  );
};

export default Header;