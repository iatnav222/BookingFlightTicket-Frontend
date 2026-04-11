import api from '../api';

export const accountApi = {
    


    getDanhSach: async (filters = {}) => {
        const res = await api.get('/api/admin/tai-khoan', { params: filters });
        return res.data;
    },

    getChiTiet: async (id) => {
        const res = await api.get(`/api/admin/tai-khoan/${id}`);
        return res.data;
    },

    tao: async (data) => {
        const res = await api.post('/api/admin/tai-khoan', data);
        return res.data;
    },

    capNhat: async (id, data) => {
        const res = await api.put(`/api/admin/tai-khoan/${id}`, data);
        return res.data;
    },

    xoa: async (id) => {
        const res = await api.delete(`/api/admin/tai-khoan/${id}`);
        return res.data;
    }
};