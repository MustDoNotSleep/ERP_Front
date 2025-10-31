import api from './axios.js';

/**
 * 특정 직원의 병역 정보 조회
 */
export const fetchMilitaryServiceByEmployeeId = async (employeeId) => {
  try {
    const response = await api.get(`/military-service/employee/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error('병역 정보 조회 실패:', error);
    throw error;
  }
};

/**
 * 병역 정보 생성
 */
export const createMilitaryService = async (employeeId, militaryData) => {
  try {
    const response = await api.post(`/military-service/employee/${employeeId}`, militaryData);
    return response.data;
  } catch (error) {
    console.error('병역 정보 생성 실패:', error);
    throw error;
  }
};

/**
 * 병역 정보 수정
 */
export const updateMilitaryService = async (id, militaryData) => {
  try {
    const response = await api.put(`/military-service/${id}`, militaryData);
    return response.data;
  } catch (error) {
    console.error('병역 정보 수정 실패:', error);
    throw error;
  }
};

/**
 * 병역 정보 삭제
 */
export const deleteMilitaryService = async (id) => {
  try {
    const response = await api.delete(`/military-service/${id}`);
    return response.data;
  } catch (error) {
    console.error('병역 정보 삭제 실패:', error);
    throw error;
  }
};
