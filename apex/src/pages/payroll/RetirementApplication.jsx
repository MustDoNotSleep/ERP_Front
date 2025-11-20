// src/pages/payroll/RetirementApplication.jsx
import React, { useState, useEffect } from 'react';
import { createRetirementRequest, fetchRetirementByEmployeeId, cancelRetirementRequest } from '../../api/retirement';
import { getCurrentUser } from '../../api/auth';
import { toast } from 'react-toastify';
import styles from './RetirementApplication.module.css';

export default function RetirementApplication() {
  const [existingRequest, setExistingRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentEmployeeId, setCurrentEmployeeId] = useState(null);
  
  const [formData, setFormData] = useState({
    desiredResignationDate: '',
    reason: '',
    detailedReason: ''
  });

  useEffect(() => {
    loadUserAndRequest();
  }, []);

  const loadUserAndRequest = async () => {
    try {
      const user = getCurrentUser();
      console.log('현재 사용자 정보:', user);
      console.log('사용자 ID:', user.employeeId);
      
      setCurrentEmployeeId(user.employeeId);
      
      // 기존 퇴직 신청이 있는지 확인
      try {
        const requests = await fetchRetirementByEmployeeId(user.employeeId);
        // 가장 최근 신청 (배열의 첫 번째)
        if (requests && requests.length > 0) {
          const latestRequest = requests[0];
          setExistingRequest(latestRequest);
          setFormData({
            desiredResignationDate: latestRequest.desiredResignationDate || '',
            reason: latestRequest.reason || '',
            detailedReason: latestRequest.detailedReason || ''
          });
        }
      } catch (error) {
        // 404는 정상 (신청 내역 없음)
        if (error.response && error.response.status !== 404) {
          console.error('퇴직 신청 조회 실패:', error);
        }
      }
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error);
      toast.error('사용자 정보를 불러오는데 실패했습니다.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentEmployeeId) {
      toast.error('사용자 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    
    if (!formData.desiredResignationDate) {
      toast.error('퇴직 희망일을 입력해주세요.');
      return;
    }
    
    if (!formData.reason) {
      toast.error('퇴직 사유를 선택해주세요.');
      return;
    }

    try {
      setLoading(true);
      const requestData = {
        employeeId: currentEmployeeId,
        ...formData
      };
      
      console.log('퇴직 신청 데이터:', requestData);
      
      await createRetirementRequest(requestData);
      toast.success('퇴직 신청이 완료되었습니다.');
      await loadUserAndRequest();
    } catch (error) {
      console.error('퇴직 신청 실패:', error);
      toast.error(error.response?.data?.message || '퇴직 신청에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('퇴직 신청을 취소하시겠습니까?')) {
      return;
    }

    try {
      setLoading(true);
      await cancelRetirementRequest(existingRequest.id);
      toast.success('퇴직 신청이 취소되었습니다.');
      setExistingRequest(null);
      setFormData({
        desiredResignationDate: '',
        reason: '',
        detailedReason: ''
      });
    } catch (error) {
      console.error('퇴직 신청 취소 실패:', error);
      toast.error('퇴직 신청 취소에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'PENDING': { text: '승인 대기', className: styles.statusPending },
      'APPROVED': { text: '승인 완료', className: styles.statusApproved },
      'REJECTED': { text: '반려', className: styles.statusRejected },
      'CANCELLED': { text: '취소됨', className: styles.statusCancelled }
    };
    
    const statusInfo = statusMap[status] || { text: status, className: '' };
    return <span className={`${styles.statusBadge} ${statusInfo.className}`}>{statusInfo.text}</span>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  return (
    <div className={styles.container}>
      <div className={styles.filterSection}>
        <div className={styles.filterTitle}>퇴직 신청</div>
      </div>

      {existingRequest && (
        <div className={styles.infoBox} style={{ marginBottom: '20px' }}>
          <h3>현재 신청 상태</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
            <span>신청일: {formatDate(existingRequest.applicationDate)}</span>
            <span>퇴직 희망일: {formatDate(existingRequest.desiredResignationDate)}</span>
            <span>상태: {getStatusBadge(existingRequest.status)}</span>
          </div>
          {existingRequest.rejectionReason && (
            <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
              <strong>반려 사유:</strong> {existingRequest.rejectionReason}
            </div>
          )}
          {existingRequest.finalResignationDate && (
            <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#d1ecf1', borderRadius: '4px' }}>
              <strong>최종 퇴사일:</strong> {formatDate(existingRequest.finalResignationDate)}
            </div>
          )}
        </div>
      )}

      <div className={styles.formSection}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>퇴직 희망일 *</label>
            <input
              type="date"
              name="desiredResignationDate"
              value={formData.desiredResignationDate}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              disabled={existingRequest && existingRequest.status === 'APPROVED'}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>퇴직 사유 *</label>
            <select
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              disabled={existingRequest && existingRequest.status === 'APPROVED'}
              required
            >
              <option value="">선택하세요</option>
              <option value="개인사정">개인 사정</option>
              <option value="이직">이직</option>
              <option value="건강">건강상의 이유</option>
              <option value="학업">학업</option>
              <option value="정년">정년퇴직</option>
              <option value="가족">가족 돌봄</option>
              <option value="기타">기타</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>상세 사유 (선택)</label>
            <textarea
              name="detailedReason"
              value={formData.detailedReason}
              onChange={handleInputChange}
              rows="4"
              placeholder="퇴직 사유에 대한 상세 내용을 입력해주세요."
              disabled={existingRequest && existingRequest.status === 'APPROVED'}
            />
          </div>

          <div className={styles.buttonGroup} style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            {existingRequest && existingRequest.status === 'PENDING' && (
              <button
                type="button"
                onClick={handleCancel}
                className={styles.cancelBtn}
                disabled={loading}
              >
                신청 취소
              </button>
            )}
            
            {(!existingRequest || existingRequest.status === 'REJECTED') && (
              <button
                type="submit"
                className={styles.confirmBtn}
                disabled={loading}
              >
                {loading ? '처리중...' : existingRequest ? '재신청' : '퇴직 신청'}
              </button>
            )}
          </div>
        </form>
      </div>

      <div className={styles.infoBox} style={{ marginTop: '30px' }}>
        <h3>📋 안내사항</h3>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li>퇴직 희망일은 최소 14일 이후로 설정해주세요.</li>
          <li>퇴직 신청 후 승인 대기 중일 때는 취소가 가능합니다.</li>
          <li>승인 완료된 퇴직은 취소가 불가능하며, 인사팀에 문의해주세요.</li>
          <li>반려된 경우 사유를 확인 후 재신청이 가능합니다.</li>
          <li>퇴직금은 퇴직 처리 완료 후 정산됩니다.</li>
        </ul>
      </div>
    </div>
  );
}
