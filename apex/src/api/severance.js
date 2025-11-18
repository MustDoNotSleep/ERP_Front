/**
 * 퇴직금 관련 API
 * Severance Pay Management API
 */

import api from './axios';

/**
 * 특정 직원의 퇴직금 계산 (오늘 기준)
 * @param {number} employeeId - 직원 ID
 * @returns {Promise} 퇴직금 계산 결과
 */
export const fetchSeveranceByEmployee = async (employeeId) => {
  const response = await api.get(`/api/severance/employee/${employeeId}`);
  return response.data;
};

/**
 * 특정 직원의 퇴직금 계산 (기준일 지정)
 * @param {number} employeeId - 직원 ID
 * @param {string} severanceDate - 기준일 (YYYY-MM-DD)
 * @returns {Promise} 퇴직금 계산 결과
 */
export const fetchSeveranceByDate = async (employeeId, severanceDate) => {
  const response = await api.get(`/api/severance/employee/${employeeId}/by-date`, {
    params: { severanceDate }
  });
  return response.data;
};

/**
 * 퇴직금 계산 (POST 방식)
 * @param {Object} data - { employeeId, severanceDate }
 * @returns {Promise} 퇴직금 계산 결과
 */
export const calculateSeverancePay = async (data) => {
  const response = await api.post('/api/severance/calculate', data);
  return response.data;
};

/**
 * 전체 직원 예상 퇴직금 조회
 * @returns {Promise<Array>} 전체 직원의 예상 퇴직금 목록
 */
export const fetchAllSeverance = async () => {
  const response = await api.get('/api/severance/all');
  return response.data;
};

/**
 * 퇴직자 목록 및 퇴직금 조회
 * @param {number|null} year - 퇴직 연도 (선택)
 * @returns {Promise<Array>} 퇴직자 목록 및 퇴직금
 */
export const fetchRetirementSeverance = async (year = null) => {
  const params = year ? { year } : {};
  const response = await api.get('/api/severance/retirements', { params });
  return response.data;
};
