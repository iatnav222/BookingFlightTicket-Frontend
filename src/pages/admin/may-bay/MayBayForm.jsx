import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaSave, FaEdit } from 'react-icons/fa';
import { mayBayApi } from '../../../services/mayBayApi';

const MayBayForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [errorMsg, setErrorMsg] = useState('');
    const [dsHang, setDsHang] = useState([]);
    
    // Tương ứng với các trường trong file blade của bạn
    const [formData, setFormData] = useState({
        tenMayBay: '',
        maHang: '',
        soGheTong: 180,
        loai: '',
        hangSanXuat: ''
    });

    useEffect(() => {
        // Lấy danh sách hãng hàng không
        mayBayApi.getHangHangKhong()
            .then(res => {
                if (res.data && res.data.data) {
                    setDsHang(res.data.data); 
                } else {
                    setDsHang([]);
                }
            })
            .catch(console.error);
        if (isEditMode) {
            // Fetch chi tiết máy bay để edit
            const fetchDetail = async () => {
                try {
                    const res = await mayBayApi.getChiTiet(id);
                    const data = res.data;
                    setFormData({ ...data });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        try {
            
            if (isEditMode) {
                await mayBayApi.capNhatMayBay(id, formData);
            } else {
                await mayBayApi.themMayBay(formData);
            }
            alert(`Thành công! Máy bay đã được ${isEditMode ? 'cập nhật' : 'thêm mới'}.`);
            navigate('/admin/may-bay');
        } catch (err) { 
            setErrorMsg(err.response?.data?.message || err.message || "Đã xảy ra lỗi"); 
        }
    };

    return (
        <div className="container-fluid mt-4 font-sans text-gray-800">
            <div className="bg-white rounded shadow-[0_0.15rem_1.75rem_0_rgba(58,59,69,0.15)] mb-4 border-none max-w-4xl mx-auto">
                <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-[#f8f9fc]">
                    <h5 className="m-0 font-bold text-[#4e73df] text-lg">
                        {isEditMode ? 'Cập Nhật Máy Bay' : 'Thêm Máy Bay Mới'}
                    </h5>
                </div>

                <div className="p-5">
                    {errorMsg && <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded text-sm">{errorMsg}</div>}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4">
                            {/* Dòng 1 */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    Tên Máy Bay <span className="text-red-500">*</span>
                                </label>
                                <input type="text" name="tenMayBay" value={formData.tenMayBay} onChange={handleChange} placeholder="VD: Airbus A321" className="w-full p-2.5 border border-gray-300 rounded focus:border-[#4e73df] focus:ring-1 focus:ring-[#4e73df] outline-none transition" required />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    Thuộc Hãng <span className="text-red-500">*</span>
                                </label>
                                <select name="maHang" value={formData.maHang} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded focus:border-[#4e73df] focus:ring-1 focus:ring-[#4e73df] outline-none transition" required>
                                    <option value="">-- Chọn Hãng --</option>
                                    {dsHang.map(hang => (
                                        <option key={hang.maHang} value={hang.maHang}>{hang.tenHang}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                            {/* Dòng 2 */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    Số Ghế Tổng <span className="text-red-500">*</span>
                                </label>
                                <input type="number" name="soGheTong" value={formData.soGheTong} onChange={handleChange} min="1" className="w-full p-2.5 border border-gray-300 rounded focus:border-[#4e73df] focus:ring-1 focus:ring-[#4e73df] outline-none transition" required />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Loại Máy Bay</label>
                                <input type="text" name="loai" value={formData.loai} onChange={handleChange} placeholder="VD: Thân hẹp" className="w-full p-2.5 border border-gray-300 rounded focus:border-[#4e73df] focus:ring-1 focus:ring-[#4e73df] outline-none transition" required />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Hãng Sản Xuất</label>
                                <input type="text" name="hangSanXuat" value={formData.hangSanXuat} onChange={handleChange} placeholder="VD: Airbus" className="w-full p-2.5 border border-gray-300 rounded focus:border-[#4e73df] focus:ring-1 focus:ring-[#4e73df] outline-none transition" />
                            </div>
                        </div>

                        <div className="flex justify-start mt-6 pt-4 border-t border-gray-200 gap-2">
                            <button type="submit" className={`px-5 py-2 text-sm font-bold text-white rounded shadow-sm flex items-center transition ${isEditMode ? 'bg-[#f6c23e] hover:bg-[#dda20a]' : 'bg-[#4e73df] hover:bg-[#2e59d9]'}`}>
                                {isEditMode ? <><FaEdit className="mr-1.5"/> Cập Nhật</> : <><FaSave className="mr-1.5"/> Lưu Lại</>}
                            </button>
                            <Link to="/admin/may-bay" className="px-5 py-2 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition shadow-sm">
                                Hủy
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MayBayForm;