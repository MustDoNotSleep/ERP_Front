import api from './axios';

/**
 * 전체 부서 목록 조회
 * GET /departments
 * @param {number} page - 페이지 번호
 * @param {number} size - 페이지 크기
 * @returns {Promise<object>} 부서 목록
 */
export const fetchDepartments = async (page = 0, size = 100) => {
    try {
        const response = await api.get('/departments', {
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching departments:', error);
        throw error;
    }
};

/**
 * 부서 상세 정보 조회
 * GET /departments/{departmentId}
 * @param {number} departmentId - 부서 ID
 * @returns {Promise<object>} 부서 상세 정보
 */
export const fetchDepartmentById = async (departmentId) => {
    try {
        const response = await api.get(`/departments/${departmentId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching department ${departmentId}:`, error);
        throw error;
    }
};

/**
 * 새 부서 생성
 * POST /departments
 * @param {object} departmentData - 부서 정보
 * @returns {Promise<object>} 생성된 부서 정보
 */
export const createDepartment = async (departmentData) => {
    try {
        const response = await api.post('/departments', departmentData);
        return response.data;
    } catch (error) {
        console.error('Error creating department:', error);
        throw error;
    }
};

/**
 * 부서 정보 수정
 * PUT /departments/{departmentId}
 * @param {number} departmentId - 부서 ID
 * @param {object} departmentData - 수정할 부서 정보
 * @returns {Promise<object>} 수정된 부서 정보
 */
export const updateDepartment = async (departmentId, departmentData) => {
    try {
        const response = await api.put(`/departments/${departmentId}`, departmentData);
        return response.data;
    } catch (error) {
        console.error('Error updating department:', error);
        throw error;
    }
};

/**
 * 부서 삭제
 * DELETE /departments/{departmentId}
 * @param {number} departmentId - 부서 ID
 * @returns {Promise<object>} 삭제 결과
 */
export const deleteDepartment = async (departmentId) => {
    try {
        const response = await api.delete(`/departments/${departmentId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting department:', error);
        throw error;
    }
};

/**
 * 부서의 직원 목록 조회
 * GET /departments/{departmentId}/employees
 * @param {number} departmentId - 부서 ID
 * @returns {Promise<Array>} 직원 목록
 */
export const fetchDepartmentEmployees = async (departmentId) => {
    try {
        const response = await api.get(`/departments/${departmentId}/employees`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching employees for department ${departmentId}:`, error);
        throw error;
    }
};

/**
 * 중복 제거된 부서명 목록 조회 (드롭다운용)
 * GET /departments/unique-names
 * @returns {Promise<Array<string>>} 중복 제거된 부서명 목록
 */
export const fetchUniqueDepartmentNames = async () => {
    try {
        const response = await api.get('/departments/unique-names');
        return response.data;
    } catch (error) {
        console.error('Error fetching unique department names:', error);
        throw error;
    }
};
