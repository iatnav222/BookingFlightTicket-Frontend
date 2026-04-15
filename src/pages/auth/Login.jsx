import React, { useState } from 'react';
import Authlayout from '../../layouts/Authlayout';
import { FaPlaneDeparture, FaUser, FaLock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../services/authApi'; // Import authApi

const Login = () => {
  const navigate = useNavigate(); // Dùng để chuyển hướng sau khi đăng nhập
  const [formData, setFormData] = useState({ username: '', password: '', rememberMe: false });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      // Gọi API đăng nhập
      const response = await authApi.login({
        username: formData.username,
        password: formData.password
      });

      // Xử lý khi thành công (Lưu token vào localStorage tuỳ thuộc vào Backend trả về)
      if (response.token) {
         localStorage.setItem('token', response.token);
         localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      setSuccessMsg('Đăng nhập thành công! Đang chuyển hướng...');
      
      // Phân quyền chuyển hướng (giả sử có thuộc tính role trong response)
      setTimeout(() => {
        if (response.user && response.user.quyen === 'admin') {
           navigate('/admin');
        } else {
           navigate('/');
        }
      }, 1000);

    } catch (error) {
      // Xử lý lỗi từ backend
      setErrorMsg(error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Authlayout>
      <div className="mb-4">
        <FaPlaneDeparture className="mb-3 text-5xl text-blue-500 mx-auto" />
        <h2 className="mb-1 text-[1.5rem] font-[800] text-[#1e3c72] uppercase">Chào mừng trở lại!</h2>
        <p className="mb-[30px] text-[0.9rem] text-[#666]">Đăng nhập để tiếp tục hành trình của bạn</p>
      </div>

      {/* Thông báo lỗi/thành công */}
      {successMsg && (
        <div className="py-2 text-base shadow-sm rounded-full mb-3 bg-green-100 text-green-700 flex items-center justify-center">
            <FaCheckCircle className="mr-1" /> {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="py-2 text-base shadow-sm rounded-full mb-3 bg-red-100 text-red-700 flex items-center justify-center">
            <FaExclamationCircle className="mr-1" /> {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Username */}
        <div className="relative mb-[20px]">
          <FaUser className="absolute text-[1.1rem] text-[#007bff] -translate-y-1/2 left-[15px] top-1/2" />
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Email hoặc Tên đăng nhập"
            className="w-full py-[12px] px-[15px] pl-[45px] transition-all duration-300 border border-[#e1e1e1] outline-none rounded-[50px] focus:border-[#007bff] focus:shadow-[0_0_0_4px_rgba(0,123,255,0.1)] text-[1rem]"
            required
            autoFocus
          />
        </div>

        {/* Password */}
        <div className="relative mb-[20px]">
          <FaLock className="absolute text-[1.1rem] text-[#007bff] -translate-y-1/2 left-[15px] top-1/2" />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mật khẩu"
            className="w-full py-[12px] px-[15px] pl-[45px] transition-all duration-300 border border-[#e1e1e1] outline-none rounded-[50px] focus:border-[#007bff] focus:shadow-[0_0_0_4px_rgba(0,123,255,0.1)] text-[1rem]"
            required
          />
        </div>

        {/* Quên mật khẩu & Ghi nhớ */}
        <div className="flex items-center justify-between px-2 mb-4 text-sm">
          <div className="flex items-center gap-2 cursor-pointer">
            <input 
                type="checkbox" 
                id="rememberMe" 
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded cursor-pointer" 
            />
            <label htmlFor="rememberMe" className="text-[#555] cursor-pointer">Ghi nhớ</label>
          </div>
          <Link to="/forgot-password" className="font-bold text-[#007bff] no-underline hover:underline">Quên mật khẩu?</Link>
        </div>

        <button 
            type="submit" 
            disabled={loading}
            className={`w-full p-[12px] font-[700] tracking-[1px] text-white uppercase transition-all duration-300 border-none rounded-[50px] cursor-pointer shadow-[0_5px_15px_rgba(0,123,255,0.3)] hover:-translate-y-[2px] hover:shadow-[0_8px_20px_rgba(0,123,255,0.4)] ${loading ? 'bg-gray-400' : 'bg-gradient-to-br from-[#007bff] to-[#0056b3]'}`}
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
        </button>
      </form>

      <div className="mt-[20px] text-[0.9rem] text-[#555]">
        Chưa có tài khoản? <Link to="/register" className="font-[700] text-[#ff5e1f] hover:underline">Đăng ký ngay</Link>
      </div>
    </Authlayout>
  );
};

export default Login;