import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import EmployeeSearchModal from '../common/EmployeeSearchModal';
import { fetchUniqueDepartmentNames } from '../../api/department';
import { fetchUniquePositionNames } from '../../api/position';
import styles from './AllowanceForm.module.css';

/**
 * 기타 수당 추가 폼 컴포넌트
 */
export default function AllowanceForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    type: '전체',
    targetDepartment: '',
    targetPosition: '',
    targetEmployee: '',
    targetEmployeeName: '',
    month: new Date().toISOString().slice(0, 7), // YYYY-MM 형식
    amount: '',
    file: null,
    description: ''
  });

  const [isEmployeeSearchOpen, setIsEmployeeSearchOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    loadDepartments();
    loadPositions();
  }, []);

  const loadDepartments = async () => {
    try {
      const data = await fetchUniqueDepartmentNames();
      console.log('부서 데이터:', data);
      // API 응답이 배열이 아닐 경우 처리
      if (Array.isArray(data)) {
        setDepartments(data);
      } else if (data?.data && Array.isArray(data.data)) {
        setDepartments(data.data);
      } else {
        setDepartments([]);
      }
    } catch (error) {
      console.error('부서 목록 조회 실패:', error);
      setDepartments([]);
    }
  };

  const loadPositions = async () => {
    try {
      const data = await fetchUniquePositionNames();
      console.log('직급 데이터:', data);
      // API 응답이 배열이 아닐 경우 처리
      if (Array.isArray(data)) {
        setPositions(data);
      } else if (data?.data && Array.isArray(data.data)) {
        setPositions(data.data);
      } else {
        setPositions([]);
      }
    } catch (error) {
      console.error('직급 목록 조회 실패:', error);
      setPositions([]);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // 항목 변경 시 대상 관련 필드 초기화
      if (name === 'type') {
        newData.targetDepartment = '';
        newData.targetPosition = '';
        newData.targetEmployee = '';
        newData.targetEmployeeName = '';
      }
      
      return newData;
    });
  };

  const handleAmountQuickAdd = (addAmount) => {
    setFormData(prev => ({
      ...prev,
      amount: String(Number(prev.amount || 0) + addAmount)
    }));
  };

  const handleSelectEmployee = (employee) => {
    setFormData(prev => ({
      ...prev,
      targetEmployee: employee.id.toString(),
      targetEmployeeName: employee.name
    }));
    setIsEmployeeSearchOpen(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
    }
  };

  const handleSubmit = async () => {
    console.log('🔥 handleSubmit 호출됨!');
    console.log('현재 formData:', formData);
    
    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.warning('금액을 입력해주세요.');
      return;
    }

    try {
      console.log('✅ onSubmit 호출 시작...');
      await onSubmit(formData);
      console.log('✅ onSubmit 완료!');
      
      // 폼 초기화
      setFormData({
        type: '전체',
        targetDepartment: '',
        targetPosition: '',
        targetEmployee: '',
        targetEmployeeName: '',
        category: '인센티브',
        month: new Date().toISOString().slice(0, 7),
        amount: '',
        file: null,
        description: ''
      });
      
      // 파일 input 초기화
      const fileInput = document.getElementById('file-upload');
      if (fileInput) fileInput.value = '';
      
      toast.success('수당이 등록되었습니다.');
    } catch (error) {
      console.error('❌ 수당 등록 실패:', error);
      toast.error('수당 등록에 실패했습니다.');
    }
  };

  return (
    <div className={styles.formSection}>
      <h2 className={styles.formTitle}>기타 수당 추가</h2>

      <div className={styles.formGroup}>
        <label className={styles.label}>항목</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleFormChange}
          className={styles.select}
        >
          <option value="전체">전체</option>
          <option value="직급별">직급별</option>
          <option value="부서별">부서별</option>
          <option value="개인별">개인별</option>
        </select>
      </div>

      {/* 항목에 따른 대상 선택 */}
      {formData.type === '부서별' && (
        <div className={styles.formGroup}>
          <label className={styles.label}>부서 선택</label>
          <select
            name="targetDepartment"
            value={formData.targetDepartment}
            onChange={handleFormChange}
            className={styles.select}
          >
            <option value="">부서를 선택하세요</option>
            {departments.map((dept, index) => (
              <option key={index} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      )}

      {formData.type === '직급별' && (
        <div className={styles.formGroup}>
          <label className={styles.label}>직급 선택</label>
          <select
            name="targetPosition"
            value={formData.targetPosition}
            onChange={handleFormChange}
            className={styles.select}
          >
            <option value="">직급을 선택하세요</option>
            {positions.map((pos, index) => (
              <option key={index} value={pos}>
                {pos}
              </option>
            ))}
          </select>
        </div>
      )}

      {formData.type === '개인별' && (
        <div className={styles.formGroup}>
          <label className={styles.label}>직원 선택</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={formData.targetEmployeeName}
              placeholder="직원을 선택하세요"
              className={styles.input}
              readOnly
              style={{ cursor: 'pointer', backgroundColor: '#f5f5f5' }}
              onClick={() => setIsEmployeeSearchOpen(true)}
            />
            <button
              type="button"
              onClick={() => setIsEmployeeSearchOpen(true)}
              className={styles.fileButton}
              style={{ minWidth: '40px' }}
            >
              🔍
            </button>
          </div>
        </div>
      )}

      <div className={styles.formGroup}>
        <label className={styles.label}>월</label>
        <input
          type="month"
          name="month"
          value={formData.month}
          onChange={handleFormChange}
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>금액</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleFormChange}
          placeholder="입력"
          className={styles.input}
          min="0"
          step="1000"
        />
        <div className={styles.amountButtons}>
          <button
            type="button"
            onClick={() => handleAmountQuickAdd(10000)}
            className={styles.amountBtn}
          >
            +1만
          </button>
          <button
            type="button"
            onClick={() => handleAmountQuickAdd(100000)}
            className={styles.amountBtn}
          >
            +10만
          </button>
          <button
            type="button"
            onClick={() => handleAmountQuickAdd(1000000)}
            className={styles.amountBtn}
          >
            +100만
          </button>
        </div>
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
          onChange={handleFormChange}
          placeholder="입력"
          className={styles.textarea}
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className={styles.submitButton}
        disabled={!formData.amount}
      >
        생성
      </button>

      {/* 직원 검색 모달 */}
      <EmployeeSearchModal
        isOpen={isEmployeeSearchOpen}
        onClose={() => setIsEmployeeSearchOpen(false)}
        onSelectEmployee={handleSelectEmployee}
      />
    </div>
  );
}
