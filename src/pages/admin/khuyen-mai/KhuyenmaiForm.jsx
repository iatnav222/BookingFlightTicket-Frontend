import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaSave, FaEdit, FaTicketAlt } from 'react-icons/fa';
import { promotionApi } from '../../../services/KhuyenmaiApi';

const KhuyenMaiForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [errorMsg, setErrorMsg] = useState('');
    const [formData, setFormData] = useState({
        code: '',
        moTa: '',
        giaTriGiam: 0,
        ngayBatDau: '',
        ngayHetHan: '',
        trangThai: 1
    });

    useEffect(() => {
        if (isEditMode) {
            // Fetch chi tiết khuyến mãi để edit
            const fetchDetail = async () => {
                try {
                    const res = await promotionApi.getChiTiet(id);
                    const data = res.data.data || res.data;
                    setFormData({
                        code: data.code || '',
                        moTa: data.moTa || '',
                        giaTriGiam: data.giaTriGiam || 0,
                        ngayBatDau: data.ngayBatDau || '',
                        ngayHetHan: data.ngayHetHan || '',
                        trangThai: data.trangThai ?? 1
                    });
                } catch (err) { 
                    setErrorMsg('Lỗi tải dữ liệu khuyến mãi!'); 
                }
            };
            fetchDetail();
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        try {
            if (isEditMode) {
                await promotionApi.capNhatKM(id, formData);
            } else {
                await promotionApi.themKM(formData);
            }
            alert(`Thành công! Mã giảm giá đã được ${isEditMode ? 'cập nhật' : 'thêm mới'}.`);
            navigate('/admin/khuyen-mai');
        } catch (err) { 
            setErrorMsg(err.response?.data?.message || "Đã xảy ra lỗi khi lưu dữ liệu"); 
        }
    };

    return (
        <div className="container-fluid mt-4 font-sans text-gray-800 px-4">
            <div className="bg-white rounded shadow-lg mb-4 max-w-4xl mx-auto border-none overflow-hidden">
                {/* Header */}
                <div className="px-5 py-4 border-b border-gray-100 flex items-center bg-[#f8f9fc]">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 text-[#4e73df]">
                        <FaTicketAlt />
                    </div>
                    <h5 className="m-0 font-bold text-[#4e73df] text-lg">
                        {isEditMode ? 'Chỉnh Sửa Mã Khuyến Mãi' : 'Tạo Mã Khuyến Mãi Mới'}
                    </h5>
                </div>

                <div className="p-6">
                    {errorMsg && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-200 rounded text-sm">
                            {errorMsg}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Mã Code */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    Mã Khuyến Mãi (Code) <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    name="code" 
                                    value={formData.code} 
                                    onChange={handleChange} 
                                    placeholder="VD: PHUCNHAN30" 
                                    className="w-full p-2.5 border border-gray-300 rounded focus:border-[#4e73df] outline-none uppercase font-bold" 
                                    required 
                                />
                            </div>

                            {/* Mức giảm */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    Mức giảm (%) <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="number" 
                                    name="giaTriGiam" 
                                    value={formData.giaTriGiam} 
                                    onChange={handleChange} 
                                    min="1" max="100"
                                    className="w-full p-2.5 border border-gray-300 rounded focus:border-[#4e73df] outline-none" 
                                    required 
                                />
                            </div>

                            {/* Ngày bắt đầu */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Ngày Bắt Đầu</label>
                                <input 
                                    type="date" 
                                    name="ngayBatDau" 
                                    value={formData.ngayBatDau} 
                                    onChange={handleChange} 
                                    className="w-full p-2.5 border border-gray-300 rounded outline-none" 
                                />
                            </div>

                            {/* Ngày kết thúc */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Ngày Kết Thúc</label>
                                <input 
                                    type="date" 
                                    name="ngayHetHan" 
                                    value={formData.ngayHetHan} 
                                    onChange={handleChange} 
                                    className="w-full p-2.5 border border-gray-300 rounded outline-none" 
                                    required
                                />
                            </div>
                        </div>

                        {/* Mô tả */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Mô Tả Chi Tiết</label>
                            <textarea 
                                name="moTa" 
                                value={formData.moTa} 
                                onChange={handleChange} 
                                rows="3"
                                placeholder="Nhập nội dung chương trình khuyến mãi..."
                                className="w-full p-2.5 border border-gray-300 rounded outline-none"
                            ></textarea>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-3 pt-5 border-t border-gray-100">
                            <Link 
                                to="/admin/khuyen-mai" 
                                className="px-6 py-2 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded transition shadow-sm"
                            >
                                Hủy Bỏ
                            </Link>
                            <button 
                                type="submit" 
                                className={`px-6 py-2 text-sm font-bold text-white rounded shadow-sm flex items-center transition ${isEditMode ? 'bg-[#f6c23e] hover:bg-[#dda20a]' : 'bg-[#4e73df] hover:bg-[#2e59d9]'}`}
                            >
                                {isEditMode ? <><FaEdit className="mr-2"/> Cập Nhật</> : <><FaSave className="mr-2"/> Lưu Mã KM</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default KhuyenMaiForm;