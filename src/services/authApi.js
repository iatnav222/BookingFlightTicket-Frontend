import api from '../api'; // Import file cấu hình axios của bạn

export const authApi = {
    // Gọi API Đăng nhập
    login: async (data) => {
        // Thay đổi URL '/api/login' cho khớp với route trên Backend Laravel của bạn
        const response = await api.post('/api/login', data); 
        return response.data;
    },
    
    // Gọi API Đăng ký
    register: async (data) => {
        // Thay đổi URL '/api/register' cho khớp với route Backend
        const response = await api.post('/api/register', data);
        return response.data;
    }
};