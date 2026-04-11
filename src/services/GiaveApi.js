import axios from 'axios';
const API_URL = 'https://bookingflightticket-backend-new.onrender.com/api/admin';

export const priceApi = {
    getDanhSach: (params) => axios.get(`${API_URL}/gia-ve`, { params }),
    getChiTiet: (id) => axios.get(`${API_URL}/gia-ve/${id}`),
    capNhatGia: (id, data) => axios.put(`${API_URL}/gia-ve/${id}`, data),
    getChuyenBay: () => axios.get(`${API_URL}/chuyen-bay`), 
};