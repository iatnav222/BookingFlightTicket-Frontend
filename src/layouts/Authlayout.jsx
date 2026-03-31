import React from 'react';

const Authlayout = ({ children, maxWidth = 'max-w-[450px]' }) => {
  return (
    <div className="relative flex items-center justify-center min-h-[85vh] bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop')] bg-no-repeat bg-center bg-cover">
      {/* Lớp phủ màu xanh */}
      <div className="absolute inset-0 z-0 bg-[#1e3c72]/60"></div>
      
      {/* Khung Form (Card) */}
      <div className={`relative z-10 w-full ${maxWidth} p-10 text-center bg-white/95 backdrop-blur-md rounded-[20px] shadow-[0_15px_35px_rgba(0,0,0,0.2)] mx-4`}>
        {children}
      </div>
    </div>
  );
};

export default Authlayout;