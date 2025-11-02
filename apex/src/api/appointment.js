import api from './axios';

/**
 * 인사발령 요청 목록 조회
 * GET /appointment-requests
 * @param {number} page - 페이지 번호
 * @param {number} size - 페이지 크기
 * @param {string} status - 상태 필터 (PENDING, APPROVED, REJECTED)
 * @returns {Promise<object>} 인사발령 요청 목록
 */
export const fetchAppointmentRequests = async (page = 0, size = 20, status = null) => {
    try {
        const params = { page, size };
        if (status) params.status = status;
            
        const response = await api.get('/appointment-requests', { params });        
        return response.data;
    } catch (error) {
        console.error('❌ Error fetching appointment requests:', error);
        console.error('❌ Error details:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            url: error.config?.url
        });
        throw error;
    }
};

/**
 * 특정 직원의 인사발령 요청 목록 조회
 * GET /appointment-requests/employee/{employeeId}
 * @param {number} employeeId - 직원 ID
 * @param {number} page - 페이지 번호
 * @param {number} size - 페이지 크기
 * @returns {Promise<object>} 직원의 인사발령 요청 목록
 */
export const fetchEmployeeAppointmentRequests = async (employeeId, page = 0, size = 20) => {
    try {
        const response = await api.get(`/appointment-requests/employee/${employeeId}`, {
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching appointment requests for employee ${employeeId}:`, error);
        throw error;
    }
};

/**
 * 인사발령 요청 상세 조회
 * GET /appointment-requests/{requestId}
 * @param {number} requestId - 인사발령 요청 ID
 * @returns {Promise<object>} 인사발령 요청 상세 정보
 */
export const fetchAppointmentRequestById = async (requestId) => {
    try {
        const response = await api.get(`/appointment-requests/${requestId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching appointment request ${requestId}:`, error);
        throw error;
    }
};

/**
 * 인사발령 요청 생성
 * POST /appointment-requests
 * @param {object} requestData - 인사발령 요청 정보
 * @returns {Promise<object>} 생성된 인사발령 요청 정보
 */
export const createAppointmentRequest = async (requestData) => {
    try {
        const response = await api.post('/appointment-requests', requestData);
        return response.data;
    } catch (error) {
        console.error('Error creating appointment request:', error);
        throw error;
    }
};

/**
 * 인사발령 요청 수정
 * PUT /appointment-requests/{requestId}
 * @param {number} requestId - 인사발령 요청 ID
 * @param {object} requestData - 수정할 인사발령 요청 정보
 * @returns {Promise<object>} 수정된 인사발령 요청 정보
 */
export const updateAppointmentRequest = async (requestId, requestData) => {
    try {
        const response = await api.put(`/appointment-requests/${requestId}`, requestData);
        return response.data;
    } catch (error) {
        console.error('Error updating appointment request:', error);
        throw error;
    }
};

/**
 * 인사발령 요청 삭제
 * DELETE /appointment-requests/{requestId}
 * @param {number} requestId - 인사발령 요청 ID
 * @returns {Promise<object>} 삭제 결과
 */
export const deleteAppointmentRequest = async (requestId) => {
    try {
        const response = await api.delete(`/appointment-requests/${requestId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting appointment request:', error);
        throw error;
    }
};

/**
 * 인사발령 승인/반려 (통합)
 * PUT /appointment-requests/{requestId}/approval
 * @param {number} requestId - 인사발령 요청 ID
 * @param {boolean} approved - true: 승인, false: 반려
 * @param {string} comment - 승인/반려 코멘트
 * @returns {Promise<object>} 처리된 인사발령 요청 정보
 */
export const approveOrRejectAppointmentRequest = async (requestId, approved, comment = '') => {
    try {
        const payload = {
            approved: approved,
            comment: comment
        };
        
        console.log('🔍 인사발령 승인/반려 API 호출:', {
            endpoint: `/appointment-requests/${requestId}/approval`,
            method: 'PUT',
            payload,
            '⚠️ approved 값': approved,
            '⚠️ approved 타입': typeof approved
        });
        
        const response = await api.put(`/appointment-requests/${requestId}/approval`, payload);
        
        return response.data;
    } catch (error) {
        console.error('❌ Error processing appointment request:', error);
        console.error('❌ Error details:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            url: error.config?.url,
            method: error.config?.method,
            requestData: error.config?.data
        });
        throw error;
    }
};

/**
 * 인사발령 승인 (편의 함수)
 * PUT /appointment-requests/{requestId}/approval
 * @param {number} requestId - 인사발령 요청 ID
 * @param {string} approverComment - 승인자 코멘트
 * @returns {Promise<object>} 승인된 인사발령 요청 정보
 */
export const approveAppointmentRequest = async (requestId, approverComment = '') => {
    console.log('✅ approveAppointmentRequest 함수 호출 - approved: true 전송');
    return approveOrRejectAppointmentRequest(requestId, true, approverComment);
};

/**
 * 인사발령 반려 (편의 함수)
 * PUT /appointment-requests/{requestId}/approval
 * @param {number} requestId - 인사발령 요청 ID
 * @param {string} approverComment - 반려 사유
 * @returns {Promise<object>} 반려된 인사발령 요청 정보
 */
export const rejectAppointmentRequest = async (requestId, approverComment) => {
    console.log('❌ rejectAppointmentRequest 함수 호출 - approved: false 전송');
    return approveOrRejectAppointmentRequest(requestId, false, approverComment);
};
