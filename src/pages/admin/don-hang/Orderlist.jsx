import React, { useEffect, useState, useCallback } from 'react';
import { FaSearch, FaEye, FaTrash, FaPhoneAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '../../../services/orderApi';

const OrderList = () => {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        trangThai: '',
        search: ''
    });

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const activeFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, v]) => v !== '')
            );
            const res = await orderApi.getDanhSach(activeFilters);
            // Dữ liệu từ Laravel trả về thường nằm trong res.data hoặc res.data.data
            setOrders(res.data?.data || res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
            await orderApi.xoa(id);
            fetchOrders();
        }
    };

    // 🎨 Hàm format Ngày tháng giống trong ảnh: "15:41 17/03/2026"
    const formatDateTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const time = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        const day = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
        return `${time} ${day}`;
    };

    // 🎨 Badge trạng thái giống trong ảnh (Background xanh lục / vàng cam)
    const renderStatus = (status) => {
        // Backend đang trả về số (VD: 1, 0, 2)
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
                
                {/* HEADER GIỐNG TRONG ẢNH */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-xl font-normal text-[#4e73df] m-0">Danh Sách Đơn Hàng</h2>
                    
                    {/* KHUNG TÌM KIẾM */}
                    <div className="flex w-72">
                        <input
                            type="text"
                            placeholder="Tìm mã đơn, tên khách..."
                            className="border border-gray-300 px-3 py-1.5 rounded-l text-sm w-full outline-none focus:border-blue-500"
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                        <button onClick={fetchOrders} className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700 transition">
                            <FaSearch className="text-sm" />
                        </button>
                    </div>
                </div>

                {/* TABLE */}
                <div className="p-4 overflow-x-auto">
                    <table className="w-full border border-gray-200 text-sm text-left">
                        {/* THẺ THEAD MÀU TỐI GIỐNG ẢNH */}
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
                                <tr>
                                    <td colSpan="6" className="text-center p-8 text-gray-500">Đang tải dữ liệu...</td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center p-8 text-gray-500">Không tìm thấy đơn hàng nào.</td>
                                </tr>
                            ) : (
                                orders.map((o) => (
                                    <tr key={o.maDonHang} className="border-b hover:bg-gray-50 align-middle text-center">
                                        
                                        {/* Mã Đơn */}
                                        <td className="p-3 font-bold text-[#4e73df] text-[15px]">
                                            #{o.maCodeDonHang}
                                        </td>
                                        
                                        {/* Khách Hàng (Tên + Icon Điện thoại) */}
                                        <td className="p-3 text-left">
                                            <div className="font-bold text-gray-800 text-[15px]">
                                                {o.thongTinLienHe?.ten || o.taikhoan?.hoten || 'Khách vãng lai'}
                                            </div>
                                            <div className="text-gray-500 flex items-center mt-1 text-[13px]">
                                                <FaPhoneAlt className="mr-1.5" /> 
                                                {o.thongTinLienHe?.sdt || 'Chưa cập nhật'}
                                            </div>
                                        </td>
                                        
                                        {/* Ngày Đặt */}
                                        <td className="p-3 text-gray-700 text-[15px]">
                                            {formatDateTime(o.ngayDat)}
                                        </td>
                                        
                                        {/* Tổng Tiền (Chữ đỏ In đậm) */}
                                        <td className="p-3 font-bold text-[#e74a3b] text-[15px]">
                                            {o.tongTien?.toLocaleString('vi-VN')} đ
                                        </td>
                                        
                                        {/* Trạng Thái */}
                                        <td className="p-3">
                                            {renderStatus(o.trangThai)}
                                        </td>
                                        
                                        {/* Hành Động (Nút Cyan và Đỏ) */}
                                        <td className="p-3">
                                            <div className="flex justify-center gap-1.5">
                                                <button
                                                    onClick={() => navigate(`/admin/don-hang/${o.maDonHang}`)}
                                                    className="bg-[#17a2b8] text-white p-2 rounded hover:bg-[#138496] transition shadow-sm"
                                                    title="Xem chi tiết"
                                                >
                                                    <FaEye />
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(o.maDonHang)}
                                                    className="bg-[#dc3545] text-white p-2 rounded hover:bg-[#c82333] transition shadow-sm"
                                                    title="Xóa đơn hàng"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderList;