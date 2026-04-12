import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    FaPlus, FaSearch, FaSyncAlt, FaUserShield, FaUser, 
    FaEdit, FaTrash, FaLock, FaUnlock, FaBoxOpen, 
    FaEnvelope, FaEye, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import { taiKhoanApi } from '../../../services/taiKhoanApi';

const TaiKhoanList = () => {
    const [allTaiKhoans, setAllTaiKhoans] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({ quyen: '', trangThai: '', search: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchTaiKhoans({});
    }, []);

    const fetchTaiKhoans = async (queryFilters) => {
        setLoading(true);
        try {
            const activeFilters = Object.fromEntries(
                Object.entries(queryFilters).filter(([_, v]) => v !== '')
            );
            const response = await taiKhoanApi.getDanhSach(activeFilters);
            setAllTaiKhoans(response.data || response);
            setCurrentPage(1);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    const handleFilterChange = (e) => setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSearch = () => fetchTaiKhoans(filters);
    const resetFilters = () => {
        const empty = { quyen: '', trangThai: '', search: '' };
        setFilters(empty);
        fetchTaiKhoans(empty);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Xác nhận xóa tài khoản này? Hành động này không thể hoàn tác!')) {
            try {
                await taiKhoanApi.xoaTaiKhoan(id);
                fetchTaiKhoans(filters);
            } catch (error) { alert("Lỗi khi xóa tài khoản."); }
        }
    };

    // Phân trang
    const totalPages = Math.ceil(allTaiKhoans.length / itemsPerPage);
    const currentItems = allTaiKhoans.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo(0, 0); // Cuộn lên đầu trang khi đổi trang
        }
    };

    return (
        <div className="container-fluid px-4 mt-4 font-sans text-[#5a5c69]">
            <div className="bg-white rounded shadow-md mb-4 border-none">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-[#f8f9fc]">
                    <h6 className="m-0 font-bold text-[#4e73df] text-lg">Quản Lý Tài Khoản</h6>
                    <Link to="/admin/tai-khoan/tao" className="flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-[#1cc88a] rounded hover:bg-[#17a673] shadow-sm">
                        <FaPlus className="mr-1" /> THÊM TÀI KHOẢN
                    </Link>
                </div>

                <div className="p-4">
                    {/* Toolbar */}
                    <div className="mb-4 bg-[#f8f9fc] p-4 rounded border flex flex-wrap gap-3 items-center">
                        <select name="quyen" value={filters.quyen} onChange={handleFilterChange} className="text-sm p-2 border rounded outline-none bg-white">
                            <option value="">-- Tất cả quyền --</option>
                            <option value="admin">Quản trị viên (Admin)</option>
                            <option value="user">Người dùng (User)</option>
                        </select>
                        <select name="trangThai" value={filters.trangThai} onChange={handleFilterChange} className="text-sm p-2 border rounded outline-none bg-white">
                            <option value="">-- Trạng thái --</option>
                            <option value="1">Đang hoạt động</option>
                            <option value="0">Đang bị khóa</option>
                        </select>
                        <div className="flex flex-1 min-w-[200px]">
                            <input type="text" name="search" value={filters.search} onChange={handleFilterChange} placeholder="Tìm username, email..." className="w-full text-sm p-2 border border-r-0 rounded-l focus:outline-none" />
                            <button onClick={handleSearch} className="px-4 bg-[#4e73df] text-white rounded-r hover:bg-[#2e59d9]"><FaSearch /></button>
                        </div>
                        <button onClick={resetFilters} className="px-3 py-2 text-sm text-white bg-[#858796] rounded hover:bg-[#717384]"><FaSyncAlt className="inline mr-1"/> Làm mới</button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left align-middle border-collapse border border-gray-200">
                            <thead className="bg-[#5a5c69] text-white text-center text-[16px] whitespace-nowrap">
                                <tr>
                                    <th className="p-4 border font-semibold">Mã TK</th>
                                    <th className="p-4 border font-semibold">Tên đăng nhập / Email</th>
                                    <th className="p-4 border font-semibold">Họ tên</th>
                                    <th className="p-4 border font-semibold">Quyền</th>
                                    <th className="p-4 border font-semibold">Trạng thái</th>
                                    <th className="p-4 border font-semibold">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-800">
                                {loading ? (
                                    <tr><td colSpan="6" className="text-center py-12">Đang tải...</td></tr>
                                ) : currentItems.length === 0 ? (
                                    <tr><td colSpan="6" className="text-center py-12"><FaBoxOpen className="mx-auto mb-3 text-4xl opacity-20"/> Không có dữ liệu.</td></tr>
                                ) : (
                                    currentItems.map(tk => (
                                        <tr key={tk.maTK} className="hover:bg-gray-50 border-b transition">
                                            <td className="p-4 text-center font-bold text-[#4e73df] text-[18px]">#{tk.maTK}</td>
                                            <td className="p-4">
                                                <div className="font-bold text-[16px]">{tk.username}</div>
                                                <div className="text-[14px] text-gray-500"><FaEnvelope className="inline mr-1"/> {tk.email}</div>
                                            </td>
                                            <td className="p-4 text-[15px]">{tk.hoten || <i className="text-gray-400">Chưa cập nhật</i>}</td>
                                            <td className="p-4 text-center">
                                                {tk.quyen === 'admin' ? 
                                                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold flex items-center justify-center w-fit mx-auto"><FaUserShield className="mr-1"/> ADMIN</span> : 
                                                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center justify-center w-fit mx-auto"><FaUser className="mr-1"/> USER</span>
                                                }
                                            </td>
                                            <td className="p-4 text-center">
                                                {tk.trangThai ? 
                                                    <span className="text-green-600 font-bold text-[13px] flex items-center justify-center"><FaUnlock className="mr-1"/> HOẠT ĐỘNG</span> : 
                                                    <span className="text-red-600 font-bold text-[13px] flex items-center justify-center"><FaLock className="mr-1"/> BỊ KHÓA</span>
                                                }
                                            </td>
                                            <td className="p-4">
                                                <div className="flex justify-center gap-2">
                                                    {/* Nút Xem chi tiết */}
                                                    <Link to={`/admin/tai-khoan/xem/${tk.maTK}`} className="w-10 h-10 bg-blue-500 text-white rounded flex items-center justify-center shadow-sm text-[18px]" title="Xem chi tiết">
                                                        <FaEye/>
                                                    </Link>
                                                    
                                                    <Link to={`/admin/tai-khoan/sua/${tk.maTK}`} className="w-10 h-10 bg-[#f6c23e] text-white rounded flex items-center justify-center shadow-sm text-[18px]"><FaEdit/></Link>
                                                    <button onClick={() => handleDelete(tk.maTK)} className="w-10 h-10 bg-[#e74a3b] text-white rounded flex items-center justify-center shadow-sm text-[18px]"><FaTrash/></button>
                                                </div>
                                            </td>                                            
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                {totalPages > 1 && (
                        <div className="flex flex-wrap items-center justify-between px-2 pt-4 border-t border-gray-100">
                            <div className="text-sm text-gray-500 mb-3 sm:mb-0">
                                Hiển thị <span className="font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> đến <span className="font-bold">{Math.min(currentPage * itemsPerPage, allTaiKhoans.length)}</span> trong tổng số <span className="font-bold">{allTaiKhoans.length}</span> tài khoản
                            </div>
                            
                            <nav className="inline-flex -space-x-px rounded-md shadow-sm bg-white" aria-label="Pagination">
                                {/* Nút Previous */}
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    <FaChevronLeft className="h-4 w-4" />
                                </button>

                                {/* Các số trang */}
                                {[...Array(totalPages)].map((_, idx) => {
                                    const page = idx + 1;
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-bold transition-colors ${
                                                currentPage === page
                                                    ? 'z-10 bg-[#4e73df] border-[#4e73df] text-white'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}

                                {/* Nút Next */}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    <FaChevronRight className="h-4 w-4" />
                                </button>
                            </nav>
                        </div>
                    )}
            </div>
        </div>
    );
};

export default TaiKhoanList;