import api from './axios';

/**
 * 문서 신청 목록 조회
 * GET /document-applications
 * @param {number} page - 페이지 번호
 * @param {number} size - 페이지 크기
 * @param {string} status - 상태 필터
 * @returns {Promise<object>} 문서 신청 목록
 */
export const fetchDocumentApplications = async (page = 0, size = 20, status = null) => {
    try {
        const params = { page, size };
        if (status) params.status = status;
        
        const response = await api.get('/document-applications', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching document applications:', error);
        throw error;
    }
};

/**
 * 특정 직원의 문서 신청 목록 조회
 * GET /document-applications/employee/{employeeId}
 * @param {number} employeeId - 직원 ID
 * @param {number} page - 페이지 번호
 * @param {number} size - 페이지 크기
 * @returns {Promise<object>} 직원의 문서 신청 목록
 */
export const fetchEmployeeDocumentApplications = async (employeeId, page = 0, size = 20) => {
    try {
        const response = await api.get(`/document-applications/employee/${employeeId}`, {
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching document applications for employee ${employeeId}:`, error);
        throw error;
    }
};

/**
 * 문서 신청 상세 조회
 * GET /document-applications/{applicationId}
 * @param {number} applicationId - 신청 ID
 * @returns {Promise<object>} 신청 상세 정보
 */
export const fetchDocumentApplicationById = async (applicationId) => {
    try {
        const response = await api.get(`/document-applications/${applicationId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching document application ${applicationId}:`, error);
        throw error;
    }
};

/**
 * 문서 신청 생성
 * POST /document-applications
 * @param {object} applicationData - 신청 정보
 * @returns {Promise<object>} 생성된 신청 정보
 */
export const createDocumentApplication = async (applicationData) => {
    try {
        const response = await api.post('/document-applications', applicationData);
        return response.data;
    } catch (error) {
        console.error('Error creating document application:', error);
        throw error;
    }
};

/**
 * 문서 신청 수정
 * PUT /document-applications/{applicationId}
 * @param {number} applicationId - 신청 ID
 * @param {object} applicationData - 수정할 신청 정보
 * @returns {Promise<object>} 수정된 신청 정보
 */
export const updateDocumentApplication = async (applicationId, applicationData) => {
    try {
        const response = await api.put(`/document-applications/${applicationId}`, applicationData);
        return response.data;
    } catch (error) {
        console.error('Error updating document application:', error);
        throw error;
    }
};

/**
 * 문서 신청 삭제
 * DELETE /document-applications/{applicationId}
 * @param {number} applicationId - 신청 ID
 * @returns {Promise<object>} 삭제 결과
 */
export const deleteDocumentApplication = async (applicationId) => {
    try {
        const response = await api.delete(`/document-applications/${applicationId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting document application:', error);
        throw error;
    }
};

/**
 * 문서 신청 승인
 * PATCH /document-applications/{applicationId}/approve
 * @param {number} applicationId - 신청 ID
 * @returns {Promise<object>} 승인된 신청 정보
 */
export const approveDocumentApplication = async (applicationId) => {
    try {
        const response = await api.patch(`/document-applications/${applicationId}/approve`);
        return response.data;
    } catch (error) {
        console.error('Error approving document application:', error);
        throw error;
    }
};

/**
 * 문서 신청 반려
 * PATCH /document-applications/{applicationId}/reject
 * @param {number} applicationId - 신청 ID
 * @param {string} reason - 반려 사유
 * @returns {Promise<object>} 반려된 신청 정보
 */
export const rejectDocumentApplication = async (applicationId, reason) => {
    try {
        const response = await api.patch(`/document-applications/${applicationId}/reject`, { reason });
        return response.data;
    } catch (error) {
        console.error('Error rejecting document application:', error);
        throw error;
    }
};
