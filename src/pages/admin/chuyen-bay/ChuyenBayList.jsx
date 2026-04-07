import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    FaPlus, FaSearch, FaSyncAlt, FaPlane, FaLongArrowAltRight, 
    FaEdit, FaTrash, FaPlaneDeparture, FaPlaneArrival, FaBoxOpen 
} from 'react-icons/fa';
import { chuyenBayApi } from '../../../services/chuyenBayApi';

const ChuyenBayList = () => {
    const [chuyenBays, setChuyenBays] = useState([]);
    const [dsHang, setDsHang] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({ maHang: '', ngayBay: '', search: '' });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Sử dụng api /hang-bay như trong routes/api.php
                const res = await chuyenBayApi.getHangHangKhong();
                setDsHang(res.data || res);
            } catch (err) { console.error(err); }
        };
        fetchCategories();
    }, []);

    const fetchChuyenBays = async () => {
        setLoading(true);
        try {
            const activeFilters = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''));
            const response = await chuyenBayApi.getDanhSach(activeFilters);
            // Backend trả về { success: true, data: [...] }
            setChuyenBays(response.data || []);
        } catch (error) { console.error(error); } finally { setLoading(false); }
    };

    useEffect(() => { fetchChuyenBays(); }, [filters]);

    const handleFilterChange = (e) => setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const resetFilters = () => setFilters({ maHang: '', ngayBay: '', search: '' });

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa chuyến bay này không? Dữ liệu vé đã đặt sẽ bị ảnh hưởng!')) {
            try {
                await chuyenBayApi.xoaChuyenBay(id);
                fetchChuyenBays();
            } catch (error) { alert(error.response?.data?.message || "Không thể xóa."); }
        }
    };

    return (
        <div className="container-fluid px-4 mt-4 font-['Nunito',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,'Helvetica_Neue',Arial,sans-serif] text-[#5a5c69]">
            <div className="bg-white rounded shadow-[0_0.15rem_1.75rem_0_rgba(58,59,69,0.15)] mb-4 border-none">
                {/* Card Header */}
                <div className="px-4 py-3 border-b border-gray-100 flex flex-wrap items-center justify-between gap-2 bg-[#f8f9fc]">
                    <h6 className="m-0 font-bold text-[#4e73df] text-lg">Danh Sách Chuyến Bay</h6>
                    <Link to="/admin/chuyen-bay/tao" className="flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-[#1cc88a] rounded hover:bg-[#17a673] transition shadow-sm">
                        <FaPlus className="mr-1" /> THÊM CHUYẾN BAY MỚI
                    </Link>
                </div>

                <div className="p-4">
                    {/* Toolbar giống file index.blade.php */}
                    <div className="mb-4 bg-[#f8f9fc] p-4 rounded border border-gray-200 flex flex-wrap gap-3 items-center">
                        <select name="maHang" value={filters.maHang} onChange={handleFilterChange} className="text-sm p-2 border rounded border-gray-300 focus:ring-1 focus:ring-[#4e73df] outline-none bg-white">
                            <option value="">-- Tất cả hãng --</option>
                            {dsHang.map(h => <option key={h.maHang} value={h.maHang}>{h.tenHang}</option>)}
                        </select>
                        <input type="date" name="ngayBay" value={filters.ngayBay} onChange={handleFilterChange} className="text-sm p-2 border rounded border-gray-300 focus:ring-1 focus:ring-[#4e73df] outline-none" />
                        <div className="flex flex-1 min-w-[200px]">
                            <input type="text" name="search" value={filters.search} onChange={handleFilterChange} placeholder="Nhập mã chuyến bay..." className="w-full text-sm p-2 border border-r-0 border-gray-300 rounded-l focus:outline-none" />
                            <button onClick={fetchChuyenBays} className="px-4 bg-[#4e73df] text-white rounded-r hover:bg-[#2e59d9] transition"><FaSearch /></button>
                        </div>
                        <button onClick={resetFilters} className="px-3 py-2 text-sm text-white bg-[#858796] rounded hover:bg-[#717384] transition"><FaSyncAlt className="inline mr-1"/> Làm mới</button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left align-middle border-collapse border border-gray-200">
                            <thead className="bg-[#5a5c69] text-white text-center text-sm">
                                <tr>
                                    <th className="p-3 border font-semibold">Mã CB</th>
                                    <th className="p-3 border font-semibold">Hãng / Máy Bay</th>
                                    <th className="p-3 border font-semibold">Hành Trình</th>
                                    <th className="p-3 border font-semibold">Thời Gian</th>
                                    <th className="p-3 border font-semibold w-[15%]">Ghế (Còn/Tổng)</th>
                                    <th className="p-3 border font-semibold">Trạng Thái</th>
                                    <th className="p-3 border font-semibold">Hành Động</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {loading ? (
                                    <tr><td colSpan="7" className="text-center py-10">Đang tải dữ liệu...</td></tr>
                                ) : chuyenBays.length === 0 ? (
                                    <tr><td colSpan="7" className="text-center py-10"><FaBoxOpen className="mx-auto mb-2 text-3xl opacity-20"/> Không tìm thấy dữ liệu.</td></tr>
                                ) : (
                                    chuyenBays.map(cb => {
                                        const tong = cb.soGheTong || 1;
                                        const conLai = cb.soGheConLai || 0;
                                        const percent = (conLai / tong) * 100;
                                        const color = percent < 20 ? 'bg-[#e74a3b]' : (percent < 50 ? 'bg-[#f6c23e]' : 'bg-[#1cc88a]');

                                        return (
                                            <tr key={cb.maChuyenBay} className="hover:bg-gray-50 border-b transition">
                                                <td className="p-3 text-center font-bold text-[#4e73df]">#{cb.maChuyenBay}</td>
                                                <td className="p-3">
                                                    {/* Truy cập bằng snake_case như Backend trả về */}
                                                    <div className="font-bold text-gray-800">{cb.hang_hang_khong?.tenHang || 'N/A'}</div>
                                                    <div className="text-[11px] text-gray-500 mt-0.5"><FaPlane className="inline mr-1"/> {cb.may_bay?.tenMayBay}</div>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <div className="flex items-center justify-center gap-1.5 mb-1">
                                                        <span className="text-[10px] bg-[#36b9cc] text-white px-1.5 py-0.5 rounded font-bold">{cb.san_bay_di?.maCode}</span>
                                                        <FaLongArrowAltRight className="text-gray-400"/>
                                                        <span className="text-[10px] bg-[#4e73df] text-white px-1.5 py-0.5 rounded font-bold">{cb.san_bay_den?.maCode}</span>
                                                    </div>
                                                    <div className="text-[10px] text-gray-500 italic">{cb.san_bay_di?.thanhPho} - {cb.san_bay_den?.thanhPho}</div>
                                                </td>
                                                <td className="p-3 text-[11px] leading-relaxed">
                                                    <div><FaPlaneDeparture className="inline text-[#1cc88a] mr-1.5"/> {new Date(cb.ngayGioCatCanh).toLocaleString('vi-VN')}</div>
                                                    <div><FaPlaneArrival className="inline text-[#e74a3b] mr-1.5"/> {new Date(cb.ngayGioHaCanh).toLocaleString('vi-VN')}</div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden border border-gray-300">
                                                        <div className={`${color} h-full text-[9px] text-white font-bold flex items-center justify-center`} style={{ width: `${percent}%` }}>
                                                            {conLai}/{tong}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-3 text-center">
                                                    {cb.trangThai ? (
                                                        <span className="px-2 py-1 text-[10px] font-bold bg-green-100 text-green-700 rounded-full border border-green-200">HOẠT ĐỘNG</span>
                                                    ) : (
                                                        <span className="px-2 py-1 text-[10px] font-bold bg-gray-100 text-gray-600 rounded-full border border-gray-200">TẠM HOÃN</span>
                                                    )}
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex justify-center gap-1.5">
                                                        <Link to={`/admin/chuyen-bay/sua/${cb.maChuyenBay}`} className="w-8 h-8 bg-[#f6c23e] hover:bg-[#dda20a] text-white rounded flex items-center justify-center transition shadow-sm"><FaEdit/></Link>
                                                        <button onClick={() => handleDelete(cb.maChuyenBay)} className="w-8 h-8 bg-[#e74a3b] hover:bg-[#be2617] text-white rounded flex items-center justify-center transition shadow-sm"><FaTrash/></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChuyenBayList;