import api from './axios';

/**
 * 휴가 목록 조회
 * GET /leaves
 * @param {number} page - 페이지 번호
 * @param {number} size - 페이지 크기
 * @param {string} status - 휴가 상태 필터 (PENDING, APPROVED, REJECTED)
 * @returns {Promise<object>} 페이징된 휴가 목록
 */
export const fetchLeaves = async (page = 0, size = 20, status = null) => {
    try {
        const params = { page, size };
        if (status) params.status = status;
        
        const response = await api.get('/leaves', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching leaves:', error);
        throw error;
    }
};

/**
 * 특정 직원의 휴가 목록 조회
 * GET /leaves/employee/{employeeId}
 * @param {number} employeeId - 직원 ID
 * @param {number} page - 페이지 번호
 * @param {number} size - 페이지 크기
 * @returns {Promise<object>} 직원의 휴가 목록
 */
export const fetchEmployeeLeaves = async (employeeId, page = 0, size = 20) => {
    try {
        const response = await api.get(`/leaves/employee/${employeeId}`, {
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching leaves for employee ${employeeId}:`, error);
        throw error;
    }
};

/**
 * 휴가 상세 정보 조회
 * GET /leaves/{leaveId}
 * @param {number} leaveId - 휴가 ID
 * @returns {Promise<object>} 휴가 상세 정보
 */
export const fetchLeaveById = async (leaveId) => {
    try {
        const response = await api.get(`/leaves/${leaveId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching leave ${leaveId}:`, error);
        throw error;
    }
};

/**
 * 휴가 신청
 * POST /leaves
 * @param {object} leaveData - 휴가 정보 (employeeId, leaveType, startDate, endDate, reason 등)
 * @returns {Promise<object>} 생성된 휴가 정보
 */
export const createLeave = async (leaveData) => {
    try {
        const response = await api.post('/leaves', leaveData);
        return response.data;
    } catch (error) {
        console.error('Error creating leave:', error);
        throw error;
    }
};

/**
 * 휴가 수정
 * PUT /leaves/{leaveId}
 * @param {number} leaveId - 휴가 ID
 * @param {object} leaveData - 수정할 휴가 정보
 * @returns {Promise<object>} 수정된 휴가 정보
 */
export const updateLeave = async (leaveId, leaveData) => {
    try {
        const response = await api.put(`/leaves/${leaveId}`, leaveData);
        return response.data;
    } catch (error) {
        console.error('Error updating leave:', error);
        throw error;
    }
};

/**
 * 휴가 취소
 * DELETE /leaves/{leaveId}
 * @param {number} leaveId - 휴가 ID
 * @returns {Promise<object>} 삭제 결과
 */
export const deleteLeave = async (leaveId) => {
    try {
        const response = await api.delete(`/leaves/${leaveId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting leave:', error);
        throw error;
    }
};

/**
 * 휴가 승인
 * PATCH /leaves/{leaveId}/approve
 * @param {number} leaveId - 휴가 ID
 * @param {string} approverComment - 승인자 코멘트 (선택)
 * @returns {Promise<object>} 승인된 휴가 정보
 */
export const approveLeave = async (leaveId, approverComment = '') => {
    try {
        const response = await api.patch(`/leaves/${leaveId}/approve`, { approverComment });
        return response.data;
    } catch (error) {
        console.error('Error approving leave:', error);
        throw error;
    }
};

/**
 * 휴가 반려
 * PATCH /leaves/{leaveId}/reject
 * @param {number} leaveId - 휴가 ID
 * @param {string} approverComment - 반려 사유
 * @returns {Promise<object>} 반려된 휴가 정보
 */
export const rejectLeave = async (leaveId, approverComment) => {
    try {
        const response = await api.patch(`/leaves/${leaveId}/reject`, { approverComment });
        return response.data;
    } catch (error) {
        console.error('Error rejecting leave:', error);
        throw error;
    }
};

/**
 * 직원의 휴가 잔여일 조회
 * GET /leaves/employee/{employeeId}/balance
 * @param {number} employeeId - 직원 ID
 * @returns {Promise<object>} 휴가 잔여일 정보
 */
export const fetchLeaveBalance = async (employeeId) => {
    try {
        const response = await api.get(`/leaves/employee/${employeeId}/balance`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching leave balance for employee ${employeeId}:`, error);
        throw error;
    }
};
