import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/common';
import api from '../../../api/axios';
import styles from './LeaveDetailModal.module.css';

export default function LeaveDetailModal({ isOpen, onClose }) {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (isOpen) {
      loadMyLeaves();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, selectedYear]);

  const loadMyLeaves = async () => {
    try {
      setLoading(true);
      
      // localStorage에서 사용자 정보 가져오기
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        console.error('로그인 정보가 없습니다.');
        return;
      }
      
      const user = JSON.parse(userStr);
      const employeeId = user.employeeId;
      
      if (!employeeId) {
        console.error('사원 ID를 찾을 수 없습니다.');
        return;
      }

      // 개인 휴가 조회 API 사용
      const response = await api.get(`/leaves/employee/${employeeId}`);
      const data = response.data?.data || [];
      
      // 선택한 년도 필터링 및 데이터 가공
      const processedData = data
        .filter(item => {
          if (!item.startDate) return false;
          const leaveYear = new Date(item.startDate).getFullYear();
          return leaveYear === selectedYear;
        })
        .map(item => ({
          id: item.id,
          startDate: item.startDate ? new Date(item.startDate).toLocaleDateString('ko-KR') : '-',
          endDate: item.endDate ? new Date(item.endDate).toLocaleDateString('ko-KR') : '-',
          type: getLeaveTypeLabel(item.type),
          duration: getLeaveDurationLabel(item.duration),
          leaveDays: item.leaveDays != null ? `${item.leaveDays}일` : '-',
          status: getLeaveStatusLabel(item.status),
          reason: item.reason || '-',
          approvedBy: item.approvedBy?.name || '-',
          approvedAt: item.approvedAt ? new Date(item.approvedAt).toLocaleDateString('ko-KR') : '-'
        }))
        .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

      setLeaves(processedData);
    } catch (err) {
      console.error('휴가 기록 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const getLeaveTypeLabel = (type) => {
    const labels = {
      'ANNUAL': '연차',
      'SICK': '병가',
      'SPECIAL': '특별휴가',
      'UNPAID': '무급휴가'
    };
    return labels[type] || type;
  };

  const getLeaveDurationLabel = (duration) => {
    const labels = {
      'FULL_DAY': '연차',
      'HALF_DAY': '반차',
      'QUARTER_DAY': '반반차'
    };
    return labels[duration] || duration;
  };

  const getLeaveStatusLabel = (status) => {
    const labels = {
      'PENDING': '대기',
      'APPROVED': '승인',
      'REJECTED': '반려',
      'CANCELLED': '취소'
    };
    return labels[status] || status;
  };

  const handleYearChange = (delta) => {
    setSelectedYear(prev => prev + delta);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="내 휴가 기록" size="full">
      <div className={styles.modalContent}>
        {/* 년도 선택기 */}
        <div className={styles.yearSelector}>
          <button 
            className={styles.yearButton}
            onClick={() => handleYearChange(-1)}
          >
            ←
          </button>
          <span className={styles.yearDisplay}>
            {selectedYear}년
          </span>
          <button 
            className={styles.yearButton}
            onClick={() => handleYearChange(1)}
          >
            →
          </button>
        </div>

        {/* 테이블 */}
        {loading ? (
          <div className={styles.loadingMessage}>
            데이터를 불러오는 중...
          </div>
        ) : leaves.length === 0 ? (
          <div className={styles.emptyMessage}>
            해당 년도의 휴가 기록이 없습니다.
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>시작일</th>
                  <th>종료일</th>
                  <th>휴가유형</th>
                  <th>기간</th>
                  <th>사용일수</th>
                  <th>상태</th>
                  <th>사유</th>
                  <th>승인자</th>
                  <th>승인일</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((record) => (
                  <tr key={record.id}>
                    <td>{record.startDate}</td>
                    <td>{record.endDate}</td>
                    <td>{record.type}</td>
                    <td>{record.duration}</td>
                    <td>{record.leaveDays}</td>
                    <td>
                      <span className={`${styles.badge} ${styles[`badge${record.status}`]}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className={styles.reasonCell}>{record.reason}</td>
                    <td>{record.approvedBy}</td>
                    <td>{record.approvedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 닫기 버튼 */}
        <div className={styles.footer}>
          <button className={styles.closeButton} onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </Modal>
  );
}
