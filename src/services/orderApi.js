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
    },

    // === API DÀNH CHO CLIENT (QUY TRÌNH ĐẶT VÉ) ===
    // Endpoint: POST /api/client/dat-ve/khoi-tao
    khoiTaoDonHang: async (data) => {
        const res = await api.post('/api/client/dat-ve/khoi-tao', data);
        return res.data; 
        // Lưu ý: Nếu lỗi 422, axios (trong api.js) sẽ ném lỗi, bạn cần try/catch ở UI
    },
    // Endpoint: POST /api/client/thanh-toan/vnpay
    taoUrlThanhToan: async (maDonHang, bankCode = "") => {
        const res = await api.post('/api/client/thanh-toan/vnpay', {
            maDonHang: maDonHang,
            bank_code: bankCode
        });
        return res.data;
    }
};