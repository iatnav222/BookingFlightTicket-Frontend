import React, { useEffect, useState } from 'react';
import { useParams, Link} from 'react-router-dom';
import { 
    FaArrowLeft, FaPrint, FaUser, FaPlane,
    FaCreditCard, FaSave, FaInfoCircle
} from 'react-icons/fa';
import { orderApi } from '../../../services/orderApi';

const OrderForm = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // Trạng thái để update
    const [statusData, setStatusData] = useState({
        trangThai: 0,
        maDatChoHang: ''
    });

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const res = await orderApi.getChiTiet(id);
                const data = res.data || res;
                setOrder(data);
                setStatusData({
                    trangThai: data.trangThai,
                    maDatChoHang: data.maDatChoHang || ''
                });
            } catch (err) {
                console.error("Lỗi tải chi tiết đơn hàng:", err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id]);

    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            await orderApi.capNhat(id, statusData);
            setOrder(prev => ({
                ...prev,
                trangThai: statusData.trangThai,
                maDatChoHang: statusData.maDatChoHang
            }));
            alert("Cập nhật trạng thái đơn hàng thành công!");
        } catch (err) {
            alert("Lỗi khi cập nhật trạng thái.");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500">Đang tải chi tiết đơn hàng...</div>;
    if (!order) return <div className="p-10 text-center text-red-500">Không tìm thấy đơn hàng!</div>;

    const renderStatusBadge = (status) => {
    const baseClass = "px-4 py-2 rounded-full text-[12px] font-bold uppercase shadow-sm whitespace-nowrap";
    switch (Number(status)) {
        case 1: 
            return <span className={`bg-green-100 text-green-700 ${baseClass}`}>Thành công</span>;
        case 2: 
            return <span className={`bg-gray-100 text-gray-600 ${baseClass}`}>Đã hủy</span>;
        default: 
            return <span className={`bg-[#FFF3CD] text-[#856404] ${baseClass}`}>Chờ thanh toán</span>;
    }
};
    const cb = order.duffel_raw_data;
    const danhSachVe = order.ves || [];
    return (
        <div className="container-fluid px-4 mt-4 font-sans text-gray-700 pb-10">
            {/* Header Toolbar */}
            <div className="flex justify-between items-center mb-6">
                <h4 className="text-xl font-bold text-gray-800 flex items-center">
                    Chi Tiết Đơn Hàng <span className="ml-2 text-blue-600">#{order.maCodeDonHang}</span>
                </h4>
                <div className="flex gap-2">
                    <button onClick={() => window.print()} className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition flex items-center text-sm">
                        <FaPrint className="mr-2" /> In hóa đơn
                    </button>
                    <Link to="/admin/don-hang" className="bg-gray-500 text-white px-4 py-2 rounded shadow hover:bg-gray-600 transition flex items-center text-sm">
                        <FaArrowLeft className="mr-2" /> Quay lại
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* CỘT TRÁI: THÔNG TIN CHI TIẾT */}
                <div className="lg:col-span-8 space-y-6">
                    
                    {/* 1. Thông tin người đặt */}
                    <div className="bg-white rounded-lg shadow-sm border p-5">
                        <h6 className="font-bold text-gray-800 border-b pb-3 mb-4 flex items-center">
                            <FaUser className="mr-2 text-blue-500" /> Thông Tin Người Đặt
                        </h6>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs text-gray-500 uppercase font-semibold">Họ tên</label>
                                <div className="font-bold text-gray-800">{order.taikhoan?.hoten || 'N/A'}</div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 uppercase font-semibold">Email</label>
                                <div className="text-gray-800">{order.thongTinLienHe?.email || 'N/A'}</div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 uppercase font-semibold">Số điện thoại</label>
                                <div className="text-gray-800">{order.thongTinLienHe?.soDienThoai || 'N/A'}</div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Chi tiết hành trình & Vé */}
                    <div className="bg-white rounded-lg shadow-sm border p-5">
                        <h6 className="font-bold text-gray-800 border-b pb-3 mb-4 flex items-center">
                            <FaPlane className="mr-2 text-blue-500" /> Chi Tiết Hành Trình
                        </h6>
                        
                        {cb && (
                            <div className="mb-6 last:mb-0 border rounded-lg overflow-hidden">
                                    {/* Header Chuyến Bay */}
                                    <div className="bg-blue-50 p-4 flex flex-wrap justify-between items-center border-b">
                                        <div className="flex items-center space-x-4">
                                            <img src={cb.hang_hang_khong?.logo} alt="logo" className="h-8 w-auto object-contain" />
                                            <div>
                                                <div className="font-bold text-blue-800 flex items-center">
                                                    {cb.san_bay_di?.tenSanBay} ({cb.san_bay_di?.maCode})
                                                    <FaArrowLeft className="mx-3 transform rotate-180 text-gray-400" />
                                                    {cb.san_bay_den?.tenSanBay} ({cb.san_bay_den?.maCode})
                                                </div>
                                                <div className="text-xs text-gray-500">{cb.hang_hang_khong?.tenHang}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-gray-700">
                                                {new Date(cb.ngayGioCatCanh).toLocaleString('vi-VN')}
                                            </div>
                                            <div className="text-xs text-gray-400 font-medium italic">Khởi hành dự kiến</div>
                                        </div>
                                    </div>

                                    {/* Danh sách vé của chuyến này */}
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-bold">
                                                <tr>
                                                    <th className="px-4 py-2 text-left">Mã Vé</th>
                                                    <th className="px-4 py-2 text-left">Hành Khách</th>
                                                    <th className="px-4 py-2 text-center">Loại/Ghế</th>
                                                    <th className="px-4 py-2 text-right">Giá thực tế</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {danhSachVe.map((ve, vIdx) => (
                                                    <tr key={vIdx} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 font-mono font-bold text-blue-600">#{ve.maVe}</td>
                                                        <td className="px-4 py-3">
                                                            <div className="font-bold text-gray-800 uppercase">{ve.hanh_khach?.hoTen}</div>
                                                            <div className="text-xs text-gray-500">SN: {new Date(ve.hanh_khach?.ngaySinh).toLocaleDateString('vi-VN')}</div>
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <span className="block font-medium">{ve.hanh_khach?.loaiHanhKhach}</span>
                                                            <span className="inline-block bg-gray-100 px-2 py-0.5 rounded text-[10px] font-bold">GHE: {ve.maGhe}</span>
                                                        </td>
                                                        <td className="px-4 py-3 text-right font-bold text-gray-700">
                                                            {ve.giaMuaThucTe?.toLocaleString('vi-VN')} đ
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>                          
                        )}
                        {!cb && <div className="text-gray-500 italic text-sm">Không có thông tin hành trình.</div>}
                    </div>
                </div>

                {/* CỘT PHẢI: XỬ LÝ & THANH TOÁN */}
                <div className="lg:col-span-4 space-y-6">
                    
                    {/* Tổng quan & Cập nhật */}
                    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                        <div className="bg-blue-600 px-4 py-3 text-white font-bold flex items-center">
                            <FaInfoCircle className="mr-2" /> Tổng Quan & Xử Lý
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-500 font-medium">Tổng thanh toán:</span>
                                <span className="text-xl font-bold text-red-600">{order.tongTien?.toLocaleString('vi-VN')} đ</span>
                            </div>
                            <div className="flex justify-between items-center mb-5 flex-nowrap gap-2">
                                <span className="text-gray-500 text-[16px] whitespace-nowrap">
                                    Trạng thái hiện tại:
                                </span>
                                <div className="flex-shrink-0">
                                    {renderStatusBadge(order.trangThai)}
                                </div>
                            </div>
                            <hr className="my-4" />

                            {/* FORM CẬP NHẬT */}
                            <form onSubmit={handleUpdateStatus} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Cập nhật trạng thái</label>
                                    <select 
                                        className="w-full border rounded p-2 text-sm outline-none focus:border-blue-500"
                                        value={statusData.trangThai}
                                        onChange={(e) => setStatusData({...statusData, trangThai: e.target.value})}
                                    >
                                        <option value="0">Chờ thanh toán</option>
                                        <option value="1">Đã xuất vé (Thành công)</option>
                                        <option value="2">Đã hủy đơn hàng</option>
                                    </select>
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={updating}
                                    className="w-full bg-yellow-500 text-white font-bold py-2 rounded shadow-sm hover:bg-yellow-600 transition flex items-center justify-center disabled:opacity-50"
                                >
                                    <FaSave className="mr-2" /> {updating ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Lịch sử thanh toán */}
                    {order.thanh_toans && order.thanh_toans.length > 0 && (
                        <div className="bg-gray-50 rounded-lg border p-4">
                            <h6 className="font-bold text-gray-800 mb-3 flex items-center text-sm border-b pb-2">
                                <FaCreditCard className="mr-2 text-gray-500" /> Lịch Sử Giao Dịch
                            </h6>
                            {order.thanh_toans.map((tt, idx) => (
                                <div key={idx} className="space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-medium">Phương thức:</span>
                                        <span className="font-bold text-gray-800 uppercase">{tt.phuongThuc}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-medium">Mã giao dịch:</span>
                                        <span className="font-mono text-blue-600">{tt.maGiaoDich}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-medium">Ngày GD:</span>
                                        <span>{new Date(tt.ngayThanhToan).toLocaleString('vi-VN')}</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-gray-500 font-medium">Trạng thái:</span>
                                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold text-[10px]">{tt.trangThai}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderForm;