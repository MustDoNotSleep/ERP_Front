import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../../components/common';
import api from '../../../api/axios';
import AttendanceDetailModal from './AttendanceDetailModal';
import styles from './AttendanceStatus.module.css';

export default function AttendanceStatus() {
  const [statistics, setStatistics] = useState({
    present: 0,    // 출석
    late: 0,       // 지각
    absent: 0,     // 결근
    leave: 0       // 연차
  });

  const [monthlyData, setMonthlyData] = useState([
    { month: '1월', present: 0, late: 0, leave: 0 },
    { month: '2월', present: 0, late: 0, leave: 0 },
    { month: '3월', present: 0, late: 0, leave: 0 },
    { month: '4월', present: 0, late: 0, leave: 0 },
    { month: '5월', present: 0, late: 0, leave: 0 },
    { month: '6월', present: 0, late: 0, leave: 0 },
    { month: '7월', present: 0, late: 0, leave: 0 },
    { month: '8월', present: 0, late: 0, leave: 0 },
    { month: '9월', present: 0, late: 0, leave: 0 },
    { month: '10월', present: 0, late: 0, leave: 0 },
    { month: '11월', present: 0, late: 0, leave: 0 },
    { month: '12월', present: 0, late: 0, leave: 0 }
  ]);

  const [loading, setLoading] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

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
      
      // 올해 데이터 기준으로 통계 조회
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth(); // 0-based
      const startOfYear = new Date(year, 0, 1);
      const endOfYear = new Date(year, 11, 31);
      
      // 개인 근태 조회 API 사용
      const response = await api.get(`/attendances/employee/${employeeId}/period`, {
        params: {
          startDate: startOfYear.toISOString().split('T')[0],
          endDate: endOfYear.toISOString().split('T')[0]
        }
      });

      const attendancesData = response.data?.data || [];
      
      // 이번 달의 통계 계산
      const firstDayOfMonth = new Date(year, month, 1);
      const lastDayOfMonth = new Date(year, month + 1, 0);
      
      const monthAttendances = attendancesData.filter(item => {
        if (!item.checkIn) return false;
        const itemDate = new Date(item.checkIn);
        return itemDate >= firstDayOfMonth && itemDate <= lastDayOfMonth;
      });

      const stats = {
        // 연차는 출석으로도 카운트되어야 함
        present: monthAttendances.filter(a => 
          a.attendanceType === '정상출근' || a.attendanceType === '연차'
        ).length,
        late: monthAttendances.filter(a => a.attendanceType === '지각').length,
        absent: monthAttendances.filter(a => a.attendanceType === '결근').length,
        // 연차와 휴가 모두 카운트
        leave: monthAttendances.filter(a => 
          a.attendanceType === '연차' || a.attendanceType === '휴가'
        ).length
      };

      setStatistics(stats);

      // 월별 데이터 계산
      const monthlyStats = Array.from({ length: 12 }, (_, i) => {
        const monthData = attendancesData.filter(item => {
          if (!item.checkIn) return false;
          const itemMonth = new Date(item.checkIn).getMonth();
          return itemMonth === i;
        });

        return {
          month: `${i + 1}월`,
          // 연차는 출석으로도 카운트되어야 함
          present: monthData.filter(a => 
            a.attendanceType === '정상출근' || a.attendanceType === '연차'
          ).length,
          late: monthData.filter(a => a.attendanceType === '지각').length,
          // 연차와 휴가 모두 카운트
          leave: monthData.filter(a => 
            a.attendanceType === '연차' || a.attendanceType === '휴가'
          ).length
        };
      });

      setMonthlyData(monthlyStats);

    } catch (err) {
      console.error('통계 데이터 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  // 차트의 최대값 계산 (Y축 스케일용)
  const maxValue = Math.max(
    ...monthlyData.flatMap(d => [d.present, d.late, d.leave]),
    10 // 최소값 10
  );

  // Y축 눈금 계산 (maxValue부터 0까지, 위에서 아래로)
  const yAxisLabels = Array.from({ length: 6 }, (_, i) => {
    const step = maxValue / 5;
    const value = Math.round(step * i);
    return value;
  }).reverse(); // [maxValue, x, x, x, x, 0]

  // 차트 막대 높이 계산 (최대 높이 340px 기준으로 여유있게)
  const getBarHeight = (value) => {
    return (value / maxValue) * 340;
  };

  return (
    <div className={styles.container}>
      {/* 근태 통계 섹션 */}
      <div className={styles.statsSection}>
        <div className={styles.statsCard}>
          <div className={styles.statsHeader}>
            <h2 className={styles.sectionTitle}>근태 통계(월)</h2>
          </div>
          
          <div className={styles.statsGrid}>
            <Card className={styles.statCards}>
              <div className={styles.statValue}>{statistics.present}</div>
              <div className={styles.statLabel}>출석</div>
            </Card>

            <Card className={styles.statCards}>
              <div className={styles.statValue}>{statistics.late}</div>
              <div className={styles.statLabel}>지각</div>
            </Card>

            <Card className={styles.statCards}>
              <div className={styles.statValue}>{statistics.absent}</div>
              <div className={styles.statLabel}>결근</div>
            </Card>

            <Card className={styles.statCards}>
              <div className={styles.statValue}>{statistics.leave}</div>
              <div className={styles.statLabel}>연차 및 휴가</div>
            </Card>
          </div>
        </div>
      </div>

      {/* 통계 차트 섹션 */}
      <div className={styles.chartSection}>
        <Card className={styles.statsCards}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>통계</h3>
            <Button 
              variant="primary"
              onClick={() => setIsDetailModalOpen(true)}
              className={styles.detailButton}
            >
              📊 세부사항 보기
            </Button>
          </div>
          
          {loading ? (
            <div className={styles.loadingMessage}>데이터를 불러오는 중...</div>
          ) : (
            <div className={styles.chartWrapper}>
              {/* Y축 레이블 */}
              <div className={styles.yAxis}>
                {yAxisLabels.map((label, i) => (
                  <div key={i} className={styles.yLabel}>{label}</div>
                ))}
              </div>

              {/* 차트 영역 */}
              <div className={styles.chartArea}>
                {/* 월별 막대 */}
                {monthlyData.map((data, index) => (
                  <div key={index} className={styles.monthColumn}>
                    <div className={styles.barsWrapper}>
                      {/* 출석 */}
                      <div 
                        className={`${styles.bar} ${styles.barPresent}`}
                        style={{ height: `${getBarHeight(data.present)}px` }}
                        title={`출석: ${data.present}회`}
                      />
                      {/* 지각 */}
                      <div 
                        className={`${styles.bar} ${styles.barLate}`}
                        style={{ height: `${getBarHeight(data.late)}px` }}
                        title={`지각: ${data.late}회`}
                      />
                      {/* 연차 */}
                      <div 
                        className={`${styles.bar} ${styles.barLeave}`}
                        style={{ height: `${getBarHeight(data.leave)}px` }}
                        title={`연차: ${data.leave}회`}
                      />
                    </div>
                    <div className={styles.monthLabel}>{data.month}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 범례 */}
          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <div className={`${styles.legendColor} ${styles.legendPresent}`} />
              <span>출석</span>
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.legendColor} ${styles.legendLate}`} />
              <span>지각</span>
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.legendColor} ${styles.legendLeave}`} />
              <span>연차</span>
            </div>
          </div>
        </Card>
      </div>

      {/* 세부사항 모달 */}
      <AttendanceDetailModal 
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
}
