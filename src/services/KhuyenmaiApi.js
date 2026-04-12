import axios from 'axios';
const API_URL = 'https://bookingflightticket-backend-new.onrender.com/api/admin';

export const promotionApi = {
    getDanhSach: (params) => axios.get(`${API_URL}/khuyen-mai`, { params }),
    getChiTiet: (id) => axios.get(`${API_URL}/khuyen-mai/${id}`),
    
    getTypes: () => axios.get(`${API_URL}/khuyen-mai/types`), 
    themKM: (data) => axios.post(`${API_URL}/khuyen-mai`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    
    capNhatKM: (id, data) => axios.post(`${API_URL}/khuyen-mai/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    xoaKM: (id) => axios.delete(`${API_URL}/khuyen-mai/${id}`),
};