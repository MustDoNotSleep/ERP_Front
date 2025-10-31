/**
 * API 응답 유틸리티
 * 백엔드 ApiResponse 구조와 매핑
 */

/**
 * API 응답 데이터 추출
 * 백엔드의 ApiResponse<T> 구조에서 data를 추출합니다.
 * @param {object} response - Axios 응답 객체
 * @returns {*} 실제 데이터
 */
export const extractData = (response) => {
    // 백엔드가 { success, message, data } 형식으로 응답하는 경우
    if (response.data && typeof response.data === 'object') {
        // data 필드가 있으면 그것을 반환, 없으면 전체 response.data 반환
        return response.data.data !== undefined ? response.data.data : response.data;
    }
    return response.data;
};

/**
 * 페이지 응답 데이터 추출
 * Spring Data의 Page<T> 응답을 처리합니다.
 * @param {object} response - Axios 응답 객체
 * @returns {object} { content, totalElements, totalPages, number, size }
 */
export const extractPageData = (response) => {
    const data = extractData(response);
    
    // Spring Data Page 구조
    if (data && data.content) {
        return {
            content: data.content,
            totalElements: data.totalElements || 0,
            totalPages: data.totalPages || 0,
            currentPage: data.number || 0,
            pageSize: data.size || 20,
            isFirst: data.first || false,
            isLast: data.last || false,
            hasNext: !data.last,
            hasPrevious: !data.first
        };
    }
    
    // 배열 형태로 오는 경우
    if (Array.isArray(data)) {
        return {
            content: data,
            totalElements: data.length,
            totalPages: 1,
            currentPage: 0,
            pageSize: data.length,
            isFirst: true,
            isLast: true,
            hasNext: false,
            hasPrevious: false
        };
    }
    
    return data;
};

/**
 * 에러 메시지 추출
 * @param {Error} error - Axios 에러 객체
 * @returns {string} 에러 메시지
 */
export const extractErrorMessage = (error) => {
    if (error.response) {
        // 서버 응답이 있는 경우
        const data = error.response.data;
        
        // 백엔드 에러 응답 구조
        if (data && data.message) {
            return data.message;
        }
        
        // HTTP 상태 코드별 기본 메시지
        switch (error.response.status) {
            case 400:
                return '잘못된 요청입니다.';
            case 401:
                return '인증이 필요합니다. 다시 로그인해주세요.';
            case 403:
                return '접근 권한이 없습니다.';
            case 404:
                return '요청한 리소스를 찾을 수 없습니다.';
            case 409:
                return '요청이 충돌합니다.';
            case 500:
                return '서버 오류가 발생했습니다.';
            default:
                return `오류가 발생했습니다. (${error.response.status})`;
        }
    } else if (error.request) {
        // 요청은 보냈지만 응답을 받지 못한 경우
        return '서버와 통신할 수 없습니다. 네트워크 연결을 확인해주세요.';
    } else {
        // 요청 설정 중 오류가 발생한 경우
        return error.message || '알 수 없는 오류가 발생했습니다.';
    }
};

/**
 * API 호출 래퍼 (에러 처리 포함)
 * @param {Function} apiCall - API 호출 함수
 * @param {object} options - { showError: boolean, defaultValue: any }
 * @returns {Promise<*>}
 */
export const apiWrapper = async (apiCall, options = {}) => {
    const { showError = true, defaultValue = null } = options;
    
    try {
        const response = await apiCall();
        return extractData(response);
    } catch (error) {
        const errorMessage = extractErrorMessage(error);
        
        if (showError) {
            console.error('API Error:', errorMessage);
            // 여기에 토스트 메시지나 alert 등을 추가할 수 있습니다.
        }
        
        if (defaultValue !== null) {
            return defaultValue;
        }
        
        throw error;
    }
};

/**
 * 날짜 형식 변환 (YYYY-MM-DD)
 * @param {Date|string} date - 날짜
 * @returns {string} YYYY-MM-DD 형식의 문자열
 */
export const formatDate = (date) => {
    if (!date) return null;
    
    const d = typeof date === 'string' ? new Date(date) : date;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
};

/**
 * 날짜/시간 형식 변환 (YYYY-MM-DD HH:mm:ss)
 * @param {Date|string} datetime - 날짜/시간
 * @returns {string} YYYY-MM-DD HH:mm:ss 형식의 문자열
 */
export const formatDateTime = (datetime) => {
    if (!datetime) return null;
    
    const d = typeof datetime === 'string' ? new Date(datetime) : datetime;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
