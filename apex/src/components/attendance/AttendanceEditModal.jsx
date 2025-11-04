import React from 'react';
import { Modal, Button, Input, Select } from '../common';
import styles from './AttendanceEditModal.module.css';

const AttendanceEditModal = ({
  isOpen,
  onClose,
  selectedRecord,
  editForm,
  onFormChange,
  onSave,
  statusOptions
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="근태 기록 수정"
    >
      <div className={styles.modalContent}>
        {/* 직원 정보 카드 */}
        <div className={styles.employeeInfo}>
          <div className={styles.employeeInfoTitle}>직원 정보</div>
          <div className={styles.employeeName}>
            {selectedRecord?.employeeName} ({selectedRecord?.employeeId})
          </div>
          <div className={styles.employeeDetails}>
            <span>📋 {selectedRecord?.departmentName}</span>
            <span className={styles.divider}>|</span>
            <span>📅 {selectedRecord?.attendanceDate}</span>
          </div>
        </div>

        {/* 폼 그리드 */}
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>이름</label>
            <Input
              type="text"
              value={selectedRecord?.employeeName || ''}
              disabled
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>사번</label>
            <Input
              type="text"
              value={selectedRecord?.employeeId || ''}
              disabled
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>부서</label>
            <Input
              type="text"
              value={selectedRecord?.departmentName || ''}
              disabled
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>근태일자</label>
            <Input
              type="date"
              value={selectedRecord?.attendanceDate || ''}
              disabled
            />
          </div>

          <div className={styles.formGroup}>
            <label className={`${styles.label} ${styles.requiredLabel}`}>출근시간</label>
            <Input
              type="time"
              value={editForm.checkInTime}
              onChange={(e) => onFormChange('checkInTime', e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={`${styles.label} ${styles.requiredLabel}`}>퇴근시간</label>
            <Input
              type="time"
              value={editForm.checkOutTime}
              onChange={(e) => onFormChange('checkOutTime', e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={`${styles.label} ${styles.requiredLabel}`}>근태상태</label>
            <Select
              value={editForm.status}
              onChange={(e) => onFormChange('status', e.target.value)}
              options={statusOptions}
            />
          </div>

          <div className={styles.formGroupFull}>
            <label className={styles.label}>변경 사유</label>
            <textarea
              className={styles.textarea}
              value={editForm.remarks}
              onChange={(e) => onFormChange('remarks', e.target.value)}
              placeholder="변경 사유를 입력하세요 (예: 출근 버튼 미입력)"
              rows="4"
            />
          </div>
        </div>

        {/* 버튼 그룹 */}
        <div className={styles.buttonGroup}>
          <Button variant="light" onClick={onClose}>
            취소
          </Button>
          <Button variant="primary" onClick={onSave}>
            수정완료
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AttendanceEditModal;
