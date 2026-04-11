import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaEdit } from 'react-icons/fa';
import { chuyenBayApi } from '../../../services/chuyenBayApi';

const ChuyenBayForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [errorMsg, setErrorMsg] = useState('');
    const [formData, setFormData] = useState({
        maHang: '', maMayBay: '', soGheTong: 100, soGheConLai: 100,
        trangThai: '1', maSanBayDi: '', maSanBayDen: '',
        ngayGioCatCanh: '', ngayGioHaCanh: '', diemDung: ''
    });

    const [dsHang, setDsHang] = useState([]);
    const [dsMayBay, setDsMayBay] = useState([]);
    const [dsSanBay, setDsSanBay] = useState([]);

    // Lấy Hãng và Sân bay khi tải trang
    useEffect(() => {
        const fetchCategories = () => {
            chuyenBayApi.getHangHangKhong().then(res => setDsHang(res.data || res)).catch(console.error);
            chuyenBayApi.getSanBay().then(res => setDsSanBay(res.data || res)).catch(console.error);
        };
        fetchCategories();

        if (isEditMode) {
            const fetchDetail = async () => {
                try {
                    const res = await chuyenBayApi.getChiTiet(id);
                    const data = res.data || res;
                    const formatDt = (dt) => dt ? new Date(dt).toISOString().slice(0, 16) : '';
                    setFormData({
                        ...data,
                        ngayGioCatCanh: formatDt(data.ngayGioCatCanh || data.ngay_gio_cat_canh),
                        ngayGioHaCanh: formatDt(data.ngayGioHaCanh || data.ngay_gio_ha_canh),
                        soGheTong: data.soGheTong || data.so_ghe_tong,
                        soGheConLai: data.soGheConLai !== undefined ? data.soGheConLai : data.so_ghe_con_lai
                    });
                } catch (err) { setErrorMsg('Lỗi tải dữ liệu!'); }
            };
            fetchDetail();
        }
    }, [id, isEditMode]);

    // ĐÃ THÊM: Theo dõi khi maHang thay đổi thì gọi lại danh sách máy bay
    useEffect(() => {
        if (formData.maHang) {
            chuyenBayApi.getMayBay(formData.maHang)
                .then(res => setDsMayBay(res.data || res))
                .catch(console.error);
        } else {
            setDsMayBay([]); // Xóa danh sách nếu chưa chọn hãng
        }
    }, [formData.maHang]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(p => {
            const newData = { 
                ...p, 
                [name]: value, 
                ...(name === 'soGheTong' && !isEditMode ? { soGheConLai: value } : {}) 
            };
            // ĐÃ THÊM: Nếu đổi hãng bay thì reset lựa chọn máy bay
            if (name === 'maHang') {
                newData.maMayBay = '';
            }
            return newData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        try {
            if (isEditMode) await chuyenBayApi.capNhatChuyenBay(id, formData);
            else await chuyenBayApi.themChuyenBay(formData);
            alert("Thành công!");
            navigate('/admin/chuyen-bay');
        } catch (err) { setErrorMsg(err.response?.data?.message || err.message); }
    };

    return (
        <div className="container-fluid mt-4 font-sans text-gray-800">
            {/* Giữ nguyên cấu trúc HTML bên dưới của bạn */}
            <div className="bg-white rounded shadow-md mb-4 border border-gray-200">
                <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h5 className="m-0 font-bold text-[#4e73df]">{isEditMode ? `Cập Nhật #${id}` : 'Thêm Mới'}</h5>
                    <Link to="/admin/chuyen-bay" className="text-xs bg-gray-500 text-white px-3 py-1.5 rounded flex items-center shadow-sm"><FaArrowLeft className="mr-1"/> Quay lại</Link>
                </div>

                <div className="p-5">
                    {errorMsg && <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded text-sm">{errorMsg}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            <div>
                                <div className="mb-3">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Hãng Hàng Không *</label>
                                    <select name="maHang" value={formData.maHang} onChange={handleChange} className="w-full p-2 border rounded focus:border-blue-500 outline-none" required>
                                        <option value="">-- Chọn Hãng --</option>
                                        {dsHang.map(h => <option key={h.maHang} value={h.maHang}>{h.tenHang}</option>)}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Máy Bay *</label>
                                    <select name="maMayBay" value={formData.maMayBay} onChange={handleChange} className="w-full p-2 border rounded focus:border-blue-500 outline-none" required disabled={!formData.maHang}>
                                        <option value="">{formData.maHang ? "-- Chọn Máy Bay --" : "-- Vui lòng chọn hãng trước --"}</option>
                                        {dsMayBay.map(m => <option key={m.maMayBay} value={m.maMayBay}>{m.tenMayBay}</option>)}
                                    </select>
                                </div>
                                <div className={`grid ${isEditMode ? 'grid-cols-2 gap-3' : 'grid-cols-1'} mb-3`}>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Tổng Số Ghế *</label>
                                        <input type="number" name="soGheTong" value={formData.soGheTong} onChange={handleChange} min="1" className="w-full p-2 border rounded outline-none focus:border-blue-500" required />
                                        {!isEditMode && <small className="text-[10px] text-gray-500 mt-1 block">Tự động thiết lập ghế còn lại.</small>}
                                    </div>
                                    {isEditMode && (
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Ghế Còn Lại</label>
                                            <input type="number" name="soGheConLai" value={formData.soGheConLai} onChange={handleChange} className="w-full p-2 border rounded outline-none" />
                                        </div>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Trạng Thái</label>
                                    <select name="trangThai" value={formData.trangThai} onChange={handleChange} className="w-full p-2 border rounded outline-none">
                                        <option value="1">Hoạt động</option>
                                        <option value="0">Tạm ngưng</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Sân Bay Đi *</label>
                                        <select name="maSanBayDi" value={formData.maSanBayDi} onChange={handleChange} className="w-full p-2 border rounded focus:border-blue-500 outline-none" required>
                                            <option value="">-- Nơi đi --</option>
                                            {dsSanBay.map(s => <option key={s.maSanBay} value={s.maSanBay}>{s.thanhPho} ({s.maCode})</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Sân Bay Đến *</label>
                                        <select name="maSanBayDen" value={formData.maSanBayDen} onChange={handleChange} className="w-full p-2 border rounded focus:border-blue-500 outline-none" required>
                                            <option value="">-- Nơi đến --</option>
                                            {dsSanBay.map(s => <option key={s.maSanBay} value={s.maSanBay}>{s.thanhPho} ({s.maCode})</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Cất Cánh *</label>
                                        <input type="datetime-local" name="ngayGioCatCanh" value={formData.ngayGioCatCanh} onChange={handleChange} className="w-full p-2 border rounded outline-none focus:border-blue-500" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Hạ Cánh *</label>
                                        <input type="datetime-local" name="ngayGioHaCanh" value={formData.ngayGioHaCanh} onChange={handleChange} className="w-full p-2 border rounded outline-none focus:border-blue-500" required />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6 pt-4 border-t gap-2">
                            <button type="submit" className={`px-5 py-2 font-bold text-white rounded shadow-sm flex items-center ${isEditMode ? 'bg-yellow-500' : 'bg-blue-600'}`}>
                                {isEditMode ? <><FaEdit className="mr-1"/> Cập Nhật</> : <><FaSave className="mr-1"/> Lưu</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChuyenBayForm;