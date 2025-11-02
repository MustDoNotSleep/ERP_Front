import api from './axios';

/**
 * 직급/직책 목록 조회
 * GET /positions
 * @param {number} page - 페이지 번호
 * @param {number} size - 페이지 크기
 * @returns {Promise<object>} 직급 목록
 */
export const fetchPositions = async (page = 0, size = 100) => {
    try {
        const response = await api.get('/positions', {
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching positions:', error);
        throw error;
    }
};

/**
 * 직급 상세 정보 조회
 * GET /positions/{positionId}
 * @param {number} positionId - 직급 ID
 * @returns {Promise<object>} 직급 상세 정보
 */
export const fetchPositionById = async (positionId) => {
    try {
        const response = await api.get(`/positions/${positionId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching position ${positionId}:`, error);
        throw error;
    }
};

/**
 * 직급 생성
 * POST /positions
 * @param {object} positionData - 직급 정보
 * @returns {Promise<object>} 생성된 직급 정보
 */
export const createPosition = async (positionData) => {
    try {
        const response = await api.post('/positions', positionData);
        return response.data;
    } catch (error) {
        console.error('Error creating position:', error);
        throw error;
    }
};

/**
 * 직급 수정
 * PUT /positions/{positionId}
 * @param {number} positionId - 직급 ID
 * @param {object} positionData - 수정할 직급 정보
 * @returns {Promise<object>} 수정된 직급 정보
 */
export const updatePosition = async (positionId, positionData) => {
    try {
        const response = await api.put(`/positions/${positionId}`, positionData);
        return response.data;
    } catch (error) {
        console.error('Error updating position:', error);
        throw error;
    }
};

/**
 * 직급 삭제
 * DELETE /positions/{positionId}
 * @param {number} positionId - 직급 ID
 * @returns {Promise<object>} 삭제 결과
 */
export const deletePosition = async (positionId) => {
    try {
        const response = await api.delete(`/positions/${positionId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting position:', error);
        throw error;
    }
};

/**
 * 중복 제거된 직급명 목록 조회 (드롭다운용)
 * GET /positions/unique-names
 * @returns {Promise<Array<string>>} 중복 제거된 직급명 목록
 */
export const fetchUniquePositionNames = async () => {
    try {
        const response = await api.get('/positions/unique-names');
        return response.data;
    } catch (error) {
        console.error('Error fetching unique position names:', error);
        throw error;
    }
};
