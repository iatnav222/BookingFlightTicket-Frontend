// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  let user = null;
  
  if (userString) {
      try {
          user = JSON.parse(userString);
      } catch (e) {
          console.error("Lỗi đọc thông tin user");
      }
  }

  // 1. Chưa đăng nhập (Không có token hoặc user) -> Đẩy về trang đăng nhập
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Đã đăng nhập nhưng KHÔNG ĐÚNG QUYỀN -> Đẩy về trang chủ (hoặc trang lỗi 403)
  if (allowedRoles && !allowedRoles.includes(user.quyen)) {
    return <Navigate to="/" replace />; 
  }

  // 3. Hợp lệ -> Cho phép truy cập vào component con (Admin)
  return <Outlet />;
};

export default ProtectedRoute;