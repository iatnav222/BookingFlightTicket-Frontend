import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSave, FaArrowLeft, FaShieldAlt, FaIdCard } from 'react-icons/fa';
import { accountApi } from '../../../services/accountApi';

const AccountForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Khởi tạo state khớp với cấu trúc bảng taikhoan và thongtin_canhan trong SQL
    const [formData, setFormData] = useState({
        username: '',
        quyen: 'user',
        trangThai: 1,
        thongtin_canhan: {
            hoTen: '',
            email: '',
            soDienThoai: ''
        }
    });

    useEffect(() => {
        if (id) {
            fetchAccountDetail();
        } else {
            setLoading(false);
        }
    }, [id]);

    const fetchAccountDetail = async () => {
        try {
            const res = await accountApi.getDanhSach(); // Giả định lấy từ danh sách hoặc bạn có api.getChiTiet
            const allAccs = Array.isArray(res) ? res : (res.data || []);
            const current = allAccs.find(a => a.maTK === parseInt(id));
            
            if (current) {
                setFormData({
                    ...current,
                    // Đảm bảo thongtin_canhan không bị null để tránh lỗi UI
                    thongtin_canhan: current.thongtin_canhan || { hoTen: '', email: '', soDienThoai: '' }
                });
            }
        } catch (err) {
            console.error("Lỗi tải chi tiết:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await accountApi.capNhatTaiKhoan(id, {
                quyen: formData.quyen,
                trangThai: formData.trangThai
            });
            alert("Cập nhật quyền hạn thành công!");
            navigate('/admin/tai-khoan');
        } catch (err) {
            alert("Có lỗi xảy ra khi lưu.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center font-bold text-[#4e73df]">Đang tải dữ liệu tài khoản...</div>;

    return (
        <div className="container-fluid px-4 mt-4 font-['Nunito'] text-[#5a5c69]">
            <div className="bg-white rounded shadow-[0_0.15rem_1.75rem_0_rgba(58,59,69,0.15)] max-w-4xl mx-auto overflow-hidden border-none">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-[#f8f9fc]">
                    <h6 className="m-0 font-bold text-[#4e73df] text-lg uppercase">
                        Thiết Lập Tài Khoản: <span className="text-gray-600">{formData.username}</span>
                    </h6>
                    <button onClick={() => navigate('/admin/tai-khoan')} className="flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-[#858796] rounded hover:bg-[#717384] transition shadow-sm">
                        <FaArrowLeft className="mr-1" /> QUAY LẠI
                    </button>
                </div>

                <form onSubmit={handleSave} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Cột 1: Quyền hạn & Trạng thái */}
                        <div className="bg-[#f8f9fc] p-4 rounded border border-gray-200">
                            <h5 className="text-[#4e73df] font-bold mb-4 flex items-center text-sm border-b pb-2 border-gray-300">
                                <FaShieldAlt className="mr-2"/> PHÂN QUYỀN HỆ THỐNG
                            </h5>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Nhóm quyền</label>
                                    <select 
                                        className="w-full p-2 border rounded text-sm font-bold outline-none bg-white"
                                        value={formData.quyen}
                                        onChange={(e) => setFormData({...formData, quyen: e.target.value})}
                                    >
                                        <option value="user">Khách hàng (User)</option>
                                        <option value="admin">Quản trị viên (Admin)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Trạng thái tài khoản</label>
                                    <select 
                                        className="w-full p-2 border rounded text-sm font-bold outline-none bg-white"
                                        value={formData.trangThai ? 1 : 0}
                                        onChange={(e) => setFormData({...formData, trangThai: parseInt(e.target.value)})}
                                    >
                                        <option value={1}>✅ Đang hoạt động</option>
                                        <option value={0}>🔒 Khóa truy cập</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Cột 2: Thông tin định danh (Dữ liệu từ bảng thongtin_canhan) */}
                        <div className="bg-[#f8f9fc] p-4 rounded border border-gray-200">
                            <h5 className="text-[#1cc88a] font-bold mb-4 flex items-center text-sm border-b pb-2 border-gray-300">
                                <FaIdCard className="mr-2"/> THÔNG TIN ĐỊNH DANH
                            </h5>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase">Họ và tên khách hàng</label>
                                    <p className="text-sm font-bold text-gray-800 border-b border-gray-200 pb-1">
                                        {/* Sử dụng dấu ? để tránh crash nếu thongtin_canhan bị null */}
                                        {formData.thongtin_canhan?.hoTen || "Chưa cập nhật"}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase">Email đăng ký</label>
                                    <p className="text-sm font-bold text-gray-800 border-b border-gray-200 pb-1">
                                        {formData.thongtin_canhan?.email || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase">Số điện thoại</label>
                                    <p className="text-sm font-bold text-gray-800 border-b border-gray-200 pb-1">
                                        {formData.thongtin_canhan?.soDienThoai || "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t flex justify-end">
                        <button 
                            type="submit" 
                            disabled={saving}
                            className="px-6 py-2 bg-[#4e73df] text-white rounded font-bold hover:bg-[#2e59d9] shadow-md transition text-sm flex items-center uppercase"
                        >
                            {saving ? "ĐANG XỬ LÝ..." : <><FaSave className="mr-2"/> Lưu thay đổi quyền hạn</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AccountForm;