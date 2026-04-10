import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    FaPlus, FaSearch, FaSyncAlt, FaPlane, 
    FaEdit, FaTrash, FaBoxOpen, FaAngleLeft, FaAngleRight
} from 'react-icons/fa';
import { mayBayApi } from '../../../services/mayBayApi'; 

const MayBayList = () => {
    const [allMayBays, setAllMayBays] = useState([]); 
    const [dsHang, setDsHang] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({ maHang: '', keyword: '' });
    
    // Phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {      
        mayBayApi.getHangHangKhong()
            .then(res => {
                if (res.data && res.data.data) {
                    setDsHang(res.data.data); 
                } else {
                    setDsHang([]);
                }
            })
            .catch(console.error);
            fetchMayBays({ maHang: '', keyword: '' });
    }, []);
    const fetchMayBays = async (queryFilters) => {
        setLoading(true);
        try {
            const res = await mayBayApi.getDanhSach(queryFilters);
            setAllMayBays(res.data.data);
            setCurrentPage(1);
        } catch (error) { 
            console.error(error); 
        } finally { 
            setLoading(false); 
        }
    };

    const handleFilterChange = (e) => setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSearch = () => fetchMayBays(filters);
    const handleKeyDown = (e) => { if (e.key === 'Enter') handleSearch(); };

    const resetFilters = () => {
        const emptyFilters = { maHang: '', keyword: '' };
        setFilters(emptyFilters);
        fetchMayBays(emptyFilters); 
    };

    const handleDelete = async (id, ten) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa máy bay ${ten} không?`)) {
            try {
                await mayBayApi.xoaMayBay(id);
                alert('Xóa thành công!');
                fetchMayBays(filters);
            } catch (error) { alert("Không thể xóa."); }
        }
    };

    // Logic Phân trang
    const totalPages = Math.ceil(allMayBays.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentMayBays = allMayBays.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
    };

    return (
        <div className="container-fluid px-4 mt-4 font-sans text-[#5a5c69]">
            <div className="bg-white rounded shadow-[0_0.15rem_1.75rem_0_rgba(58,59,69,0.15)] mb-4 border-none">
                <div className="px-4 py-3 border-b border-gray-100 flex flex-wrap items-center justify-between gap-2 bg-[#f8f9fc]">
                    <h6 className="m-0 font-bold text-[#4e73df] text-lg">Danh Sách Tàu Bay</h6>
                    <Link to="/admin/may-bay/tao" className="flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-[#1cc88a] rounded hover:bg-[#17a673] transition shadow-sm">
                        <FaPlus className="mr-1" /> THÊM MỚI
                    </Link>
                </div>

                <div className="p-4">
                    {/* Bộ lọc */}
                    <div className="mb-4 bg-[#f8f9fc] p-4 rounded border border-gray-200 flex flex-wrap gap-3 items-center">
                        <select name="maHang" value={filters.maHang} onChange={handleFilterChange} className="text-sm p-2 border rounded border-gray-300 focus:ring-1 focus:ring-[#4e73df] outline-none bg-white">
                            <option value="">-- Tất cả hãng --</option>
                            {dsHang.map(h => <option key={h.maHang} value={h.maHang}>{h.tenHang}</option>)}
                        </select>
                        <div className="flex flex-1 min-w-[200px]">
                            <input type="text" name="keyword" value={filters.keyword} onChange={handleFilterChange} onKeyDown={handleKeyDown} placeholder="Tìm tên, loại máy bay..." className="w-full text-sm p-2 border border-r-0 border-gray-300 rounded-l focus:outline-none" />
                            <button onClick={handleSearch} className="px-4 bg-[#4e73df] text-white rounded-r hover:bg-[#2e59d9] transition"><FaSearch /></button>
                        </div>
                        <button onClick={resetFilters} className="px-3 py-2 text-sm text-white bg-[#858796] rounded hover:bg-[#717384] transition"><FaSyncAlt className="inline mr-1"/> Xóa bộ lọc</button>
                    </div>

                    {/* Bảng Dữ Liệu */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left align-middle border-collapse border border-gray-200">
                            <thead className="bg-[#5a5c69] text-white text-center text-[15px] whitespace-nowrap">
                                <tr>
                                    <th className="p-4 border font-semibold w-[5%]">ID</th>
                                    <th className="p-4 border font-semibold">Tên Máy Bay</th>
                                    <th className="p-4 border font-semibold">Hãng Sở Hữu</th>
                                    <th className="p-4 border font-semibold">Thông Tin Kỹ Thuật</th>
                                    <th className="p-4 border font-semibold w-[10%]">Số Ghế</th>
                                    <th className="p-4 border font-semibold w-[15%]">Hành Động</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-800">
                                {loading ? (
                                    <tr><td colSpan="6" className="text-center py-12">Đang tải dữ liệu...</td></tr>
                                ) : currentMayBays.length === 0 ? (
                                    <tr><td colSpan="6" className="text-center py-12"><FaBoxOpen className="mx-auto mb-3 text-4xl opacity-20"/> Không tìm thấy máy bay nào phù hợp.</td></tr>
                                ) : (
                                    currentMayBays.map(mb => {
                                        // 1. Tìm thông tin hãng hàng không từ dsHang dựa vào maHang
                                        const hang = dsHang.find(h => h.maHang === mb.maHang);

                                        return (
                                            <tr key={mb.maMayBay} className="hover:bg-gray-50 border-b transition">
                                                <td className="p-4 text-center">{mb.maMayBay}</td>
                                                <td className="p-4 font-bold text-[#4e73df] whitespace-nowrap">{mb.tenMayBay}</td>
                                                
                                                {/* 2. Cột Hãng Sở Hữu - Đã được cập nhật để hiển thị Logo */}
                                                <td className="p-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        {hang && hang.logo_url ? (
                                                            <img 
                                                                src={`https://bookingflightticket-backend-new.onrender.com/${encodeURI(hang.logo_url)}`}
                                                                alt={hang.tenHang} 
                                                                className="w-8 h-8 object-contain rounded bg-white border border-gray-200 p-0.5"
                                                                onError={(e) => {
                                                                    // Ẩn ảnh nếu link bị lỗi và hiện lại icon dự phòng
                                                                    e.target.style.display = 'none';
                                                                    e.target.nextElementSibling.style.display = 'block';
                                                                }}
                                                            />
                                                        ) : null}
                                                        
                                                        {/* Icon mặc định nếu hãng không có logo */}
                                                        <FaPlane 
                                                            className="text-gray-400" 
                                                            style={{ display: hang?.logo_url ? 'none' : 'block' }} 
                                                        />
                                                        
                                                        <span className="font-semibold text-gray-700">
                                                            {hang ? hang.tenHang : 'Chưa cập nhật'}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="p-4 text-[14px]">
                                                    <div><strong className="text-gray-600">Loại:</strong> {mb.loai}</div>
                                                    <div><strong className="text-gray-600">SX:</strong> {mb.hangSanXuat}</div>
                                                </td>
                                                <td className="p-4 text-center font-bold text-[#1cc88a] text-[16px]">
                                                    {mb.soGheTong}
                                                </td>
                                                <td className="p-4 whitespace-nowrap">
                                                    <div className="flex justify-center gap-2">
                                                        <Link to={`/admin/may-bay/sua/${mb.maMayBay}`} className="w-9 h-9 bg-[#f6c23e] hover:bg-[#dda20a] text-white rounded flex items-center justify-center transition shadow-sm text-[16px]"><FaEdit/></Link>
                                                        <button onClick={() => handleDelete(mb.maMayBay, mb.tenMayBay)} className="w-9 h-9 bg-[#e74a3b] hover:bg-[#be2617] text-white rounded flex items-center justify-center transition shadow-sm text-[16px]"><FaTrash/></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                            <div className="text-sm text-gray-600">
                                Hiển thị {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, allMayBays.length)} của {allMayBays.length}
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1.5 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-100 flex items-center"><FaAngleLeft className="mr-1" /> Trước</button>
                                <span className="px-3 py-1.5 bg-[#4e73df] text-white font-bold rounded border border-[#4e73df]">{currentPage}</span>
                                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1.5 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-100 flex items-center">Sau <FaAngleRight className="ml-1" /></button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MayBayList;