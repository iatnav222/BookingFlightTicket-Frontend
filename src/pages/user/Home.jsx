import React, { useState, useEffect, useRef } from 'react';
import { FaPlaneDeparture, FaPlaneArrival, FaUserFriends, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
// Import Swiper React components (Cần chạy: npm install swiper)
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Home = () => {
  // --- STATE QUẢN LÝ TÌM KIẾM ---
  const [tripType, setTripType] = useState('mot-chieu');
  const [showPaxPopup, setShowPaxPopup] = useState(false);
  const [pax, setPax] = useState({ nl: 1, te: 0, eb: 0 });
  const popupRef = useRef(null);

  const totalPax = pax.nl + pax.te + pax.eb;

  // Đóng popup hành khách khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPaxPopup(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updatePax = (type, change) => {
    setPax(prev => {
      const newVal = prev[type] + change;
      if (type === 'nl' && newVal < 1) return prev; // Ít nhất 1 người lớn
      if (newVal < 0) return prev; // Không được âm
      return { ...prev, [type]: newVal };
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search info:', { tripType, pax });
    // Gắn logic chuyển trang hoặc gọi API tìm chuyến bay
  };

  return (
    <div className="font-sans bg-gray-50">
      <div className="relative w-full h-[680px] overflow-hidden bg-gray-900">
        <img src="/assets/img/banner.png" alt="Banner FlyNow" className="object-cover w-full h-full opacity-60" />
        
        <div className="absolute w-full text-center text-white transform -translate-x-1/2 -translate-y-1/2 top-[35%] left-1/2 drop-shadow-lg">
          <h1 className="text-4xl font-extrabold tracking-widest uppercase md:text-6xl mb-4">Vi vu khắp chốn</h1>
          <p className="text-xl font-light md:text-2xl">Đặt vé máy bay giá rẻ, uy tín chỉ với một chạm</p>
        </div>

        <div className="absolute bottom-[50px] left-1/2 transform -translate-x-1/2 w-[95%] max-w-[1300px] bg-white p-6 md:p-10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] z-10">
          <form onSubmit={handleSearch}>
            <div className="flex gap-8 mb-6 ml-2">
              <label className="flex items-center gap-2 text-lg font-bold text-gray-700 cursor-pointer hover:text-[#ff5e1f] transition-colors">
                <input type="radio" name="loaiVe" value="mot-chieu" checked={tripType === 'mot-chieu'} onChange={(e) => setTripType(e.target.value)} className="w-5 h-5 accent-[#ff5e1f] cursor-pointer" /> Một chiều
              </label>
              <label className="flex items-center gap-2 text-lg font-bold text-gray-700 cursor-pointer hover:text-[#ff5e1f] transition-colors">
                <input type="radio" name="loaiVe" value="khu-hoi" checked={tripType === 'khu-hoi'} onChange={(e) => setTripType(e.target.value)} className="w-5 h-5 accent-[#ff5e1f] cursor-pointer" /> Khứ hồi
              </label>
            </div>
            <div className={`grid gap-5 items-end ${tripType === 'khu-hoi' ? 'grid-cols-1 md:grid-cols-[2fr_2fr_1.5fr_1.5fr_1.5fr_1fr]' : 'grid-cols-1 md:grid-cols-[2.5fr_2.5fr_2fr_2fr_1.5fr]'}`}>
              
              <div className="flex flex-col gap-2">
                <label className="ml-1 text-sm font-bold text-gray-500 uppercase">Điểm đi</label>
                <div className="flex items-center h-[70px] px-5 bg-[#f7f9fc] border-2 border-[#eef1f5] rounded-2xl focus-within:bg-white focus-within:border-[#ff5e1f] transition-all">
                  <FaPlaneDeparture className="mr-3 text-gray-400" />
                  <select className="w-full h-full text-lg font-semibold bg-transparent outline-none cursor-pointer text-gray-800" required>
                    <option value="" hidden>Chọn nơi đi</option>
                    <option value="SGN">Hồ Chí Minh (SGN)</option>
                    <option value="HAN">Hà Nội (HAN)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="ml-1 text-sm font-bold text-gray-500 uppercase">Điểm đến</label>
                <div className="flex items-center h-[70px] px-5 bg-[#f7f9fc] border-2 border-[#eef1f5] rounded-2xl focus-within:bg-white focus-within:border-[#ff5e1f] transition-all">
                  <FaPlaneArrival className="mr-3 text-gray-400" />
                  <select className="w-full h-full text-lg font-semibold bg-transparent outline-none cursor-pointer text-gray-800" required>
                    <option value="" hidden>Chọn nơi đến</option>
                    <option value="DAD">Đà Nẵng (DAD)</option>
                    <option value="PQC">Phú Quốc (PQC)</option>
                  </select>
                </div>
              </div>

              {/* Ngày đi */}
              <div className="flex flex-col gap-2">
                <label className="ml-1 text-sm font-bold text-gray-500 uppercase">Ngày đi</label>
                <div className="flex items-center h-[70px] px-5 bg-[#f7f9fc] border-2 border-[#eef1f5] rounded-2xl focus-within:bg-white focus-within:border-[#ff5e1f] transition-all">
                  <input type="date" className="w-full h-full text-lg font-semibold bg-transparent outline-none cursor-pointer text-gray-800" required />
                </div>
              </div>

              {/* Ngày về (Chỉ hiện khi Khứ hồi) */}
              {tripType === 'khu-hoi' && (
                <div className="flex flex-col gap-2">
                  <label className="ml-1 text-sm font-bold text-gray-500 uppercase">Ngày về</label>
                  <div className="flex items-center h-[70px] px-5 bg-[#f7f9fc] border-2 border-[#eef1f5] rounded-2xl focus-within:bg-white focus-within:border-[#ff5e1f] transition-all">
                    <input type="date" className="w-full h-full text-lg font-semibold bg-transparent outline-none cursor-pointer text-gray-800" required />
                  </div>
                </div>
              )}

              {/* Hành khách */}
              <div className="flex flex-col gap-2 relative" ref={popupRef}>
                <label className="ml-1 text-sm font-bold text-gray-500 uppercase">Hành khách</label>
                <div 
                  onClick={() => setShowPaxPopup(!showPaxPopup)}
                  className="flex items-center h-[70px] px-5 bg-[#f7f9fc] border-2 border-[#eef1f5] rounded-2xl cursor-pointer hover:border-[#ff5e1f] transition-all"
                >
                  <FaUserFriends className="mr-3 text-gray-400" />
                  <span className="text-lg font-semibold text-gray-800">{totalPax} Khách</span>
                </div>

                {/* Popup chọn khách */}
                {showPaxPopup && (
                  <div className="absolute top-[80px] left-0 w-[320px] bg-white p-5 rounded-2xl shadow-xl border border-gray-100 z-50">
                    <h6 className="pb-3 mb-4 font-bold border-b">Số lượng hành khách</h6>
                    
                    {/* Hàng Người lớn */}
                    <div className="flex items-center justify-between mb-4">
                      <div><span className="block font-bold">Người lớn</span><small className="text-gray-500">Từ 12 tuổi trở lên</small></div>
                      <div className="flex items-center gap-3">
                        <button type="button" onClick={() => updatePax('nl', -1)} className="w-9 h-9 border rounded-full hover:bg-gray-100">-</button>
                        <span className="font-bold text-lg w-4 text-center">{pax.nl}</span>
                        <button type="button" onClick={() => updatePax('nl', 1)} className="w-9 h-9 border rounded-full hover:bg-gray-100">+</button>
                      </div>
                    </div>

                    {/* Hàng Trẻ em */}
                    <div className="flex items-center justify-between mb-4">
                      <div><span className="block font-bold">Trẻ em</span><small className="text-gray-500">Từ 2 - 11 tuổi</small></div>
                      <div className="flex items-center gap-3">
                        <button type="button" onClick={() => updatePax('te', -1)} className="w-9 h-9 border rounded-full hover:bg-gray-100">-</button>
                        <span className="font-bold text-lg w-4 text-center">{pax.te}</span>
                        <button type="button" onClick={() => updatePax('te', 1)} className="w-9 h-9 border rounded-full hover:bg-gray-100">+</button>
                      </div>
                    </div>

                    <button type="button" onClick={() => setShowPaxPopup(false)} className="w-full py-2 mt-4 font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700">Xong</button>
                  </div>
                )}
              </div>

              {/* Nút Tìm */}
              <button type="submit" className="flex items-center justify-center gap-2 h-[70px] bg-gradient-to-br from-[#ff5e1f] to-[#ff9966] text-white rounded-2xl text-x font-extrabold uppercase shadow-[0_10px_25px_rgba(255,94,31,0.4)] hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(255,94,31,0.5)] transition-all">
                <FaSearch /> Tìm Kiếm
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="h-24"></div> {/* Khoảng đệm */}

      {/* --- PHẦN VÉ RẺ (SWIPER) --- */}
      <section className="container px-4 mx-auto my-12 max-w-7xl">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="mb-2 text-3xl font-extrabold text-[#1e3c72]">⚡ Vé Rẻ Hôm Nay</h2>
            <p className="m-0 text-gray-500">Cơ hội bay với mức giá tốt nhất trong tháng</p>
          </div>
          {/* Custom Navigation cho Swiper */}
          <div className="flex gap-2">
            <button className="swiper-prev-btn p-3 border rounded-full shadow-sm bg-white hover:bg-gray-50"><FaChevronLeft className="text-gray-600" /></button>
            <button className="swiper-next-btn p-3 border rounded-full shadow-sm bg-white hover:bg-gray-50"><FaChevronRight className="text-gray-600" /></button>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={25}
          slidesPerView={1}
          navigation={{ nextEl: '.swiper-next-btn', prevEl: '.swiper-prev-btn' }}
          pagination={{ clickable: true, dynamicBullets: true }}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          className="pb-12 px-2 !mx-[-8px]" // Để bóng (shadow) không bị cắt
        >
          {/* Ở đây map mảng dữ liệu chuyến bay, mình làm 1 slide mẫu */}
          {[1,2,3,4,5].map((item) => (
            <SwiperSlide key={item}>
              <div className="flex flex-col h-full bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.05)] hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] hover:border-[#ff5e1f] transition-all group">
                <div className="relative h-[150px] w-full bg-gray-200">
                  <img src="https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=500&auto=format&fit=crop" className="object-cover w-full h-full" alt="City" />
                  <div className="absolute top-3 left-3 bg-[#ff5e1f] text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">Giá tốt nhất</div>
                </div>
                <div className="flex flex-col flex-grow p-4">
                  <div className="flex items-center justify-between mb-3 text-lg font-bold">
                    <span className="text-gray-800">SGN</span>
                    <FaPlaneDeparture className="text-[#007bff] text-sm" />
                    <span className="text-[#007bff]">HAN</span>
                  </div>
                  <div className="mt-auto pt-3 border-t flex justify-between items-center">
                    <div>
                      <small className="block text-xs text-gray-500">Chỉ từ</small>
                      <span className="text-xl font-bold text-red-500">850.000đ</span>
                    </div>
                    <button className="px-4 py-1.5 text-sm font-semibold text-blue-600 border border-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-colors">Đặt ngay</button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Các phần Khuyến Mãi, Feature Box bạn có thể áp dụng tương tự Tailwind class vào mảng map() nhé */}

    </div>
  );
};

export default Home;