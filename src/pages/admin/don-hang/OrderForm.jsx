import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
    FaArrowLeft, FaSave, FaUser, FaPlane, FaTicketAlt, 
    FaInfoCircle, FaUsers, FaCreditCard 
} from 'react-icons/fa';
import { orderApi } from '../../../services/orderApi';

const OrderForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                const res = await orderApi.getChiTiet(id);
                const data = res.data || res;
                
                // Parse JSON thongTinLienHe nếu backend trả về dạng string
                if (typeof data.thongTinLienHe === 'string') {
                    data.thongTinLienHe = JSON.parse(data.thongTinLienHe);
                }
                setOrder(data);
            } catch (err) {
                alert("Không thể tải thông tin đơn hàng");
                navigate('/admin/don-hang');
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetail();
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Gửi cả trạng thái và mã PNR (maDatChoHang) theo SQL
            await orderApi.capNhatDonHang(id, { 
                trangThai: order.trangThai,
                maDatChoHang: order.maDatChoHang 
            });
            alert("Cập nhật đơn hàng thành công!");
            navigate('/admin/don-hang');
        } catch (err) {
            alert("Lỗi cập nhật dữ liệu.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center font-bold text-[#4e73df]">Đang truy xuất dữ liệu từ DB...</div>;

    return (
        <div className="container-fluid px-4 mt-4 font-['Nunito'] text-[#5a5c69]">
            {/* Header đồng bộ ChuyenBayList */}
            <div className="bg-white rounded shadow-[0_0.15rem_1.75rem_0_rgba(58,59,69,0.15)] mb-4 border-none overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-[#f8f9fc]">
                    <h6 className="m-0 font-bold text-[#4e73df] text-lg uppercase">
                        Đơn hàng: <span className="text-gray-700">{order.maCodeDonHang}</span>
                    </h6>
                    <Link to="/admin/don-hang" className="flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-[#858796] rounded hover:bg-[#717384] transition shadow-sm">
                        <FaArrowLeft className="mr-1" /> QUAY LẠI
                    </Link>
                </div>

                <div className="p-4">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Cột trái: Thông tin khách & Hành khách (2/3) */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* Card 1: Thông tin người đặt (Từ thongTinLienHe JSON) */}
                            <div className="bg-[#f8f9fc] p-4 rounded border border-gray-200">
                                <h5 className="text-[#4e73df] font-bold mb-4 flex items-center border-b pb-2 border-gray-300">
                                    <FaUser className="mr-2"/> NGƯỜI ĐẶT VÉ
                                </h5>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-gray-400">Họ tên</label>
                                        <p className="text-sm font-bold">{order.thongTinLienHe?.ten}</p>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-gray-400">Số điện thoại</label>
                                        <p className="text-sm font-bold">{order.thongTinLienHe?.sdt}</p>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-gray-400">Email</label>
                                        <p className="text-sm font-bold">{order.thongTinLienHe?.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Danh sách hành khách bay (Dữ liệu từ bảng `ve` join `hanh_khach`) */}
                            <div className="bg-white p-4 rounded border border-gray-200 shadow-sm">
                                <h5 className="text-[#36b9cc] font-bold mb-4 flex items-center border-b pb-2 border-gray-300">
                                    <FaUsers className="mr-2"/> DANH SÁCH HÀNH KHÁCH
                                </h5>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-100 text-gray-600 uppercase text-[10px]">
                                                <th className="p-2 border">Hành khách</th>
                                                <th className="p-2 border">Loại</th>
                                                <th className="p-2 border">Ghế</th>
                                                <th className="p-2 border">Giá mua thực tế</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.ves?.map((ve, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50">
                                                    <td className="p-2 border font-bold text-gray-800">{ve.hanh_khach?.hoTen}</td>
                                                    <td className="p-2 border">{ve.hanh_khach?.loaiHanhKhach}</td>
                                                    <td className="p-2 border text-center font-mono text-blue-600">{ve.maGhe}</td>
                                                    <td className="p-2 border text-right">{parseFloat(ve.giaMuaThucTe).toLocaleString()}đ</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Cột phải: Thanh toán & Xử lý (1/3) */}
                        <div className="lg:col-span-1 space-y-6">
                            
                            {/* Card 3: Thanh toán */}
                            <div className="bg-[#f8f9fc] p-4 rounded border border-gray-200">
                                <h5 className="text-[#e74a3b] font-bold mb-4 flex items-center border-b pb-2 border-gray-300">
                                    <FaCreditCard className="mr-2"/> THANH TOÁN
                                </h5>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-xs">Phương thức:</span>
                                        <span className="text-xs font-bold">{order.phuongThucThanhToan}</span>
                                    </div>
                                    <div className="flex justify-between items-end border-t pt-2">
                                        <span className="text-xs font-bold">TỔNG TIỀN:</span>
                                        <span className="text-xl font-black text-[#e74a3b]">
                                            {parseFloat(order.tongTien).toLocaleString()}đ
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Card 4: Xử lý nghiệp vụ Admin */}
                            <div className="bg-white p-4 rounded border border-gray-200 shadow-md">
                                <h5 className="text-[#f6c23e] font-bold mb-4 flex items-center border-b pb-2 border-gray-300">
                                    <FaInfoCircle className="mr-2"/> XỬ LÝ NGHIỆP VỤ
                                </h5>
                                <div className="space-y-4">
                                    {/* Input Mã PNR - Khớp maDatChoHang trong SQL */}
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Mã PNR (Từ hãng)</label>
                                        <input 
                                            type="text"
                                            value={order.maDatChoHang || ''}
                                            onChange={(e) => setOrder({...order, maDatChoHang: e.target.value.toUpperCase()})}
                                            placeholder="VD: VN12345"
                                            className="w-full p-2 border rounded text-sm font-bold text-blue-600 focus:border-[#4e73df] outline-none"
                                        />
                                    </div>

                                    {/* Select Trạng thái - Khớp tinyint trong SQL */}
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Trạng thái đơn</label>
                                        <select 
                                            value={order.trangThai}
                                            onChange={(e) => setOrder({...order, trangThai: parseInt(e.target.value)})}
                                            className="w-full p-2 border rounded text-sm font-bold outline-none"
                                        >
                                            <option value={0}>⏳ CHỜ THANH TOÁN</option>
                                            <option value={1}>✅ ĐÃ THANH TOÁN</option>
                                            <option value={2}>❌ ĐÃ HỦY ĐƠN</option>
                                        </select>
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={saving}
                                        className="w-full flex items-center justify-center px-4 py-3 text-xs font-bold text-white bg-[#4e73df] rounded hover:bg-[#2e59d9] transition shadow-md disabled:opacity-50 uppercase"
                                    >
                                        {saving ? "ĐANG LƯU..." : <><FaSave className="mr-2" /> XÁC NHẬN CẬP NHẬT</>}
                                    </button>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default OrderForm;