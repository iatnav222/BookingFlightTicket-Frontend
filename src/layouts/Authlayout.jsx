import React from 'react';
import Header from '../components/user/Header'; 
import Footer from '../components/user/Footer';

const Authlayout = ({ children, maxWidth = 'max-w-[450px]' }) => {
  return (
    // Bọc toàn bộ trong 1 thẻ div có class flex-col và min-h-screen để căn chỉnh giao diện
    <div className="flex flex-col min-h-screen">
      
      {/* Component Header sẽ nằm ở trên cùng */}
      <Header />

      {/* flex-grow giúp phần nội dung chính chiếm toàn bộ khoảng trống còn lại, đẩy Footer xuống đáy */}
      <div className="relative flex flex-grow items-center justify-center py-10 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop')] bg-no-repeat bg-center bg-cover">
        
        {/* Lớp phủ màu xanh */}
        <div className="absolute inset-0 z-0 bg-[#1e3c72]/60"></div>
        
        {/* Khung Form (Card) chứa nội dung của từng trang */}
        <div className={`relative z-10 w-full ${maxWidth} p-10 text-center bg-white/95 backdrop-blur-md rounded-[20px] shadow-[0_15px_35px_rgba(0,0,0,0.2)] mx-4`}>
          {children}
        </div>
        
      </div>

      {/* Component Footer sẽ nằm ở dưới cùng */}
      <Footer />
      
    </div>
  );
};

export default Authlayout;