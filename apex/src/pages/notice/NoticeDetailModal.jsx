import React from 'react';
import './NoticeDetailModal.css';

function NoticeDetailModal({ notice, onClose }) {
  if (!notice) return null;

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 모달 외부 클릭 시 닫기
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="notice-modal-backdrop" onClick={handleBackdropClick}>
      <div className="notice-modal-container">
        <div className="notice-modal-header">
          <div className="notice-modal-title-area">
            {notice.isImportant && (
              <span className="modal-important-badge">중요</span>
            )}
            <h2>{notice.title}</h2>
          </div>
          <button className="notice-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="notice-modal-info">
          <div className="notice-info-item">
            <span className="info-label">작성자:</span>
            <span className="info-value">{notice.authorName || '최관지'}</span>
          </div>
          <div className="notice-info-item">
            <span className="info-label">작성일:</span>
            <span className="info-value">{formatDate(notice.createdAt)}</span>
          </div>
          <div className="notice-info-item">
            <span className="info-label">조회수:</span>
            <span className="info-value">{notice.views || 0}회</span>
          </div>
        </div>

        <div className="notice-modal-content">
          <div className="notice-content-text">
            {notice.content || '내용이 없습니다.'}
          </div>
        </div>

        <div className="notice-modal-footer">
          <button className="notice-modal-confirm-btn" onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

export default NoticeDetailModal;
