import axios from 'axios'; 
const API_BASE_URL = 'https://xtjea0rsb6.execute-api.ap-northeast-2.amazonaws.com/dev';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    // 모든 요청에 기본적으로 JSON 형식을 사용한다고 명시합니다.
    'Content-Type': 'application/json',
  },
});

// ✅ Interceptor를 사용하면 토큰 자동 추가 등의 작업을 할 수 있지만, 
// 지금은 로그인 기능만 먼저 만들어 볼게요! 🐥

export default api;