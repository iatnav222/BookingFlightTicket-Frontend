import api from '../api';

export const orderApi = {
    getDanhSach: async (filters = {}) => {
        const response = await api.get('/api/admin/don-hang', { params: filters });
        return response.data;
    },
    xoaDonHang: async (id) => {
        const response = await api.delete(`/api/admin/don-hang/${id}`);
        return response.data;
    },
    // Thêm vào file orderApi.js của bạn
    getChiTiet: async (id) => {
        const response = await api.get(`/api/admin/don-hang/${id}`);
        return response.data;
    },
    capNhatDonHang: async (id, data) => {
        const response = await api.put(`/api/admin/don-hang/${id}`, data);
        return response.data;
    }
};