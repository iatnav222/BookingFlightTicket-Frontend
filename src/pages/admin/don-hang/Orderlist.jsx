import React, { useEffect, useState, useCallback } from 'react';
import { FaSearch, FaEye, FaTrash, FaPhoneAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '../../../services/orderApi';

const OrderList = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        trangThai: '',
        search: ''
    });

    const fetchOrders = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const activeFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, v]) => v !== '')
            );
            
            // res là object JSON tổng thể (chứa data và pagination)
            const res = await orderApi.getDanhSach({ 
                ...activeFilters, 
                page: page,
                per_page: 10 
            });

            // Gán dữ liệu dựa trên cấu trúc API bạn cung cấp
            setOrders(res.data || []);
            setTotalPages(res.pagination?.last_page || 1);
            setCurrentPage(res.pagination?.current_page || page);
        } catch (err) {
            console.error("Lỗi tải danh sách:", err);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchOrders(1); // Reset về trang 1 khi filter thay đổi
    }, [filters, fetchOrders]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            fetchOrders(newPage);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
            try {
                await orderApi.xoa(id);
                await fetchOrders(currentPage);
                alert("Xóa đơn hàng thành công!");
            } catch (err) {
                const errorMessage = err.response?.data?.message || "Lỗi khi xóa đơn hàng.";
                alert(errorMessage);
            }
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const time = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        const day = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
        return `${time} ${day}`;
    };

    const renderStatus = (status) => {
        if (status === 1 || status === '1') {
            return <span className="bg-[#1cc88a] text-white px-3 py-1 rounded text-sm font-semibold shadow-sm">Thành công</span>;
        } else if (status === 0 || status === '0') {
            return <span className="bg-[#f6c23e] text-white px-3 py-1 rounded text-sm font-semibold shadow-sm">Chờ thanh toán</span>;
        } else {
            return <span className="bg-gray-500 text-white px-3 py-1 rounded text-sm font-semibold shadow-sm">Đã hủy</span>;
        }
    };

    return (
        <div className="container-fluid mt-4">
            <div className="bg-white rounded border shadow-sm">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-xl font-normal text-[#4e73df] m-0">Danh Sách Đơn Hàng</h2>
                    <div className="flex w-72">
                        <input
                            type="text"
                            placeholder="Tìm mã đơn, tên khách..."
                            className="border border-gray-300 px-3 py-1.5 rounded-l text-sm w-full outline-none focus:border-blue-500"
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />            
                        <button onClick={() => fetchOrders(1)} className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700 transition">
                            <FaSearch className="text-sm" />
                        </button>
                    </div>
                </div>

                <div className="p-4 overflow-x-auto">
                    <table className="w-full border border-gray-200 text-sm text-left">
                        <thead className="bg-[#2c3034] text-white text-center">
                            <tr>
                                <th className="p-3 border-r border-gray-600 w-[15%]">Mã Đơn</th>
                                <th className="p-3 border-r border-gray-600 w-[25%]">Khách Hàng</th>
                                <th className="p-3 border-r border-gray-600 w-[15%]">Ngày Đặt</th>
                                <th className="p-3 border-r border-gray-600 w-[15%]">Tổng Tiền</th>
                                <th className="p-3 border-r border-gray-600 w-[15%]">Trạng Thái</th>
                                <th className="p-3 w-[15%]">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center p-8 text-gray-500">Đang tải...</td></tr>
                            ) : orders.length === 0 ? (
                                <tr><td colSpan="6" className="text-center p-8 text-gray-500">Không tìm thấy đơn hàng.</td></tr>
                            ) : (
                                orders.map((o) => (
                                    <tr key={o.maDonHang} className="border-b hover:bg-gray-50 align-middle text-center">
                                        <td className="p-3 font-bold text-[#4e73df] text-[15px]">#{o.maCodeDonHang}</td>
                                        <td className="p-3 text-left">
                                            <div className="font-bold text-gray-800 text-[15px]">{o.thongTinLienHe?.ten || o.taikhoan?.hoten || 'Khách vãng lai'}</div>
                                            <div className="text-gray-500 flex items-center mt-1 text-[13px]"><FaPhoneAlt className="mr-1.5" />{o.thongTinLienHe?.soDienThoai}</div>
                                        </td>
                                        <td className="p-3 text-gray-700 text-[15px]">{formatDateTime(o.ngayDat)}</td>
                                        <td className="p-3 font-bold text-[#e74a3b] text-[15px]">{o.tongTien?.toLocaleString('vi-VN')} đ</td>
                                        <td className="p-3">{renderStatus(o.trangThai)}</td>
                                        <td className="p-3">
                                            <div className="flex justify-center gap-1.5">
                                                <button onClick={() => navigate(`/admin/don-hang/${o.maDonHang}`)} className="bg-[#17a2b8] text-white p-2 rounded hover:bg-[#138496] shadow-sm"><FaEye /></button>
                                                <button onClick={() => handleDelete(o.maDonHang)} className="bg-[#dc3545] text-white p-2 rounded hover:bg-[#c82333] shadow-sm"><FaTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PHẦN PHÂN TRANG */}
                <div className="flex justify-end items-center p-4 border-t border-gray-200 bg-gray-50 gap-4">
                    <div className="text-sm text-gray-600">
                        Hiển thị trang <span className="font-semibold">{currentPage}</span> trên <span className="font-semibold">{totalPages}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={`p-2 rounded border ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}><FaChevronLeft size={14} /></button>
                        {[...Array(totalPages)].map((_, index) => {
                            const pageNum = index + 1;
                            if (totalPages <= 7 || pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                                return (
                                    <button key={pageNum} onClick={() => handlePageChange(pageNum)} className={`px-3 py-1 rounded border text-sm transition ${currentPage === pageNum ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>{pageNum}</button>
                                );
                            } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                                return <span key={pageNum} className="px-2 text-gray-400">...</span>;
                            }
                            return null;
                        })}
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className={`p-2 rounded border ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}><FaChevronRight size={14} /></button>
                    </div>
                </div>
            </div> 
        </div>
    );
};

export default OrderList;