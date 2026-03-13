import axios from 'axios';
const API_BASE_URL = 'https://bookingflightticket-backend-production.up.railway.app';
const api = axios.create({
    baseURL: API_BASE_URL,
});
export default api;