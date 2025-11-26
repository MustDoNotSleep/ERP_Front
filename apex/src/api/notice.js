import api from './axios';

/**
 * 전체 공지사항 조회 (페이징)
 * @param {Object} params - { page, size, search }
 */
export const fetchNotices = async (params = {}) => {
  try {
    const response = await api.get('/notices', { params });
    return response.data;
  } catch (error) {
    console.error('공지사항 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 공지사항 상세 조회
 * @param {number} id - 공지사항 ID
 */
export const fetchNoticeDetail = async (id) => {
  try {
    const response = await api.get(`/notices/${id}`);
    return response.data;
  } catch (error) {
    console.error('공지사항 상세 조회 실패:', error);
    throw error;
  }
};

/**
 * 중요 공지사항 목록 조회 (최대 5개)
 */
export const fetchImportantNotices = async () => {
  try {
    const response = await api.get('/notices/important');
    return response.data;
  } catch (error) {
    console.error('중요 공지사항 조회 실패:', error);
    throw error;
  }
};

/**
 * 공지사항 작성 (관리자, HR만 가능)
 * @param {Object} data - { title, content, isImportant }
 */
export const createNotice = async (data) => {
  try {
    const response = await api.post('/notices', data);
    return response.data;
  } catch (error) {
    console.error('공지사항 작성 실패:', error);
    throw error;
  }
};

/**
 * 공지사항 수정
 * @param {number} id - 공지사항 ID
 * @param {Object} data - { title, content, isImportant }
 */
export const updateNotice = async (id, data) => {
  try {
    const response = await api.put(`/notices/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('공지사항 수정 실패:', error);
    throw error;
  }
};

/**
 * 공지사항 삭제
 * @param {number} id - 공지사항 ID
 */
export const deleteNotice = async (id) => {
  try {
    const response = await api.delete(`/notices/${id}`);
    return response.data;
  } catch (error) {
    console.error('공지사항 삭제 실패:', error);
    throw error;
  }
};
