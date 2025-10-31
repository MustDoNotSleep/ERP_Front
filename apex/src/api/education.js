import api from './axios';

/**
 * 직원의 학력 정보 조회
 * GET /educations/employee/{employeeId}
 * @param {number} employeeId - 직원 ID
 * @returns {Promise<Array>} 학력 정보 목록
 */
export const fetchEducationsByEmployeeId = async (employeeId) => {
    try {
        const response = await api.get(`/educations/employee/${employeeId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching educations:', error);
        throw error;
    }
};

/**
 * 학력 정보 등록
 * POST /educations/employee/{employeeId}
 * @param {number} employeeId - 직원 ID
 * @param {object} educationData - 학력 정보
 * @returns {Promise<object>} 생성된 학력 정보
 */
export const createEducation = async (employeeId, educationData) => {
    try {
        const response = await api.post(`/educations/employee/${employeeId}`, educationData);
        return response.data;
    } catch (error) {
        console.error('Error creating education:', error);
        throw error;
    }
};

/**
 * 학력 정보 수정
 * PUT /educations/{id}
 * @param {number} id - 학력 ID
 * @param {object} educationData - 수정할 학력 정보
 * @returns {Promise<object>} 수정된 학력 정보
 */
export const updateEducation = async (id, educationData) => {
    try {
        const response = await api.put(`/educations/${id}`, educationData);
        return response.data;
    } catch (error) {
        console.error('Error updating education:', error);
        throw error;
    }
};

/**
 * 학력 정보 삭제
 * DELETE /educations/{id}
 * @param {number} id - 학력 ID
 * @returns {Promise<object>} 삭제 결과
 */
export const deleteEducation = async (id) => {
    try {
        const response = await api.delete(`/educations/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting education:', error);
        throw error;
    }
};
