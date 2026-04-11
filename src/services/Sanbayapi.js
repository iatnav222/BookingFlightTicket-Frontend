import axios from 'axios';
// Nhớ thêm /admin vào sau /api
const API_URL = 'https://bookingflightticket-backend-new.onrender.com/api/admin';

export const sanBayApi = {
    getDanhSach: (params) => axios.get(`${API_URL}/san-bay`, { params }),
    getChiTiet: (id) => axios.get(`${API_URL}/san-bay/${id}`),
    themSanBay: (data) => axios.post(`${API_URL}/san-bay`, data),
    capNhatSanBay: (id, data) => axios.put(`${API_URL}/san-bay/${id}`, data),
    xoaSanBay: (id) => axios.delete(`${API_URL}/san-bay/${id}`),
};