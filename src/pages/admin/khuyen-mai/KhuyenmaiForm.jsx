import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSave, FaUndo, FaArrowLeft, FaInfoCircle, FaClock, FaCalendarAlt, FaImage } from 'react-icons/fa';
import { promotionApi } from '../../../services/KhuyenmaiApi';

const KhuyenMaiForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null); 
    
    const [formData, setFormData] = useState({
        ten_km: '',
        loai_km: 'phan_tram', 
        giaTriGiam: '', 
        dieukien: '',
        soLuongToiDa: '',
        ngayBatDau: '',
        ngayHetHan: '',
        trangThai: 'Hoạt động',
        anh_url: null,
        imageFile: null 
    });

    const BACKEND_URL = 'https://bookingflightticket-backend-new.onrender.com';

    useEffect(() => {
        if (isEditMode) {
            const fetchDetail = async () => {
                setLoading(true);
                try {
                    const res = await promotionApi.getChiTiet(id);
                    const data = res.data.data || res.data;
                    let realVal = data.giamPhanTram;
                    if (data.type === 'tien_mat') {
                        if (realVal > 0 && realVal < 1000) {
                            realVal = realVal * 1000; 
                        }
                    }

                    setFormData({
                        ten_km: data.ten_km || '',
                        loai_km: data.type || 'phan_tram',
                        giaTriGiam: realVal || '', 
                        dieukien: data.dieukien || '',
                        soLuongToiDa: data.soLuongToiDa || '',
                        ngayBatDau: data.ngayBatDau ? data.ngayBatDau.split('T')[0] : '',
                        ngayHetHan: (data.ngayKetThuc || data.ngayHetHan) ? (data.ngayKetThuc || data.ngayHetHan).split('T')[0] : '',
                        trangThai: data.trangThai ? 'Hoạt động' : 'Tạm dừng',
                        anh_url: data.anh || data.anh_url || null
                    });

                    if (data.anh || data.anh_url) {
                        const path = data.anh || data.anh_url;
                        const finalSrc = path.startsWith('http') ? path : `${BACKEND_URL}/storage/${path.replace(/^\//, '')}`;
                        setImagePreview(finalSrc);
                    }
                } catch (err) {
                    setErrorMsg('Lỗi tải dữ liệu khuyến mãi!');
                } finally {
                    setLoading(false);
                }
            };
            fetchDetail();
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, imageFile: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        if (!formData.giaTriGiam || formData.giaTriGiam <= 0) {
            setErrorMsg("Mức giảm giá phải lớn hơn 0");
            return;
        }

        setLoading(true);
        const dataSubmit = new FormData();
        
        dataSubmit.append('ten_km', formData.ten_km);
        dataSubmit.append('dieukien', formData.dieukien || '');
        dataSubmit.append('soLuongToiDa', formData.soLuongToiDa);
        dataSubmit.append('ngayBatDau', formData.ngayBatDau);
        dataSubmit.append('ngayKetThuc', formData.ngayHetHan);
        dataSubmit.append('trangThai', formData.trangThai === 'Hoạt động' ? 1 : 0);
        dataSubmit.append('type', formData.loai_km);
        let valueToSave = Number(formData.giaTriGiam);
        if (formData.loai_km === 'tien_mat') {
            if (valueToSave >= 10000 && valueToSave <= 999999) {
                valueToSave = valueToSave / 1000;
            } else if (valueToSave >= 1000000) {
                valueToSave = valueToSave / 1000000; 
            }
        }
        dataSubmit.append('giamPhanTram', valueToSave);

        if (formData.imageFile) {
            dataSubmit.append('anh', formData.imageFile);
        }
        if (isEditMode) dataSubmit.append('_method', 'PUT');

        try {
            if (isEditMode) {
                await promotionApi.capNhatKM(id, dataSubmit);
            } else {
                await promotionApi.themKM(dataSubmit);
            }
            alert('Lưu dữ liệu thành công!');
            navigate('/admin/khuyen-mai');
        } catch (err) {
            const serverErrors = err.response?.data?.errors;
            if (serverErrors) {
                const firstErrorKey = Object.keys(serverErrors)[0];
                setErrorMsg(serverErrors[firstErrorKey][0]);
            } else {
                setErrorMsg(err.response?.data?.message || "Dữ liệu không hợp lệ hoặc lỗi SQL");
            }
        } finally {
            setLoading(false);
        }
    };

    const labelClasses = "block text-[14px] font-bold text-[#4e73df] mb-2 uppercase tracking-wide";
    const inputGroupClasses = "flex h-[40px] w-full border border-gray-300 rounded overflow-hidden focus-within:border-[#4e73df]";
    const inputFieldClasses = "flex-1 px-3 outline-none text-[14px] text-gray-700 transition-all";
    const iconAddonClasses = "flex items-center justify-center w-[45px] bg-[#f8f9fa] border-r border-gray-300 text-gray-600";

    return (
        <div className="w-full flex flex-col gap-6 font-sans">
            <div className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-8 border-b pb-5">
                    <h5 className="text-[#4e73df] font-bold text-xl m-0 uppercase tracking-wide">
                        {isEditMode ? 'Chỉnh sửa Khuyến Mãi' : 'Thêm Khuyến Mãi'}
                    </h5>
                    <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2 bg-[#6c757d] text-white rounded hover:bg-[#5a6268] text-[13px] transition shadow-sm">
                        <FaArrowLeft size={12} /> Quay lại
                    </button>
                </div>

                {errorMsg && <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded text-sm font-bold animate-pulse">Lỗi: {errorMsg}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-gray-400 mb-2">
                                <FaInfoCircle />
                                <span className="font-bold uppercase text-[12px] tracking-wider">Thông tin chung</span>
                            </div>
                            <div className="space-y-5">
                                <div>
                                    <label className={labelClasses}>Tên khuyến mãi *</label>
                                    <input type="text" name="ten_km" value={formData.ten_km} onChange={handleChange} placeholder="VD: Siêu giảm giá..." className="w-full h-[40px] px-3 border border-gray-300 rounded outline-none text-[14px] focus:border-[#4e73df]" required />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className={labelClasses}>Loại hình</label>
                                        <select name="loai_km" value={formData.loai_km} onChange={handleChange} className="w-full h-[40px] px-3 border border-gray-300 rounded bg-white outline-none text-[14px] focus:border-[#4e73df]">
                                            <option value="phan_tram">Phần trăm (%)</option>
                                            <option value="tien_mat">Tiền mặt (VND)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClasses}>Điều kiện</label>
                                        <input type="text" name="dieukien" value={formData.dieukien} onChange={handleChange} placeholder="Trong thời gian quy định" className="w-full h-[40px] px-3 border border-gray-300 rounded outline-none text-[14px] focus:border-[#4e73df]" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className={labelClasses}>Mức giảm giá *</label>
                                        <div className={inputGroupClasses}>
                                            <input type="number" name="giaTriGiam" value={formData.giaTriGiam} onChange={handleChange} placeholder={formData.loai_km === 'phan_tram' ? "0-100" : "50000"} className={inputFieldClasses} required />
                                            <div className="flex items-center justify-center w-[50px] bg-[#f8f9fa] border-l border-gray-300 text-gray-600 font-bold text-[13px]">
                                                {formData.loai_km === 'phan_tram' ? '%' : 'VND'}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelClasses}>Số lượng *</label>
                                        <input type="number" name="soLuongToiDa" value={formData.soLuongToiDa} onChange={handleChange} placeholder="100" className="w-full h-[40px] px-3 border border-gray-300 rounded outline-none text-[14px] focus:border-[#4e73df]" required />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 lg:border-l lg:pl-12 border-gray-100 pt-6 lg:pt-0">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-gray-400 mb-2">
                                <FaClock />
                                <span className="font-bold uppercase text-[12px] tracking-wider">Thời gian & Hình ảnh</span>
                            </div>
                            <div className="space-y-5">
                                <div>
                                    <label className={labelClasses}>Thời gian áp dụng *</label>
                                    <div className="flex flex-col gap-3">
                                        <div className={inputGroupClasses}>
                                            <div className={iconAddonClasses}><FaCalendarAlt size={14} /></div>
                                            <input type="date" name="ngayBatDau" value={formData.ngayBatDau} onChange={handleChange} className={inputFieldClasses} required />
                                        </div>
                                        <div className={inputGroupClasses}>
                                            <div className={iconAddonClasses}><FaCalendarAlt size={14} /></div>
                                            <input type="date" name="ngayHetHan" value={formData.ngayHetHan} onChange={handleChange} className={inputFieldClasses} required />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClasses}>Trạng thái</label>
                                    <select name="trangThai" value={formData.trangThai} onChange={handleChange} className="w-full h-[40px] px-3 border border-gray-300 rounded bg-white outline-none text-[14px] focus:border-[#4e73df]">
                                        <option value="Hoạt động">Hoạt động</option>
                                        <option value="Tạm dừng">Tạm dừng</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClasses}>Ảnh Banner</label>
                                    <div className="flex border rounded overflow-hidden h-[40px] mb-3">
                                        <label className="bg-gray-100 px-4 flex items-center border-r text-[13px] font-bold cursor-pointer hover:bg-gray-200 transition">
                                            Chọn tệp <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                                        </label>
                                        <span className="flex items-center px-3 text-gray-500 text-[13px] italic truncate">{formData.imageFile ? formData.imageFile.name : "Thay đổi ảnh..."}</span>
                                    </div>
                                    <div className="w-full h-40 bg-gray-50 border-2 border-dashed border-gray-200 rounded flex items-center justify-center overflow-hidden">
                                        {imagePreview ? <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" /> : <FaImage className="text-gray-300 text-3xl" />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 pt-6 border-t flex justify-end gap-3">
                        <button type="button" onClick={() => window.location.reload()} className="flex items-center gap-2 px-6 py-2 bg-[#6c757d] text-white rounded  transition shadow-sm hover:bg-gray-600"><FaUndo /> Nhập lại</button>
                        <button type="submit" disabled={loading} className={`flex items-center gap-2 px-6 py-2 bg-[#1cc88a] text-white rounded transition shadow-sm hover:bg-[#17a673] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <FaSave /> {loading ? 'Đang lưu...' : 'Lưu Khuyến Mãi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default KhuyenMaiForm;