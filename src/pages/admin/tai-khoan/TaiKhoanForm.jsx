import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaEdit} from 'react-icons/fa';
import { taiKhoanApi } from '../../../services/taiKhoanApi';

const TaiKhoanForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [errorMsg, setErrorMsg] = useState('');
    const [formData, setFormData] = useState({
        username: '', password: '', hoten: '', email: '', quyen: 'user', trangThai: '1'
    });

    useEffect(() => {
        if (isEditMode) {
            taiKhoanApi.getChiTiet(id).then(res => {
                // Kiểm tra và lấy data.taikhoan
                if (res.success && res.data && res.data.taikhoan) {
                    const accountData = res.data.taikhoan;
                    setFormData({ 
                        ...accountData, 
                        password: '',
                        // Đảm bảo trangThai là string "1" hoặc "0" nếu bạn dùng <select>
                        trangThai: accountData.trangThai ? "1" : "0" 
                    });
                }
            }).catch(() => setErrorMsg('Lỗi tải dữ liệu tài khoản!'));
        }
    }, [id, isEditMode]);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg(''); // Xóa lỗi cũ nếu có
        
        try {
            // Tạo một bản sao dữ liệu và ép kiểu các trường số/boolean
            const submitData = {
                ...formData,
                trangThai: Number(formData.trangThai) // Chuyển "0" thành 0, "1" thành 1
            };

            // (Tùy chọn) Xóa bớt các trường không cần thiết để tránh lỗi Backend
            delete submitData.ngayTao;
            delete submitData.maTK;

            if (isEditMode) {
                await taiKhoanApi.capNhatTaiKhoan(id, submitData);
            } else {
                await taiKhoanApi.themTaiKhoan(submitData);
            }
            
            alert("Cập nhật tài khoản thành công!");
            navigate('/admin/tai-khoan');
        } catch (err) { 
            // Hiển thị thông báo lỗi từ Server (Lỗi 500 bạn thấy trong console)
            setErrorMsg(err.response?.data?.message || "Lỗi hệ thống khi cập nhật"); 
        }
    };

    return (
        <div className="container-fluid mt-4 font-sans text-gray-800">
            <div className="max-w-4xl mx-auto bg-white rounded shadow-md border border-gray-200">
                <div className="px-4 py-3 border-b flex justify-between items-center bg-gray-50">
                    <h5 className="m-0 font-bold text-[#4e73df]">
                        {isEditMode ? `Chỉnh sửa: ${formData.username}` : 'Tạo tài khoản mới'}
                    </h5>
                    <Link to="/admin/tai-khoan" className="text-xs bg-gray-500 text-white px-3 py-1.5 rounded flex items-center"><FaArrowLeft className="mr-1"/> Quay lại</Link>
                </div>

                <div className="p-6">
                    {errorMsg && <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded text-sm">{errorMsg}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Tên đăng nhập *</label>
                                <input name="username" value={formData.username} onChange={handleChange} className="w-full p-2 border rounded outline-none focus:border-blue-500" required disabled={isEditMode} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    {isEditMode ? "Mật khẩu mới (Để trống nếu không đổi)" : "Mật khẩu *"}
                                </label>
                                <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full p-2 border rounded outline-none focus:border-blue-500" required={!isEditMode} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Họ và tên</label>
                                <input name="hoten" value={formData.hoten} onChange={handleChange} className="w-full p-2 border rounded outline-none focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Email *</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded outline-none focus:border-blue-500" required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Phân quyền</label>
                                <select name="quyen" value={formData.quyen} onChange={handleChange} className="w-full p-2 border rounded outline-none">
                                    <option value="user">Người dùng (User)</option>
                                    <option value="admin">Quản trị viên (Admin)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Trạng thái</label>
                                <select name="trangThai" value={formData.trangThai} onChange={handleChange} className="w-full p-2 border rounded outline-none">
                                    <option value="1">Đang hoạt động</option>
                                    <option value="0">Khóa tài khoản</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end mt-8 pt-4 border-t gap-2">
                            <button type="submit" className={`px-6 py-2 font-bold text-white rounded shadow-sm flex items-center ${isEditMode ? 'bg-yellow-500' : 'bg-blue-600'}`}>
                                {isEditMode ? <><FaEdit className="mr-1"/> Cập Nhật</> : <><FaSave className="mr-1"/> Lưu tài khoản</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TaiKhoanForm;