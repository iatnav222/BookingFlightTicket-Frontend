import api from '../api';

export const accountApi = {
    getDanhSach: async (filters = {}) => {
        const response = await api.get('/api/admin/tai-khoan', { params: filters });
        return response.data;
    },
    getLoaiTaiKhoan: async () => {
        const response = await api.get('/api/admin/loai-tai-khoan');
        return response.data;
    },
    capNhatTaiKhoan: async (id, data) => {
        const response = await api.put(`/api/admin/tai-khoan/${id}`, data);
        return response.data;
    },
    xoaTaiKhoan: async (id) => {
        const response = await api.delete(`/api/admin/tai-khoan/${id}`);
        return response.data;
    }
};