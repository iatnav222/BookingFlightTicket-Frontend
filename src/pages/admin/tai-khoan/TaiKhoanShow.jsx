import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
    FaArrowLeft, FaUserCircle, FaHistory, FaPen, 
    FaDesktop, FaExclamationCircle, FaCheckCircle 
} from 'react-icons/fa';
import { taiKhoanApi } from '../../../services/taiKhoanApi';

const TaiKhoanShow = () => {
    const { id } = useParams();
    const [account, setAccount] = useState(null);
    const [loginHistory, setLoginHistory] = useState([]); // Giả định API sẽ trả về thêm history
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const fetchData = async () => {
        try {
            const res = await taiKhoanApi.getChiTiet(id);
            // res ở đây chính là object { success, message, data } vì Api trả về response.data
            
            if (res.success && res.data) {
                setAccount(res.data.taikhoan); // Lấy đúng object taikhoan
                setLoginHistory(res.data.lich_su_dang_nhap || []); // Lấy đúng mảng lịch sử
            }
        } catch (error) {
            console.error("Lỗi tải chi tiết tài khoản:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
}, [id]);

    if (loading) return <div className="p-10 text-center text-gray-500">Đang tải dữ liệu...</div>;
    if (!account) return <div className="p-10 text-center text-red-500">Không tìm thấy tài khoản!</div>;

    return (
        <div className="container-fluid px-4 mt-4 font-sans text-gray-700">
            {/* Header: Nút quay lại */}
            <div className="mb-4">
                <Link to="/admin/tai-khoan" className="inline-flex items-center px-3 py-1.5 bg-gray-500 text-white text-sm rounded shadow-sm hover:bg-gray-600 transition">
                    <FaArrowLeft className="mr-2" /> Quay lại danh sách
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Cột trái: Thông tin cá nhân */}
                <div className="lg:col-span-4">
                    <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden h-full">
                        <div className="bg-[#4e73df] px-4 py-3 text-white font-bold flex items-center">
                            <FaUserCircle className="mr-2" /> Thông Tin Tài Khoản
                        </div>
                        <div className="p-6 text-center">
                            <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-blue-50 flex items-center justify-center mx-auto mb-4 text-[#4e73df] text-4xl font-bold shadow-sm">
                                {account.username?.charAt(0).toUpperCase()}
                            </div>
                            <h4 className="text-xl font-bold text-gray-800 mb-1">{account.username}</h4>
                            <p className="text-gray-500 text-sm mb-4">{account.email}</p>

                            <div className="border-t pt-4 text-left text-sm space-y-3">
                                <div className="flex justify-between border-b pb-2">
                                    <span className="font-semibold text-gray-500">Họ tên:</span>
                                    <span className="text-gray-800 font-medium">{account.hoten || 'Chưa cập nhật'}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="font-semibold text-gray-500">Quyền hạn:</span>
                                    <span>
                                        {account.quyen === 'admin' ? 
                                            <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-bold uppercase">Quản trị viên</span> : 
                                            <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs font-bold uppercase">Người dùng</span>
                                        }
                                    </span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="font-semibold text-gray-500">Trạng thái:</span>
                                    <span>
                                        {account.trangThai ? 
                                            <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded text-xs font-bold uppercase">Đang hoạt động</span> : 
                                            <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-xs font-bold uppercase">Đã khóa</span>
                                        }
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold text-gray-500">Ngày tham gia:</span>
                                    <span className="text-gray-800">{new Date(account.ngayTao).toLocaleDateString('vi-VN')}</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <Link to={`/admin/tai-khoan/sua/${account.maTK}`} className="w-full inline-flex justify-center items-center px-4 py-2 bg-yellow-500 text-white font-bold rounded shadow-sm hover:bg-yellow-600 transition">
                                    <FaPen className="mr-2" /> Chỉnh sửa thông tin
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cột phải: Lịch sử đăng nhập */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden h-full">
                        <div className="bg-white border-b px-4 py-3 flex justify-between items-center">
                            <h6 className="font-bold text-[#4e73df] flex items-center">
                                <FaHistory className="mr-2" /> Lịch Sử Đăng Nhập
                            </h6>
                            <span className="text-xs bg-gray-50 text-gray-500 px-2 py-1 border rounded">Tổng: {loginHistory.length} lần</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left align-middle">
                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                                    <tr>
                                        <th className="px-6 py-3 border-b">Thời gian</th>
                                        <th className="px-6 py-3 border-b">Địa chỉ IP</th>
                                        <th className="px-6 py-3 border-b">Thiết bị</th>
                                        <th className="px-6 py-3 border-b text-center">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {loginHistory.length > 0 ? loginHistory.map((log, index) => (
                                        <tr key={index} className="hover:bg-gray-50 border-b last:border-0 transition">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-800">{new Date(log.ngayDangNhap).toLocaleTimeString('vi-VN')}</div>
                                                <div className="text-xs text-gray-500">{new Date(log.ngayDangNhap).toLocaleDateString('vi-VN')}</div>
                                            </td>
                                            <td className="px-6 py-4 text-blue-600 font-mono">{log.ip}</td>
                                            <td className="px-6 py-4 text-gray-500"><FaDesktop className="inline mr-1"/> Chrome / Windows</td>
                                            <td className="px-6 py-4 text-center">
                                                {log.thanhCong ? 
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 font-bold text-xs"><FaCheckCircle className="mr-1"/> Thành công</span> : 
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-50 text-red-700 font-bold text-xs"><FaExclamationCircle className="mr-1"/> Thất bại</span>
                                                }
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="text-center py-20 text-gray-400">
                                                <FaHistory className="mx-auto mb-3 text-4xl opacity-20" />
                                                Chưa có dữ liệu đăng nhập nào.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaiKhoanShow;