import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaMapMarkerAlt } from 'react-icons/fa';
import { sanBayApi } from '../../../services/Sanbayapi';

const SanBayList = () => {
    const [dsSanBay, setDsSanBay] = useState([]);
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState('');

    useEffect(() => { fetchSanBays(); }, []);

    const fetchSanBays = async () => {
        setLoading(true);
        try {
            const res = await sanBayApi.getDanhSach({ keyword });
            setDsSanBay(res.data.data);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id, ten) => {
        if (window.confirm(`Xóa sân bay ${ten}?`)) {
            try {
                await sanBayApi.xoaSanBay(id);
                fetchSanBays();
            } catch (error) { alert("Lỗi khi xóa."); }
        }
    };

    return (
        <div className="container-fluid px-4 mt-4 font-sans">
            <div className="bg-white rounded shadow-sm border-none">
                <div className="px-4 py-3 border-b flex justify-between items-center bg-[#f8f9fc]">
                    <h6 className="m-0 font-bold text-[#4e73df] text-lg">Quản Lý Sân Bay</h6>
                    <Link to="/admin/san-bay/tao" className="bg-[#1cc88a] text-white px-3 py-1.5 rounded text-xs font-bold flex items-center">
                        <FaPlus className="mr-1" /> THÊM MỚI
                    </Link>
                </div>
                <div className="p-4">
                    <div className="mb-4 flex gap-2">
                        <input type="text" placeholder="Tìm tên sân bay, thành phố..." value={keyword} onChange={(e) => setKeyword(e.target.value)} className="flex-1 p-2 border rounded text-sm outline-none" />
                        <button onClick={fetchSanBays} className="bg-[#4e73df] text-white px-4 rounded"><FaSearch/></button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#5a5c69] text-white">
                                <tr>
                                    <th className="p-3 border">ID</th>
                                    <th className="p-3 border">Tên Sân Bay</th>
                                    <th className="p-3 border">Vị Trí</th>
                                    <th className="p-3 border w-[100px]">Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="4" className="text-center py-4">Đang tải...</td></tr>
                                ) : dsSanBay.map(sb => (
                                    <tr key={sb.maSanBay} className="hover:bg-gray-50 border-b">
                                        <td className="p-3 border">{sb.maSanBay}</td>
                                        <td className="p-3 border font-bold text-blue-600">{sb.tenSanBay}</td>
                                        <td className="p-3 border">
                                            <div className="flex items-center text-gray-600 text-sm">
                                                <FaMapMarkerAlt className="mr-1 text-red-400"/> {sb.thanhPho}, {sb.quocGia}
                                            </div>
                                        </td>
                                        <td className="p-3 border">
                                            <div className="flex gap-2">
                                                <Link to={`/admin/san-bay/sua/${sb.maSanBay}`} className="p-2 bg-yellow-400 text-white rounded hover:bg-yellow-500"><FaEdit/></Link>
                                                <button onClick={() => handleDelete(sb.maSanBay, sb.tenSanBay)} className="p-2 bg-red-500 text-white rounded hover:bg-red-600"><FaTrash/></button>
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

export default SanBayList;