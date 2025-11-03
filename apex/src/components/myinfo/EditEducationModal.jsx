import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import styles from '../common/Modal.module.css';

function EditEducationModal({ isOpen, onClose, education, onSave, onDelete }) {
  const [formData, setFormData] = useState({
    schoolName: '',
    degree: '',
    major: '',
    admissionDate: '',
    graduationDate: '',
    graduationStatus: '졸업',
  });

  useEffect(() => {
    if (education) {
      setFormData({
        schoolName: education.schoolName || '',
        degree: education.degree || '',
        major: education.major || '',
        admissionDate: education.admissionDate ? education.admissionDate.split('T')[0] : '',
        graduationDate: education.graduationDate ? education.graduationDate.split('T')[0] : '',
        graduationStatus: education.graduationStatus || '졸업',
      });
    } else {
      // 새로 추가하는 경우 초기화
      setFormData({
        schoolName: '',
        degree: '',
        major: '',
        admissionDate: '',
        graduationDate: '',
        graduationStatus: '졸업',
      });
    }
  }, [education, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  const handleDelete = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      onDelete();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className={styles.modalHeader}>
        <h2>{education ? '학력 수정' : '학력 추가'}</h2>
      </div>
      <div className={styles.modalBody}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label>학교명</label>
            <input
              type="text"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            />
          </div>
          <div>
            <label>학위</label>
            <select
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            >
              <option value="">선택</option>
              <option value="고졸">고졸</option>
              <option value="전문학사">전문학사</option>
              <option value="학사">학사</option>
              <option value="석사">석사</option>
              <option value="박사">박사</option>
            </select>
          </div>
          <div>
            <label>전공</label>
            <input
              type="text"
              name="major"
              value={formData.major}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            />
          </div>
          <div>
            <label>입학일</label>
            <input
              type="date"
              name="admissionDate"
              value={formData.admissionDate}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            />
          </div>
          <div>
            <label>졸업일</label>
            <input
              type="date"
              name="graduationDate"
              value={formData.graduationDate}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            />
          </div>
          <div>
            <label>졸업구분</label>
            <select
              name="graduationStatus"
              value={formData.graduationStatus}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            >
              <option value="졸업">졸업</option>
              <option value="재학">재학</option>
              <option value="휴학">휴학</option>
              <option value="중퇴">중퇴</option>
            </select>
          </div>
        </div>
      </div>
      <div className={styles.modalFooter}>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <div>
            {education && (
              <button onClick={handleDelete} style={{ backgroundColor: '#f44336', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                삭제
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={onClose} style={{ padding: '0.5rem 1rem', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>
              취소
            </button>
            <button onClick={handleSubmit} style={{ backgroundColor: '#4CAF50', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              저장
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default EditEducationModal;
