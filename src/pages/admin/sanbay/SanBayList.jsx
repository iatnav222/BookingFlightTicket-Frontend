import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaMapMarkerAlt } from 'react-icons/fa';
import { sanBayApi } from '../../../services/Sanbayapi';

const BACKEND_URL = 'https://bookingflightticket-backend-new.onrender.com';

const SanBayList = () => {
    const [dsSanBay, setDsSanBay] = useState([]);
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const fetchSanBays = useCallback(async () => {
        setLoading(true);
        try {
     
            const res = await sanBayApi.getDanhSach({ keyword, _t: Date.now() });
            setDsSanBay(res.data.data || []);
        } catch (error) {
            console.error("Lỗi lấy danh sách:", error);
        } finally {
            setLoading(false);
        }
    }, [keyword]);

    useEffect(() => {
        fetchSanBays();
    }, [fetchSanBays]);

    const handleDelete = async (id, name) => {
        if (window.confirm(`Xóa sân bay "${name}"?`)) {
            try {
                await sanBayApi.xoaSanBay(id);
                alert("Xóa thành công!");
                fetchSanBays();
            } catch (error) {
                alert("Lỗi: " + (error.response?.data?.message || "Không thể xóa."));
            }
        }
    };

    const cities = [...new Set(dsSanBay.map(item => item.thanhPho))];

    return (
        <div className="flex flex-col gap-6">
            <div className="bg-[#f8f9fc] rounded-lg p-6 border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h5 className="text-[#4e73df] font-bold text-lg uppercase tracking-wide">Danh Sách Sân Bay</h5>
                    <Link to="/admin/san-bay/tao" className="flex items-center px-4 py-2 text-sm text-white bg-[#1cc88a] rounded hover:bg-[#17a673] transition shadow-sm">
                        <FaPlus className="mr-2" /> Thêm SB Mới
                    </Link>
                </div>

                <div className="flex justify-end gap-3 mb-6">
                    <select 
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 text-xs bg-white outline-none focus:ring-1 focus:ring-[#4e73df]"
                    >
                        <option value="">-- Tất cả thành phố --</option>
                        {cities.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>

                    <form onSubmit={(e) => { e.preventDefault(); fetchSanBays(); }} className="relative flex shadow-sm">
                        <input 
                            type="text" 
                            placeholder="Mã hoặc tên sân bay..." 
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="border border-gray-300 rounded-l-md px-4 py-2 text-xs outline-none w-64 focus:border-[#4e73df]"
                        />
                        <button type="submit" className="bg-[#4e73df] text-white px-4 rounded-r-md hover:bg-[#2e59d9]">
                            <FaSearch className="text-sm"/>
                        </button>
                    </form>
                </div>

                <div className="overflow-hidden rounded-lg border border-gray-300 shadow-sm">
                    <table className="w-full border-collapse bg-white">
                        <thead className="bg-[#5a5c69] text-white text-[13px] font-bold">
                            <tr>
                                <th className="p-4 border-r border-gray-600 w-[130px] text-center">Mã Code</th>
                                <th className="p-4 border-r border-gray-600 w-[200px] text-center">Hình ảnh</th>
                                <th className="p-4 border-r border-gray-600 text-center">Tên Sân Bay</th>
                                <th className="p-4 border-r border-gray-600 text-center">Thành Phố</th>
                                <th className="p-4 text-center w-[130px]">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="text-[13px]">
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-10">Đang tải dữ liệu...</td></tr>
                            ) : dsSanBay.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-10 text-gray-500">Không có dữ liệu.</td></tr>
                            ) : dsSanBay.filter(sb => !selectedCity || sb.thanhPho === selectedCity).map((sb) => {
                                
                                const imagePath = sb.hinh_anh_url || sb.hinhAnh;
                                const finalSrc = imagePath 
                                    ? (imagePath.startsWith('http') 
                                        ? `${imagePath}?t=${Date.now()}` 
                                        : `${BACKEND_URL}/storage/${imagePath.replace(/^\//, '')}?t=${Date.now()}`)
                                    : null;

                                return (
                                    <tr key={sb.maSanBay} className="border-b border-gray-200 hover:bg-blue-50/30 transition-colors">
                                        <td className="p-4 text-center border-r border-gray-100">
                                            <span className="bg-[#2563eb] text-white px-3 py-1.5 rounded-md font-bold text-[15px] shadow-sm">
                                                {sb.maCode}
                                            </span>
                                        </td>
                                        <td className="p-2 text-center border-r border-gray-100">
                                            <div className="w-40 h-20 mx-auto rounded overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                                                {finalSrc ? (
                                                    <img 
                                                        src={finalSrc} 
                                                        className="w-full h-full object-cover"
                                                        alt={sb.tenSanBay}
                                                        onError={(e) => { e.target.src = "https://via.placeholder.com/160x80?text=No+Image"; }}
                                                    />
                                                ) : <span className="text-gray-400 text-[10px]">No Image</span>}
                                            </div>
                                        </td>
                                        <td className="p-4 font-bold text-gray-800 border-r border-gray-100">{sb.tenSanBay}</td>
                                        <td className="p-4 border-r border-gray-100">
                                            <div className="flex items-center text-gray-600 font-bold">
                                                <FaMapMarkerAlt className="mr-2 text-[#e74a3b]"/> {sb.thanhPho}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex gap-2 justify-center">
                                                <Link to={`/admin/san-bay/sua/${sb.maSanBay}`} className="p-2 bg-[#f4b619] text-black rounded-md hover:bg-[#d39e00]">
                                                    <FaEdit />
                                                </Link>
                                                <button onClick={() => handleDelete(sb.maSanBay, sb.tenSanBay)} className="p-2 bg-[#e02d1b] text-white rounded-md hover:bg-[#b91d0e]">
                                                    <FaTrash />
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

export default SanBayList;