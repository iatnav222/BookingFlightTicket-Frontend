import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaCalendarAlt } from 'react-icons/fa';
import { promotionApi } from '../../../services/KhuyenmaiApi';

const KhuyenMaiList = () => {
    const [dsKhuyenMai, setDsKhuyenMai] = useState([]);
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState('');

    useEffect(() => { fetchPromotions(); }, []);

    const fetchPromotions = async () => {
        setLoading(true);
        try {
            const res = await promotionApi.getDanhSach({ keyword });
            setDsKhuyenMai(res.data.data || res.data);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id, code) => {
        if (window.confirm(`Bạn có chắc muốn xóa mã giảm giá này không?`)) {
            try {
                await promotionApi.xoaKM(id);
                fetchPromotions();
            } catch (error) { alert("Lỗi khi xóa."); }
        }
    };

    return (
        <div className="container-fluid px-4 mt-4 font-sans text-[#5a5c69]">
            <div className="bg-white rounded shadow-md border-none">
                <div className="px-4 py-3 border-b flex justify-between items-center bg-[#f8f9fc]">
                    <h6 className="m-0 font-bold text-[#4e73df] text-lg">Quản Lý Khuyến Mãi</h6>
                    <Link to="/admin/khuyen-mai/tao" className="bg-[#1cc88a] text-white px-3 py-1.5 rounded text-xs font-bold flex items-center">
                        <FaPlus className="mr-1" /> THÊM MÃ MỚI
                    </Link>
                </div>
                <div className="p-4">
                    <div className="mb-4 flex gap-2">
                        <input type="text" placeholder="Tìm theo mã hoặc nội dung..." value={keyword} onChange={(e) => setKeyword(e.target.value)} className="flex-1 p-2 border rounded text-sm outline-none focus:ring-1 focus:ring-blue-500" />
                        <button onClick={fetchPromotions} className="bg-[#4e73df] text-white px-4 rounded hover:bg-[#2e59d9]"><FaSearch/></button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse border border-gray-200">
                            <thead className="bg-[#5a5c69] text-white text-center">
                                <tr>
                                    <th className="p-3 border font-semibold">Mã KM</th>
                                    <th className="p-3 border font-semibold text-center">Mô Tả</th>
                                    <th className="p-3 border font-semibold text-center">Mức Giảm</th>
                                    <th className="p-3 border font-semibold text-center">Thời Hạn</th>
                                    <th className="p-3 border font-semibold w-[100px]">Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" className="text-center py-10 italic">Đang tải khuyến mãi...</td></tr>
                                ) : dsKhuyenMai.length === 0 ? (
                                    <tr><td colSpan="5" className="text-center py-10 italic">Không có mã khuyến mãi nào.</td></tr>
                                ) : dsKhuyenMai.map(km => (
                                    <tr key={km.maGiamGia} className="hover:bg-gray-50 border-b">
                                        <td className="p-3 border font-bold text-red-500 text-center">
                                            ID: {km.maGiamGia}
                                        </td>
                                        <td className="p-3 border text-sm text-center">
                                            {km.tenKhuyenMai || km.moTa || 'Chương trình khuyến mãi'}
                                        </td>
                                        <td className="p-3 border text-center">
                                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                                                -{km.giamPhanTram}%
                                            </span>
                                        </td>
                                        <td className="p-3 border text-sm text-gray-600 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <FaCalendarAlt className="text-blue-400"/> 
                                                {km.ngayKetThuc ? new Date(km.ngayKetThuc).toLocaleDateString('vi-VN') : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="p-3 border text-center">
                                            <div className="flex gap-2 justify-center">
                                                <Link to={`/admin/khuyen-mai/sua/${km.maGiamGia}`} className="p-2 bg-[#f6c23e] text-white rounded"><FaEdit/></Link>
                                                <button onClick={() => handleDelete(km.maGiamGia, km.maGiamGia)} className="p-2 bg-[#e74a3b] text-white rounded"><FaTrash/></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KhuyenMaiList;