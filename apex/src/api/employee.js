import api from './axios';

/**
 * 전체 직원 목록 조회 (페이징)
 * GET /employees
 * @param {number} page - 페이지 번호 (0부터 시작)
 * @param {number} size - 페이지 크기
 * @param {string} sort - 정렬 기준 (예: 'name,asc')
 * @returns {Promise<object>} 페이징된 직원 목록
 */
export const fetchEmployees = async (page = 1, size = 10, sort = 'id,asc') => {
    try {
        const response = await api.get('/employees', {
            params: { page, size, sort }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching employees:', error);
        throw error;
    }
};

/**
 * 직원 검색 (상세 검색)
 * GET /employees/search
 * @param {object} searchParams - 검색 조건 { name, email, departmentName, positionName }
 * @param {number} page - 페이지 번호 (0부터 시작)
 * @param {number} size - 페이지 크기
 * @returns {Promise<object>} 검색된 직원 목록
 */
export const searchEmployees = async (searchParams = {}, page = 0, size = 100) => {
    try {
        const params = { page, size };
        
        // 검색 파라미터가 있는 경우만 추가
        if (searchParams.name && searchParams.name.trim()) {
            params.name = searchParams.name.trim();
        }

        // id로 검색 (백엔드에서 id를 사번으로 사용)
        if (searchParams.id) {
            params.id = searchParams.id;
        }
        
        if (searchParams.email && searchParams.email.trim()) {
            params.email = searchParams.email.trim();
        }
        // ✅ Name 기반 검색으로 변경
        if (searchParams.departmentName && searchParams.departmentName.trim()) {
            params.departmentName = searchParams.departmentName.trim();
        }
        if (searchParams.positionName && searchParams.positionName.trim()) {
            params.positionName = searchParams.positionName.trim();
        }
        
        const response = await api.get('/employees/search', { params });
        return response.data;
    } catch (error) {
        console.error('Error searching employees:', error);
        throw error;
    }
};

/**
 * 직원 상세 정보 조회
 * GET /employees/{employeeId}
 * @param {number} employeeId - 조회할 직원의 고유 ID
 * @returns {Promise<object>} 직원 상세 정보
 */
export const fetchEmployeeProfile = async (employeeId) => {
    try {
        const response = await api.get(`/employees/${employeeId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching employee ${employeeId}:`, error);
        throw error;
    }
};

/**
 * 새 직원 등록
 * POST /employees
 * @param {object} employeeData - 직원 정보
 * @returns {Promise<object>} 생성된 직원 정보
 */
export const createEmployee = async (employeeData) => {
    try {
        const response = await api.post('/employees', employeeData);
        return response.data;
    } catch (error) {
        console.error('Error creating employee:', error);
        throw error;
    }
};

/**
 * 직원 정보 수정
 * PUT /employees/{employeeId}
 * @param {number} employeeId - 직원 ID
 * @param {object} employeeData - 수정할 직원 정보
 * @returns {Promise<object>} 수정된 직원 정보
 */
export const updateEmployee = async (employeeId, employeeData) => {
    try {
        const response = await api.put(`/employees/${employeeId}`, employeeData);
        return response.data;
    } catch (error) {
        console.error('Error updating employee:', error);
        throw error;
    }
};

/**
 * 직원 삭제
 * DELETE /employees/{employeeId}
 * @param {number} employeeId - 직원 ID
 * @returns {Promise<object>} 삭제 결과
 */
export const deleteEmployee = async (employeeId) => {
    try {
        const response = await api.delete(`/employees/${employeeId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting employee:', error);
        throw error;
    }
};

/**
 * 직원 비밀번호 변경
 * PUT /employees/{employeeId}/password
 * @param {number} employeeId - 직원 ID
 * @param {string} currentPassword - 현재 비밀번호
 * @param {string} newPassword - 새로운 비밀번호
 * @returns {Promise<object>} 성공/실패 메시지
 */
export const updateEmployeePassword = async (employeeId, currentPassword, newPassword) => {
    try {
        // 백엔드가 request parameter를 요구함 (JSON body가 아님)
        console.log('🔐 비밀번호 변경 요청 (query params):', {
            employeeId,
            endpoint: `/employees/${employeeId}/password`,
            params: { oldPassword: currentPassword, newPassword }
        });
        
        // params로 전달 (query string으로)
        const response = await api.put(`/employees/${employeeId}/password`, null, {
            params: {
                oldPassword: currentPassword,
                newPassword: newPassword
            }
        });
        
        console.log('✅ 비밀번호 변경 성공:', response.data);
        
        return response.data;
    } catch (error) {
        console.error('❌ 비밀번호 변경 실패 - 상세:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            errorData: error.response?.data,
            requestSent: { oldPassword: currentPassword, newPassword }
        });
        throw error;
    }
};

/**
 * 직원 급여 정보 조회
 * GET /salary-info/employee/{employeeId}
 * @param {number} employeeId - 직원 ID
 * @returns {Promise<object>} 급여 정보 (은행명, 계좌번호 등)
 */
export const fetchEmployeeSalaryInfo = async (employeeId) => {
    try {
        const response = await api.get(`/salary-info/employee/${employeeId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching employee salary info:', error);
        throw error;
    }
};