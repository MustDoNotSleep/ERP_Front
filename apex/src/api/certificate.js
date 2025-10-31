import api from './axios';

/**
 * 특정 직원의 자격증(자격면허) 정보 조회
 * GET /certificates/employee/{employeeId}
 * @param {number} employeeId - 직원 ID
 * @returns {Promise<object>} 자격증 목록
 */
export const fetchCertificatesByEmployeeId = async (employeeId) => {
  try {
    const response = await api.get(`/certificates/employee/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error('자격증 정보 조회 실패:', error);
    throw error;
  }
};

/**
 * 자격증 정보 생성
 * POST /certificates/employee/{employeeId}
 * @param {number} employeeId - 직원 ID
 * @param {object} certificateData - 자격증 정보
 * @returns {Promise<object>} 생성된 자격증 정보
 */
export const createCertificateRecord = async (employeeId, certificateData) => {
  try {
    const response = await api.post(`/certificates/employee/${employeeId}`, certificateData);
    return response.data;
  } catch (error) {
    console.error('자격증 정보 생성 실패:', error);
    throw error;
  }
};

/**
 * 자격증 정보 수정
 * PUT /certificates/{id}
 * @param {number} id - 자격증 ID
 * @param {object} certificateData - 수정할 자격증 정보
 * @returns {Promise<object>} 수정된 자격증 정보
 */
export const updateCertificateRecord = async (id, certificateData) => {
  try {
    const response = await api.put(`/certificates/${id}`, certificateData);
    return response.data;
  } catch (error) {
    console.error('자격증 정보 수정 실패:', error);
    throw error;
  }
};

/**
 * 자격증 정보 삭제
 * DELETE /certificates/{id}
 * @param {number} id - 자격증 ID
 * @returns {Promise<object>} 삭제 결과
 */
export const deleteCertificateRecord = async (id) => {
  try {
    const response = await api.delete(`/certificates/${id}`);
    return response.data;
  } catch (error) {
    console.error('자격증 정보 삭제 실패:', error);
    throw error;
  }
};

/**
 * 증명서 목록 조회
 * GET /certificates
 * @param {number} page - 페이지 번호
 * @param {number} size - 페이지 크기
 * @returns {Promise<object>} 증명서 목록
 */
export const fetchCertificates = async (page = 0, size = 20) => {
    try {
        const response = await api.get('/certificates', {
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching certificates:', error);
        throw error;
    }
};

/**
 * 특정 직원의 증명서 목록 조회
 * GET /certificates/employee/{employeeId}
 * @param {number} employeeId - 직원 ID
 * @param {number} page - 페이지 번호
 * @param {number} size - 페이지 크기
 * @returns {Promise<object>} 직원의 증명서 목록
 */
export const fetchEmployeeCertificates = async (employeeId, page = 0, size = 20) => {
    try {
        const response = await api.get(`/certificates/employee/${employeeId}`, {
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching certificates for employee ${employeeId}:`, error);
        throw error;
    }
};

/**
 * 증명서 상세 정보 조회
 * GET /certificates/{certificateId}
 * @param {number} certificateId - 증명서 ID
 * @returns {Promise<object>} 증명서 상세 정보
 */
export const fetchCertificateById = async (certificateId) => {
    try {
        const response = await api.get(`/certificates/${certificateId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching certificate ${certificateId}:`, error);
        throw error;
    }
};

/**
 * 증명서 발급 신청
 * POST /certificates
 * @param {object} certificateData - 증명서 정보 (employeeId, certificateType, purpose 등)
 * @returns {Promise<object>} 생성된 증명서 정보
 */
export const createCertificate = async (certificateData) => {
    try {
        const response = await api.post('/certificates', certificateData);
        return response.data;
    } catch (error) {
        console.error('Error creating certificate:', error);
        throw error;
    }
};

/**
 * 증명서 수정
 * PUT /certificates/{certificateId}
 * @param {number} certificateId - 증명서 ID
 * @param {object} certificateData - 수정할 증명서 정보
 * @returns {Promise<object>} 수정된 증명서 정보
 */
export const updateCertificate = async (certificateId, certificateData) => {
    try {
        const response = await api.put(`/certificates/${certificateId}`, certificateData);
        return response.data;
    } catch (error) {
        console.error('Error updating certificate:', error);
        throw error;
    }
};

/**
 * 증명서 삭제
 * DELETE /certificates/{certificateId}
 * @param {number} certificateId - 증명서 ID
 * @returns {Promise<object>} 삭제 결과
 */
export const deleteCertificate = async (certificateId) => {
    try {
        const response = await api.delete(`/certificates/${certificateId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting certificate:', error);
        throw error;
    }
};

/**
 * 증명서 발급 승인
 * PATCH /certificates/{certificateId}/approve
 * @param {number} certificateId - 증명서 ID
 * @returns {Promise<object>} 승인된 증명서 정보
 */
export const approveCertificate = async (certificateId) => {
    try {
        const response = await api.patch(`/certificates/${certificateId}/approve`);
        return response.data;
    } catch (error) {
        console.error('Error approving certificate:', error);
        throw error;
    }
};

/**
 * 증명서 발급 반려
 * PATCH /certificates/{certificateId}/reject
 * @param {number} certificateId - 증명서 ID
 * @param {string} reason - 반려 사유
 * @returns {Promise<object>} 반려된 증명서 정보
 */
export const rejectCertificate = async (certificateId, reason) => {
    try {
        const response = await api.patch(`/certificates/${certificateId}/reject`, { reason });
        return response.data;
    } catch (error) {
        console.error('Error rejecting certificate:', error);
        throw error;
    }
};

/**
 * 증명서 다운로드
 * GET /certificates/{certificateId}/download
 * @param {number} certificateId - 증명서 ID
 * @returns {Promise<Blob>} 증명서 파일
 */
export const downloadCertificate = async (certificateId) => {
    try {
        const response = await api.get(`/certificates/${certificateId}/download`, {
            responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        console.error('Error downloading certificate:', error);
        throw error;
    }
};
