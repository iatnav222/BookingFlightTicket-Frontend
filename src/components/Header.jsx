import React from 'react';
import { Link } from 'react-router-dom'; // 1. Import Link từ react-router-dom

const Header = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50 py-4 px-8 flex justify-between items-center">
    
      <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center">
        <i className="fas fa-paper-plane mr-2"></i> FLYNOW
      </Link>

      <nav className="hidden md:flex gap-6 font-semibold text-gray-600">
        <a href="/" className="hover:text-blue-600 transition">Trang Chủ</a>
        <a href="/khuyen-mai" className="hover:text-blue-600 transition">Khuyến Mãi</a>
        <a href="/ho-tro" className="hover:text-blue-600 transition">Hỗ Trợ</a>
      </nav>
      <div className="flex gap-4">
        <button className="px-5 py-2 border border-blue-600 text-blue-600 rounded-full font-medium hover:bg-blue-600 hover:text-white transition">Đăng Nhập</button>
        <button className="px-5 py-2 bg-orange-500 text-white rounded-full font-medium shadow-lg hover:bg-orange-600 transition">Đăng Ký</button>
      </div>
    </header>
  );
};

export default Header;