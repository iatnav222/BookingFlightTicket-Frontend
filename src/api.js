import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://bookingflightticket-backend-new.onrender.com', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// THÊM INTERCEPTOR NÀY
axiosClient.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage
    const token = localStorage.getItem('token');
    
    // Nếu có token, đính kèm vào header Authorization
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;