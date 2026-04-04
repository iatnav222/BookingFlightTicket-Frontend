import React, { useState } from 'react';
import Authlayout from '../../layouts/Authlayout';
import { FaPlaneDeparture, FaUser, FaLock } from 'react-icons/fa'; // Cần cài react-icons
import { Link } from 'react-router-dom';
const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '', rememberMe: false });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login Submit:', formData);
    // Xử lý gọi API đăng nhập tại đây
  };

  return (
    <Authlayout>
      <div className="mb-8">
        <FaPlaneDeparture className="mb-4 text-5xl text-blue-500 mx-auto" />
        <h2 className="mb-1 text-2xl font-extrabold tracking-wide text-[#1e3c72] uppercase">Chào mừng trở lại!</h2>
        <p className="text-sm text-gray-500">Đăng nhập để tiếp tục hành trình của bạn</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Username */}
        <div className="relative mb-5">
          <FaUser className="absolute text-lg text-blue-500 -translate-y-1/2 left-4 top-1/2" />
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Email hoặc Tên đăng nhập"
            className="w-full py-3 pr-4 transition-all duration-300 border border-gray-200 outline-none pl-11 rounded-full focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            required
            autoFocus
          />
        </div>

        {/* Password */}
        <div className="relative mb-5">
          <FaLock className="absolute text-lg text-blue-500 -translate-y-1/2 left-4 top-1/2" />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mật khẩu"
            className="w-full py-3 pr-4 transition-all duration-300 border border-gray-200 outline-none pl-11 rounded-full focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            required
          />
        </div>

        {/* Quên mật khẩu & Ghi nhớ */}
        <div className="flex items-center justify-between px-2 mb-6 text-sm">
          <div className="flex items-center gap-2 cursor-pointer">
            <input 
                type="checkbox" 
                id="rememberMe" 
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded cursor-pointer" 
            />
            <label htmlFor="rememberMe" className="text-gray-500 cursor-pointer">Ghi nhớ</label>
          </div>
          <Link to="/forgot-password" className="font-bold text-blue-500 no-underline">Quên mật khẩu?</Link>
        </div>

        {/* Nút bấm */}
        <button 
            type="submit" 
            className="w-full p-3 font-bold tracking-wide text-white uppercase transition-all duration-300 border-none rounded-full cursor-pointer bg-gradient-to-br from-blue-500 to-blue-700 shadow-[0_5px_15px_rgba(0,123,255,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,123,255,0.4)]"
        >
          Đăng Nhập
        </button>
      </form>

      <div className="mt-5 text-sm text-gray-500">
        Chưa có tài khoản? <Link to="/register" className="font-bold text-[#ff5e1f] hover:underline">Đăng ký ngay</Link>
      </div>
    </Authlayout>
  );
};

export default Login;