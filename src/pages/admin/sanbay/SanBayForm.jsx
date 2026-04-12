import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSave, FaArrowLeft, FaInfoCircle, FaMapMarkerAlt, FaImage, FaPlaneDeparture } from 'react-icons/fa';
import { sanBayApi } from '../../../services/Sanbayapi';

const SanBayForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const [formData, setFormData] = useState({
        maCode: '',
        tenSanBay: '',
        thanhPho: '',
        hinhAnh: null
    });

    const BASE_URL = 'https://bookingflightticket-backend-new.onrender.com';

    useEffect(() => {
        if (isEditMode) {
            loadSanBayDetail();
        }
    }, [id]);

    const loadSanBayDetail = async () => {
        setLoading(true);
        try {
            const res = await sanBayApi.getChiTiet(id);
            const data = res.data.data || res.data;
            
            setFormData({
                maCode: data.maCode || '',
                tenSanBay: data.tenSanBay || '',
                thanhPho: data.thanhPho || '',
                hinhAnh: null
            });

            const path = data.hinh_anh_url || data.hinhAnh;
            if (path) {
                const fullPath = path.startsWith('http') 
                    ? path 
                    : `${BASE_URL}/storage/${path.replace(/^\//, '')}`;
                setPreviewImage(`${fullPath}?t=${new Date().getTime()}`);
            }
        } catch (err) {
            setErrorMsg('Không thể tải thông tin sân bay!');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, hinhAnh: file }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        const dataSubmit = new FormData();
        dataSubmit.append('maCode', formData.maCode);
        dataSubmit.append('tenSanBay', formData.tenSanBay);
        dataSubmit.append('thanhPho', formData.thanhPho);
        
        if (formData.hinhAnh) {
            dataSubmit.append('hinhAnh', formData.hinhAnh);
        }
        if (isEditMode) {
            dataSubmit.append('_method', 'PUT');
        }

        try {
            if (isEditMode) {
                await sanBayApi.capNhatSanBay(id, dataSubmit);
            } else {
                await sanBayApi.themSanBay(dataSubmit);
            }
            alert('Lưu dữ liệu thành công!');
            navigate('/admin/san-bay');
        } catch (err) {
            setErrorMsg(err.response?.data?.message || "Lỗi hệ thống khi lưu dữ liệu.");
        } finally {
            setLoading(false);
        }
    };

    const labelClasses = "block text-[14px] font-bold text-[#4e73df] mb-2 uppercase tracking-wide";
    const iconAddonClasses = "flex items-center justify-center w-[45px] bg-[#f8f9fa] border border-gray-300 rounded-l border-r-0 text-[#5a5c69]";
    const inputFieldClasses = "flex-1 h-[40px] px-4 border border-gray-300 rounded-r focus:border-[#4e73df] outline-none text-[14px] text-gray-700 transition-all";

    return (
        <div className="w-full flex flex-col gap-6 font-sans">
            <div className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-8 border-b pb-5">
                    <h5 className="text-[#4e73df] font-bold text-xl m-0 uppercase tracking-wide">
                        {isEditMode ? 'Cập Nhật Sân Bay' : 'Thêm Sân Bay Mới'}
                    </h5>
                    <button onClick={() => navigate('/admin/san-bay')} className="flex items-center gap-2 px-4 py-2 bg-[#6c757d] text-white rounded hover:bg-[#5a6268] text-[13px]">
                        <FaArrowLeft size={12} /> Quay lại
                    </button>
                </div>

                {errorMsg && <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded text-sm font-bold">{errorMsg}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-5">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-[#5a5c69] mb-2">
                                <FaInfoCircle /> <span className="font-bold uppercase text-[12px] tracking-wider">Thông tin cơ bản</span>
                            </div>
                            
                            <div>
                                <label className={labelClasses}>Mã IATA (Mã Code) *</label>
                                <div className="flex h-[40px]">
                                    <div className={iconAddonClasses}><FaPlaneDeparture size={14} /></div>
                                    <input type="text" name="maCode" value={formData.maCode} onChange={handleChange} placeholder="SGN, HAN..." className={inputFieldClasses} required />
                                </div>
                            </div>

                            <div>
                                <label className={labelClasses}>Tên Sân Bay *</label>
                                <input type="text" name="tenSanBay" value={formData.tenSanBay} onChange={handleChange} className="w-full h-[40px] px-3 border border-gray-300 rounded focus:border-[#4e73df] outline-none text-[14px]" required />
                            </div>

                            <div>
                                <label className={labelClasses}>Tỉnh / Thành Phố *</label>
                                <div className="flex h-[40px]">
                                    <div className={iconAddonClasses}><FaMapMarkerAlt size={14} /></div>
                                    <input type="text" name="thanhPho" value={formData.thanhPho} onChange={handleChange} className={inputFieldClasses} required />
                                </div>
                            </div>
                        </div>

                        <div className="lg:border-l lg:pl-12">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-[#5a5c69] mb-2">
                                <FaImage /> <span className="font-bold uppercase text-[12px] tracking-wider">Hình ảnh đại diện</span>
                            </div>
                            <div className="space-y-5">
                                <label className={labelClasses}>Ảnh Banner Thành Phố</label>
                                <div className="flex border border-gray-300 rounded overflow-hidden h-[40px] mb-4">
                                    <label className="bg-[#f8f9fa] px-4 flex items-center border-r border-gray-300 text-[13px] font-bold cursor-pointer hover:bg-gray-200 text-[#5a5c69]">
                                        Chọn tệp <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                                    </label>
                                    <span className="flex items-center px-3 text-gray-500 text-[13px] italic truncate">
                                        {formData.hinhAnh ? formData.hinhAnh.name : "Nhấn để thay đổi ảnh..."}
                                    </span>
                                </div>
                                <div className="w-full h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded flex items-center justify-center overflow-hidden">
                                    {previewImage ? (
                                        <img src={previewImage} alt="Preview" className="w-full h-full object-contain" />
                                    ) : (
                                        <span className="text-gray-400 text-sm italic">Chưa có ảnh</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-6 border-t flex justify-end gap-3">
                        <button type="button" onClick={() => navigate('/admin/san-bay')} className="px-6 py-2 bg-[#6c757d] text-white rounded">Hủy</button>
                        <button type="submit" disabled={loading} className={`px-8 py-2 ${loading ? 'bg-gray-400' : 'bg-[#1cc88a]'} text-white rounded transition`}>
                            <FaSave className="inline mr-2" /> {loading ? 'Đang xử lý...' : (isEditMode ? 'Cập Nhật' : 'Lưu Mới')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SanBayForm;