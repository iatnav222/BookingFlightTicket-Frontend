import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaCalendarAlt } from 'react-icons/fa';
import { promotionApi } from '../../../services/KhuyenmaiApi';

const BACKEND_URL = 'https://bookingflightticket-backend-new.onrender.com';

const KhuyenMaiList = () => {
    const [dsKhuyenMai, setDsKhuyenMai] = useState([]);
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState('');


    const fetchPromotions = useCallback(async () => {
    setLoading(true);
    try {
        const res = await promotionApi.getDanhSach({ keyword });
        setDsKhuyenMai(res.data.data || []);
    } catch (error) {
        console.error("Lỗi lấy danh sách khuyến mãi:", error);
    } finally {
        setLoading(false);
    }
    }, [keyword]);

    useEffect(() => {
        fetchPromotions();
    }, [fetchPromotions]);

    const handleDelete = async (id) => {
        if (window.confirm(`Bạn có chắc muốn xóa chương trình khuyến mãi này không?`)) {
            try {
                await promotionApi.xoaKM(id);
                fetchPromotions();
            } catch (error) {
                alert("Lỗi khi xóa.");
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "00/00/0000";
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    const renderTypeBadge = (km) => {
        const typeValue = km.type;

        return (
            <div className="flex justify-center items-center w-full">
                {(() => {
                    switch (typeValue) {
                        case 'phan_tram':
                            return <span className="bg-[#bde8f5] text-[#2c7a94] px-3 py-1 rounded-full text-[10px] font-bold min-w-[110px] inline-block shadow-sm text-center">Phần trăm (%)</span>;
                        case 'tien_mat':
                            return <span className="bg-[#fef3c7] text-[#92400e] px-3 py-1 rounded-full text-[10px] font-bold min-w-[110px] inline-block shadow-sm text-center">Tiền mặt (VNĐ)</span>;
                        default:
                            return <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-bold min-w-[110px] inline-block shadow-sm text-center italic">Phần trăm</span>;
                    }
                })()}
            </div>
        );
    };

    return (
        <div className="w-full flex flex-col gap-6">
            <div className="bg-[#f8f9fc] rounded-lg p-6 border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h5 className="text-[#4e73df] font-bold text-xl m-0 uppercase tracking-wide">
                        Danh Sách Mã Giảm Giá
                    </h5>
                    <Link 
                        to="/admin/khuyen-mai/tao" 
                        className="flex items-center px-4 py-2 text-sm text-white bg-[#1cc88a] rounded hover:bg-[#17a673] transition shadow-sm"
                    >
                        <FaPlus className="mr-2 text-xs" /> Thêm Khuyến Mãi
                    </Link>
                </div>

                <div className="flex justify-end mb-6">
                    <form onSubmit={(e) => { e.preventDefault(); fetchPromotions(); }} className="relative flex shadow-sm">
                        <input 
                            type="text" 
                            placeholder="Tìm tên chương trình..." 
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="border border-gray-300 rounded-l-md px-4 py-2 text-sm outline-none w-72 focus:border-[#4e73df]"
                        />
                        <button type="submit" className="bg-[#4e73df] text-white px-5 rounded-r-md hover:bg-[#2e59d9] transition">
                            <FaSearch className="text-sm"/>
                        </button>
                    </form>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
                    <table className="w-full border-collapse bg-white text-center table-fixed min-w-[1250px]">
                        <thead className="bg-[#1a202c] text-white text-[14px] font-bold">
                            <tr>
                                <th className="p-4 border-r border-gray-700 w-[60px]">ID</th>
                                <th className="p-4 border-r border-gray-700 w-[140px]">Ảnh</th>
                                <th className="p-4 border-r border-gray-700 text-left px-6 w-[300px]">Tên Chương Trình</th>
                                <th className="p-4 border-r border-gray-700 w-[120px]">Giảm Giá</th>
                                <th className="p-4 border-r border-gray-700 w-[100px]">Số Lượng</th>
                                <th className="p-4 border-r border-gray-700 w-[180px]">Thời Gian Áp Dụng</th>
                                <th className="p-4 border-r border-gray-700 w-[150px]">Loại</th>
                                <th className="p-4 border-r border-gray-700 w-[120px]">Trạng Thái</th>
                                <th className="p-4 w-[110px]">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="text-[13px]">
                            {loading ? (
                                <tr><td colSpan="9" className="py-20 text-center font-bold">Đang tải dữ liệu...</td></tr>
                            ) : dsKhuyenMai.map((km) => {
                                const imagePath = km.anh_url || km.anh;
                                const finalSrc = imagePath 
                                    ? (imagePath.startsWith('http') 
                                        ? imagePath 
                                        : `${BACKEND_URL}/storage/${encodeURI(imagePath.replace(/^\//, ''))}`)
                                    : null;

                                return (
                                    <tr key={km.maGiamGia} className="border-b border-gray-200 hover:bg-blue-50/20 transition-colors">
                                        <td className="p-4 border-r border-gray-100 font-bold">{km.maGiamGia}</td>
                                        <td className="p-2 border-r border-gray-100">
                                            <div className="w-28 h-16 mx-auto rounded overflow-hidden border border-gray-200 shadow-sm bg-gray-100 flex items-center justify-center">
                                                {finalSrc ? (
                                                    <img src={finalSrc} className="w-full h-full object-cover" alt="KM" />
                                                ) : <span className="text-[11px] text-gray-400">No Image</span>}
                                            </div>
                                        </td>
                                        <td className="p-4 border-r border-gray-100 text-left px-6">
                                            <div className="font-bold text-blue-700 uppercase leading-snug text-[16px]">{km.ten_km}</div>
                                            <div className="text-[14px] text-gray-500 mt-1 italic ">DK: {km.dieukien}</div>
                                        </td>
                                        <td className="p-4 border-r border-gray-100">
                                            <span className="bg-[#e74a3b] text-white px-3 py-1.5 rounded text-[12px] font-bold min-w-[80px] inline-block">
                                                {km.type === 'tien_mat' 
                                                    ? `-${Number(km.giamPhanTram).toLocaleString()}đ` 
                                                    : `-${km.giamPhanTram}%`
                                                }
                                            </span>
                                        </td>
                                        <td className="p-4 border-r border-gray-100">
                                            <div className="font-bold text-base">{km.soLuongToiDa}</div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase">lượt</div>
                                        </td>
                                        <td className="p-4 border-r border-gray-100">
                                            <div className="flex flex-col items-start w-fit mx-auto text-[12px] text-gray-700 font-medium">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <FaCalendarAlt className="text-green-600" /> {formatDate(km.ngayBatDau)}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <FaCalendarAlt className="text-red-500" /> {formatDate(km.ngayKetThuc)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 border-r border-gray-100">
                                            {renderTypeBadge(km)}
                                        </td>
                                        <td className="p-4 border-r border-gray-100 text-center">
                                            <div className="flex justify-center w-full">
                                                {km.trangThai ? (
                                                    <span className="bg-[#e6fffa] text-[#236e61] px-3 py-1.5 rounded-full text-[11px] font-bold shadow-sm border border-green-100 whitespace-nowrap min-w-[100px]">
                                                        Hoạt động
                                                    </span>
                                                ) : (
                                                    <span className="bg-[#f7fafc] text-[#a0aec0] px-3 py-1.5 rounded-full text-[11px] font-bold shadow-sm border border-gray-100 whitespace-nowrap min-w-[100px]">
                                                        Tạm khóa
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-1 justify-center">
                                                <Link to={`/admin/khuyen-mai/sua/${km.maGiamGia}`} className="p-2 bg-[#f4b619] hover:bg-[#d39e00] text-black rounded shadow transition-all active:scale-95">
                                                    <FaEdit className="text-sm" />
                                                </Link>
                                                <button onClick={() => handleDelete(km.maGiamGia)} className="p-2 bg-[#e02d1b] hover:bg-[#b91d0e] text-white rounded shadow transition-all active:scale-95">
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

export default KhuyenMaiList;