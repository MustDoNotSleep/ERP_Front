import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { LEAVE_TYPE_INFO, DURATION_INFO } from '../../../models/LeaveType';
import styles from './AnnualRequests.module.css';

export default function AnnualRequests() {
  const [user, setUser] = useState(null);
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [formData, setFormData] = useState({
    period: '',
    employeeNumber: '',
    department: '',
    position: '',
    applicantDate: '',
    startDate: '',
    endDate: '',
    leaveType: 'ANNUAL',
    duration: 'FULL_DAY',
    reason: '',
    note: ''
  });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      setFormData(prev => ({
        ...prev,
        period: userData.name || '',
        employeeNumber: userData.employeeId || '',
        department: userData.department || '',
        position: userData.positionName || '',
        applicantDate: new Date().toISOString().split('T')[0]
      }));
      loadLeaveBalance(userData.employeeId);
    }
  }, []);

  const loadLeaveBalance = async (employeeId) => {
    try {
      const currentYear = new Date().getFullYear();
      const response = await api.get(`/leaves/employee/${employeeId}/statistics`, {
        params: { year: currentYear }
      });
      if (response.data.success) {
        setLeaveBalance(response.data.data);
      }
    } catch (error) {
      console.error('연차 잔여 정보 조회 실패:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'leaveType') {
      // 휴가 종류 변경 시 duration을 FULL_DAY로 초기화
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        duration: 'FULL_DAY',
        startDate: '',
        endDate: ''
      }));
    } else if (name === 'duration') {
      // duration 변경 시 반차/반반차면 종료일을 시작일과 같게
      const isPartialDay = value !== 'FULL_DAY';
      setFormData(prev => ({
        ...prev,
        [name]: value,
        endDate: isPartialDay && prev.startDate ? prev.startDate : prev.endDate
      }));
    } else if (name === 'startDate') {
      const typeInfo = LEAVE_TYPE_INFO[formData.leaveType];
      
      // 시작일 변경 시 반차/반반차면 종료일도 같이 변경
      const isPartialDay = formData.duration !== 'FULL_DAY';
      
      // 정확한 일수가 정해진 휴가 타입인 경우 자동으로 종료일 계산
      if (typeInfo.minDays === typeInfo.maxDays && typeInfo.maxDays > 0) {
        const startDate = new Date(value);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + typeInfo.maxDays - 1);
        const formattedEndDate = endDate.toISOString().split('T')[0];
        
        setFormData(prev => ({
          ...prev,
          [name]: value,
          endDate: formattedEndDate
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          endDate: isPartialDay ? value : prev.endDate
        }));
      }
    } else if (name === 'endDate') {
      const typeInfo = LEAVE_TYPE_INFO[formData.leaveType];
      
      // 정확한 일수가 정해진 휴가의 경우 검증
      if (typeInfo.minDays === typeInfo.maxDays && typeInfo.maxDays > 0 && formData.startDate) {
        const startDate = new Date(formData.startDate);
        const endDate = new Date(value);
        const diffTime = endDate - startDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        
        if (diffDays !== typeInfo.maxDays) {
          alert(`${typeInfo.name}은(는) 정확히 ${typeInfo.maxDays}일이어야 합니다. 다시 선택해주세요.`);
          return;
        }
      }
      
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleReset = () => {
    setFormData({
      period: user?.name || '',
      employeeNumber: user?.employeeId || '',
      department: user?.department || '',
      position: user?.positionName || '',
      applicantDate: new Date().toISOString().split('T')[0],
      startDate: '',
      endDate: '',
      leaveType: 'ANNUAL',
      duration: 'FULL_DAY',
      reason: '',
      note: ''
    });
  };

  const handleSubmit = async () => {
    try {
      if (!formData.startDate || !formData.endDate || !formData.reason) {
        alert('필수 항목을 모두 입력해주세요. (휴가 기간, 신청 사유)');
        return;
      }

      if (!user?.employeeId) {
        alert('로그인 정보를 찾을 수 없습니다.');
        return;
      }

      // 연차 차감 타입인 경우 잔여 연차 확인 (프론트엔드 사전 체크)
      const typeInfo = LEAVE_TYPE_INFO[formData.leaveType];
      if (typeInfo.deduct && leaveBalance) {
        const durationDays = DURATION_INFO[formData.duration].days;
        if (leaveBalance.remainingAnnualLeave < durationDays) {
          alert(`연차가 부족합니다. (잔여: ${leaveBalance.remainingAnnualLeave}일, 신청: ${durationDays}일)`);
          return;
        }
      }

      // 백엔드 API 형식에 맞춰 요청 데이터 생성
      const requestData = {
        type: formData.leaveType,           // "ANNUAL", "SICK_PAID" 등 또는 "연차", "유급병가" 가능
        duration: formData.duration,         // "FULL_DAY", "HALF_DAY_AM" 등 (항상 전송)
        startDate: formData.startDate,       // "2025-01-10"
        endDate: formData.endDate,           // "2025-01-12"
        reason: formData.reason              // 신청 사유
      };

      console.log('휴가 신청 데이터:', requestData);

      const response = await api.post('/leaves', requestData);
      
      if (response.data.success) {
        alert('휴가 신청이 완료되었습니다.');
        handleReset();
        if (user?.employeeId) {
          loadLeaveBalance(user.employeeId);
        }
      }
    } catch (error) {
      console.error('휴가 신청 실패:', error);
      // 백엔드에서 온 에러 메시지 그대로 표시
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          '휴가 신청 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  const handleTemporarySave = () => {
    localStorage.setItem('leaveRequestDraft', JSON.stringify(formData));
    alert('임시저장되었습니다.');
  };

  const selectedTypeInfo = LEAVE_TYPE_INFO[formData.leaveType];

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>휴가 신청서</h1>
        
        {leaveBalance && selectedTypeInfo.deduct && (
          <div className={styles.balanceInfo}>
            <div className={styles.balanceItem}>
              <span className={styles.balanceLabel}>총 연차</span>
              <span className={styles.balanceValue}>{leaveBalance.totalAnnualLeave}일</span>
            </div>
            <div className={styles.balanceItem}>
              <span className={styles.balanceLabel}>사용</span>
              <span className={styles.balanceValue}>{leaveBalance.usedAnnualLeave}일</span>
            </div>
            <div className={styles.balanceItem}>
              <span className={styles.balanceLabel}>잔여</span>
              <span className={`${styles.balanceValue} ${styles.remaining}`}>
                {leaveBalance.remainingAnnualLeave}일
              </span>
            </div>
          </div>
        )}
        
        <form className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>기안자</label>
              <input
                type="text"
                value={formData.period}
                readOnly
                className={styles.input}
                style={{ backgroundColor: '#f0f0f0' }}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>사원번호</label>
              <input
                type="text"
                value={formData.employeeNumber}
                readOnly
                className={styles.input}
                style={{ backgroundColor: '#f0f0f0' }}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>부서</label>
              <input
                type="text"
                value={formData.department}
                readOnly
                className={styles.input}
                style={{ backgroundColor: '#f0f0f0' }}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>직급</label>
              <input
                type="text"
                value={formData.position}
                readOnly
                className={styles.input}
                style={{ backgroundColor: '#f0f0f0' }}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.label}>휴가 종류</label>
              <div className={styles.selectWrapper}>
                <select
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleChange}
                  className={styles.select}
                >
                  {Object.entries(LEAVE_TYPE_INFO).map(([key, info]) => (
                    <option key={key} value={key}>
                      {info.name} {info.paid ? '(유급)' : '(무급)'}
                      {info.deduct && ' - 연차 차감'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={styles.infoBox}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>구분:</span>
              <span className={styles.infoValue}>
                {selectedTypeInfo.paid ? '유급' : '무급'}
                {selectedTypeInfo.deduct && ' / 연차에서 차감됨'}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>법정 일수:</span>
              <span className={styles.infoValue} style={{ 
                color: selectedTypeInfo.daysRangeDescription !== '제한없음' ? '#e74c3c' : '#666',
                fontWeight: selectedTypeInfo.daysRangeDescription !== '제한없음' ? '600' : 'normal'
              }}>
                {selectedTypeInfo.daysRangeDescription}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>설명:</span>
              <span className={styles.infoValue}>{selectedTypeInfo.description}</span>
            </div>
          </div>

          {selectedTypeInfo.showDuration && (
            <div className={styles.formRow}>
              <div className={styles.formGroup} style={{ flex: 1 }}>
                <label className={styles.label}>기간 구분</label>
                <div className={styles.selectWrapper}>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    {Object.entries(DURATION_INFO).map(([key, info]) => (
                      <option key={key} value={key}>
                        {info.name} ({info.days}일)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>시작일 <span className={styles.required}>*</span></label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                종료일 <span className={styles.required}>*</span>
                {formData.duration !== 'FULL_DAY' && (
                  <small style={{ marginLeft: '8px', color: '#3498db', fontWeight: 'normal' }}>
                    (반차/반반차는 시작일과 동일)
                  </small>
                )}
                {selectedTypeInfo.minDays === selectedTypeInfo.maxDays && selectedTypeInfo.maxDays > 0 && (
                  <small style={{ marginLeft: '8px', color: '#e74c3c', fontWeight: 'normal' }}>
                    (자동 설정: {selectedTypeInfo.maxDays}일)
                  </small>
                )}
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={styles.input}
                min={formData.startDate}
                disabled={
                  formData.duration !== 'FULL_DAY' || 
                  (selectedTypeInfo.minDays === selectedTypeInfo.maxDays && selectedTypeInfo.maxDays > 0)
                }
                style={
                  formData.duration !== 'FULL_DAY' || 
                  (selectedTypeInfo.minDays === selectedTypeInfo.maxDays && selectedTypeInfo.maxDays > 0)
                    ? { backgroundColor: '#f0f0f0' } 
                    : {}
                }
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.label}>신청 사유 <span className={styles.required}>*</span></label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className={styles.textarea}
                rows={4}
                placeholder="신청 사유를 입력하세요"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.label}>비고</label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                className={styles.textarea}
                rows={3}
                placeholder="추가 사항을 입력하세요"
              />
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={handleReset}
              className={`${styles.button} ${styles.resetButton}`}
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleTemporarySave}
              className={`${styles.button} ${styles.tempSaveButton}`}
            >
              임시저장
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className={`${styles.button} ${styles.submitButton}`}
            >
              신청
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}