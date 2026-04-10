import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaEdit } from 'react-icons/fa';
import { hangHangKhongApi } from '../../../services/hangHangKhongApi';

const BACKEND_URL = 'https://bookingflightticket-backend-new.onrender.com/';

const HangHangKhongForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        tenHang: '',
        maCode: '',
        ghiChu: '',
        trangThai: 1 // Mặc định là Hoạt động
    });

    const [logoFile, setLogoFile] = useState(null); // Lưu file thật để gửi lên server
    const [logoPreview, setLogoPreview] = useState(null); // URL để hiển thị ảnh preview

    useEffect(() => {
        if (isEditMode) {
            const fetchDetail = async () => {
                try {
                    const res = await hangHangKhongApi.getChiTiet(id);
                    const data = res.data.data || res.data;
                    setFormData({
                        tenHang: data.tenHang || '',
                        maCode: data.maCode || '',
                        ghiChu: data.ghiChu || '',
                        trangThai: data.trangThai ?? 1
                    });
                    // Nếu có logo cũ, gán link vào preview
                    if (data.logo_url) {
                        setLogoPreview(`${BACKEND_URL}${encodeURI(data.logo_url)}`);
                    }
                } catch (err) { 
                    setErrorMsg('Lỗi tải dữ liệu!'); 
                }
            };
            fetchDetail();
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Hàm xử lý khi người dùng chọn ảnh từ máy
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file); // Lưu file vào state
            setLogoPreview(URL.createObjectURL(file)); // Tạo link tạm để xem trước ảnh
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setIsLoading(true);

        try {
            // Khởi tạo đối tượng FormData để gửi file
            const dataToSend = new FormData();
            dataToSend.append('tenHang', formData.tenHang);
            dataToSend.append('maCode', formData.maCode);
            dataToSend.append('ghiChu', formData.ghiChu || '');
            const isHoatDong = formData.trangThai === 1 || formData.trangThai === '1' || formData.trangThai === true || formData.trangThai === 'true';
            dataToSend.append('trangThai', isHoatDong ? '1' : '0');
            
            // Nếu có chọn file mới thì mới append vào
            if (logoFile) {
                dataToSend.append('logo', logoFile);
            }

            if (isEditMode) {
                await hangHangKhongApi.capNhatHang(id, dataToSend);
            } else {
                await hangHangKhongApi.themHang(dataToSend);
            }
            
            alert(`Thành công! Hãng đã được ${isEditMode ? 'cập nhật' : 'thêm mới'}.`);
            navigate('/admin/hang-hang-khong');
        } catch (err) { 
            console.error("Chi tiết lỗi từ Server:", err.response?.data);
            
            // Xử lý lôi lỗi chi tiết của Laravel (422 Validation Error)
            if (err.response?.status === 422 && err.response?.data?.errors) {
                // Gom tất cả các lỗi chi tiết lại thành 1 chuỗi để hiển thị
                const detailedErrors = Object.values(err.response.data.errors).flat().join(' | ');
                setErrorMsg(`Lỗi dữ liệu: ${detailedErrors}`);
            } else {
                setErrorMsg(err.response?.data?.message || err.message || "Đã xảy ra lỗi hệ thống"); 
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container-fluid mt-4 font-sans text-gray-800">
            <div className="bg-white rounded shadow-sm mb-4 border-none max-w-4xl mx-auto">
                <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-[#f8f9fc]">
                    <h5 className="m-0 font-bold text-[#4e73df] text-lg">
                        {isEditMode ? `Cập Nhật Hãng: ${formData.tenHang}` : 'Thêm Hãng Hàng Không Mới'}
                    </h5>
                    <Link to="/admin/hang-hang-khong" className="text-sm bg-[#858796] hover:bg-[#717384] transition text-white px-3 py-1.5 rounded flex items-center shadow-sm">
                        <FaArrowLeft className="mr-1"/> Quay lại
                    </Link>
                </div>

                <div className="p-5">
                    {errorMsg && <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded text-sm">{errorMsg}</div>}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Tên Hãng <span className="text-red-500">*</span>
                            </label>
                            <input type="text" name="tenHang" value={formData.tenHang} onChange={handleChange} placeholder="VD: Vietnam Airlines" className="w-full p-2.5 border border-gray-300 rounded focus:border-[#4e73df] focus:ring-1 focus:ring-[#4e73df] outline-none" required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    Mã Code (Viết tắt) <span className="text-red-500">*</span>
                                </label>
                                <input type="text" name="maCode" value={formData.maCode} onChange={handleChange} placeholder="VD: VN, VJ" className="w-full p-2.5 border border-gray-300 rounded focus:border-[#4e73df] focus:ring-1 focus:ring-[#4e73df] outline-none" required />
                                <small className="text-gray-500 mt-1 block">Mã này sẽ dùng để tạo mã chuyến bay.</small>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Logo Hãng</label>
                                {/* Thẻ input file */}
                                <input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2 border border-gray-300 rounded text-sm cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                
                                {/* Hiển thị ảnh preview nếu có */}
                                {logoPreview && (
                                    <div className="mt-3">
                                        <span className="text-xs text-gray-500 block mb-1">Logo hiện tại:</span>
                                        <img src={logoPreview} alt="Preview" className="h-16 object-contain border p-1 rounded bg-gray-50" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Ghi Chú</label>
                            <textarea name="ghiChu" value={formData.ghiChu} onChange={handleChange} rows="3" className="w-full p-2.5 border border-gray-300 rounded focus:border-[#4e73df] outline-none"></textarea>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Trạng Thái</label>
                            <select 
                                name="trangThai" 
                                value={(formData.trangThai === 1 || formData.trangThai === '1' || formData.trangThai === true || formData.trangThai === 'true') ? 1 : 0} 
                                onChange={(e) => setFormData(prev => ({ ...prev, trangThai: Number(e.target.value) }))} 
                                className="w-full p-2.5 border border-gray-300 rounded focus:border-[#4e73df] outline-none"
                            >
                                <option value={1}>Hoạt động</option>
                                <option value={0}>Tạm ngừng</option>
                            </select>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-200">
                            <button type="submit" disabled={isLoading} className={`px-5 py-2 text-sm font-bold text-white rounded shadow-sm flex items-center transition disabled:opacity-50 ${isEditMode ? 'bg-[#f6c23e] hover:bg-[#dda20a]' : 'bg-[#4e73df] hover:bg-[#2e59d9]'}`}>
                                {isLoading ? 'Đang xử lý...' : (isEditMode ? <><FaEdit className="mr-1.5"/> Cập Nhật</> : <><FaSave className="mr-1.5"/> Lưu Lại</>)}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default HangHangKhongForm;