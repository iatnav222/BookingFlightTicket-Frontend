import api from '../api';

export const chuyenBayApi = {
    // 1. Lấy danh sách chuyến bay
    getDanhSach: async (filters = {}) => {
        const response = await api.get('/api/admin/chuyen-bay', { params: filters });
        return response.data;
    },

    // 2. Thêm mới
    themChuyenBay: async (data) => {
        validateChuyenBay(data);
        const response = await api.post('/api/admin/chuyen-bay', data);
        return response.data;
    },

    // 3. Chi tiết
    getChiTiet: async (id) => {
        const response = await api.get(`/api/admin/chuyen-bay/${id}`);
        return response.data;
    },

    // 4. Cập nhật
    capNhatChuyenBay: async (id, data) => {
        validateChuyenBay(data);
        const response = await api.put(`/api/admin/chuyen-bay/${id}`, data);
        return response.data;
    },

    // 5. Xóa
    xoaChuyenBay: async (id) => {
        const response = await api.delete(`/api/admin/chuyen-bay/${id}`);
        return response.data;
    },

    // Các hàm lấy dữ liệu danh mục cho Select box
    getHangHangKhong: async () => {
        const response = await api.get('/api/admin/hang-bay');
        return response.data;
    },
    getMayBay: async () => {
        const response = await api.get('/api/admin/may-bay'); 
        return response.data;
    },
    getSanBay: async () => {
        const response = await api.get('/api/admin/san-bay');
        return response.data;
    }
};

const validateChuyenBay = (data) => {
    if (data.maSanBayDi && data.maSanBayDen && data.maSanBayDi === data.maSanBayDen) {
        throw new Error("Sân bay đến không được trùng với sân bay đi.");
    }
    if (data.ngayGioCatCanh && data.ngayGioHaCanh) {
        if (new Date(data.ngayGioHaCanh) <= new Date(data.ngayGioCatCanh)) {
            throw new Error("Thời gian hạ cánh phải sau thời gian cất cánh.");
        }
    }
};