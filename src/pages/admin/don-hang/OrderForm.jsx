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
            <h2 className="text-xl font-bold mb-4">Chi tiết đơn hàng #{id}</h2>

            <div className="space-y-3 mb-4">
                <p><b>Khách hàng:</b> {order.tenKhach}</p>
                <p><b>Email:</b> {order.email}</p>
                <p><b>Tổng tiền:</b> {order.tongTien}</p>
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