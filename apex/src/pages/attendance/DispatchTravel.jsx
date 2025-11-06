import React, { useState, useEffect } from 'react';
import { Card, DataTable } from '../../components/common'; // 공통 컴포넌트
import api from '../../api/axios'; // API 인스턴스
import styles from './DispatchTravel.module.css'; // 전용 CSS 모듈

export default function DispatchTravel() {
  // 1. 상태(State) 정의
  const [statistics, setStatistics] = useState({
    inProgress: 0,
    scheduled: 0,
    completed: 0,
  });

  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [loading, setLoading] = useState(false);

  // 2. 데이터 로드
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
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

      // 1. 통계 데이터 (상단 3개 카드)
      // API 엔드포인트는 실제 프로젝트에 맞게 수정
      const statsResponse = await api.get(`/dispatches/employee/${employeeId}/statistics`);
      const statsData = statsResponse.data?.data;
      if (statsData) {
        setStatistics({
          inProgress: statsData.inProgress || 0,
          scheduled: statsData.scheduled || 0,
          completed: statsData.completed || 0,
        });
      }

      // 2. 이력 데이터 (테이블 및 차트)
      // API 엔드포인트는 실제 프로젝트에 맞게 수정
      const historyResponse = await api.get(`/dispatches/employee/${employeeId}`);
      const historyData = historyResponse.data?.data || [];
      
      // 최신순으로 정렬
      const sortedHistory = historyData.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
      setHistory(sortedHistory);

    } catch (err) {
      console.error('파견/출장 데이터 조회 실패:', err);
      // ★ 목데이터 제거: 실패 시 빈 값으로 설정
      setStatistics({ inProgress: 0, scheduled: 0, completed: 0 });
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  // 3. 헬퍼 함수
  const getTypeLabel = (type) => ({
    'DISPATCH': '파견',
    'BUSINESS_TRIP': '출장',
  }[type] || type);

  const getStatusLabel = (status) => ({
    'IN_PROGRESS': '진행중',
    'SCHEDULED': '예정',
    'COMPLETED': '완료',
  }[status] || status);

  // 4. 데이터 계산 (렌더링 전)

  // 진행률 계산 (LeaveStatus의 usagePercentage에 해당)
  const totalCount = statistics.inProgress + statistics.scheduled + statistics.completed;
  const progressPercentage = totalCount > 0 
    ? Math.round((statistics.completed / totalCount) * 100) 
    : 0;

  // 페이지네이션
  const totalPages = Math.ceil(history.length / pageSize);
  const paginatedData = history.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // DataTable 헤더
  const tableHeaders = [
    { label: 'no' },
    { label: '구분' },
    { label: '목적지' },
    { label: '기간' },
    { label: '상태' }
  ];

  // DataTable 렌더 함수
  const renderHistoryRow = (item, index) => {
    const startDate = item.startDate ? new Date(item.startDate).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' }) : '-';
    const endDate = item.endDate ? new Date(item.endDate).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' }) : '-';
    
    // 페이지네이션 번호 (no) 계산
    const itemNo = index + 1 + (currentPage - 1) * pageSize;

    return (
      <>
        <td>{itemNo}</td>
        <td>{getTypeLabel(item.type)}</td>
        <td>{item.destination}</td>
        <td>{`${startDate}~${endDate}`}</td>
        <td>{getStatusLabel(item.status)}</td>
      </>
    );
  };

  // 차트 계산 (LeaveStatus의 annualCount, halfDayCount에 해당)
  const tripCount = history.filter(h => h.type === 'BUSINESS_TRIP').length;
  const dispatchCount = history.filter(h => h.type === 'DISPATCH').length;
  const totalChartCount = tripCount + dispatchCount;

  // 5. JSX 렌더링 (LeaveStatus.jsx 구조와 동일)
  return (
    <div className={styles.container}>
      {/* 1. 상단 현황 (LeaveStatus의 balanceSection) */}
      <div className={styles.balanceSection}>
        <div className={styles.balanceWrapper}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>파견/출장 현황</h2>
          </div>
          
          <div className={styles.balanceGrid}>
            <Card className={styles.balanceCard}>
              <div className={styles.balanceLabel}>진행 중</div>
              <div className={styles.balanceValue}>{statistics.inProgress}건</div>
            </Card>

            <Card className={styles.balanceCard}>
              <div className={styles.balanceLabel}>시작 예정</div>
              <div className={styles.balanceValue}>{statistics.scheduled}건</div>
            </Card>

            <Card className={styles.balanceCard}>
              <div className={styles.balanceLabel}>완료</div>
              {/* LeaveStatus의 .remaining -> .completed 클래스로 변경 */}
              <div className={`${styles.balanceValue} ${styles.completed}`}>
                {statistics.completed}건
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* 2. 하단 컨텐츠 (LeaveStatus의 contentSection) */}
      <div className={styles.contentSection}>
        {/* 2-1. 좌측 테이블 (LeaveStatus의 tableSection) */}
        <div className={styles.tableSection}>
          <div className={styles.tableHeader}>
            <h3 className={styles.tableTitle}>파견/출장 현황</h3>
          </div>
          
          {loading ? (
            <div className={styles.loadingMessage}>데이터를 불러오는 중...</div>
          ) : (
            <>
              <DataTable
                headers={tableHeaders}
                data={paginatedData}
                renderRow={renderHistoryRow}
                emptyMessage="파견/출장 기록이 없습니다."
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

        {/* 2-2. 우측 차트 (LeaveStatus의 chartSection) */}
        <div className={styles.chartSection}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>구분</h3>
          </div>
          
          {/* 차트 래퍼 */}
          <div className={styles.pieChartWrapper}>
            <svg viewBox="0 0 200 200" className={styles.pieChart}>
              {/* 배경 원 (데이터 0일 때도 보임) */}
              <circle cx="100" cy="100" r="70" fill="none" stroke="#e0e0e0" strokeWidth="40" />
              
              {/* 출장 (진한 색) */}
              <circle
                cx="100" cy="100" r="70"
                fill="none"
                stroke="#4A5D54" /* 출장 색상 */
                strokeWidth="40"
                strokeDasharray={`${((tripCount / Math.max(totalChartCount, 1)) * 440).toFixed(2)} 440`}
                strokeDashoffset="0"
                transform="rotate(-90 100 100)"
              />
              {/* 파견 (밝은 색) */}
              <circle
                cx="100" cy="100" r="70"
                fill="none"
                stroke="#A9A9A9" /* 파견 색상 */
                strokeWidth="40"
                strokeDasharray={`${((dispatchCount / Math.max(totalChartCount, 1)) * 440).toFixed(2)} 440`}
                strokeDashoffset={`-${((tripCount / Math.max(totalChartCount, 1)) * 440).toFixed(2)}`}
                transform="rotate(-90 100 100)"
              />
              <circle cx="100" cy="100" r="50" fill="white" />
            </svg>
          </div>

          {/* 범례 (LeaveStatus의 chartLegend) */}
          <div className={styles.chartLegend}>
            <div className={styles.legendItem}>
              {/* .dotAnnual -> .dotTrip */}
              <div className={`${styles.legendDot} ${styles.dotTrip}`}></div>
              <span>출장</span>
              <span className={styles.legendValue}>{tripCount}</span>
            </div>
            <div className={styles.legendItem}>
              {/* .dotHalfDay -> .dotDispatch */}
              <div className={`${styles.legendDot} ${styles.dotDispatch}`}></div>
              <span>파견</span>
              <span className={styles.legendValue}>{dispatchCount}</span>
            </div>
          </div>

          {/* 하단 요약 (LeaveStatus의 usageText) */}
          <div className={styles.usageText}>
            진행률 {progressPercentage}%
          </div>
        </div>
      </div>
    </div>
  );
}