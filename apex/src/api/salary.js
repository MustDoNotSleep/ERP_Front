import api from './axios';

/**
 * 급여 목록 조회
 * GET /salary
 * @param {number} page - 페이지 번호
 * @param {number} size - 페이지 크기
 * @param {number} year - 연도
 * @param {number} month - 월
 * @returns {Promise<object>} 급여 목록
 */
export const fetchsalary = async (page = 0, size = 20, year = null, month = null) => {
    try {
        const params = { page, size };
        if (year) params.year = year;
        if (month) params.month = month;
        
        const response = await api.get('/salary', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching salary:', error);
        throw error;
    }
};

/**
 * 특정 직원의 급여 목록 조회
 * GET /salary/employee/{employeeId}
 * @param {number} employeeId - 직원 ID
 * @param {number} page - 페이지 번호
 * @param {number} size - 페이지 크기
 * @param {number} year - 연도
 * @returns {Promise<object>} 직원의 급여 목록
 */
export const fetchEmployeesalary = async (employeeId, page = 0, size = 20, year = null) => {
    try {
        const params = { page, size };
        if (year) params.year = year;
        
        const response = await api.get(`/salary/employee/${employeeId}`, { params });
        return response.data;
    } catch (error) {
        console.error(`Error fetching salary for employee ${employeeId}:`, error);
        throw error;
    }
};

/**
 * 급여 상세 정보 조회
 * GET /salary/{salaryId}
 * @param {number} salaryId - 급여 ID
 * @returns {Promise<object>} 급여 상세 정보
 */
export const fetchSalaryById = async (salaryId) => {
    try {
        const response = await api.get(`/salary/${salaryId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching salary ${salaryId}:`, error);
        throw error;
    }
};

/**
 * 급여 생성
 * POST /salary
 * @param {object} salaryData - 급여 정보
 * @returns {Promise<object>} 생성된 급여 정보
 */
export const createSalary = async (salaryData) => {
    try {
        const response = await api.post('/salary', salaryData);
        return response.data;
    } catch (error) {
        console.error('Error creating salary:', error);
        throw error;
    }
};

/**
 * 급여 수정
 * PUT /salary/{salaryId}
 * @param {number} salaryId - 급여 ID
 * @param {object} salaryData - 수정할 급여 정보
 * @returns {Promise<object>} 수정된 급여 정보
 */
export const updateSalary = async (salaryId, salaryData) => {
    try {
        const response = await api.put(`/salary/${salaryId}`, salaryData);
        return response.data;
    } catch (error) {
        console.error('Error updating salary:', error);
        throw error;
    }
};

/**
 * 급여 삭제
 * DELETE /salary/{salaryId}
 * @param {number} salaryId - 급여 ID
 * @returns {Promise<object>} 삭제 결과
 */
export const deleteSalary = async (salaryId) => {
    try {
        const response = await api.delete(`/salary/${salaryId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting salary:', error);
        throw error;
    }
};

/**
 * 급여명세서 다운로드
 * GET /salary/{salaryId}/payslip
 * @param {number} salaryId - 급여 ID
 * @returns {Promise<Blob>} 급여명세서 파일
 */
export const downloadPayslip = async (salaryId) => {
    try {
        const response = await api.get(`/salary/${salaryId}/payslip`, {
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

/**
 * 월별 급여 목록 조회
 * GET /salary/month/{yearMonth}
 * @param {string} yearMonth - 연월 (YYYY-MM)
 * @returns {Promise<object>} 월별 급여 목록
 */
export const fetchMonthlysalary = async (yearMonth) => {
    try {
        const response = await api.get(`/salary/month/${yearMonth}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching monthly salary for ${yearMonth}:`, error);
        throw error;
    }
};

/**
 * 급여 확정
 * PUT /salary/{id}/confirm
 * @param {number} salaryId - 급여 ID
 * @returns {Promise<object>} 확정 결과
 */
export const confirmSalary = async (salaryId) => {
    try {
        const response = await api.put(`/salary/${salaryId}/confirm`);
        return response.data;
    } catch (error) {
        console.error(`Error confirming salary ${salaryId}:`, error);
        throw error;
    }
};

/**
 * 급여 지급 처리
 * PUT /salary/{id}/pay
 * @param {number} salaryId - 급여 ID
 * @returns {Promise<object>} 지급 결과
 */
export const markSalaryAsPaid = async (salaryId) => {
    try {
        const response = await api.put(`/salary/${salaryId}/pay`);
        return response.data;
    } catch (error) {
        console.error(`Error marking salary ${salaryId} as paid:`, error);
        throw error;
    }
};

/**
 * 필터링된 급여 일괄 수정 (기타 수당 추가)
 * PUT /salary/bulk-update-filtered
 * @param {object} requestData - 일괄 수정 요청 데이터
 * @param {string} requestData.paymentDate - 대상 월 (YYYY-MM)
 * @param {string} requestData.targetType - 대상 유형 (ALL, DEPARTMENT, POSITION, EMPLOYEE)
 * @param {string} requestData.targetDepartment - 부서명 (targetType=DEPARTMENT 시)
 * @param {string} requestData.targetPosition - 직급명 (targetType=POSITION 시)
 * @param {number} requestData.targetEmployeeId - 직원 ID (targetType=EMPLOYEE 시)
 * @param {number} requestData.bonusToAdd - 추가할 보너스
 * @param {number} requestData.overtimeAllowanceToAdd - 추가할 야근수당
 * @param {number} requestData.nightAllowanceToAdd - 추가할 야간수당
 * @returns {Promise<object>} 일괄 수정 결과
 */
export const bulkUpdateFilteredSalaries = async (requestData) => {
    try {
        const response = await api.put('/salary/bulk-update-filtered', requestData);
        return response.data;
    } catch (error) {
        console.error('Error bulk updating filtered salaries:', error);
        throw error;
    }
};

/**
 * 급여 수정 내역 조회 (월별)
 * GET /salary/modifications/{yearMonth}
 * @param {string} yearMonth - 조회할 년월 (YYYY-MM)
 * @returns {Promise<object>} 수정 내역 목록
 */
export const fetchSalaryModifications = async (yearMonth) => {
    try {
        const response = await api.get(`/salary/modifications/${yearMonth}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching salary modifications for ${yearMonth}:`, error);
        throw error;
    }
};
