import React, { useState, useEffect } from 'react';
import { Card, DataTable } from '../../../components/common';
import api from '../../../api/axios';
import styles from './LeaveStatus.module.css';

export default function LeaveStatus() {
  const [balanceInfo, setBalanceInfo] = useState({
    totalDays: 0,
    usedDays: 0,
    remainingDays: 0
  });

  const [leaveHistory, setLeaveHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [loading, setLoading] = useState(false);

  // 데이터 로드
  useEffect(() => {
    loadStatistics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadStatistics = async () => {
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
      
      const currentYear = new Date().getFullYear();
      
      // 휴가 통계 조회
      const statsResponse = await api.get(`/leaves/employee/${employeeId}/statistics`, {
        params: { year: currentYear }
      });

      const statsData = statsResponse.data?.data;
      
      console.log('통계 API 응답:', statsData); // 디버깅용
      
      if (statsData) {
        // 연차 잔여 정보 (API 필드명에 맞게 수정)
        const balanceData = {
          totalDays: statsData.totalAnnualLeave || 0,
          usedDays: statsData.usedAnnualLeave || 0,
          remainingDays: statsData.remainingAnnualLeave || 0
        };
        console.log('설정될 balanceInfo:', balanceData); // 디버깅용
        setBalanceInfo(balanceData);
      }

      // 휴가 이력 조회
      const historyResponse = await api.get(`/leaves/employee/${employeeId}`);
      const leavesData = historyResponse.data?.data || [];
      
      // 올해 휴가만 필터링하고 정렬
      const currentYearLeaves = leavesData
        .filter(leave => {
          if (!leave.startDate) return false;
          const leaveYear = new Date(leave.startDate).getFullYear();
          return leaveYear === currentYear;
        })
        .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

      setLeaveHistory(currentYearLeaves);
      console.log('휴가 이력 데이터:', leavesData); // 디버깅용
      if (leavesData.length > 0) {
        console.log('첫 번째 휴가 데이터 전체:', JSON.stringify(leavesData[0], null, 2)); // 전체 구조 확인
        console.log('사용 가능한 필드들:', Object.keys(leavesData[0])); // 모든 필드명 출력
      }

    } catch (err) {
      console.error('휴가 데이터 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const getLeaveTypeLabel = (type) => {
    const labels = {
      'ANNUAL': '연차',
      'SICK': '병가',
      'SICK_PAID': '유급병가',
      'MATERNITY': '출산휴가',
      'PATERNITY': '배우자출산휴가',
      'CHILDCARE': '육아휴직',
      'MARRIAGE': '결혼휴가',
      'FAMILY_MARRIAGE': '가족결혼휴가',
      'BEREAVEMENT': '경조사',
      'OFFICIAL': '공가',
      'UNPAID': '무급휴가'
    };
    return labels[type] || type;
  };

  const getLeaveDurationLabel = (duration) => {
    const labels = {
      'FULL_DAY': '종일',
      'HALF_DAY_AM': '오전 반차',
      'HALF_DAY_PM': '오후 반차',
      'QUARTER_DAY_AM': '오전 반반차',
      'QUARTER_DAY_PM': '오후 반반차',
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

  // 잔여 연차 진행률 계산
  const usagePercentage = balanceInfo.totalDays > 0 
    ? Math.round((balanceInfo.usedDays / balanceInfo.totalDays) * 100) 
    : 0;

  // console.log('사용률 계산:', {
  //   totalDays: balanceInfo.totalDays,
  //   usedDays: balanceInfo.usedDays,
  //   usagePercentage
  // }); // 디버깅용

  // 페이지네이션
  const totalPages = Math.ceil(leaveHistory.length / pageSize);
  const paginatedData = leaveHistory.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // DataTable 헤더
  const tableHeaders = [
    { label: 'no' },
    { label: '휴가 종류' },
    { label: '기간 구분' },
    { label: '사용 일수' },
    { label: '기간' },
    { label: '승인 여부' }
  ];

  // DataTable 렌더 함수
  const renderLeaveRow = (item, index) => {
    const startDate = item.startDate ? new Date(item.startDate).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' }) : '-';
    const endDate = item.endDate ? new Date(item.endDate).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' }) : '-';
    
    // 일수 계산: startDate와 endDate로 계산하거나 duration 값 사용
    let displayDays = 0;
    if (item.startDate && item.endDate) {
      const start = new Date(item.startDate);
      const end = new Date(item.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end day
      
      // duration이 "반차"면 0.5일로 표시
      displayDays = item.duration === '반차' ? 0.5 : diffDays;
    }
    
    return (
      <>
        <td>{index + 1}</td>
        <td>{getLeaveTypeLabel(item.type)}</td>
        <td>{getLeaveDurationLabel(item.duration)}</td>
        <td>{displayDays}</td>
        <td>{`${startDate}~${endDate}`}</td>
        <td>{getLeaveStatusLabel(item.status)}</td>
      </>
    );
  };

  // 연차/반차 카운트 계산 - API 응답의 한글 값 기준
  const annualCount = leaveHistory.filter(l => 
    l.type === '연차' && l.duration === '연차'
  ).length;
  
  const halfDayCount = leaveHistory.filter(l => 
    l.type === '연차' && l.duration === '반차'
  ).length;
  
  console.log('연차 카운트:', annualCount, '반차 카운트:', halfDayCount); // 디버깅용

  return (
    <div className={styles.container}>
      {/* 연차 현황 */}
      <div className={styles.balanceSection}>
        <div className={styles.balanceWrapper}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>연차 현황</h2>
          </div>
          
          <div className={styles.balanceGrid}>
            <Card className={styles.balanceCard}>
              <div className={styles.balanceLabel}>부여</div>
              <div className={styles.balanceValue}>{balanceInfo.totalDays}일</div>
            </Card>

            <Card className={styles.balanceCard}>
              <div className={styles.balanceLabel}>사용</div>
              <div className={styles.balanceValue}>{balanceInfo.usedDays}일</div>
            </Card>

            <Card className={styles.balanceCard}>
              <div className={styles.balanceLabel}>잔여</div>
              <div className={`${styles.balanceValue} ${styles.remaining}`}>
                {balanceInfo.remainingDays}일
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* 휴가 현황 및 사용률 */}
      <div className={styles.contentSection}>
        {/* 휴가 현황 테이블 */}
        <div className={styles.tableSection}>
          <div className={styles.tableHeader}>
            <h3 className={styles.tableTitle}>휴가 현황</h3>
          </div>
          
          {loading ? (
            <div className={styles.loadingMessage}>데이터를 불러오는 중...</div>
          ) : (
            <>
              <DataTable
                headers={tableHeaders}
                data={paginatedData}
                renderRow={renderLeaveRow}
                emptyMessage="휴가 기록이 없습니다."
              />
              
              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className={styles.pageButton}
                  >
                    ◀
                  </button>
                  <span className={styles.pageInfo}>{currentPage}</span>
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className={styles.pageButton}
                  >
                    ▶
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* 사용률 차트 */}
        <div className={styles.chartSection}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>사용률</h3>
          </div>
          
          <div className={styles.pieChartWrapper}>
            <svg viewBox="0 0 200 200" className={styles.pieChart}>
              {/* 연차 (진한 색) */}
              <circle
                cx="100"
                cy="100"
                r="70"
                fill="none"
                stroke="#3b5998"
                strokeWidth="40"
                strokeDasharray={`${((annualCount / Math.max(annualCount + halfDayCount, 1)) * 440).toFixed(2)} 440`}
                strokeDashoffset="0"
                transform="rotate(-90 100 100)"
              />
              {/* 반차 (밝은 색) */}
              <circle
                cx="100"
                cy="100"
                r="70"
                fill="none"
                stroke="#c4c4c4"
                strokeWidth="40"
                strokeDasharray={`${((halfDayCount / Math.max(annualCount + halfDayCount, 1)) * 440).toFixed(2)} 440`}
                strokeDashoffset={`-${((annualCount / Math.max(annualCount + halfDayCount, 1)) * 440).toFixed(2)}`}
                transform="rotate(-90 100 100)"
              />
              <circle cx="100" cy="100" r="50" fill="white" />
            </svg>
          </div>

          <div className={styles.chartLegend}>
            <div className={styles.legendItem}>
              <div className={`${styles.legendDot} ${styles.dotAnnual}`}></div>
              <span>연차</span>
              <span className={styles.legendValue}>{annualCount}</span>
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.legendDot} ${styles.dotHalfDay}`}></div>
              <span>반차</span>
              <span className={styles.legendValue}>{halfDayCount}</span>
            </div>
          </div>

          <div className={styles.usageText}>
            사용률 {usagePercentage}%
          </div>
        </div>
      </div>
    </div>
  );
}

