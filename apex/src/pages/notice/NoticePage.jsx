import React, { useState, useEffect } from 'react';
import { fetchNotices, fetchNoticeDetail } from '../../api/notice';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import NoticeDetailModal from './NoticeDetailModal';
import './NoticePage.css';

function NoticePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pageSize = 8;

  // 공지사항 목록 조회
  const loadNotices = async (page = 0, search = '') => {
    setLoading(true);
    try {
      const params = {
        page: page,
        size: pageSize,
      };

      if (search && search.trim() !== '') {
        params.search = search.trim();
      }

      const response = await fetchNotices(params);
      
      if (response.success && response.data) {
        setNotices(response.data.content || []);
        setTotalPages(response.data.totalPages || 0);
        setTotalElements(response.data.totalElements || 0);
        setCurrentPage(page);
      }
    } catch (error) {
      toast.error('공지사항을 불러오는데 실패했습니다.');
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices(0);

    // 메인 페이지에서 전달받은 공지사항 ID가 있으면 모달 열기
    if (location.state && location.state.selectedNoticeId) {
      handleNoticeClick(location.state.selectedNoticeId);
    }
  }, []);

  // 검색 핸들러
  const handleSearch = () => {
    loadNotices(0, searchTerm);
  };

  // 검색어 입력 시 엔터키 처리
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 페이지 변경
  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      loadNotices(page, searchTerm);
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\. /g, '.').replace('.', '.');
  };

  // 페이지네이션 번호 생성
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(0, currentPage - 2);
    let end = Math.min(totalPages - 1, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(0, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  // 공지사항 클릭 시 상세 조회
  const handleNoticeClick = async (noticeId) => {
    try {
      const response = await fetchNoticeDetail(noticeId);
      if (response.success && response.data) {
        setSelectedNotice(response.data);
        setIsModalOpen(true);
      }
    } catch (error) {
      toast.error('공지사항을 불러오는데 실패했습니다.');
    }
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNotice(null);
    // 모달 닫을 때 목록 새로고침 (조회수 반영)
    loadNotices(currentPage, searchTerm);
  };

  // 메인 페이지로 돌아가기
  const handleBackToMain = () => {
    navigate('/');
  };

  // 공지사항 작성 페이지로 이동
  const handleCreateNotice = () => {
    navigate('/notice/create');
  };

  return (
    <div className="common-wrap">
      <div className="notice-page-container">
        <button className="back-to-main-btn" onClick={handleBackToMain}>
          ← 돌아가기
        </button>
        
        <div className="notice-title-area">
          <h2 className="notice-page-title">공지사항</h2>
          <button className="create-notice-btn" onClick={handleCreateNotice}>
            + 공지사항 작성
          </button>
        </div>

        {/* 검색 영역 */}
        <div className="notice-search-section">
          <div className="search-row">
            <label className="search-label">기간</label>
            <input
              type="date"
              className="date-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span className="date-separator">~</span>
            <input
              type="date"
              className="date-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="search-row">
            <label className="search-label">검색</label>
            <input
              type="text"
              className="search-input"
              placeholder="제목을 입력하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="search-button" onClick={handleSearch}>
              조회
            </button>
          </div>
        </div>

        {/* 공지사항 테이블 */}
        <div className="notice-table-wrapper">
          {loading ? (
            <div className="loading-message">로딩 중...</div>
          ) : (
            <>
              <table className="notice-table">
                <thead>
                  <tr>
                    <th>번호</th>
                    <th>분류</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>작성일</th>
                    <th>조회수</th>
                  </tr>
                </thead>
                <tbody>
                  {notices.length > 0 ? (
                    notices.map((notice, index) => (
                      <tr key={notice.id} onClick={() => handleNoticeClick(notice.id)}>
                        <td>{totalElements - (currentPage * pageSize) - index}</td>
                        <td>
                          {notice.isImportant ? (
                            <span className="important-badge">중요</span>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="notice-title">
                          {notice.title}
                          {notice.isNew && <span className="new-badge">[N]</span>}
                        </td>
                        <td>{notice.authorName || '최관지'}</td>
                        <td>{formatDate(notice.createdAt)}</td>
                        <td>{notice.viewCount || 0}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="no-data">
                        공지사항이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* 페이지네이션 */}
              {totalPages > 0 && (
                <div className="pagination">
                  <button
                    className="page-btn"
                    onClick={() => handlePageChange(0)}
                    disabled={currentPage === 0}
                  >
                    ◀
                  </button>
                  
                  {getPageNumbers().map((pageNum) => (
                    <button
                      key={pageNum}
                      className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum + 1}
                    </button>
                  ))}

                  {totalPages > 5 && currentPage < totalPages - 3 && (
                    <>
                      <span className="page-ellipsis">...</span>
                      <button
                        className="page-number"
                        onClick={() => handlePageChange(totalPages - 1)}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                  <button
                    className="page-btn"
                    onClick={() => handlePageChange(totalPages - 1)}
                    disabled={currentPage === totalPages - 1}
                  >
                    ▶
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 공지사항 상세 모달 */}
      {isModalOpen && (
        <NoticeDetailModal
          notice={selectedNotice}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default NoticePage;
