import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/user/Header'; // Sửa lại đường dẫn nếu cần
import Footer from '../components/user/Footer'; // Sửa lại đường dẫn nếu cần

const Userlayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Các component con (như Home, KhuyenMai) sẽ hiển thị ở đây */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Userlayout;