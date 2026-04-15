import React, { useState } from 'react';
import Authlayout from '../../layouts/Authlayout';
import { FaUnlockAlt, FaEnvelope, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Forgot Password Email:', email);
    // Giả lập call API ở đây
    setSuccessMsg('Đã gửi liên kết đặt lại mật khẩu! Vui lòng kiểm tra email.');
  };

  return (
    <Authlayout>
      <div className="mb-4">
        <FaUnlockAlt className="mb-3 text-5xl text-blue-500 mx-auto" />
        <h2 className="mb-[5px] text-[1.5rem] font-[800] text-[#1e3c72] uppercase">Quên Mật Khẩu?</h2>
        <p className="mb-[30px] text-[0.9rem] text-[#666]">Nhập email của bạn để nhận liên kết đặt lại mật khẩu</p>
      </div>

      {successMsg && (
        <div className="py-2 text-base shadow-sm rounded-full mb-3 bg-green-100 text-green-700 flex items-center justify-center">
            <FaCheckCircle className="mr-1" /> {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="relative mb-[20px]">
          <FaEnvelope className="absolute text-[1.1rem] text-[#007bff] -translate-y-1/2 left-[15px] top-1/2" />
          <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Nhập địa chỉ Email đã đăng ký" required
            className="w-full py-[12px] px-[15px] pl-[45px] transition-all duration-300 border border-[#e1e1e1] outline-none rounded-[50px] focus:border-[#007bff] focus:shadow-[0_0_0_4px_rgba(0,123,255,0.1)] text-[1rem]" />
        </div>

        <button type="submit" className="w-full p-[12px] font-[700] tracking-[1px] text-white uppercase transition-all duration-300 border-none rounded-[50px] cursor-pointer bg-gradient-to-br from-[#007bff] to-[#0056b3] shadow-[0_5px_15px_rgba(0,123,255,0.3)] hover:-translate-y-[2px] hover:shadow-[0_8px_20px_rgba(0,123,255,0.4)]">
          Gửi Liên Kết
        </button>
      </form>

      <div className="mt-[20px] text-[0.9rem] text-[#555]">
        <Link to="/login" className="font-[700] text-[#ff5e1f] hover:underline flex items-center justify-center">
            <FaArrowLeft className="mr-1" /> Quay lại Đăng nhập
        </Link>
      </div>
    </Authlayout>
  );
};

export default ForgotPassword;