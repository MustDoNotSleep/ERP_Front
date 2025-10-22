import api from "./axios";

/**
 * 로그인 요청을 처리하는 함수입니다.
 * @param {string} email 사용자 이메일
 * @param {string} password 사용자 비밀번호
 * @returns {Promise<object>} 서버에서 받은 응답 데이터 (token, user 정보 포함)
 */
export const login = async (email, password) => {
  try {
    const response = await api.post('/login', { 
      email: email, 
      password: password 
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};