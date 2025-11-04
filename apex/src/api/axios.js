import axios from 'axios'; 
// EC2 연결
// const API_BASE_URL = 'http://15.164.75.26:8080/api';

// 로컬 연결
const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    // 모든 요청에 기본적으로 JSON 형식을 사용한다고 명시합니다.
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  
  // 로그인 요청은 토큰이 필요 없으므로 경고 제외
  const isLoginRequest = config.url?.includes('/auth/login');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (!isLoginRequest) {
    console.warn('⚠️ localStorage에 토큰이 없습니다. 로그인이 필요합니다.');
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// 응답 인터셉터 추가 (에러 처리)
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      console.error('❌ API 에러:', error.response.status, error.config?.url);
      if (error.response.status === 403) {
        console.error('🚫 403 Forbidden - 토큰이 만료되었거나 권한이 없습니다.');
        // 토큰 만료 시 로그인 페이지로 리다이렉트
        if (window.location.pathname !== '/login') {
          alert('세션이 만료되었습니다. 다시 로그인해주세요.');
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      console.error('❌ 서버 응답 없음:', error.message);
    } else {
      console.error('❌ 요청 설정 오류:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;