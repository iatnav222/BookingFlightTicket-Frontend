import api from '../api';

export const orderApi = {
    // 1. Danh sách đơn hàng
    getDanhSach: async (filters = {}) => {
        const res = await api.get('/api/admin/don-hang', { params: filters });
        return res.data;
    },

    // 2. Chi tiết
    getChiTiet: async (id) => {
        const res = await api.get(`/api/admin/don-hang/${id}`);
        return res.data;
    },

    // 3. Cập nhật trạng thái
    capNhat: async (id, data) => {
        const res = await api.put(`/api/admin/don-hang/${id}`, data);
        return res.data;
    },

    // 4. Xóa
    xoa: async (id) => {
        const res = await api.delete(`/api/admin/don-hang/${id}`);
        return res.data;
    }
};