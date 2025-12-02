/**
 * Welfare API
 * 복리후생 관련 API 호출 함수들
 */

import api from './axios';

/**
 * 직원별 복리후생 사용 내역 조회
 * @param {number} employeeId - 직원 ID
 * @returns {Promise} 복리후생 사용 내역 목록
 */
export const fetchWelfareByEmployeeId = async (employeeId) => {
    try {
        const response = await api.get(`/welfare/employee/${employeeId}`);
        return response.data;
    } catch (error) {
        console.error('복리후생 사용 내역 조회 실패:', error);
        throw error;
    }
};

/**
 * 직원의 복리후생 잔액 조회
 * @param {number} employeeId - 직원 ID
 * @param {number} year - 조회 연도 (선택, 기본값: 현재 연도)
 * @returns {Promise} 복리후생 잔액 정보
 */
export const fetchWelfareBalance = async (employeeId, year = null) => {
    try {
        const params = year ? { year } : {};
        const response = await api.get(`/welfare/employee/${employeeId}/balance`, { params });
        return response.data;
    } catch (error) {
        console.error('복리후생 잔액 조회 실패:', error);
        throw error;
    }
};

/**
 * 복리후생 사용 신청 (인사팀 전용)
 * @param {object} welfareData - 복리후생 데이터
 * @returns {Promise} 생성된 복리후생 정보
 */
export const createWelfare = async (welfareData) => {
    try {
        const response = await api.post('/welfare', welfareData);
        return response.data;
    } catch (error) {
        console.error('복리후생 사용 신청 실패:', error);
        throw error;
    }
};

/**
 * 승인 대기 중인 복리후생 목록 조회 (인사팀 전용)
 * @returns {Promise} 승인 대기 중인 복리후생 목록
 */
export const fetchPendingWelfares = async () => {
    try {
        const response = await api.get('/welfare/pending');
        return response.data;
    } catch (error) {
        console.error('승인 대기 복리후생 목록 조회 실패:', error);
        throw error;
    }
};
