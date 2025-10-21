import api from './axios';

/**
 * 사용자 상세 정보 조회 (GET /employees/{employeeId})
 * Lambda 핸들러의 'CASE B'를 호출합니다.
 * @param {number} employeeId - 조회할 직원의 고유 ID
 * @returns {Promise<object>} 직원 상세 정보 데이터
 */
export const fetchEmployeeProfile = async (employeeId) => {
    try {
        // GET /employees/{employeeId} 경로로 요청을 보냅니다.
        const response = await api.get(`/employees/${employeeId}`);
        // Lambda 핸들러는 { employee: details } 형태로 응답할 것이므로, employee 객체를 리턴합니다.
        return response.data.employee;
    } catch (error) {
        // 에러 처리: 404 Not Found, 403 Forbidden 등
        console.error(`Error fetching employee ${employeeId}:`, error);
        throw error; 
    }
};
/**
 * 2. 사용자 비밀번호 변경 (PATCH /employees/password)
 * @param {string} currentPassword - 현재 비밀번호
 * @param {string} newPassword - 새로운 비밀번호
 * @returns {Promise<object>} 성공/실패 메시지
 */
export const updateEmployeePassword = async (currentPassword, newPassword) => {
    const employeeId = JSON.parse(localStorage.getItem('user')).employeeId;

    try {
        const response = await api.patch(`/employees/${employeeId}/password`, { 
            currentPassword,
            newPassword 
        });
        return response.data;
    } catch (error) {
        console.error("Error updating password:", error);
        throw error;
    }
};