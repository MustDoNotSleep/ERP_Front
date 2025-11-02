import api from './axios.js';

/**
 * 전체 직원의 경력 정보 조회
 * GET /work-experiences
 * @returns {Promise<object>} 전체 경력 정보 목록
 */
export const fetchAllWorkExperiences = async () => {
  try {
    const response = await api.get('/work-experiences');
    return response.data;
  } catch (error) {
    console.error('전체 경력 정보 조회 실패:', error);
    throw error;
  }
};

/**
 * 특정 직원의 경력 정보 조회
 */
export const fetchWorkExperiencesByEmployeeId = async (employeeId) => {
  try {
    const response = await api.get(`/work-experiences/employee/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error('경력 정보 조회 실패:', error);
    throw error;
  }
};

/**
 * 경력 정보 생성
 */
export const createWorkExperience = async (employeeId, workExperienceData) => {
  try {
    const response = await api.post(`/work-experiences/employee/${employeeId}`, workExperienceData);
    return response.data;
  } catch (error) {
    console.error('경력 정보 생성 실패:', error);
    throw error;
  }
};

/**
 * 경력 정보 수정
 */
export const updateWorkExperience = async (id, workExperienceData) => {
  try {
    const response = await api.put(`/work-experiences/${id}`, workExperienceData);
    return response.data;
  } catch (error) {
    console.error('경력 정보 수정 실패:', error);
    throw error;
  }
};

/**
 * 경력 정보 삭제
 */
export const deleteWorkExperience = async (id) => {
  try {
    const response = await api.delete(`/work-experiences/${id}`);
    return response.data;
  } catch (error) {
    console.error('경력 정보 삭제 실패:', error);
    throw error;
  }
};
