import api from '../api'; // File cấu hình axios của bạn

export const hangHangKhongApi = {
    getDanhSach(params) {
        return api.get('/api/admin/hang-hang-khong', { params });
    },
    getChiTiet(id) {
        return api.get(`/api/admin/hang-hang-khong/${id}`);
    },
    themHang(data) {
        return api.post('/api/admin/hang-hang-khong', data, {
        });
    },
    // Laravel thường gặp lỗi khi nhận file qua phương thức PUT, 
    // Mẹo: Vẫn gửi POST nhưng kèm theo _method: 'PUT' trong FormData
    capNhatHang(id, data) {
        data.append('_method', 'PUT'); 
        return api.post(`/api/admin/hang-hang-khong/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    xoaHang(id) {
        return api.delete(`/api/admin/hang-hang-khong/${id}`);
    }
};