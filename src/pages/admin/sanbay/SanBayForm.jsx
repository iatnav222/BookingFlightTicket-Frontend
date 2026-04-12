import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaSave, FaEdit } from 'react-icons/fa';
import { sanBayApi } from '../../../services/Sanbayapi'; 

const SanBayForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [errorMsg, setErrorMsg] = useState('');
    const [formData, setFormData] = useState({
        tenSanBay: '',
        thanhPho: '',
        quocGia: 'Việt Nam'
    });

    useEffect(() => {
        if (isEditMode) {
            sanBayApi.getChiTiet(id)
                .then(res => {
                    const data = res.data.data || res.data;
                    setFormData({
                        tenSanBay: data.tenSanBay || '',
                        thanhPho: data.thanhPho || '',
                        quocGia: data.quocGia || 'Việt Nam'
                    });
                })
                .catch(() => setErrorMsg('Lỗi tải dữ liệu sân bay!'));
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await sanBayApi.capNhatSanBay(id, formData);
            } else {
                await sanBayApi.themSanBay(formData);
            }
            alert('Thao tác thành công!');
            navigate('/admin/san-bay');
        } catch (err) {
            setErrorMsg(err.response?.data?.message || "Đã xảy ra lỗi");
        }
    };

    return (
        <div className="container-fluid mt-4 font-sans text-gray-800">
            <div className="bg-white rounded shadow-md mb-4 max-w-2xl mx-auto border-t-4 border-[#4e73df]">
                <div className="px-4 py-3 border-b flex justify-between items-center bg-[#f8f9fc]">
                    <h5 className="m-0 font-bold text-[#4e73df]">
                        {isEditMode ? 'Cập Nhật Sân Bay' : 'Thêm Sân Bay Mới'}
                    </h5>
                </div>
                <div className="p-5">
                    {errorMsg && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">{errorMsg}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-1">Tên Sân Bay</label>
                            <input type="text" name="tenSanBay" value={formData.tenSanBay} onChange={handleChange} className="w-full p-2 border rounded outline-none focus:ring-1 focus:ring-blue-500" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Thành Phố</label>
                                <input type="text" name="thanhPho" value={formData.thanhPho} onChange={handleChange} className="w-full p-2 border rounded" required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Quốc Gia</label>
                                <input type="text" name="quocGia" value={formData.quocGia} onChange={handleChange} className="w-full p-2 border rounded" required />
                            </div>
                        </div>
                        <div className="flex gap-2 pt-4 border-t">
                            <button type="submit" className="bg-[#4e73df] text-white px-4 py-2 rounded flex items-center text-sm font-bold">
                                {isEditMode ? <FaEdit className="mr-1"/> : <FaSave className="mr-1"/>} Lưu Lại
                            </button>
                            <Link to="/admin/san-bay" className="bg-gray-100 px-4 py-2 rounded text-sm font-bold">Hủy</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SanBayForm;