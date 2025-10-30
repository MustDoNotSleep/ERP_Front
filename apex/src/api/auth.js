import api from "./axios";

/**
 * 로그인 요청을 처리하는 함수입니다.
 * @param {string} email 사용자 이메일
 * @param {string} password 사용자 비밀번호
 * @returns {Promise<object>} 서버에서 받은 응답 데이터 (accessToken, refreshToken, user 정보 포함)
 */
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { 
      email: email, 
      password: password 
    });
    
    const data = response.data;
    
    // 토큰을 localStorage에 저장
    if (data.accessToken) {
      localStorage.setItem('token', data.accessToken);
    }
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    
    // 사용자 정보 저장
    if (data.employeeId) {
      const userInfo = {
        employeeId: data.employeeId,
        name: data.name,
        email: data.email,
        role: data.role,
        department: data.department,
        position: data.position,
        teamName: data.department // teamName으로도 사용
      };
      localStorage.setItem('user', JSON.stringify(userInfo));
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * 로그아웃 함수
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

/**
 * 현재 로그인한 사용자 정보 가져오기
 * @returns {object|null} 사용자 정보 또는 null
 */
export const getCurrentUser = () => {
  const userInfo = localStorage.getItem('user');
  return userInfo ? JSON.parse(userInfo) : null;
};

/**
 * 토큰 가져오기
 * @returns {string|null} 액세스 토큰
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * 로그인 상태 확인
 * @returns {boolean} 로그인 여부
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};