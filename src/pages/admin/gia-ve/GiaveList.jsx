import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaEdit, FaTrash, FaPlus, FaCalendarAlt } from 'react-icons/fa';
import { priceApi } from '../../../services/GiaveApi';

const GiaVeList = () => {
    const [dsGiaVe, setDsGiaVe] = useState([]);
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [selectedType, setSelectedType] = useState('');

    useEffect(() => { 
        fetchPrices(); 
    }, []);

    const fetchPrices = async () => {
        setLoading(true);
        try {
            const res = await priceApi.getDanhSach({ keyword });
            
            setDsGiaVe(res.data.data || []);
        } catch (error) {
            console.error("Lỗi lấy danh sách giá vé:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa cấu hình giá vé này không?')) {
            try {
                await priceApi.xoaGia(id);
                fetchPrices();
            } catch (error) {
                alert("Lỗi: " + (error.response?.data?.message || "Không thể xóa dữ liệu"));
            }
        }
    };

    const renderPassengerBadge = (type) => {
       
        const badges = {
            'NguoiLon': { label: 'Người lớn', color: 'bg-[#4e73df]' },
            'TreEm': { label: 'Trẻ em', color: 'bg-[#1cc88a]' },
            'EmBe': { label: 'Em bé', color: 'bg-[#f6c23e]' },
        };
        const item = badges[type] || { label: type, color: 'bg-gray-500' };
        return (
            <span className={`px-4 py-1 rounded-full text-[11px] font-bold text-white min-w-[90px] inline-block shadow-sm text-center ${item.color}`}>
                {item.label}
            </span>
        );
    };

    return (
        <div className="w-full flex flex-col gap-6 font-sans">
            <div className="bg-[#f8f9fc] rounded-lg p-6 border border-gray-200 shadow-sm">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h5 className="text-[#4e73df] font-bold text-xl m-0 uppercase tracking-wide">
                        Cấu Hình Giá Vé
                    </h5>
                    <Link
                        to="/admin/gia-ve/tao"
                        className="flex items-center px-5 py-2.5 text-sm text-white bg-[#1cc88a] rounded hover:bg-[#17a673] transition shadow-md "
                    >
                        <FaPlus className="mr-2 text-xs" /> THIẾT LẬP GIÁ MỚI
                    </Link>
                </div>

                <div className="flex justify-end gap-3 mb-6">
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600 bg-white outline-none focus:border-[#4e73df] shadow-sm"
                    >
                        <option value="">-- Tất cả đối tượng --</option>
                        <option value="NguoiLon">Người lớn</option>
                        <option value="TreEm">Trẻ em</option>
                        <option value="EmBe">Em bé</option>
                    </select>

                    <form onSubmit={(e) => { e.preventDefault(); fetchPrices(); }} className="relative flex shadow-sm">
                        <input
                            type="text"
                            placeholder="Tìm theo mã chuyến bay..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="border border-gray-300 rounded-l-md px-4 py-2 text-sm outline-none w-72 focus:border-[#4e73df]"
                        />
                        <button type="submit" className="bg-[#4e73df] text-white px-5 rounded-r-md hover:bg-[#2e59d9] transition">
                            <FaSearch className="text-sm" />
                        </button>
                    </form>
                </div>

                <div className="overflow-hidden rounded-lg border border-gray-300 shadow-sm">
                    <table className="w-full border-collapse bg-white table-auto">
                        <thead className="bg-[#1a202c] text-white text-[13px] font-bold tracking-wider">
                            <tr>
                                <th className="p-4 border-r border-gray-700 w-[10%] text-center">Mã CB</th>
                                <th className="p-4 border-r border-gray-700 w-[35%] text-left pl-10">Hành Trình & Thời Gian</th>
                                <th className="p-4 border-r border-gray-700 w-[15%] text-center">Đối Tượng</th>
                                <th className="p-4 border-r border-gray-700 w-[15%] text-center">Loại Ghế</th>
                                <th className="p-4 border-r border-gray-700 w-[15%] text-center">Giá Vé (VND)</th>
                                <th className="p-4 w-[10%] text-center">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="text-[14px]">
                            {loading ? (
                                <tr><td colSpan="6" className="py-20 text-center text-gray-500 font-bold">Đang tải dữ liệu...</td></tr>
                            ) : dsGiaVe.length === 0 ? (
                                <tr><td colSpan="6" className="py-10 text-center text-gray-400 italic">Không có dữ liệu giá vé nào</td></tr>
                            ) : dsGiaVe.filter(gv => selectedType === '' || gv.loaiHanhKhach === selectedType).map((gv) => {
                               
                                const dt = gv.chuyen_bay?.ngayGioCatCanh ? new Date(gv.chuyen_bay.ngayGioCatCanh) : null;
                                const timeStr = dt ? dt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '00:00';
                                const dateStr = dt ? dt.toLocaleDateString('vi-VN') : '00/00/0000';

                                return (
                                    <tr key={gv.maGiaVe} className="border-b border-gray-200 hover:bg-blue-50/30 transition-colors">
                                        <td className="p-4 text-center border-r border-gray-100 font-bold text-blue-600">
                                            #{gv.maChuyenBay}
                                        </td>
                                        <td className="p-4 border-r border-gray-100 text-left pl-10">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-800 text-[15px]">
                                                   
                                                    Sân bay {gv.chuyen_bay?.maSanBayDi} → Sân bay {gv.chuyen_bay?.maSanBayDen}
                                                </span>
                                                <div className="text-[12px] text-gray-500 font-medium flex items-center gap-1">
                                                    <FaCalendarAlt size={10} className="text-gray-400" /> {timeStr} {dateStr}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center border-r border-gray-100">
                                            {renderPassengerBadge(gv.loaiHanhKhach)}
                                        </td>
                                        <td className="p-4 text-center border-r border-gray-100 font-medium text-gray-700">
                                            {gv.loaiGhe === 'PhoThong' ? 'Phổ Thông' : 'Thương Gia'}
                                        </td>
                                        <td className="p-4 text-right border-r border-gray-100 pr-10">
                                            <div className="flex items-baseline justify-end gap-1">
                                                <span className="text-[18px] font-bold text-[#b91d1d]">
                                                    {new Intl.NumberFormat('vi-VN').format(gv.giaTien || 0)}
                                                </span>
                                                <span className="text-sm font-bold text-[#b91d1d]">đ</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex gap-2 justify-center">
                                                <Link 
                                                    to={`/admin/gia-ve/sua/${gv.maGiaVe}`} 
                                                    className="p-2 bg-[#f4b619] hover:bg-[#d39e00] text-black rounded shadow active:scale-95 transition-all"
                                                    title="Sửa"
                                                >
                                                    <FaEdit className="text-sm" />
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(gv.maGiaVe)} 
                                                    className="p-2 bg-[#e02d1b] hover:bg-[#b91d0e] text-white rounded shadow active:scale-95 transition-all"
                                                    title="Xóa"
                                                >
                                                    <FaTrash className="text-sm" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default GiaVeList;