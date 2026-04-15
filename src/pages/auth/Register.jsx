import React, { useState } from 'react';
import Authlayout from '../../layouts/Authlayout';
import { FaIdCard, FaEnvelope, FaUserTag, FaLock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../services/authApi'; // Import authApi

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    hoten: '', email: '', username: '', password: '', password_confirmation: ''
  });
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Validate mật khẩu ở phía Frontend
    if (formData.password !== formData.password_confirmation) {
      setErrorMsg('Mật khẩu xác nhận không khớp!');
      return;
    }

    setLoading(true);

    try {
      // Gọi API đăng ký
      await authApi.register(formData);
      
      setSuccessMsg('Đăng ký thành công! Đang chuyển đến trang đăng nhập...');
      
      // Chuyển hướng sang trang login sau khi đăng ký thành công
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (error) {
      // Xử lý các lỗi validation từ phía Backend
      const serverErrors = error.response?.data?.errors;
      if (serverErrors) {
          const firstErrorKey = Object.keys(serverErrors)[0];
          setErrorMsg(serverErrors[firstErrorKey][0]);
      } else {
          setErrorMsg(error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Authlayout maxWidth="max-w-[500px]">
      <div className="mb-4">
        <h2 className="mb-[5px] text-[1.5rem] font-[800] text-[#1e3c72] uppercase">Tạo Tài Khoản Mới</h2>
        <p className="mb-[30px] text-[0.9rem] text-[#666]">Trở thành thành viên FlyNow ngay hôm nay</p>
      </div>

      {/* Thông báo */}
      {successMsg && (
        <div className="py-2 text-base shadow-sm rounded-full mb-4 bg-green-100 text-green-700 flex items-center justify-center">
            <FaCheckCircle className="mr-2" /> {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="py-2 px-4 text-sm shadow-sm rounded-full mb-4 bg-red-100 text-red-700 flex items-center justify-center">
            <FaExclamationCircle className="mr-2 shrink-0" /> {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="relative mb-[20px]">
          <FaIdCard className="absolute text-[1.1rem] text-[#007bff] -translate-y-1/2 left-[15px] top-1/2" />
          <input type="text" name="hoten" value={formData.hoten} onChange={handleChange} placeholder="Họ và tên đầy đủ" required
            className="w-full py-[12px] px-[15px] pl-[45px] transition-all duration-300 border border-[#e1e1e1] outline-none rounded-[50px] focus:border-[#007bff] focus:shadow-[0_0_0_4px_rgba(0,123,255,0.1)] text-[1rem]" />
        </div>

        <div className="relative mb-[20px]">
          <FaEnvelope className="absolute text-[1.1rem] text-[#007bff] -translate-y-1/2 left-[15px] top-1/2" />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Địa chỉ Email" required
            className="w-full py-[12px] px-[15px] pl-[45px] transition-all duration-300 border border-[#e1e1e1] outline-none rounded-[50px] focus:border-[#007bff] focus:shadow-[0_0_0_4px_rgba(0,123,255,0.1)] text-[1rem]" />
        </div>

        <div className="relative mb-[20px]">
          <FaUserTag className="absolute text-[1.1rem] text-[#007bff] -translate-y-1/2 left-[15px] top-1/2" />
          <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Tên đăng nhập" required
            className="w-full py-[12px] px-[15px] pl-[45px] transition-all duration-300 border border-[#e1e1e1] outline-none rounded-[50px] focus:border-[#007bff] focus:shadow-[0_0_0_4px_rgba(0,123,255,0.1)] text-[1rem]" />
        </div>

        <div className="grid grid-cols-1 gap-4 mb-[20px] md:grid-cols-2">
          <div className="relative">
            <FaLock className="absolute text-[1.1rem] text-[#007bff] -translate-y-1/2 left-[15px] top-1/2" />
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Mật khẩu" required
              className="w-full py-[12px] px-[15px] pl-[45px] transition-all duration-300 border border-[#e1e1e1] outline-none rounded-[50px] focus:border-[#007bff] focus:shadow-[0_0_0_4px_rgba(0,123,255,0.1)] text-[1rem]" />
          </div>
          <div className="relative">
            <FaCheckCircle className="absolute text-[1.1rem] text-[#007bff] -translate-y-1/2 left-[15px] top-1/2" />
            <input type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} placeholder="Nhập lại MK" required
              className="w-full py-[12px] px-[15px] pl-[45px] transition-all duration-300 border border-[#e1e1e1] outline-none rounded-[50px] focus:border-[#007bff] focus:shadow-[0_0_0_4px_rgba(0,123,255,0.1)] text-[1rem]" />
          </div>
        </div>

        <button 
            type="submit" 
            disabled={loading}
            className={`w-full mt-[8px] p-[12px] font-[700] tracking-[1px] text-white uppercase transition-all duration-300 border-none rounded-[50px] cursor-pointer shadow-[0_5px_15px_rgba(0,123,255,0.3)] hover:-translate-y-[2px] hover:shadow-[0_8px_20px_rgba(0,123,255,0.4)] ${loading ? 'bg-gray-400' : 'bg-gradient-to-br from-[#007bff] to-[#0056b3]'}`}
        >
          {loading ? 'Đang xử lý...' : 'Đăng Ký Thành Viên'}
        </button>
      </form>

      <div className="mt-[20px] text-[0.9rem] text-[#555]">
        Đã có tài khoản? <Link to="/login" className="font-[700] text-[#ff5e1f] hover:underline">Đăng nhập</Link>
      </div>
    </Authlayout>
  );
};

export default Register;