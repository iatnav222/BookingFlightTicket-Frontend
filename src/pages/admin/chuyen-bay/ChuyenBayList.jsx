import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
    FaPlus, FaSearch, FaSyncAlt, FaPlane, FaLongArrowAltRight, 
    FaEdit, FaTrash, FaPlaneDeparture, FaPlaneArrival, FaBoxOpen,
    FaAngleLeft, FaAngleRight
} from 'react-icons/fa';
import { chuyenBayApi } from '../../../services/chuyenBayApi';

const ChuyenBayList = () => {
    const [allChuyenBays, setAllChuyenBays] = useState([]); 
    const [dsHang, setDsHang] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({ maHang: '', ngayBay: '', search: '' });
    
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; 

    // Lấy danh sách hãng hàng không
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await chuyenBayApi.getHangHangKhong();
                setDsHang(res.data || res);
            } catch (err) { console.error(err); }
        };
        fetchCategories();
    }, []);

    // Tự động lấy danh sách chuyến bay khi thay đổi filters
    const fetchChuyenBays = useCallback(async () => {
        setLoading(true);
        try {
            const activeFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, v]) => v !== '')
            );
            
            const response = await chuyenBayApi.getDanhSach(activeFilters);
            const dataList = response.data || [];
            
            setAllChuyenBays(dataList);
            setCurrentPage(1); 
        } catch (error) { 
            console.error(error); 
        } finally { 
            setLoading(false); 
        }
    }, [filters]);

    useEffect(() => {
        fetchChuyenBays();
    }, [fetchChuyenBays]);

    const handleFilterChange = (e) => setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const resetFilters = () => {
        setFilters({ maHang: '', ngayBay: '', search: '' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa chuyến bay này không? Dữ liệu vé đã đặt sẽ bị ảnh hưởng!')) {
            try {
                await chuyenBayApi.xoaChuyenBay(id);
                fetchChuyenBays();
            } catch (error) { alert(error.response?.data?.message || "Không thể xóa."); }
        }
    };

    const totalPages = Math.ceil(allChuyenBays.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentChuyenBays = allChuyenBays.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="container-fluid px-4 mt-4 font-sans text-[#5a5c69]">
            <div className="bg-white rounded shadow-[0_0.15rem_1.75rem_0_rgba(58,59,69,0.15)] mb-4 border-none">
                <div className="px-4 py-3 border-b border-gray-100 flex flex-wrap items-center justify-between gap-2 bg-[#f8f9fc]">
                    <h6 className="m-0 font-bold text-[#4e73df] text-lg">Danh Sách Chuyến Bay</h6>
                    <Link to="/admin/chuyen-bay/tao" className="flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-[#1cc88a] rounded hover:bg-[#17a673] transition shadow-sm">
                        <FaPlus className="mr-1" /> THÊM CHUYẾN BAY MỚI
                    </Link>
                </div>

                <div className="p-4">
                    <div className="mb-4 bg-[#f8f9fc] p-4 rounded border border-gray-200 flex flex-wrap gap-3 items-center">
                        <select name="maHang" value={filters.maHang} onChange={handleFilterChange} className="text-sm p-2 border rounded border-gray-300 focus:ring-1 focus:ring-[#4e73df] outline-none bg-white">
                            <option value="">-- Tất cả hãng --</option>
                            {dsHang.map(h => <option key={h.maHang} value={h.maHang}>{h.tenHang}</option>)}
                        </select>
                        <input type="date" name="ngayBay" value={filters.ngayBay} onChange={handleFilterChange} className="text-sm p-2 border rounded border-gray-300 focus:ring-1 focus:ring-[#4e73df] outline-none" />
                        <div className="flex flex-1 min-w-[200px]">
                            <input type="text" name="search" value={filters.search} onChange={handleFilterChange} placeholder="Nhập mã chuyến bay..." className="w-full text-sm p-2 border border-r-0 border-gray-300 rounded-l focus:outline-none" />
                            <button className="px-4 bg-[#4e73df] text-white rounded-r hover:bg-[#2e59d9] transition"><FaSearch /></button>
                        </div>
                        <button onClick={resetFilters} className="px-3 py-2 text-sm text-white bg-[#858796] rounded hover:bg-[#717384] transition"><FaSyncAlt className="inline mr-1"/> Làm mới</button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left align-middle border-collapse border border-gray-200">
                            <thead className="bg-[#5a5c69] text-white text-center text-[16px] whitespace-nowrap">
                                <tr>
                                    <th className="p-4 border font-semibold">Mã CB</th>
                                    <th className="p-4 border font-semibold min-w-[180px]">Hãng / Máy Bay</th>
                                    <th className="p-4 border font-semibold min-w-[200px]">Hành Trình</th>
                                    <th className="p-4 border font-semibold">Thời Gian</th>
                                    <th className="p-4 border font-semibold w-[15%] min-w-[140px]">Ghế (Còn/Tổng)</th>
                                    <th className="p-4 border font-semibold">Trạng Thái</th>
                                    <th className="p-4 border font-semibold">Hành Động</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-800">
                                {loading ? (
                                    <tr><td colSpan="7" className="text-center py-12 text-[16px]">Đang tải dữ liệu...</td></tr>
                                ) : currentChuyenBays.length === 0 ? (
                                    <tr><td colSpan="7" className="text-center py-12"><FaBoxOpen className="mx-auto mb-3 text-4xl opacity-20"/> Không tìm thấy dữ liệu.</td></tr>
                                ) : (
                                    currentChuyenBays.map(cb => {
                                        const tong = cb.soGheTong || 1;
                                        const conLai = cb.soGheConLai || 0;
                                        const percent = (conLai / tong) * 100;
                                        const color = percent < 20 ? 'bg-[#e74a3b]' : (percent < 50 ? 'bg-[#f6c23e]' : 'bg-[#1cc88a]');

                                        return (
                                            <tr key={cb.maChuyenBay} className="hover:bg-gray-50 border-b transition">
                                                <td className="p-4 text-center font-bold text-[#4e73df] text-[18px] whitespace-nowrap">
                                                    #{cb.maChuyenBay}
                                                </td>
                                                <td className="p-4 whitespace-nowrap">
                                                    <div className="font-bold text-gray-900 text-[16px]">{cb.hang_hang_khong?.tenHang || 'N/A'}</div>
                                                    <div className="text-[14px] text-gray-500 mt-1"><FaPlane className="inline mr-1.5"/> {cb.may_bay?.tenMayBay}</div>
                                                </td>
                                                <td className="p-4 text-center whitespace-nowrap">
                                                    <div className="flex items-center justify-center gap-2 mb-2">
                                                        <span className="text-[14px] bg-[#36b9cc] text-white px-2.5 py-1 rounded font-bold">{cb.san_bay_di?.maCode}</span>
                                                        <FaLongArrowAltRight className="text-gray-400 text-[18px]"/>
                                                        <span className="text-[14px] bg-[#4e73df] text-white px-2.5 py-1 rounded font-bold">{cb.san_bay_den?.maCode}</span>
                                                    </div>
                                                    <div className="text-[14px] text-gray-600 italic">{cb.san_bay_di?.thanhPho} - {cb.san_bay_den?.thanhPho}</div>
                                                </td>
                                                <td className="p-4 text-[15px] leading-loose whitespace-nowrap">
                                                    <div><FaPlaneDeparture className="inline text-[#1cc88a] mr-2"/> {new Date(cb.ngayGioCatCanh).toLocaleString('vi-VN')}</div>
                                                    <div><FaPlaneArrival className="inline text-[#e74a3b] mr-2"/> {new Date(cb.ngayGioHaCanh).toLocaleString('vi-VN')}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="w-full bg-gray-200 rounded-full h-7 relative overflow-hidden border border-gray-300">
                                                        <div className={`${color} h-full text-[14px] text-white font-bold flex items-center justify-center`} style={{ width: `${percent}%` }}>
                                                            {conLai}/{tong}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center whitespace-nowrap">
                                                    {cb.trangThai ? (
                                                        <span className="px-3.5 py-1.5 text-[13px] font-bold bg-green-100 text-green-700 rounded-full border border-green-200 shadow-sm">HOẠT ĐỘNG</span>
                                                    ) : (
                                                        <span className="px-3.5 py-1.5 text-[13px] font-bold bg-gray-100 text-gray-600 rounded-full border border-gray-200 shadow-sm">TẠM HOÃN</span>
                                                    )}
                                                </td>
                                                <td className="p-4 whitespace-nowrap">
                                                    <div className="flex justify-center gap-2">
                                                        <Link to={`/admin/chuyen-bay/sua/${cb.maChuyenBay}`} className="w-10 h-10 bg-[#f6c23e] hover:bg-[#dda20a] text-white rounded flex items-center justify-center transition shadow-sm text-[18px]"><FaEdit/></Link>
                                                        <button onClick={() => handleDelete(cb.maChuyenBay)} className="w-10 h-10 bg-[#e74a3b] hover:bg-[#be2617] text-white rounded flex items-center justify-center transition shadow-sm text-[18px]"><FaTrash/></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 pt-4 border-t border-gray-200">
                            <div className="text-sm text-gray-600 mb-2 sm:mb-0">
                                Đang xem <span className="font-bold">{indexOfFirstItem + 1}</span> đến <span className="font-bold">{Math.min(indexOfLastItem, allChuyenBays.length)}</span> trong tổng số <span className="font-bold">{allChuyenBays.length}</span> chuyến bay
                            </div>
                            <div className="flex items-center gap-1">
                                <button 
                                    onClick={() => handlePageChange(currentPage - 1)} 
                                    disabled={currentPage === 1}
                                    className="px-3 py-1.5 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 flex items-center transition"
                                >
                                    <FaAngleLeft className="mr-1" /> Trước
                                </button>
                                
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(page => Math.abs(page - currentPage) <= 2 || page === 1 || page === totalPages)
                                    .map((page, index, array) => (
                                        <React.Fragment key={page}>
                                            {index > 0 && page - array[index - 1] > 1 && (
                                                <span className="px-2 text-gray-400">...</span>
                                            )}
                                            <button
                                                onClick={() => handlePageChange(page)}
                                                className={`w-8 h-8 flex items-center justify-center border rounded text-sm transition ${
                                                    currentPage === page 
                                                    ? 'bg-[#4e73df] text-white border-[#4e73df] shadow-sm font-bold' 
                                                    : 'border-gray-300 hover:bg-gray-100 text-gray-700'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        </React.Fragment>
                                ))}

                                <button 
                                    onClick={() => handlePageChange(currentPage + 1)} 
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1.5 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 flex items-center transition"
                                >
                                    Sau <FaAngleRight className="ml-1" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChuyenBayList;