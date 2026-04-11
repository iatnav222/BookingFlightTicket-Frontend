import api from '../api'; // Giữ nguyên dòng này

export const mayBayApi = {
    // Kế thừa lại các hàm lấy danh mục
    getHangHangKhong() {
        return api.get('/api/admin/hang-hang-khong');
    },
    
    // CRUD Máy Bay
    getDanhSach(params) {
        return api.get('/api/admin/may-bay', { params });
    },
    getChiTiet(id) {
        return api.get(`/api/admin/may-bay/${id}`);
    },
    themMayBay(data) {
        return api.post('/api/admin/may-bay', data);
    },
    capNhatMayBay(id, data) {
        return api.put(`/api/admin/may-bay/${id}`, data);
    },
    xoaMayBay(id) {
        return api.delete(`/api/admin/may-bay/${id}`);
    }
};