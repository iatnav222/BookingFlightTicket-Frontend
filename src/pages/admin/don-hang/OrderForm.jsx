import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { orderApi } from '../../../services/orderApi';

const OrderForm = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            const res = await orderApi.getChiTiet(id);
            setOrder(res.data || res);
        };
        fetch();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await orderApi.capNhat(id, { trangThai: order.trangThai });
        alert("Cập nhật thành công");
    };

    if (!order) return <p className="p-5">Loading...</p>;

    return (
        <div className="p-6 bg-white rounded-xl shadow max-w-xl">
            <h2 className="text-xl font-bold mb-4">
                Chi tiết đơn hàng <span className="text-blue-600">#{order.maCodeDonHang || id}</span>
            </h2>

            <div className="space-y-3 mb-4 bg-gray-50 p-4 rounded border">
                {/* Lấy đúng từ object thongTinLienHe */}
                <p><b>Khách hàng:</b> {order.thongTinLienHe?.ten || order.taikhoan?.hoten}</p>
                <p><b>Email:</b> {order.thongTinLienHe?.email || order.taikhoan?.email}</p>
                <p><b>Số điện thoại:</b> {order.thongTinLienHe?.sdt}</p>
                <p><b>Phương thức thanh toán:</b> {order.phuongThucThanhToan}</p>
                <p><b>Tổng tiền:</b> <span className="text-red-500 font-bold">{order.tongTien?.toLocaleString('vi-VN')} VNĐ</span></p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <select
                    value={order.trangThai}
                    onChange={(e) => setOrder({ ...order, trangThai: e.target.value })}
                    className="w-full border p-2 rounded"
                >
                    <option value="pending">Chờ xử lý</option>
                    <option value="paid">Đã thanh toán</option>
                    <option value="cancel">Đã hủy</option>
                </select>

                <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">
                    Cập nhật
                </button>
            </form>
        </div>
    );
};

export default OrderForm;