import api from '../api';
export const sanBayApi = {
    // Admin
    getDanhSach: (params) => api.get('/api/admin/san-bay', { params }),
    getChiTiet: (id) => api.get(`/api/admin/san-bay/${id}`),
    themSanBay: (data) => api.post('/api/admin/san-bay', data),
    capNhatSanBay: (id, data) => api.post(`/api/admin/san-bay/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    xoaSanBay: (id) => api.delete(`/api/admin/san-bay/${id}`),

    // Client
    getDanhSachClient: (params) => api.get('/api/client/san-bay', { params })
};