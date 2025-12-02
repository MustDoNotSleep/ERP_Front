import api from './axios';

// RewardDto 구조 참고
// {
//   rewardId, rewardDate, rewardType, rewardItem, rewardValue, reason, status,
//   employeeId, approverId,
//   employeeName, departmentName, positionName, approverName, approvedAt, createdAt
// }

// 포상 목록 조회 (검색 필터)
export const fetchRewards = async (params) => {
  // params: { startDate, endDate, empName, deptName, status }
  const response = await api.get('/hr/rewards', { params });
  return response.data; // RewardDto[]
};

// 포상 등록
export const createReward = async (rewardDto) => {
  // rewardDto: { employeeId, rewardDate, rewardType, rewardItem, rewardValue, reason }
  const response = await api.post('/hr/rewards', rewardDto);
  return response.data;
};

// 포상 승인
export const approveReward = async (rewardId) => {
  const response = await api.put(`/hr/rewards/${rewardId}/approve`);
  return response.data;
};

// 포상 반려
export const rejectReward = async (rewardId) => {
  const response = await api.put(`/hr/rewards/${rewardId}/reject`);
  return response.data;
};

// 포상 삭제
export const deleteReward = async (rewardId) => {
  const response = await api.delete(`/hr/rewards/${rewardId}`);
  return response.data;
};
