import api from './axios';

/**
 * 게시글 목록 조회
 * GET /posts
 * @param {number} page - 페이지 번호
 * @param {number} size - 페이지 크기
 * @param {string} category - 카테고리 필터
 * @returns {Promise<object>} 게시글 목록
 */
export const fetchPosts = async (page = 0, size = 20, category = null) => {
    try {
        const params = { page, size };
        if (category) params.category = category;
        
        const response = await api.get('/posts', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
};

/**
 * 게시글 상세 조회
 * GET /posts/{postId}
 * @param {number} postId - 게시글 ID
 * @returns {Promise<object>} 게시글 상세 정보
 */
export const fetchPostById = async (postId) => {
    try {
        const response = await api.get(`/posts/${postId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching post ${postId}:`, error);
        throw error;
    }
};

/**
 * 게시글 생성
 * POST /posts
 * @param {object} postData - 게시글 정보
 * @returns {Promise<object>} 생성된 게시글 정보
 */
export const createPost = async (postData) => {
    try {
        const response = await api.post('/posts', postData);
        return response.data;
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
};

/**
 * 게시글 수정
 * PUT /posts/{postId}
 * @param {number} postId - 게시글 ID
 * @param {object} postData - 수정할 게시글 정보
 * @returns {Promise<object>} 수정된 게시글 정보
 */
export const updatePost = async (postId, postData) => {
    try {
        const response = await api.put(`/posts/${postId}`, postData);
        return response.data;
    } catch (error) {
        console.error('Error updating post:', error);
        throw error;
    }
};

/**
 * 게시글 삭제
 * DELETE /posts/{postId}
 * @param {number} postId - 게시글 ID
 * @returns {Promise<object>} 삭제 결과
 */
export const deletePost = async (postId) => {
    try {
        const response = await api.delete(`/posts/${postId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
};
