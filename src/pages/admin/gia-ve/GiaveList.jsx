import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaEdit } from 'react-icons/fa'; 
import { priceApi } from '../../../services/GiaveApi';

const GiaVeList = () => {
    const [dsGiaVe, setDsGiaVe] = useState([]);
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState('');

    useEffect(() => { fetchPrices(); }, []);

    const fetchPrices = async () => {
        setLoading(true);
        try {
            const res = await priceApi.getDanhSach({ keyword });
            setDsGiaVe(res.data.data || res.data);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    return (
        <div className="container-fluid px-4 mt-4 font-sans text-[#5a5c69]">
            <div className="bg-white rounded shadow-md border-none">
                <div className="px-4 py-3 border-b flex justify-between items-center bg-[#f8f9fc]">
                    <h6 className="m-0 font-bold text-[#4e73df] text-lg">Bảng Giá Chuyến Bay</h6>
                </div>
                <div className="p-4">
                    <div className="mb-4 flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Tìm theo chuyến bay, hạng vé..." 
                            value={keyword} 
                            onChange={(e) => setKeyword(e.target.value)} 
                            className="flex-1 p-2 border rounded text-sm outline-none focus:ring-1 focus:ring-[#4e73df]" 
                        />
                        <button onClick={fetchPrices} className="bg-[#4e73df] text-white px-4 rounded hover:bg-[#2e59d9] transition flex items-center justify-center">
                            <FaSearch />
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse border border-gray-200">
                            <thead className="bg-[#5a5c69] text-white text-center">
                                <tr>
                                    <th className="p-3 border font-semibold">Chuyến Bay</th>
                                    <th className="p-3 border font-semibold">Hạng Ghế</th>
                                    <th className="p-3 border font-semibold">Giá Cơ Bản</th>
                                    <th className="p-3 border font-semibold">Trạng Thái</th>
                                    <th className="p-3 border font-semibold w-[80px]">Sửa Giá</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" className="text-center py-10">Đang tải bảng giá...</td></tr>
                                ) : dsGiaVe.length === 0 ? (
                                    <tr><td colSpan="5" className="text-center py-10 italic">Không có dữ liệu giá vé.</td></tr>
                                ) : dsGiaVe.map(gv => (
                                    <tr key={gv.maGiaVe} className="hover:bg-gray-50 border-b">
                                        <td className="p-3 border text-sm text-center">
                                            <div className="font-bold text-[#4e73df]">Mã chuyến: {gv.maChuyenBay}</div>
                                            <div className="text-[10px] text-gray-500 uppercase">Đối tượng: {gv.loaiHanhKhach}</div>
                                        </td>
                                        <td className="p-3 border text-center">
                                            <span className={`px-2 py-1 rounded text-[11px] font-bold ${gv.loaiGhe === 'ThuongGia' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {gv.loaiGhe}
                                            </span>
                                        </td>
                                        <td className="p-3 border text-center font-bold text-red-600">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(gv.giaTien || 0))}
                                        </td>
                                        <td className="p-3 border text-center">
                                            <span className="text-green-600 text-[11px] font-semibold border border-green-200 bg-green-50 px-2 py-0.5 rounded">
                                                Đang áp dụng
                                            </span>
                                        </td>
                                        <td className="p-3 border text-center">
                                            <Link 
                                                to={`/admin/gia-ve/sua/${gv.maGiaVe}`} 
                                                className="inline-flex p-2 bg-[#f6c23e] text-white rounded hover:bg-[#dda20a] transition shadow-sm"
                                            >
                                                <FaEdit/>
                                            </Link>
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

export default GiaVeList;