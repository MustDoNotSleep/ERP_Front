import React, { useState } from 'react';
import { createNotice } from '../../api/notice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './NoticeCreatePage.css';

function NoticeCreatePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isImportant: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // 취소 버튼
  const handleCancel = () => {
    if (window.confirm('작성을 취소하시겠습니까? 작성 중인 내용은 저장되지 않습니다.')) {
      navigate('/notice');
    }
  };

  // 작성 완료
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!formData.title.trim()) {
      toast.error('제목을 입력해주세요.');
      return;
    }

    if (!formData.content.trim()) {
      toast.error('내용을 입력해주세요.');
      return;
    }

    if (formData.title.length > 200) {
      toast.error('제목은 200자를 초과할 수 없습니다.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createNotice(formData);
      if (response.success) {
        toast.success('공지사항이 작성되었습니다.');
        navigate('/notice');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || '공지사항 작성에 실패했습니다.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="common-wrap">
      <div className="notice-create-container">
        <div className="notice-create-header">
          <h2>공지사항 작성</h2>
        </div>

        <form onSubmit={handleSubmit} className="notice-create-form">
          {/* 제목 입력 */}
          <div className="form-group">
            <label htmlFor="title" className="form-label required">
              제목
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-input"
              placeholder="공지사항 제목을 입력하세요"
              value={formData.title}
              onChange={handleChange}
              maxLength={200}
              required
            />
            <div className="char-count">
              {formData.title.length} / 200
            </div>
          </div>

          {/* 중요 공지 체크박스 */}
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isImportant"
                checked={formData.isImportant}
                onChange={handleChange}
                className="form-checkbox"
              />
              <span className="checkbox-text">중요 공지사항으로 설정</span>
              <span className="checkbox-desc">(메인 페이지 상단에 표시됩니다)</span>
            </label>
          </div>

          {/* 내용 입력 */}
          <div className="form-group">
            <label htmlFor="content" className="form-label required">
              내용
            </label>
            <textarea
              id="content"
              name="content"
              className="form-textarea"
              placeholder="공지사항 내용을 입력하세요"
              value={formData.content}
              onChange={handleChange}
              rows={15}
              required
            />
          </div>

          {/* 버튼 영역 */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              취소
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? '작성 중...' : '작성 완료'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NoticeCreatePage;
