import axios from 'axios';
import { getToken } from './authStorage';

// Replace with your actual backend URL
// Use your machine's IP address if testing on a physical device or emulator
const BASE_URL = 'http://192.168.0.107:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
