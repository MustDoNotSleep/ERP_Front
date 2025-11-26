import React, { useState, useEffect } from 'react';
import { Card, DataTable } from '../../components/common'; // 공통 컴포넌트
import api from '../../api/axios'; // API 인스턴스
import styles from './DispatchTravel.module.css'; // 전용 CSS 모듈

export default function DispatchTravel() {
  // 1. 상태(State) 정의
  const [statistics, setStatistics] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
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

      // 전체 직원의 발령 데이터 가져오기
      console.log('파견 데이터 로딩 시작...');
      const appointmentResponse = await api.get('/appointment-requests');
      console.log('API 응답:', appointmentResponse);
      
      const appointmentData = appointmentResponse.data?.data?.content || appointmentResponse.data?.data || [];
      console.log('전체 발령 데이터:', appointmentData);
      
      // 파견 유형(DISPATCH)만 필터링
      const dispatchData = appointmentData.filter(item => 
        item.appointmentType === 'DISPATCH' || item.appointmentType === '파견'
      );
      console.log('파견 필터링 후:', dispatchData);
      
      // 최신순으로 정렬
      const sortedHistory = dispatchData.sort((a, b) => 
        new Date(b.effectiveDate || b.createdAt) - new Date(a.effectiveDate || a.createdAt)
      );
      setHistory(sortedHistory);

      // 통계 계산 (승인/반려 카운트)
      const total = dispatchData.length;
      const approved = dispatchData.filter(d => d.status === 'APPROVED' || d.status === '승인').length;
      const rejected = dispatchData.filter(d => d.status === 'REJECTED' || d.status === '반려').length;
      
      console.log('통계:', { total, approved, rejected });
      
      setStatistics({
        total,
        approved,
        rejected,
      });

    } catch (err) {
      console.error('파견 데이터 조회 실패:', err);
      setStatistics({ total: 0, approved: 0, rejected: 0 });
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  // 3. 헬퍼 함수
  const getStatusLabel = (status) => ({
    'PENDING': '대기',
    'APPROVED': '승인',
    'REJECTED': '반려',
    '대기': '대기',
    '승인': '승인',
    '반려': '반려',
  }[status] || status);

  // 4. 페이지네이션
  const totalPages = Math.ceil(history.length / pageSize);
  const paginatedData = history.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // DataTable 헤더
  const tableHeaders = [
    { label: 'no' },
    { label: '대상자' },
    { label: '발령일' },
    { label: '사유' },
    { label: '상태' }
  ];

  // DataTable 렌더 함수
  const renderHistoryRow = (item, index) => {
    const effectiveDate = item.effectiveDate ? new Date(item.effectiveDate).toLocaleDateString('ko-KR') : '-';
    
    // 페이지네이션 번호 (no) 계산
    const itemNo = index + 1 + (currentPage - 1) * pageSize;

    return (
      <>
        <td>{itemNo}</td>
        <td>{item.targetEmployeeName || '-'}</td>
        <td>{effectiveDate}</td>
        <td>{item.reason || '-'}</td>
        <td>{getStatusLabel(item.status)}</td>
      </>
    );
  };

  // 5. JSX 렌더링
  return (
    <div className={styles.container}>
      {/* 1. 상단 현황 (LeaveStatus의 balanceSection) */}
      <div className={styles.balanceSection}>
        <div className={styles.balanceWrapper}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>파견 현황</h2>
          </div>
          
          <div className={styles.balanceGrid}>
            <Card className={styles.balanceCard}>
              <div className={styles.balanceLabel}>전체</div>
              <div className={styles.balanceValue}>{statistics.total}건</div>
            </Card>

            <Card className={styles.balanceCard}>
              <div className={styles.balanceLabel}>승인</div>
              <div className={`${styles.balanceValue} ${styles.approved}`}>
                {statistics.approved}건
              </div>
            </Card>

            <Card className={styles.balanceCard}>
              <div className={styles.balanceLabel}>반려</div>
              <div className={`${styles.balanceValue} ${styles.rejected}`}>
                {statistics.rejected}건
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* 2. 하단 테이블 전체 너비 */}
      <div className={styles.fullWidthSection}>
        {/* 테이블 */}
        <div className={styles.tableSection}>
          <div className={styles.tableHeader}>
            <h3 className={styles.tableTitle}>파견 목록</h3>
          </div>
          
          {loading ? (
            <div className={styles.loadingMessage}>데이터를 불러오는 중...</div>
          ) : (
            <>
              <DataTable
                headers={tableHeaders}
                data={paginatedData}
                renderRow={renderHistoryRow}
                emptyMessage="파견 기록이 없습니다."
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
      </div>
    </div>
  );
}