import axios from 'axios'; 
const API_BASE_URL = 'http://13.124.242.117:8080/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    // 모든 요청에 기본적으로 JSON 형식을 사용한다고 명시합니다.
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;