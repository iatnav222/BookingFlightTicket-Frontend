import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaUser, FaPlus, FaMinus, FaArrowRight, FaUsers, FaInfoCircle, FaEnvelope, FaPhone } from 'react-icons/fa';
import { orderApi } from '../../../services/orderApi';

const ThongTinHanhKhach = () => {
  const { state, search } = useLocation();
  const navigate = useNavigate();
  const flight = state?.flightDetails;

  // Lấy params từ URL (nl, te, eb)
  const queryParams = new URLSearchParams(search);
  const urlNl = parseInt(queryParams.get('nl'));
  const urlTe = parseInt(queryParams.get('te'));
  const urlEb = parseInt(queryParams.get('eb'));

  // Logic: Nếu URL có đầy đủ nl, te, eb (từ trang tìm kiếm) thì mặc định confirmed = true
  // Nếu không có (đi từ vé rẻ Home) thì mặc định confirmed = false để khách chọn lại
  const hasUrlParams = !isNaN(urlNl);

  const [paxCounts, setPaxCounts] = useState({ 
    adult: urlNl || 1, 
    child: urlTe || 0, 
    infant: urlEb || 0 
  });
  
  const [isConfirmed, setIsConfirmed] = useState(hasUrlParams);

  // Lưu thông tin liên hệ riêng
  const [contact, setContact] = useState({ email: '', soDienThoai: '' });
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Tự động kích hoạt tạo form CHỈ KHI có dữ liệu từ URL
  useEffect(() => {
    if (hasUrlParams) {
      handleConfirmPax();
    }
  }, []);

  const updatePaxCount = (type, delta) => {
    setPaxCounts(prev => {
      const newVal = prev[type] + delta;
      if (type === 'adult' && newVal < 1) return prev;
      if (newVal < 0) return prev;
      return { ...prev, [type]: newVal };
    });
    setIsConfirmed(false); // Reset trạng thái xác nhận khi thay đổi số lượng
  };

  const handleConfirmPax = () => {
    const initial = [];
    const createPax = (type) => ({
      ho: '', ten: '', ngaySinh: '', gioiTinh: 'Nam',
      loaiHanhKhach: type, soCMND: '', duffel_passenger_id: '' 
    });

    for (let i = 0; i < paxCounts.adult; i++) initial.push(createPax('adult'));
    for (let i = 0; i < paxCounts.child; i++) initial.push(createPax('child'));
    for (let i = 0; i < paxCounts.infant; i++) initial.push(createPax('infant'));
    
    setPassengers(initial);
    setIsConfirmed(true);
  };

  const handlePassengerChange = (index, field, value) => {
    const newPas = [...passengers];
    newPas[index][field] = (field === 'ho' || field === 'ten') ? value.toUpperCase() : value;
    setPassengers(newPas);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isConfirmed) return alert("Vui lòng xác nhận số lượng hành khách!");
    
    setLoading(true);
    const payload = {
      duffel_offer_id: flight?.id || flight?.maChuyenBay,
      tong_tien: Number(flight?.gia_thap_nhat || flight?.giaTien || 0) * (paxCounts.adult + paxCounts.child + paxCounts.infant),
      duffel_raw_data: flight,
      thong_tin_lien_he: contact, 
      hanh_khach: passengers
    };

    try {
      const res = await orderApi.khoiTaoDonHang(payload);
      if (res.success) {
        navigate(`/dat-ve/thanh-toan/${res.data.maDonHang}`, { state: { order: res.data } });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi 422: Email không đúng hoặc Ngày sinh sai định dạng (YYYY-MM-DD)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f6f8fb] min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-black text-gray-900 mb-8 text-center uppercase tracking-wide">
          Hoàn tất thông tin đặt vé
        </h2>

        {/* BƯỚC 1: CHỌN SỐ LƯỢNG - Luôn hiển thị để khách có thể chỉnh sửa */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-700">
            <FaUsers className="text-[#007bff]" /> 1. Xác nhận số lượng khách
          </h3>
          {!hasUrlParams && (
            <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-xl text-sm flex items-center gap-2">
                <FaInfoCircle /> Bạn chọn chuyến bay trực tiếp, vui lòng kiểm tra lại số lượng người đi.
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[
              { id: 'adult', label: 'Người lớn', sub: '> 12 tuổi' },
              { id: 'child', label: 'Trẻ em', sub: '2 - 12 tuổi' },
              { id: 'infant', label: 'Em bé', sub: '< 2 tuổi' }
            ].map(type => (
              <div key={type.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <p className="font-bold text-gray-700">{type.label}</p>
                  <p className="text-[10px] text-gray-400 font-black uppercase">{type.sub}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => updatePaxCount(type.id, -1)} className="w-8 h-8 rounded-full border bg-white flex items-center justify-center hover:bg-red-50"><FaMinus size={10}/></button>
                  <span className="font-bold w-4 text-center">{paxCounts[type.id]}</span>
                  <button type="button" onClick={() => updatePaxCount(type.id, 1)} className="w-8 h-8 rounded-full border bg-white flex items-center justify-center hover:bg-blue-50"><FaPlus size={10}/></button>
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={handleConfirmPax}
            className={`w-full py-4 rounded-2xl font-bold transition-all ${isConfirmed ? 'bg-green-600 text-white shadow-lg' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
            {isConfirmed ? '✓ Đã xác nhận số lượng' : 'Xác nhận số lượng để nhập thông tin'}
          </button>
        </div>

        {/* BƯỚC 2: NHẬP THÔNG TIN CHI TIẾT */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {isConfirmed && passengers.map((p, index) => (
            <div key={index} className={`bg-white p-6 rounded-3xl shadow-sm border ${index === 0 ? 'border-blue-400 ring-2 ring-blue-50' : 'border-gray-100'}`}>
              <div className="flex items-center justify-between mb-6 pb-2 border-b">
                <h3 className="font-black text-[#007bff] flex items-center gap-2">
                  <FaUser /> HÀNH KHÁCH {index + 1} ({p.loaiHanhKhach === 'adult' ? 'Người lớn' : p.loaiHanhKhach === 'child' ? 'Trẻ em' : 'Em bé'})
                </h3>
              </div>

              {p.loaiHanhKhach === 'adult' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-blue-600 uppercase flex items-center gap-1">
                      <FaEnvelope className="text-[10px]" /> Email liên hệ *
                    </label>
                    <input 
                      type="email" 
                      placeholder="nguyenvana@gmail.com" 
                      required={index === 0} 
                      className="w-full border-2 border-white rounded-xl px-4 py-2 outline-none focus:border-blue-500"
                      onChange={e => setContact({...contact, email: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-blue-600 uppercase flex items-center gap-1">
                      <FaPhone className="text-[10px]" /> Số điện thoại *
                    </label>
                    <input 
                      type="text" 
                      placeholder="09xxxxxxxx" 
                      required={index === 0} 
                      className="w-full border-2 border-white rounded-xl px-4 py-2 outline-none focus:border-blue-500"
                      onChange={e => setContact({...contact, soDienThoai: e.target.value})} 
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase">Họ (VD: NGUYEN) *</label>
                  <input type="text" placeholder="Họ" required className="w-full border rounded-xl px-4 py-2 outline-none focus:border-blue-500 bg-gray-50/50" value={p.ho} onChange={e => handlePassengerChange(index, 'ho', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase">Tên (VD: VAN A) *</label>
                  <input type="text" placeholder="Tên" required className="w-full border rounded-xl px-4 py-2 outline-none focus:border-blue-500 bg-gray-50/50" value={p.ten} onChange={e => handlePassengerChange(index, 'ten', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase">Ngày sinh *</label>
                  <input type="date" required className="w-full border rounded-xl px-4 py-2 outline-none focus:border-blue-500 bg-gray-50/50" value={p.ngaySinh} onChange={e => handlePassengerChange(index, 'ngaySinh', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase">Giới tính *</label>
                  <select className="w-full border rounded-xl px-4 py-2 outline-none focus:border-blue-500 bg-gray-50/50" value={p.gioiTinh} onChange={e => handlePassengerChange(index, 'gioiTinh', e.target.value)}>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase">Số CMND/Hộ chiếu *</label>
                  <input type="text" placeholder="Số giấy tờ tùy thân" required className="w-full border rounded-xl px-4 py-2 outline-none focus:border-blue-500 bg-gray-50/50" value={p.soCMND} onChange={e => handlePassengerChange(index, 'soCMND', e.target.value)} />
                </div>
              </div>
            </div>
          ))}

          {isConfirmed && (
            <div className="pt-4 pb-12">
                <button type="submit" disabled={loading} className="w-full bg-[#007bff] text-white py-5 rounded-2xl font-black text-xl hover:bg-[#0056b3] shadow-xl hover:shadow-blue-200 transition-all flex justify-center items-center gap-3">
                    {loading ? 'Đang khởi tạo đơn hàng...' : 'TIẾP TỤC THANH TOÁN'} <FaArrowRight />
                </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ThongTinHanhKhach;