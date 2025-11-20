// src/pages/payroll/RetirementManage.jsx
import React, { useState, useEffect } from 'react';
import { 
  fetchRetirementRequests,
  processRetirement,
  fetchRetirementStatistics
} from '../../api/retirement';
import { toast } from 'react-toastify';
import { getCurrentUser } from '../../api/auth';
import Modal from '../../components/common/Modal';
import styles from './RetirementManage.module.css';

export default function RetirementManage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [status, setStatus] = useState('전체');
  const [requests, setRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0
  });
  
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadRequests();
      loadStatistics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, currentUser]);

  useEffect(() => {
    filterRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, allRequests]);

  const loadCurrentUser = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error);
      toast.error('사용자 정보를 불러오는데 실패했습니다.');
    }
  };

  const loadRequests = async () => {
    try {
      setLoading(true);
      // 페이징 처리 (page=0부터 시작, size=100)
      const data = await fetchRetirementRequests({ page: 0, size: 100 });
      // Page 객체인 경우 content 속성 사용
      const requestsList = data.content || data;
      
      // 연도 필터링
      const filtered = requestsList.filter(req => {
        const reqYear = new Date(req.applicationDate).getFullYear();
        return reqYear === year;
      });
      
      setAllRequests(filtered);
      setRequests(filtered);
    } catch (error) {
      console.error('퇴직 신청 목록 조회 실패:', error);
      toast.error('퇴직 신청 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await fetchRetirementStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('통계 조회 실패:', error);
    }
  };

  const filterRequests = () => {
    if (status === '전체') {
      setRequests(allRequests);
    } else {
      const statusMap = {
        '대기': 'PENDING',
        '승인': 'APPROVED',
        '반려': 'REJECTED'
      };
      const backendStatus = statusMap[status];
      setRequests(allRequests.filter(req => req.status === backendStatus));
    }
  };

  const handleApprove = async (request) => {
    if (!window.confirm(`${request.employee.name}님의 퇴직 신청을 승인하시겠습니까?`)) {
      return;
    }

    try {
      const approvalData = {
        processorId: currentUser.id,
        approved: true,
        finalResignationDate: request.desiredResignationDate // 희망일을 최종일로 사용
      };
      await processRetirement(request.id, approvalData);
      toast.success('퇴직 신청이 승인되었습니다.');
      await loadRequests();
      await loadStatistics();
    } catch (error) {
      console.error('퇴직 승인 실패:', error);
      toast.error(error.response?.data?.message || '퇴직 승인에 실패했습니다.');
    }
  };

  const handleRejectClick = (request) => {
    setSelectedRequest(request);
    setRejectionReason('');
    setIsRejectModalOpen(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectionReason.trim()) {
      toast.error('반려 사유를 입력해주세요.');
      return;
    }

    try {
      const rejectionData = {
        processorId: currentUser.id,
        approved: false,
        rejectionReason: rejectionReason
      };
      await processRetirement(selectedRequest.id, rejectionData);
      toast.success('퇴직 신청이 반려되었습니다.');
      setIsRejectModalOpen(false);
      setSelectedRequest(null);
      setRejectionReason('');
      await loadRequests();
      await loadStatistics();
    } catch (error) {
      console.error('퇴직 반려 실패:', error);
      toast.error('퇴직 반려에 실패했습니다.');
    }
  };

  const getStatusBadge = (statusValue) => {
    const statusMap = {
      'PENDING': { text: '승인 대기', className: styles.statusPending },
      'APPROVED': { text: '승인 완료', className: styles.statusApproved },
      'REJECTED': { text: '반려', className: styles.statusRejected },
      'CANCELLED': { text: '취소됨', className: styles.statusCancelled }
    };
    
    const statusInfo = statusMap[statusValue] || { text: statusValue, className: '' };
    return <span className={`${styles.statusBadge} ${statusInfo.className}`}>{statusInfo.text}</span>;
  };

  const calculateWorkYears = (hireDate, resignationDate) => {
    if (!hireDate || !resignationDate) return '-';
    const hire = new Date(hireDate);
    const resignation = new Date(resignationDate);
    const years = (resignation - hire) / (1000 * 60 * 60 * 24 * 365.25);
    return `${years.toFixed(1)}년`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  return (
    <div className={styles.container}>
      {/* 필터 섹션 */}
      <div className={styles.filterSection}>
        <div className={styles.filterTitle}>퇴직자 관리</div>
        <div className={styles.filterControls}>
          <div className={styles.filterGroup}>
            <label>연도</label>
            <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
              {[...Array(5)].map((_, i) => {
                const y = new Date().getFullYear() - i;
                return <option key={y} value={y}>{y}년</option>;
              })}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>상태</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="전체">전체</option>
              <option value="대기">승인 대기</option>
              <option value="승인">승인 완료</option>
              <option value="반려">반려</option>
              <option value="완료">퇴직 완료</option>
            </select>
          </div>
        </div>
      </div>

      {/* 통계 섹션 */}
      <div className={styles.summarySection}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>총 신청 건수</div>
          <div className={styles.summaryValue}>{statistics.totalApplications}건</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>승인 대기</div>
          <div className={styles.summaryValue}>
            {statistics.pendingApplications}건
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>승인 완료</div>
          <div className={styles.summaryValue}>
            {statistics.approvedApplications}건
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>반려</div>
          <div className={styles.summaryValue}>
            {statistics.rejectedApplications}건
          </div>
        </div>
      </div>

      {/* 테이블 섹션 */}
      <div className={styles.tableSection}>
        {loading ? (
          <div className={styles.loading}>로딩 중...</div>
        ) : requests.length === 0 ? (
          <div className={styles.noData}>퇴직 신청 내역이 없습니다.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>신청일</th>
                <th>사번</th>
                <th>성명</th>
                <th>부서</th>
                <th>직급</th>
                <th>입사일</th>
                <th>퇴직 희망일</th>
                <th>근속연수</th>
                <th>퇴직 사유</th>
                <th>상태</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>{formatDate(request.applicationDate)}</td>
                  <td>{request.employee.id}</td>
                  <td>{request.employee.name}</td>
                  <td>{request.employee.departmentName}</td>
                  <td>{request.employee.positionName}</td>
                  <td>{formatDate(request.employee.hireDate)}</td>
                  <td>{formatDate(request.desiredResignationDate)}</td>
                  <td>{formatDate(request.desiredResignationDate)}</td>
                  <td>{calculateWorkYears(request.employee.hireDate, request.desiredResignationDate)}</td>
                  <td>{request.reason}</td>
                  <td>{getStatusBadge(request.status)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      {request.status === 'PENDING' && (
                        <>
                          <button
                            className={styles.approveBtn}
                            onClick={() => handleApprove(request)}
                            title="승인"
                          >
                            승인
                          </button>
                          <button
                            className={styles.rejectBtn}
                            onClick={() => handleRejectClick(request)}
                            title="반려"
                          >
                            반려
                          </button>
                        </>
                      )}
                      {request.status === 'APPROVED' && (
                        <span style={{ color: '#28a745' }}>✓ 승인됨</span>
                      )}
                      {request.status === 'REJECTED' && (
                        <span style={{ color: '#dc3545' }}>반려됨</span>
                      )}
                      {request.status === 'CANCELLED' && (
                        <span style={{ color: '#999' }}>취소됨</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 반려 사유 입력 모달 */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
          setSelectedRequest(null);
          setRejectionReason('');
        }}
        title="퇴직 신청 반려"
      >
        <div style={{ padding: '20px' }}>
          <div style={{ marginBottom: '15px' }}>
            <strong>{selectedRequest?.employee?.name}</strong>님의 퇴직 신청을 반려하시겠습니까?
          </div>
          <div className={styles.formGroup}>
            <label>반려 사유 *</label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows="4"
              placeholder="반려 사유를 입력해주세요."
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button
              className={styles.cancelBtn}
              onClick={() => {
                setIsRejectModalOpen(false);
                setSelectedRequest(null);
                setRejectionReason('');
              }}
            >
              취소
            </button>
            <button
              className={styles.rejectBtn}
              onClick={handleRejectSubmit}
            >
              반려
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
