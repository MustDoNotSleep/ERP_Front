import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import styles from './PayslipDetailModal.module.css';

const PayslipDetailModal = ({ isOpen, onClose, salary, onUpdate }) => {
  const [formData, setFormData] = useState({
    // 기본 정보 (읽기 전용)
    employeeId: '',
    employeeName: '',
    positionName: '',
    departmentName: '',
    
    // 기본급
    baseSalary: 0,
    
    // 수당
    positionAllowance: 0,
    mealAllowance: 0,
    transportAllowance: 0,
    overtimeAllowance: 0,
    nightAllowance: 0,
    holidayAllowance: 0,
    otherAllowance: 0,
    
    // 공제
    nationalPension: 0,
    healthInsurance: 0,
    employmentInsurance: 0,
    incomeTax: 0,
    localIncomeTax: 0,
    otherDeductions: 0
  });

  useEffect(() => {
    if (salary) {
      setFormData({
        employeeId: salary.employeeId || '',
        employeeName: salary.employeeName || '',
        positionName: salary.positionName || '',
        departmentName: salary.departmentName || '',
        baseSalary: salary.baseSalary || 0,
        positionAllowance: salary.positionAllowance || 0,
        mealAllowance: salary.mealAllowance || 0,
        transportAllowance: salary.transportAllowance || 0,
        overtimeAllowance: salary.overtimeAllowance || 0,
        nightAllowance: salary.nightAllowance || 0,
        holidayAllowance: salary.holidayAllowance || 0,
        otherAllowance: salary.otherAllowance || 0,
        nationalPension: salary.nationalPension || 0,
        healthInsurance: salary.healthInsurance || 0,
        employmentInsurance: salary.employmentInsurance || 0,
        incomeTax: salary.incomeTax || 0,
        localIncomeTax: salary.localIncomeTax || 0,
        otherDeductions: salary.otherDeductions || 0
      });
    }
  }, [salary]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: Number(value) || 0
    }));
  };

  const calculateTotalSalary = () => {
    return formData.baseSalary +
           formData.positionAllowance +
           formData.mealAllowance +
           formData.transportAllowance +
           formData.overtimeAllowance +
           formData.nightAllowance +
           formData.holidayAllowance +
           formData.otherAllowance;
  };

  const calculateTotalDeductions = () => {
    return formData.nationalPension +
           formData.healthInsurance +
           formData.employmentInsurance +
           formData.incomeTax +
           formData.localIncomeTax +
           formData.otherDeductions;
  };

  const calculateNetSalary = () => {
    return calculateTotalSalary() - calculateTotalDeductions();
  };

  const handleSubmit = async () => {
    try {
      const updateData = {
        ...formData,
        totalSalary: calculateTotalSalary(),
        netSalary: calculateNetSalary()
      };
      
      await onUpdate(salary.id, updateData);
      toast.success('급여 정보가 수정되었습니다.');
      onClose();
    } catch (error) {
      console.error('급여 수정 실패:', error);
      toast.error('급여 수정에 실패했습니다.');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR').format(amount || 0);
  };

  if (!isOpen || !salary) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>급여명세 수정</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        {/* 본문 */}
        <div className={styles.modalBody}>
          {/* 직원 정보 */}
          <div className={styles.infoSection}>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>사번</span>
                <span className={styles.infoValue}>{formData.employeeId}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>이름</span>
                <span className={styles.infoValue}>{formData.employeeName}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>직급</span>
                <span className={styles.infoValue}>{formData.positionName}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>부서</span>
                <span className={styles.infoValue}>{formData.departmentName}</span>
              </div>
            </div>
          </div>

          {/* 기본급 */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>기본급</h3>
            <div className={styles.grid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>기본급</label>
                <input
                  type="number"
                  name="baseSalary"
                  value={formData.baseSalary}
                  onChange={handleChange}
                  className={styles.input}
                  step="1000"
                />
              </div>
            </div>
          </div>

          {/* 수당 */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>수당</h3>
            <div className={styles.grid}>
              {/* <div className={styles.formGroup}>
                <label className={styles.label}>직책수당</label>
                <input
                  type="number"
                  name="positionAllowance"
                  value={formData.positionAllowance}
                  onChange={handleChange}
                  className={styles.input}
                  step="1000"
                />
              </div> */}
              {/* <div className={styles.formGroup}>
                <label className={styles.label}>교통비</label>
                <input
                  type="number"
                  name="transportAllowance"
                  value={formData.transportAllowance}
                  onChange={handleChange}
                  className={styles.input}
                  step="1000"
                />
              </div> */}
              <div className={styles.formGroup}>
                <label className={styles.label}>야근수당</label>
                <input
                  type="number"
                  name="overtimeAllowance"
                  value={formData.overtimeAllowance}
                  onChange={handleChange}
                  className={styles.input}
                  step="1000"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>야간수당</label>
                <input
                  type="number"
                  name="nightAllowance"
                  value={formData.nightAllowance}
                  onChange={handleChange}
                  className={styles.input}
                  step="1000"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>(공)휴일수당</label>
                <input
                  type="number"
                  name="holidayAllowance"
                  value={formData.holidayAllowance}
                  onChange={handleChange}
                  className={styles.input}
                  step="1000"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>기타수당</label>
                <input
                  type="number"
                  name="otherAllowance"
                  value={formData.otherAllowance}
                  onChange={handleChange}
                  className={styles.input}
                  step="1000"
                />
              </div>
            </div>
          </div>

          {/* 공제 */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>공제</h3>
            <div className={styles.grid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>국민연금</label>
                <input
                  type="number"
                  name="nationalPension"
                  value={formData.nationalPension}
                  onChange={handleChange}
                  className={styles.input}
                  step="1000"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>건강보험</label>
                <input
                  type="number"
                  name="healthInsurance"
                  value={formData.healthInsurance}
                  onChange={handleChange}
                  className={styles.input}
                  step="1000"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>고용보험</label>
                <input
                  type="number"
                  name="employmentInsurance"
                  value={formData.employmentInsurance}
                  onChange={handleChange}
                  className={styles.input}
                  step="1000"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>소득세</label>
                <input
                  type="number"
                  name="incomeTax"
                  value={formData.incomeTax}
                  onChange={handleChange}
                  className={styles.input}
                  step="1000"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>지방소득세</label>
                <input
                  type="number"
                  name="localIncomeTax"
                  value={formData.localIncomeTax}
                  onChange={handleChange}
                  className={styles.input}
                  step="1000"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>기타공제</label>
                <input
                  type="number"
                  name="otherDeductions"
                  value={formData.otherDeductions}
                  onChange={handleChange}
                  className={styles.input}
                  step="1000"
                />
              </div>
            </div>
          </div>

          {/* 요약 */}
          <div className={styles.summarySection}>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>총 지급액</span>
                <span className={styles.summaryValue}>
                  ₩{formatCurrency(calculateTotalSalary())}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>총 공제액</span>
                <span className={styles.summaryValue}>
                  ₩{formatCurrency(calculateTotalDeductions())}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>실지급액</span>
                <span className={styles.summaryValue}>
                  ₩{formatCurrency(calculateNetSalary())}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.btnSecondary}>
            취소
          </button>
          <button onClick={handleSubmit} className={styles.btnPrimary}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayslipDetailModal;
