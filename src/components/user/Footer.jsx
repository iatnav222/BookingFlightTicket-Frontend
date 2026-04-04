import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-slate-300 pt-12 pb-6 border-t-4 border-blue-600">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-white text-xl font-bold mb-4 uppercase">
            <a href="/" className="hover:text-blue-400 transition">FlyNow
            </a>
            </h2>
          <p className="text-sm">Hệ thống đặt vé máy bay trực tuyến nhanh chóng, tiện lợi cho mọi hành trình.</p>
        </div>
        <div>
          <h3 className="text-white font-bold mb-4 uppercase">Liên kết</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-blue-400 transition">Trang chủ</a></li>
            <li><a href="/khuyen-mai" className="hover:text-blue-400 transition">Khuyến mãi</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-bold mb-4 uppercase">Đội ngũ</h3>
          
        </div>
      </div>
      <div className="text-center mt-10 text-xs border-t border-slate-700 pt-4">
        © 2025 FlyNow Project.
      </div>
    </footer>
  );
};

export default Footer;