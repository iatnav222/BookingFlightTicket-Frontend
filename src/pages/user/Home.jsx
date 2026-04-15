import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaPlaneDeparture, FaPlaneArrival, FaUserFriends, FaSearch, 
  FaChevronLeft, FaChevronRight, FaTag, FaHeadset, 
  FaShieldAlt, FaCheckCircle 
} from 'react-icons/fa';
// Import Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// CHỈ IMPORT NHỮNG API ĐÃ ĐƯỢC TẠO
// Import các API đã có
import { sanBayApi } from '../../services/Sanbayapi';
import { chuyenBayApi } from '../../services/chuyenBayApi';
import { hangHangKhongApi } from '../../services/hangHangKhongApi';

const Home = () => {
  const navigate = useNavigate();
  
  // --- STATE DỮ LIỆU ---
  const [sanBays, setSanBays] = useState([]);
  const [cheapFlights, setCheapFlights] = useState([]);
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [airlines, setAirlines] = useState([]);
  
  // DỮ LIỆU TĨNH TẠM THỜI (Để tránh lỗi chưa có API khi push Vercel)
  const promotions = [
    { maKM: 1, ten_km: "Chào hè rực rỡ", giamPhanTram: 20, anh: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop" },
    { maKM: 2, ten_km: "Bay cùng gia đình", giamPhanTram: 15, anh: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500&auto=format&fit=crop" },
    { maKM: 3, ten_km: "Ưu đãi cuối tuần", giamPhanTram: 10, anh: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=500&auto=format&fit=crop" },
    { maKM: 4, ten_km: "Khám phá châu Á", giamPhanTram: 25, anh: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=500&auto=format&fit=crop" }
  ];

  // --- STATE FORM TÌM KIẾM ---
  const [tripType, setTripType] = useState('mot-chieu');
  const [searchData, setSearchData] = useState({
    maSanBayDi: '',
    maSanBayDen: '',
    ngayDi: '',
    ngayVe: ''
  });
  const [pax, setPax] = useState({ nl: 1, te: 0, eb: 0 });
  const [showPaxPopup, setShowPaxPopup] = useState(false);
  const popupRef = useRef(null);
  const totalPax = pax.nl + pax.te + pax.eb;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Gọi riêng lẻ để nếu 1 cái lỗi, các cái khác vẫn chạy được
        const fetchSB = sanBayApi.getDanhSachClient().catch(err => {
          console.error("Lỗi sân bay:", err);
          return null;
        });
        const fetchCB = chuyenBayApi.getDanhSachClient({ per_page: 10 }).catch(err => {
          console.error("Lỗi chuyến bay:", err);
          return null;
        });
        const fetchHHK = hangHangKhongApi.getDanhSachClient().catch(err => {
          console.error("Lỗi hãng bay:", err);
          return null;
        });

        const [resSB, resCB, resHHK] = await Promise.all([fetchSB, fetchCB, fetchHHK]);

        // Kiểm tra dữ liệu trước khi gán để tránh lỗi 'undefined'
        if (resSB && resSB.data) {
          const sbData = resSB.data.data || resSB.data || [];
          setSanBays(sbData);
          setPopularDestinations(sbData.slice(0, 5));
        }

        if (resCB && resCB.data) {
          setCheapFlights(resCB.data.data || resCB.data || []);
        }

        if (resHHK && resHHK.data) {
          setAirlines(resHHK.data.data || resHHK.data || []);
        }

      } catch (error) {
        console.error("Lỗi tổng quát:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Đóng popup pax
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) setShowPaxPopup(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updatePax = (type, change) => {
    setPax(prev => {
      const newVal = prev[type] + change;
      if (type === 'nl' && newVal < 1) return prev;
      if (newVal < 0) return prev;
      return { ...prev, [type]: newVal };
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchData.maSanBayDi === searchData.maSanBayDen) {
      alert("Điểm đi và điểm đến không được trùng nhau!");
      return;
    }
    const query = new URLSearchParams({ ...searchData, loaiVe: tripType, ...pax });
    navigate(`/dat-ve/tim-kiem?${query.toString()}`);
  };

  // SỬ DỤNG BIẾN LOADING Ở ĐÂY ĐỂ HIỂN THỊ MÀN HÌNH CHỜ VÀ SỬA LỖI ESLINT
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#ff5e1f] border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-bold text-gray-600">Đang tải dữ liệu...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans bg-gray-50 text-gray-800">
      {/* 1. BANNER & SEARCH */}
      <div className="relative w-full h-[680px] overflow-hidden bg-gray-900">
        <img src="/assets/img/banner.png" alt="Banner" className="object-cover w-full h-full opacity-60" />
        <div className="absolute w-full text-center text-white transform -translate-x-1/2 -translate-y-1/2 top-[35%] left-1/2">
          <h1 className="text-4xl font-extrabold uppercase md:text-6xl mb-4 drop-shadow-lg">Vi vu khắp chốn</h1>
          <p className="text-xl font-light md:text-2xl drop-shadow-md">Đặt vé máy bay giá rẻ, uy tín chỉ với một chạm</p>
        </div>

        <div className="absolute bottom-[50px] left-1/2 transform -translate-x-1/2 w-[95%] max-w-[1300px] bg-white p-6 md:p-10 rounded-3xl shadow-2xl z-10">
          <form onSubmit={handleSearch}>
            <div className="flex gap-8 mb-6 ml-2 font-bold text-gray-700">
              <label className="flex items-center gap-2 cursor-pointer hover:text-[#ff5e1f] transition-colors">
                <input type="radio" value="mot-chieu" checked={tripType === 'mot-chieu'} onChange={(e) => setTripType(e.target.value)} className="w-5 h-5 accent-[#ff5e1f]" /> Một chiều
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-[#ff5e1f] transition-colors">
                <input type="radio" value="khu-hoi" checked={tripType === 'khu-hoi'} onChange={(e) => setTripType(e.target.value)} className="w-5 h-5 accent-[#ff5e1f]" /> Khứ hồi
              </label>
            </div>
            
            <div className={`grid gap-4 items-end ${tripType === 'khu-hoi' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-[2fr_2fr_1.5fr_1.5fr_1.5fr_1.2fr]' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-[2.5fr_2.5fr_2fr_2fr_1.5fr]'}`}>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Điểm đi</label>
                <div className="flex items-center h-[65px] px-4 bg-[#f7f9fc] border-2 border-[#eef1f5] rounded-2xl focus-within:bg-white focus-within:border-[#ff5e1f] transition-all">
                  <FaPlaneDeparture className="mr-3 text-gray-400 shrink-0" />
                  <select name="maSanBayDi" onChange={(e) => setSearchData({...searchData, maSanBayDi: e.target.value})} className="w-full h-full bg-transparent outline-none font-bold text-lg cursor-pointer" required>
                    <option value="" hidden>Chọn nơi đi</option>
                    {sanBays.map(sb => <option key={sb.maSanBay} value={sb.maSanBay}>{sb.thanhPho} ({sb.maCode})</option>)}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Điểm đến</label>
                <div className="flex items-center h-[65px] px-4 bg-[#f7f9fc] border-2 border-[#eef1f5] rounded-2xl focus-within:bg-white focus-within:border-[#ff5e1f] transition-all">
                  <FaPlaneArrival className="mr-3 text-gray-400 shrink-0" />
                  <select name="maSanBayDen" onChange={(e) => setSearchData({...searchData, maSanBayDen: e.target.value})} className="w-full h-full bg-transparent outline-none font-bold text-lg cursor-pointer" required>
                    <option value="" hidden>Chọn nơi đến</option>
                    {sanBays.map(sb => <option key={sb.maSanBay} value={sb.maSanBay}>{sb.thanhPho} ({sb.maCode})</option>)}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Ngày đi</label>
                <div className="flex items-center h-[65px] px-4 bg-[#f7f9fc] border-2 border-[#eef1f5] rounded-2xl focus-within:bg-white focus-within:border-[#ff5e1f] transition-all">
                  <input type="date" name="ngayDi" onChange={(e) => setSearchData({...searchData, ngayDi: e.target.value})} className="w-full bg-transparent outline-none font-bold" required min={new Date().toISOString().split('T')[0]} />
                </div>
              </div>

              {tripType === 'khu-hoi' && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Ngày về</label>
                  <div className="flex items-center h-[65px] px-4 bg-[#f7f9fc] border-2 border-[#eef1f5] rounded-2xl focus-within:bg-white focus-within:border-[#ff5e1f] transition-all">
                    <input type="date" name="ngayVe" onChange={(e) => setSearchData({...searchData, ngayVe: e.target.value})} className="w-full bg-transparent outline-none font-bold" required />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2 relative" ref={popupRef}>
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Hành khách</label>
                <div onClick={() => setShowPaxPopup(!showPaxPopup)} className="flex items-center h-[65px] px-4 bg-[#f7f9fc] border-2 border-[#eef1f5] rounded-2xl cursor-pointer hover:border-[#ff5e1f] transition-all">
                  <FaUserFriends className="mr-3 text-gray-400 shrink-0" />
                  <span className="font-bold text-lg">{totalPax} Khách</span>
                </div>
                {showPaxPopup && (
                  <div className="absolute top-[75px] left-0 w-[300px] bg-white p-5 rounded-2xl shadow-2xl border z-50">
                    <h6 className="font-bold mb-4 border-b pb-2">Hành khách</h6>
                    {[ ['nl','Người lớn','Từ 12 tuổi'], ['te','Trẻ em','2-11 tuổi'], ['eb','Em bé','Dưới 2 tuổi'] ].map(([k, t, s]) => (
                      <div key={k} className="flex justify-between items-center mb-4">
                        <div><span className="block font-bold">{t}</span><small className="text-gray-400">{s}</small></div>
                        <div className="flex items-center gap-3">
                          <button type="button" onClick={() => updatePax(k, -1)} className="w-8 h-8 border rounded-full hover:bg-gray-100">-</button>
                          <span className="font-bold w-4 text-center">{pax[k]}</span>
                          <button type="button" onClick={() => updatePax(k, 1)} className="w-8 h-8 border rounded-full hover:bg-gray-100">+</button>
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={() => setShowPaxPopup(false)} className="w-full py-2 bg-blue-600 text-white font-bold rounded-xl mt-2">Xong</button>
                  </div>
                )}
              </div>

              <button type="submit" className="flex items-center justify-center gap-2 h-[65px] bg-gradient-to-r from-[#ff5e1f] to-[#ff9966] text-white rounded-2xl text-lg font-black uppercase shadow-lg hover:-translate-y-1 transition-all md:col-span-2 xl:col-span-1">
                <FaSearch /> Tìm Kiếm
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="h-20"></div>

      {/* 2. ƯU ĐÃI ĐỘC QUYỀN */}
      <section className="max-w-7xl mx-auto px-4 my-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-[#1e3c72] mb-2">🔥 Ưu Đãi Độc Quyền</h2>
          <p className="text-gray-500">Săn vé rẻ liền tay, nhận ngay ưu đãi khủng</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {promotions.map(km => (
            <div key={km.maKM} className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition-all group border border-transparent hover:border-[#ff5e1f]">
              <div className="h-44 bg-gray-100 overflow-hidden">
                <img src={km.anh} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={km.ten_km} />
              </div>
              <div className="p-6 text-center">
                <h3 className="font-bold text-lg mb-2 line-clamp-1">{km.ten_km}</h3>
                <p className="text-[#ff5e1f] font-black text-2xl mb-4">Giảm {km.giamPhanTram}%</p>
                <button onClick={() => navigate('/khuyen-mai')} className="w-full py-2 border-2 border-blue-600 text-blue-600 font-bold rounded-full hover:bg-blue-600 hover:text-white transition-all">Chi tiết</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. VÉ RẺ HÔM NAY (SWIPER) */}
      <section className="max-w-7xl mx-auto px-4 my-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-black text-[#1e3c72] mb-1">⚡ Vé Rẻ Hôm Nay</h2>
            <p className="text-gray-500">Cơ hội bay với mức giá tốt nhất trong tháng</p>
          </div>
          <div className="flex gap-2">
            <button className="swiper-prev p-3 bg-white border rounded-full hover:bg-gray-100 shadow-sm transition-colors"><FaChevronLeft /></button>
            <button className="swiper-next p-3 bg-white border rounded-full hover:bg-gray-100 shadow-sm transition-colors"><FaChevronRight /></button>
          </div>
        </div>
        
        {cheapFlights.length === 0 ? (
            <div className="text-center text-gray-500 py-10 font-bold">Đang cập nhật các chuyến bay giá rẻ...</div>
        ) : (
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={25}
              slidesPerView={1}
              navigation={{ nextEl: '.swiper-next', prevEl: '.swiper-prev' }}
              pagination={{ clickable: true }}
              breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 4 } }}
              className="pb-12"
            >
              {cheapFlights.map(cb => (
                <SwiperSlide key={cb.maChuyenBay}>
                  <div onClick={() => navigate(`/dat-ve/chon-ghe/${cb.maChuyenBay}`)} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:-translate-y-2 hover:shadow-xl transition-all cursor-pointer group">
                    <div className="relative h-40">
                      <img src={cb.san_bay_den?.hinh_anh_url || "https://via.placeholder.com/500x300"} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="Dest" />
                      <div className="absolute top-3 left-3 bg-[#ff5e1f] text-white px-3 py-1 rounded-full text-[10px] font-bold">GIÁ TỐT NHẤT</div>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-center mb-4 font-bold">
                        <span>{cb.san_bay_di?.maCode}</span>
                        <FaPlaneDeparture className="text-blue-500" />
                        <span className="text-blue-600">{cb.san_bay_den?.maCode}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        {cb.hang_hang_khong?.logo_url && <img src={cb.hang_hang_khong?.logo_url} className="w-6 h-6 object-contain" alt="Logo" />}
                        <span className="text-xs text-gray-400 font-medium">
                            {new Date(cb.ngayGioCatCanh).toLocaleDateString('vi-VN')} • {new Date(cb.ngayGioCatCanh).toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      <div className="pt-3 border-t flex justify-between items-center">
                        <div>
                          <small className="block text-[10px] text-gray-400 uppercase font-bold">Chỉ từ</small>
                          <span className="text-xl font-black text-red-500">{(cb.gia_ves?.find(v => v.loaiHanhKhach === 'NguoiLon')?.giaTien || 0).toLocaleString('vi-VN')}đ</span>
                        </div>
                        <button className="bg-blue-50 text-blue-600 font-bold px-4 py-1.5 rounded-full text-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">Đặt ngay</button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
        )}
      </section>

      {/* 4. ĐIỂM ĐẾN YÊU THÍCH */}
      <section className="max-w-7xl mx-auto px-4 my-20">
        <h2 className="text-3xl font-black text-[#1e3c72] text-center mb-2">✈️ Điểm Đến Yêu Thích</h2>
        <p className="text-center text-gray-500 mb-10">Khám phá những thành phố tuyệt vời nhất</p>
        
        {popularDestinations.length === 0 ? (
           <div className="text-center text-gray-500 py-10 font-bold">Đang tải danh sách điểm đến...</div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-6 gap-6 h-[650px] md:h-[550px]">
             {popularDestinations.map((dest, i) => (
               <div 
                 key={dest.maSanBay} 
                 onClick={() => navigate(`/dat-ve/tim-kiem?maSanBayDen=${dest.maSanBay}`)}
                 className={`relative rounded-3xl overflow-hidden cursor-pointer group shadow-lg ${i < 2 ? 'md:col-span-3' : 'md:col-span-2'}`}
               >
                 <img src={dest.hinh_anh_url || "https://via.placeholder.com/500x500"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={dest.thanhPho} />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end text-white">
                   <h4 className="text-2xl font-bold">{dest.thanhPho}</h4>
                   <p className="text-sm opacity-80 flex items-center gap-1"><FaPlaneArrival /> Sân bay {dest.tenSanBay}</p>
                 </div>
               </div>
             ))}
           </div>
        )}
      </section>

      {/* 5. TẠI SAO CHỌN CHÚNG TÔI */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-black text-[#1e3c72] text-center mb-2 text-uppercase">✨ Tại Sao Chọn FlyNow?</h2>
          <p className="text-center text-gray-500 mb-12">Chúng tôi mang đến trải nghiệm đặt vé tốt nhất cho bạn</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { i: <FaTag />, t: "Giá Rẻ Mỗi Ngày", d: "Cam kết giá vé cạnh tranh và nhiều ưu đãi hấp dẫn nhất thị trường." },
              { i: <FaHeadset />, t: "Hỗ Trợ 24/7", d: "Đội ngũ tư vấn viên luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi." },
              { i: <FaShieldAlt />, t: "Thanh Toán An Toàn", d: "Hệ thống bảo mật tuyệt đối, đa dạng phương thức thanh toán." },
              { i: <FaCheckCircle />, t: "Dễ Đàng Đặt Vé", d: "Giao diện thân thiện, đặt vé nhanh chóng chỉ trong vài thao tác." }
            ].map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl text-center hover:-translate-y-2 transition-all shadow-sm hover:shadow-xl border border-transparent hover:border-blue-200">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-6">{f.i}</div>
                <h5 className="font-bold text-lg mb-3">{f.t}</h5>
                <p className="text-gray-500 text-sm leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ĐỐI TÁC & NEWSLETTER */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h5 className="text-center text-gray-400 font-bold uppercase tracking-widest mb-10 text-sm">Đối Tác Hàng Không</h5>
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-60 hover:opacity-100 transition-opacity mb-20">
          {airlines.map(hang => hang.logo_url && (
            <img key={hang.maHang} src={hang.logo_url} alt={hang.tenHang} className="h-8 md:h-10 grayscale hover:grayscale-0 transition-all cursor-pointer" title={hang.tenHang} />
          ))}
        </div>

        <div className="bg-gradient-to-r from-[#1e3c72] to-[#2a5298] p-10 md:p-16 rounded-[40px] text-white text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-4">Đăng Ký Nhận Tin Khuyến Mãi</h2>
            <p className="opacity-80 mb-8 max-w-xl mx-auto">Nhập email để không bỏ lỡ các ưu đãi vé máy bay 0 đồng và tin tức du lịch hấp dẫn!</p>
            <form className="flex flex-col sm:flex-row justify-center max-w-2xl mx-auto gap-0 bg-white p-1 rounded-full overflow-hidden">
              <input type="email" placeholder="Địa chỉ email của bạn..." className="flex-1 px-8 py-4 text-gray-800 outline-none" required />
              <button type="button" className="bg-[#ff5e1f] hover:bg-[#e04e15] text-white font-black px-10 py-4 rounded-full transition-all">ĐĂNG KÝ</button>
            </form>
          </div>
          {/* Decorative Circle */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full -ml-10 -mb-10"></div>
        </div>
      </section>
    </div>
  );
};

export default Home;