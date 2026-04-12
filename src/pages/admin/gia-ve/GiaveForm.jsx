import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSave, FaArrowLeft, FaMoneyBillWave, FaPlane, FaUsers, FaStickyNote } from 'react-icons/fa';
import { priceApi } from '../../../services/GiaveApi';
import { chuyenBayApi } from '../../../services/chuyenBayApi';

const GiaveForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [chuyenBays, setChuyenBays] = useState([]); 
    const [errorMsg, setErrorMsg] = useState(''); 
    const [formData, setFormData] = useState({
        maChuyenBay: '',
        giaCoBan: '', 
        loaiGhe: 'PhoThong', 
        doiTuong: 'NguoiLon', 
        ghiChu: ''
    });

    useEffect(() => {
        const loadChuyenBays = async () => {
            try {
                const res = await chuyenBayApi.getDanhSach();
                setChuyenBays(res.data?.data || res.data || []);
            } catch (err) {
                console.error("Không thể tải danh sách chuyến bay:", err);
            }
        };
        loadChuyenBays();

        if (isEditMode) {
            const fetchDetail = async () => {
                setLoading(true);
                try {
                    const res = await priceApi.getChiTiet(id);
                    const data = res.data?.data || res.data;
                    
                    setFormData({
                        maChuyenBay: data.maChuyenBay || '',
                        giaCoBan: data.giaTien || '', 
                        loaiGhe: data.loaiGhe || 'PhoThong',
                        doiTuong: data.loaiHanhKhach || 'NguoiLon',
                        ghiChu: data.ghiChu || ''
                    });
                } catch (err) {
                    setErrorMsg("Lỗi khi tải thông tin chi tiết giá vé.");
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
        if (errorMsg) setErrorMsg('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        const dataSubmit = {
            maChuyenBay: Number(formData.maChuyenBay),
            giaTien: Number(formData.giaCoBan),
            loaiGhe: formData.loaiGhe,
            loaiHanhKhach: formData.doiTuong,
            ghiChu: formData.ghiChu || ''
        };

        try {
            if (isEditMode) {
                await priceApi.capNhatGia(id, dataSubmit);
                alert('Cập nhật giá vé thành công!');
            } else {
                if (!dataSubmit.maChuyenBay) {
                    setErrorMsg("Vui lòng chọn một chuyến bay!");
                    setLoading(false);
                    return;
                }
                await priceApi.themMoiGia(dataSubmit);
                alert('Thêm mới giá vé thành công!');
            }
            navigate('/admin/gia-ve');
        } catch (err) {
            const serverRes = err.response?.data;
            if (serverRes?.errors) {
                const firstError = Object.values(serverRes.errors)[0][0];
                setErrorMsg(firstError);
            } else if (serverRes?.message) {
                setErrorMsg(serverRes.message);
            } else {
                setErrorMsg('Đã xảy ra lỗi khi lưu dữ liệu!');
            }
        } finally {
            setLoading(false);
        }
    };

    const labelClasses = "block text-[14px] font-bold text-[#4e73df] mb-2 uppercase tracking-wide";
    const iconAddonClasses = "flex items-center justify-center w-[45px] bg-[#f8f9fa] border border-gray-300 rounded-l border-r-0 text-[#5a5c69]";
    const inputFieldClasses = "flex-1 h-[40px] px-4 border border-gray-300 rounded-r focus:border-[#4e73df] outline-none text-[14px] text-gray-700 transition-all bg-white";

    return (
        <div className="w-full flex flex-col gap-6 font-sans">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-white px-6 py-4 border-b flex justify-between items-center">
                    <h5 className="text-[#4e73df] font-bold text-lg m-0 uppercase tracking-wide">
                        {isEditMode ? 'Cập nhật Giá Vé' : 'Thêm Mới Giá Vé'}
                    </h5>
                    <button 
                        type="button" 
                        onClick={() => navigate(-1)} 
                        className="flex items-center gap-2 px-3.5 py-1.5 bg-[#6c757d] text-white rounded-[5px] hover:bg-[#5a6268] text-[14px] font-medium transition-all shadow-sm active:scale-95"
                    >
                        <FaArrowLeft size={13} /> Quay lại
                    </button>
                </div>

                {errorMsg && (
                    <div className="mx-8 mt-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded text-sm font-bold animate-bounce">
                        Lỗi: {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6">
                    
                        <div>
                            <label className={labelClasses}>Chuyến bay *</label>
                            <div className="flex h-[40px] w-full">
                                <div className={iconAddonClasses}><FaPlane size={14} /></div>
                                <select 
                                    name="maChuyenBay" value={formData.maChuyenBay} onChange={handleChange}
                                    className={inputFieldClasses} required disabled={isEditMode}
                                >
                                    <option value="">-- Chọn chuyến bay --</option>
                                    {chuyenBays.map((cb, index) => (
                                        <option key={index} value={cb.maChuyenBay}>
                                            [{cb.maChuyenBay}] {cb.san_bay_di?.thanhPho || cb.maSanBayDi} → {cb.san_bay_den?.thanhPho || cb.maSanBayDen}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className={labelClasses}>Giá tiền (VNĐ) *</label>
                            <div className="flex h-[40px] w-full">
                                <div className={iconAddonClasses}><FaMoneyBillWave size={14} /></div>
                                <input 
                                    type="number" name="giaCoBan" value={formData.giaCoBan} onChange={handleChange}
                                    placeholder="VD: 1500000" className={inputFieldClasses} required 
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelClasses}>Đối tượng khách hàng</label>
                            <div className="flex h-[40px] w-full">
                                <div className={iconAddonClasses}><FaUsers size={14} /></div>
                                <select name="doiTuong" value={formData.doiTuong} onChange={handleChange} className={inputFieldClasses}>
                                    <option value="NguoiLon">Người lớn</option>
                                    <option value="TreEm">Trẻ em</option>
                                    <option value="EmBe">Em bé</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className={labelClasses}>Hạng ghế</label>
                            <div className="flex h-[40px] w-full">
                                <div className={iconAddonClasses}><FaPlane size={14} className="rotate-45" /></div>
                                <select name="loaiGhe" value={formData.loaiGhe} onChange={handleChange} className={inputFieldClasses}>
                                    <option value="PhoThong">Phổ thông (Economy)</option>
                                    <option value="ThuongGia">Thương gia (Business)</option>
                                </select>
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            <label className={labelClasses}>Ghi chú</label>
                            <div className="flex w-full">
                                <div className="flex items-start justify-center w-[45px] bg-[#f8f9fa] border border-gray-300 rounded-l border-r-0 text-[#5a5c69] pt-3">
                                    <FaStickyNote size={14} />
                                </div>
                                <textarea 
                                    name="ghiChu" value={formData.ghiChu} onChange={handleChange}
                                    rows="3" placeholder="Nhập điều kiện vé hoặc ghi chú thêm..."
                                    className="flex-1 p-3 border border-gray-300 rounded-r focus:border-[#4e73df] outline-none text-[14px] text-gray-700 min-h-[80px]"
                                ></textarea>
                            </div>
                        </div>     
                    </div>

                    <div className="mt-10 pt-6 border-t flex gap-3">
                        <button type="submit" disabled={loading}
                            className={`px-10 py-2.5 ${loading ? 'bg-gray-400 opacity-70' : 'bg-[#1cc88a] hover:bg-[#17a673]'} text-white rounded text-[14px] transition-all shadow-sm flex items-center gap-2 uppercase tracking-wider active:scale-95`}>
                            <FaSave /> {loading ? 'Đang xử lý...' : (isEditMode ? 'Lưu thay đổi' : 'Xác nhận thêm')}
                        </button>
                        <button type="button" onClick={() => navigate('/admin/gia-ve')}
                            className="px-8 py-2.5 bg-[#6c757d] text-white rounded text-[14px]  hover:bg-[#5a6268] transition-colors">
                            Hủy bỏ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GiaveForm;