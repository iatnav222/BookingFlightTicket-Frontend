import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { priceApi } from '../../../services/GiaveApi';

const GiaveForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        maChuyenBay: '',
        giaCoBan: 0,
        loaiGhe: 'Economy'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await priceApi.capNhatGia(id, formData);
            alert('Cập nhật giá thành công!');
            navigate('/admin/gia-ve');
        } catch (err) {
            alert('Lỗi khi lưu giá!');
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4 text-[#4e73df]">Điều Chỉnh Giá Vé</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-1">Giá cơ bản (VNĐ)</label>
                    <input 
                        type="number" 
                        className="w-full p-2 border rounded"
                        value={formData.giaCoBan}
                        onChange={(e) => setFormData({...formData, giaCoBan: e.target.value})}
                    />
                </div>
                <button type="submit" className="bg-[#4e73df] text-white px-4 py-2 rounded font-bold w-full">
                    Xác nhận thay đổi
                </button>
            </form>
        </div>
    );
};

export default GiaveForm;