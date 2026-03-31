import React, { useState } from 'react';
import Authlayout from '../layouts/Authlayout';
import { FaIdCard, FaEnvelope, FaUserTag, FaLock, FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
const Register = () => {
  const [formData, setFormData] = useState({
    hoten: '', email: '', username: '', password: '', password_confirmation: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Register Data:', formData);
    // Xử lý gọi API đăng ký
  };

  return (
    <Authlayout maxWidth="max-w-[500px]">
      <div className="mb-8">
        <h2 className="mb-1 text-2xl font-extrabold tracking-wide text-[#1e3c72] uppercase">Tạo Tài Khoản Mới</h2>
        <p className="text-sm text-gray-500">Trở thành thành viên FlyNow ngay hôm nay</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Họ tên */}
        <div className="relative mb-5">
          <FaIdCard className="absolute text-lg text-blue-500 -translate-y-1/2 left-4 top-1/2" />
          <input type="text" name="hoten" value={formData.hoten} onChange={handleChange} placeholder="Họ và tên đầy đủ" required
            className="w-full py-3 pr-4 transition-all duration-300 border border-gray-200 outline-none pl-11 rounded-full focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
        </div>

        {/* Email */}
        <div className="relative mb-5">
          <FaEnvelope className="absolute text-lg text-blue-500 -translate-y-1/2 left-4 top-1/2" />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Địa chỉ Email" required
            className="w-full py-3 pr-4 transition-all duration-300 border border-gray-200 outline-none pl-11 rounded-full focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
        </div>

        {/* Username */}
        <div className="relative mb-5">
          <FaUserTag className="absolute text-lg text-blue-500 -translate-y-1/2 left-4 top-1/2" />
          <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Tên đăng nhập" required
            className="w-full py-3 pr-4 transition-all duration-300 border border-gray-200 outline-none pl-11 rounded-full focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
        </div>

        {/* Mật khẩu & Nhập lại */}
        <div className="grid grid-cols-1 gap-4 mb-5 md:grid-cols-2">
          <div className="relative">
            <FaLock className="absolute text-lg text-blue-500 -translate-y-1/2 left-4 top-1/2" />
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Mật khẩu" required
              className="w-full py-3 pr-4 transition-all duration-300 border border-gray-200 outline-none pl-11 rounded-full focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
          </div>
          <div className="relative">
            <FaCheckCircle className="absolute text-lg text-blue-500 -translate-y-1/2 left-4 top-1/2" />
            <input type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} placeholder="Nhập lại MK" required
              className="w-full py-3 pr-4 transition-all duration-300 border border-gray-200 outline-none pl-11 rounded-full focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
          </div>
        </div>

        <button type="submit" className="w-full p-3 mt-2 font-bold tracking-wide text-white uppercase transition-all duration-300 border-none rounded-full cursor-pointer bg-gradient-to-br from-blue-500 to-blue-700 shadow-[0_5px_15px_rgba(0,123,255,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,123,255,0.4)]">
          Đăng Ký Thành Viên
        </button>
      </form>

      <div className="mt-5 text-sm text-gray-500">
        Đã có tài khoản? <Link to="/login" className="font-bold text-[#ff5e1f] hover:underline">Đăng nhập</Link>
      </div>
    </Authlayout>
  );
};

export default Register;