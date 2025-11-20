// src/api/retirement.js
import api from './axios';

/**
 * 퇴직 신청 관련 API
 */

// 퇴직 신청 목록 조회 (관리자용, 페이징)
export const fetchRetirementRequests = async (params = {}) => {
  const response = await api.get('/api/resignations', { params });
  return response.data;
};

// 특정 퇴직 신청 상세 조회
export const fetchRetirementById = async (retirementId) => {
  const response = await api.get(`/api/resignations/${retirementId}`);
  return response.data;
};

// 특정 직원의 퇴직 신청 조회
export const fetchRetirementByEmployeeId = async (employeeId) => {
  const response = await api.get(`/api/resignations/employee/${employeeId}`);
  return response.data;
};

// 상태별 퇴직 신청 조회
export const fetchRetirementsByStatus = async (status) => {
  const response = await api.get(`/api/resignations/status/${status}`);
  return response.data;
};

// 퇴직 신청 생성
export const createRetirementRequest = async (retirementData) => {
  const response = await api.post('/api/resignations', retirementData);
  return response.data;
};

// 퇴직 신청 승인/반려 처리
export const processRetirement = async (retirementId, approvalData) => {
  const response = await api.put(`/api/resignations/${retirementId}/process`, approvalData);
  return response.data;
};

// 퇴직 신청 취소 (신청자만, PENDING 상태만)
export const cancelRetirementRequest = async (retirementId) => {
  const response = await api.put(`/api/resignations/${retirementId}/cancel`);
  return response.data;
};

// 퇴직 신청 삭제 (관리자만)
export const deleteRetirement = async (retirementId) => {
  const response = await api.delete(`/api/resignations/${retirementId}`);
  return response.data;
};

// 퇴직 신청 통계 조회
export const fetchRetirementStatistics = async () => {
  const response = await api.get('/api/resignations/statistics');
  return response.data;
};

