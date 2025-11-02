import api from './axios';

/**
 * 특정 직원의 교육훈련 이수 정보 조회
 * GET /courses/employee/{employeeId}
 * @param {number} employeeId - 직원 ID
 * @returns {Promise<object>} 교육훈련 이수 목록
 */
export const fetchCoursesByEmployeeId = async (employeeId) => {
  try {
    const response = await api.get(`/courses/employee/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error('교육훈련 정보 조회 실패:', error);
    throw error;
  }
};

/**
 * 교육 과정 목록 조회
 * GET /courses
 * @param {number} page - 페이지 번호
 * @param {number} size - 페이지 크기
 * @param {object} filters - 필터 조건 { courseName, dateStatus, approvalStatus }
 * @returns {Promise<object>} 교육 과정 목록
 */
export const fetchCourses = async (page = 0, size = 20, filters = {}) => {
    try {
        const params = { page, size };
        
        // 필터 조건 추가
        if (filters.courseName) params.courseName = filters.courseName;
        if (filters.dateStatus) params.dateStatus = filters.dateStatus;
        if (filters.approvalStatus) params.status = filters.approvalStatus;
        
        const response = await api.get('/courses', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching courses:', error);
        throw error;
    }
};

/**
 * 교육 과정 상세 정보 조회
 * GET /courses/{courseId}
 * @param {number} courseId - 과정 ID
 * @returns {Promise<object>} 과정 상세 정보
 */
export const fetchCourseById = async (courseId) => {
    try {
        const response = await api.get(`/courses/${courseId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching course ${courseId}:`, error);
        throw error;
    }
};

/**
 * 교육 과정 생성
 * POST /courses
 * @param {object} courseData - 과정 정보
 * @returns {Promise<object>} 생성된 과정 정보
 */
export const createCourse = async (courseData) => {
    try {
        const response = await api.post('/courses', courseData);
        return response.data;
    } catch (error) {
        console.error('Error creating course:', error);
        throw error;
    }
};

/**
 * 교육 과정 수정
 * PUT /courses/{courseId}
 * @param {number} courseId - 과정 ID
 * @param {object} courseData - 수정할 과정 정보
 * @returns {Promise<object>} 수정된 과정 정보
 */
export const updateCourse = async (courseId, courseData) => {
    try {
        const response = await api.put(`/courses/${courseId}`, courseData);
        return response.data;
    } catch (error) {
        console.error('Error updating course:', error);
        throw error;
    }
};

/**
 * 교육 과정 삭제
 * DELETE /courses/{courseId}
 * @param {number} courseId - 과정 ID
 * @returns {Promise<object>} 삭제 결과
 */
export const deleteCourse = async (courseId) => {
    try {
        const response = await api.delete(`/courses/${courseId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting course:', error);
        throw error;
    }
};

/**
 * 교육 신청 목록 조회
 * GET /course-applications
 * @param {number} page - 페이지 번호
 * @param {number} size - 페이지 크기
 * @param {string} status - 상태 필터
 * @returns {Promise<object>} 교육 신청 목록
 */
export const fetchCourseApplications = async (page = 0, size = 20, status = null) => {
    try {
        const params = { page, size };
        if (status) params.status = status;
        
        const response = await api.get('/course-applications', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching course applications:', error);
        throw error;
    }
};

/**
 * 특정 직원의 교육 신청 목록 조회
 * GET /course-applications/employee/{employeeId}
 * @param {number} employeeId - 직원 ID
 * @param {number} page - 페이지 번호
 * @param {number} size - 페이지 크기
 * @returns {Promise<object>} 직원의 교육 신청 목록
 */
export const fetchEmployeeCourseApplications = async (employeeId, page = 0, size = 20) => {
    try {
        const response = await api.get(`/course-applications/employee/${employeeId}`, {
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching course applications for employee ${employeeId}:`, error);
        throw error;
    }
};

/**
 * 교육 신청
 * POST /course-applications
 * @param {object} applicationData - 신청 정보
 * @returns {Promise<object>} 생성된 신청 정보
 */
export const createCourseApplication = async (applicationData) => {
    try {
        const response = await api.post('/course-applications', applicationData);
        return response.data;
    } catch (error) {
        console.error('Error creating course application:', error);
        throw error;
    }
};

/**
 * 교육 신청 취소
 * DELETE /course-applications/{applicationId}
 * @param {number} applicationId - 신청 ID
 * @returns {Promise<object>} 삭제 결과
 */
export const deleteCourseApplication = async (applicationId) => {
    try {
        const response = await api.delete(`/course-applications/${applicationId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting course application:', error);
        throw error;
    }
};

/**
 * 교육 신청 승인
 * PATCH /course-applications/{applicationId}/approve
 * @param {number} applicationId - 신청 ID
 * @returns {Promise<object>} 승인된 신청 정보
 */
export const approveCourseApplication = async (applicationId) => {
    try {
        const response = await api.put(`/course-applications/${applicationId}/approval`, {
            approved: true,
            comment: '승인되었습니다.'
        });
        return response.data;
    } catch (error) {
        console.error('Error approving course application:', error);
        throw error;
    }
};

/**
 * 교육 신청 반려
 * PATCH /course-applications/{applicationId}/reject
 * @param {number} applicationId - 신청 ID
 * @param {string} reason - 반려 사유
 * @returns {Promise<object>} 반려된 신청 정보
 */
export const rejectCourseApplication = async (applicationId, reason) => {
    try {
        const response = await api.put(`/course-applications/${applicationId}/approval`, {
            approved: false,
            comment: reason
        });
        return response.data;
    } catch (error) {
        console.error('Error rejecting course application:', error);
        throw error;
    }
};

/**
 * 특정 교육의 신청자 목록 조회
 * GET /courses/{courseId}/applications
 * @param {number} courseId - 교육 ID
 * @returns {Promise<object>} 해당 교육의 신청자 목록
 */
export const fetchApplicantsByCourseId = async (courseId) => {
    try {
        const response = await api.get(`/courses/${courseId}/applications`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching applicants for course ${courseId}:`, error);
        throw error;
    }
};

/**
 * 교육 과정 승인/반려
 * PUT /courses/{id}/approval
 * @param {number} courseId - 교육 ID
 * @param {boolean} approved - 승인 여부
 * @param {string} comment - 코멘트
 * @returns {Promise<object>} 승인/반려된 교육 정보
 */
export const approveCourse = async (courseId, approved, comment = '') => {
    try {
        const response = await api.put(`/courses/${courseId}/approval`, {
            approved,
            comment
        });
        return response.data;
    } catch (error) {
        console.error('Error approving/rejecting course:', error);
        throw error;
    }
};
