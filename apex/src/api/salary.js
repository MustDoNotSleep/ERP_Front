import api from './axios';

/**
 * 급여 목록 조회
 * GET /salaries
 * @param {number} page - 페이지 번호
 * @param {number} size - 페이지 크기
 * @param {number} year - 연도
 * @param {number} month - 월
 * @returns {Promise<object>} 급여 목록
 */
export const fetchSalaries = async (page = 0, size = 20, year = null, month = null) => {
    try {
        const params = { page, size };
        if (year) params.year = year;
        if (month) params.month = month;
        
        const response = await api.get('/salaries', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching salaries:', error);
        throw error;
    }
};

/**
 * 특정 직원의 급여 목록 조회
 * GET /salaries/employee/{employeeId}
 * @param {number} employeeId - 직원 ID
 * @param {number} page - 페이지 번호
 * @param {number} size - 페이지 크기
 * @param {number} year - 연도
 * @returns {Promise<object>} 직원의 급여 목록
 */
export const fetchEmployeeSalaries = async (employeeId, page = 0, size = 20, year = null) => {
    try {
        const params = { page, size };
        if (year) params.year = year;
        
        const response = await api.get(`/salaries/employee/${employeeId}`, { params });
        return response.data;
    } catch (error) {
        console.error(`Error fetching salaries for employee ${employeeId}:`, error);
        throw error;
    }
};

/**
 * 급여 상세 정보 조회
 * GET /salaries/{salaryId}
 * @param {number} salaryId - 급여 ID
 * @returns {Promise<object>} 급여 상세 정보
 */
export const fetchSalaryById = async (salaryId) => {
    try {
        const response = await api.get(`/salaries/${salaryId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching salary ${salaryId}:`, error);
        throw error;
    }
};

/**
 * 급여 생성
 * POST /salaries
 * @param {object} salaryData - 급여 정보
 * @returns {Promise<object>} 생성된 급여 정보
 */
export const createSalary = async (salaryData) => {
    try {
        const response = await api.post('/salaries', salaryData);
        return response.data;
    } catch (error) {
        console.error('Error creating salary:', error);
        throw error;
    }
};

/**
 * 급여 수정
 * PUT /salaries/{salaryId}
 * @param {number} salaryId - 급여 ID
 * @param {object} salaryData - 수정할 급여 정보
 * @returns {Promise<object>} 수정된 급여 정보
 */
export const updateSalary = async (salaryId, salaryData) => {
    try {
        const response = await api.put(`/salaries/${salaryId}`, salaryData);
        return response.data;
    } catch (error) {
        console.error('Error updating salary:', error);
        throw error;
    }
};

/**
 * 급여 삭제
 * DELETE /salaries/{salaryId}
 * @param {number} salaryId - 급여 ID
 * @returns {Promise<object>} 삭제 결과
 */
export const deleteSalary = async (salaryId) => {
    try {
        const response = await api.delete(`/salaries/${salaryId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting salary:', error);
        throw error;
    }
};

/**
 * 급여명세서 다운로드
 * GET /salaries/{salaryId}/payslip
 * @param {number} salaryId - 급여 ID
 * @returns {Promise<Blob>} 급여명세서 파일
 */
export const downloadPayslip = async (salaryId) => {
    try {
        const response = await api.get(`/salaries/${salaryId}/payslip`, {
            responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        console.error('Error downloading payslip:', error);
        throw error;
    }
};

/**
 * 직원의 급여 정보 조회
 * GET /salary-info/employee/{employeeId}
 * @param {number} employeeId - 직원 ID
 * @returns {Promise<object>} 급여 정보
 */
export const fetchEmployeeSalaryInfo = async (employeeId) => {
    try {
        const response = await api.get(`/salary-info/employee/${employeeId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching salary info for employee ${employeeId}:`, error);
        throw error;
    }
};

/**
 * 급여 정보 수정
 * PUT /salary-info/{salaryInfoId}
 * @param {number} salaryInfoId - 급여 정보 ID
 * @param {object} salaryInfoData - 수정할 급여 정보
 * @returns {Promise<object>} 수정된 급여 정보
 */
export const updateSalaryInfo = async (salaryInfoId, salaryInfoData) => {
    try {
        const response = await api.put(`/salary-info/${salaryInfoId}`, salaryInfoData);
        return response.data;
    } catch (error) {
        console.error('Error updating salary info:', error);
        throw error;
    }
};
