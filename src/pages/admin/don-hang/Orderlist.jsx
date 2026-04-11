import React, { useEffect, useState, useCallback } from 'react';
import { FaSearch, FaSyncAlt, FaEye, FaTrash } from 'react-icons/fa';
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
            setOrders(res.data || []);
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
        if (window.confirm("Xóa đơn hàng này?")) {
            await orderApi.xoa(id);
            fetchOrders();
        }
    };

    // 🎨 Badge trạng thái (giống chuyến bay style)
    const renderStatus = (status) => {
        const map = {
            pending: 'bg-yellow-100 text-yellow-700',
            paid: 'bg-green-100 text-green-700',
            cancel: 'bg-red-100 text-red-700'
        };
        return (
            <span className={`px-2 py-1 rounded text-sm ${map[status] || 'bg-gray-100'}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-2xl font-bold">Quản lý đơn hàng</h2>
            </div>

            {/* FILTER */}
            <div className="flex gap-3 mb-5">
                <select
                    value={filters.trangThai}
                    onChange={(e) => setFilters({ ...filters, trangThai: e.target.value })}
                    className="border px-3 py-2 rounded"
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="pending">Chờ xử lý</option>
                    <option value="paid">Đã thanh toán</option>
                    <option value="cancel">Đã hủy</option>
                </select>

                <input
                    type="text"
                    placeholder="Tìm mã đơn..."
                    className="border px-3 py-2 rounded flex-1"
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />

                <button onClick={fetchOrders} className="bg-blue-500 text-white px-4 rounded">
                    <FaSearch />
                </button>

                <button onClick={() => setFilters({ trangThai: '', search: '' })}
                        className="bg-gray-400 text-white px-4 rounded">
                    <FaSyncAlt />
                </button>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
                <table className="w-full border rounded-lg overflow-hidden">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-3">Mã</th>
                            <th className="p-3">Khách hàng</th>
                            <th className="p-3">Chuyến bay</th>
                            <th className="p-3">Tổng tiền</th>
                            <th className="p-3">Trạng thái</th>
                            <th className="p-3 text-center">Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center p-5">Đang tải...</td>
                            </tr>
                        ) : orders.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center p-5">Không có dữ liệu</td>
                            </tr>
                        ) : (
                            orders.map((o) => (
                                <tr key={o.id} className="border-t hover:bg-gray-50">
                                    <td className="p-3 font-semibold">#{o.id}</td>
                                    <td className="p-3">{o.tenKhach}</td>
                                    <td className="p-3">{o.chuyen_bay?.maChuyenBay}</td>
                                    <td className="p-3 text-blue-600 font-semibold">
                                        {o.tongTien?.toLocaleString()} đ
                                    </td>
                                    <td className="p-3">
                                        {renderStatus(o.trangThai)}
                                    </td>
                                    <td className="p-3 text-center flex justify-center gap-2">
                                        <button
                                            onClick={() => navigate(`/admin/don-hang/${o.id}`)}
                                            className="bg-blue-500 text-white p-2 rounded"
                                        >
                                            <FaEye />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(o.id)}
                                            className="bg-red-500 text-white p-2 rounded"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderList;