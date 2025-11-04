import api from './axios';

/**
 * 근태 목록 조회
 * GET /attendances
 * @param {number} page - 페이지 번호
 * @param {number} size - 페이지 크기
 * @param {string} startDate - 시작 날짜 (YYYY-MM-DD)
 * @param {string} endDate - 종료 날짜 (YYYY-MM-DD)
 * @returns {Promise<object>} 근태 목록
 */
export const fetchAttendances = async (page = 0, size = 20, startDate = null, endDate = null) => {
    try {
        const params = { page, size };
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        
        const response = await api.get('/attendances', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching attendances:', error);
        throw error;
    }
};

/**
 * 특정 직원의 근태 목록 조회
 * GET /attendances/employee/{employeeId}
 * @param {number} employeeId - 직원 ID
 * @param {number} page - 페이지 번호
 * @param {number} size - 페이지 크기
 * @param {string} startDate - 시작 날짜
 * @param {string} endDate - 종료 날짜
 * @returns {Promise<object>} 직원의 근태 목록
 */
export const fetchEmployeeAttendances = async (employeeId, page = 0, size = 20, startDate = null, endDate = null) => {
    try {
        const params = { page, size };
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        
        const response = await api.get(`/attendances/employee/${employeeId}`, { params });
        return response.data;
    } catch (error) {
        console.error(`Error fetching attendances for employee ${employeeId}:`, error);
        throw error;
    }
};

/**
 * 근태 상세 정보 조회
 * GET /attendances/{attendanceId}
 * @param {number} attendanceId - 근태 ID
 * @returns {Promise<object>} 근태 상세 정보
 */
export const fetchAttendanceById = async (attendanceId) => {
    try {
        const response = await api.get(`/attendances/${attendanceId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching attendance ${attendanceId}:`, error);
        throw error;
    }
};

/**
 * 출근 처리
 * POST /attendances/check-in
 * @param {number} employeeId - 직원 ID (사용하지 않음, 토큰에서 추출)
 * @returns {Promise<object>} 출근 기록
 */
export const checkIn = async (employeeId) => {
    try {
        // 빈 객체로 전송 (백엔드가 JWT 토큰에서 employeeId 추출)
        const response = await api.post('/attendances/check-in', {});
        return response.data;
    } catch (error) {
        console.error('Error checking in:', error);
        throw error;
    }
};

/**
 * 퇴근 처리
 * POST /attendances/check-out
 * @param {number} employeeId - 직원 ID (사용하지 않음, 토큰에서 추출)
 * @returns {Promise<object>} 퇴근 기록
 */
export const checkOut = async (employeeId) => {
    try {
        // 빈 객체로 전송 (백엔드가 JWT 토큰에서 employeeId 추출)
        const response = await api.post('/attendances/check-out', {});
        return response.data;
    } catch (error) {
        console.error('Error checking out:', error);
        throw error;
    }
};

/**
 * 근태 기록 생성 (관리자용)
 * POST /attendances
 * @param {object} attendanceData - 근태 정보
 * @returns {Promise<object>} 생성된 근태 정보
 */
export const createAttendance = async (attendanceData) => {
    try {
        const response = await api.post('/attendances', attendanceData);
        return response.data;
    } catch (error) {
        console.error('Error creating attendance:', error);
        throw error;
    }
};

/**
 * 근태 수정
 * PUT /attendances/{attendanceId}
 * @param {number} attendanceId - 근태 ID
 * @param {object} attendanceData - 수정할 근태 정보
 * @returns {Promise<object>} 수정된 근태 정보
 */
export const updateAttendance = async (attendanceId, attendanceData) => {
    try {
        const response = await api.put(`/attendances/${attendanceId}`, attendanceData);
        return response.data;
    } catch (error) {
        console.error('Error updating attendance:', error);
        throw error;
    }
};

/**
 * 근태 삭제
 * DELETE /attendances/{attendanceId}
 * @param {number} attendanceId - 근태 ID
 * @returns {Promise<object>} 삭제 결과
 */
export const deleteAttendance = async (attendanceId) => {
    try {
        const response = await api.delete(`/attendances/${attendanceId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting attendance:', error);
        throw error;
    }
};

/**
 * 직원의 근태 통계 조회
 * GET /attendances/employee/{employeeId}/statistics
 * @param {number} employeeId - 직원 ID
 * @param {string} startDate - 시작 날짜
 * @param {string} endDate - 종료 날짜
 * @returns {Promise<object>} 근태 통계
 */
export const fetchAttendanceStatistics = async (employeeId, startDate, endDate) => {
    try {
        const response = await api.get(`/attendances/employee/${employeeId}/statistics`, {
            params: { startDate, endDate }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching attendance statistics:', error);
        throw error;
    }
};

/**
 * 오늘의 근태 현황 조회
 * GET /attendances/today
 * @returns {Promise<object>} 오늘의 근태 현황
 */
export const fetchTodayAttendance = async () => {
    try {
        const response = await api.get('/attendances/today');
        return response.data;
    } catch (error) {
        console.error('Error fetching today attendance:', error);
        throw error;
    }
};
