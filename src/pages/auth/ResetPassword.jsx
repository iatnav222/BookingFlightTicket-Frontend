import React, { useState } from 'react';
import Authlayout from '../../layouts/Authlayout';
import { FaKey, FaEnvelope, FaLock, FaCheckCircle } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Tự động bắt param ?token=... trên URL
  const [formData, setFormData] = useState({ email: '', password: '', password_confirmation: '' });
  const [errorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Reset Password Data:', { ...formData, token });
    // Call API đặt lại mật khẩu ở đây
  };

  return (
    <Authlayout>
      <div className="mb-4">
        <FaKey className="mb-3 text-5xl text-blue-500 mx-auto" />
        <h2 className="mb-[5px] text-[1.5rem] font-[800] text-[#1e3c72] uppercase">Đặt Lại Mật Khẩu</h2>
        <p className="mb-[30px] text-[0.9rem] text-[#666]">Vui lòng nhập mật khẩu mới của bạn</p>
      </div>

      {errorMsg && (
        <div className="py-2 text-base shadow-sm rounded-full mb-3 bg-red-100 text-red-700 flex items-center justify-center">
             {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="relative mb-[20px]">
          <FaEnvelope className="absolute text-[1.1rem] text-[#007bff] -translate-y-1/2 left-[15px] top-1/2" />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Nhập lại Email của bạn" required
            className="w-full py-[12px] px-[15px] pl-[45px] transition-all duration-300 border border-[#e1e1e1] outline-none rounded-[50px] focus:border-[#007bff] focus:shadow-[0_0_0_4px_rgba(0,123,255,0.1)] text-[1rem]" />
        </div>

        <div className="relative mb-[20px]">
          <FaLock className="absolute text-[1.1rem] text-[#007bff] -translate-y-1/2 left-[15px] top-1/2" />
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Mật khẩu mới" required autoFocus
            className="w-full py-[12px] px-[15px] pl-[45px] transition-all duration-300 border border-[#e1e1e1] outline-none rounded-[50px] focus:border-[#007bff] focus:shadow-[0_0_0_4px_rgba(0,123,255,0.1)] text-[1rem]" />
        </div>

        <div className="relative mb-[20px]">
          <FaCheckCircle className="absolute text-[1.1rem] text-[#007bff] -translate-y-1/2 left-[15px] top-1/2" />
          <input type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} placeholder="Xác nhận mật khẩu" required
            className="w-full py-[12px] px-[15px] pl-[45px] transition-all duration-300 border border-[#e1e1e1] outline-none rounded-[50px] focus:border-[#007bff] focus:shadow-[0_0_0_4px_rgba(0,123,255,0.1)] text-[1rem]" />
        </div>

        <button type="submit" className="w-full p-[12px] font-[700] tracking-[1px] text-white uppercase transition-all duration-300 border-none rounded-[50px] cursor-pointer bg-gradient-to-br from-[#007bff] to-[#0056b3] shadow-[0_5px_15px_rgba(0,123,255,0.3)] hover:-translate-y-[2px] hover:shadow-[0_8px_20px_rgba(0,123,255,0.4)]">
          Đổi Mật Khẩu
        </button>
      </form>
    </Authlayout>
  );
};

export default ResetPassword;