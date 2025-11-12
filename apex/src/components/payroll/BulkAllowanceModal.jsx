import React, { useState } from 'react';
import { toast } from 'react-toastify';
import styles from './BulkAllowanceModal.module.css';

const BulkAllowanceModal = ({ isOpen, onClose, onSubmit, year, month }) => {
  const [formData, setFormData] = useState({
    type: '전체',
    category: '인센티브',
    date: `${year}-${String(month).padStart(2, '0')}-01`,
    amount: '',
    attachmentType: '',
    file: null,
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ 
        ...prev, 
        file,
        attachmentType: file.name.split('.').pop()
      }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.warning('금액을 입력해주세요.');
      return;
    }

    try {
      await onSubmit(formData);
      toast.success('전체 수당이 지급되었습니다.');
      handleClose();
    } catch (error) {
      console.error('수당 지급 실패:', error);
      toast.error('수당 지급에 실패했습니다.');
    }
  };

  const handleClose = () => {
    setFormData({
      type: '전체',
      category: '인센티브',
      date: `${year}-${String(month).padStart(2, '0')}-01`,
      amount: '',
      attachmentType: '',
      file: null,
      description: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>기타 수당 추가</h2>

        <div className={styles.formGroup}>
          <label className={styles.label}>항목</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="전체">전체</option>
            <option value="부서별">부서별</option>
            <option value="개인별">개인별</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>구분</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="인센티브">인센티브</option>
            <option value="보너스">보너스</option>
            <option value="명절수당">명절수당</option>
            <option value="야근수당">야근수당</option>
            <option value="특별수당">특별수당</option>
            <option value="기타">기타</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>날짜</label>
          <div className={styles.dateInput}>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>금액</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="입력"
            className={styles.input}
            min="0"
            step="1000"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>첨부파일</label>
          <div className={styles.fileInputWrapper}>
            <input
              type="file"
              id="file-upload"
              className={styles.fileInput}
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
            <label htmlFor="file-upload" className={styles.fileLabel}>
              {formData.file ? formData.file.name : '.pdf, .jpg'}
            </label>
            <button
              type="button"
              className={styles.fileButton}
              onClick={() => document.getElementById('file-upload').click()}
            >
              📎
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>신청사유</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="입력"
            className={styles.textarea}
          />
        </div>

        <button
          onClick={handleSubmit}
          className={styles.submitButton}
        >
          생성
        </button>
      </div>
    </div>
  );
};

export default BulkAllowanceModal;
