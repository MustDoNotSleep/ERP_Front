import React, { useState, useEffect } from 'react';
import { Card, FilterCard, FilterGroup, Select } from '../../../components/common';
import api from '../../../api/axios';
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

  // 필터 상태
  const [filters, setFilters] = useState({
    year: new Date().getFullYear().toString(),
    month: (new Date().getMonth() + 1).toString()
  });

  // 데이터 로드
  useEffect(() => {
    loadStatistics();
  }, [filters.year, filters.month]);

  // 필터 변경
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  // 검색
  const handleSearch = () => {
    loadStatistics();
  };

  // 초기화
  const handleReset = () => {
    const today = new Date();
    setFilters({
      year: today.getFullYear().toString(),
      month: (today.getMonth() + 1).toString()
    });
  };

  const loadStatistics = async () => {
    try {
      setLoading(true);
      
      // 선택된 연도 기준으로 통계 조회
      const year = parseInt(filters.year);
      const startOfYear = new Date(year, 0, 1);
      const endOfYear = new Date(year, 11, 31);
      
      const response = await api.get('/attendances/period', {
        params: {
          startDate: startOfYear.toISOString().split('T')[0],
          endDate: endOfYear.toISOString().split('T')[0]
        }
      });

      const attendancesData = response.data?.data || [];
      
      // 선택된 월의 통계 계산
      const selectedMonth = parseInt(filters.month) - 1; // 0-based
      const firstDayOfMonth = new Date(year, selectedMonth, 1);
      const lastDayOfMonth = new Date(year, selectedMonth + 1, 0);
      
      const monthAttendances = attendancesData.filter(item => {
        if (!item.checkIn) return false;
        const itemDate = new Date(item.checkIn);
        return itemDate >= firstDayOfMonth && itemDate <= lastDayOfMonth;
      });

      const stats = {
        present: monthAttendances.filter(a => a.attendanceType === '정상출근').length,
        late: monthAttendances.filter(a => a.attendanceType === '지각').length,
        absent: monthAttendances.filter(a => a.attendanceType === '결근').length,
        leave: monthAttendances.filter(a => a.attendanceType === '연차').length
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
          present: monthData.filter(a => a.attendanceType === '정상출근').length,
          late: monthData.filter(a => a.attendanceType === '지각').length,
          leave: monthData.filter(a => a.attendanceType === '연차').length
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

  // 차트 막대 높이 계산 (최대 높이 200px 기준)
  const getBarHeight = (value) => {
    return (value / maxValue) * 200;
  };

  // 연도 옵션 (최근 5년)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => ({
    value: (currentYear - i).toString(),
    label: `${currentYear - i}년`
  }));

  // 월 옵션
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `${i + 1}월`
  }));

  return (
    <div className={styles.container}>
      {/* 필터 카드 */}
      <FilterCard 
        title="근태 통계"
        description="월별 근태 현황을 조회하고 통계를 확인합니다."
        onSearch={handleSearch}
        onReset={handleReset}
      >
        <FilterGroup label="연도">
          <Select
            name="year"
            value={filters.year}
            onChange={(e) => handleFilterChange('year', e.target.value)}
            options={yearOptions}
          />
        </FilterGroup>

        <FilterGroup label="월">
          <Select
            name="month"
            value={filters.month}
            onChange={(e) => handleFilterChange('month', e.target.value)}
            options={monthOptions}
          />
        </FilterGroup>
      </FilterCard>

      {/* 근태 통계 섹션 */}
      <div className={styles.statsSection}>
        <div className={styles.statsCard}>
          <h2 className={styles.sectionTitle}>근태 통계(월)</h2>
          
          <div className={styles.statsGrid}>
            <Card>
              <div className={styles.statValue}>{statistics.present}</div>
              <div className={styles.statLabel}>출석</div>
            </Card>

            <Card>
              <div className={styles.statValue}>{statistics.late}</div>
              <div className={styles.statLabel}>지각</div>
            </Card>

            <Card>
              <div className={styles.statValue}>{statistics.absent}</div>
              <div className={styles.statLabel}>결근</div>
            </Card>

            <Card>
              <div className={styles.statValue}>{statistics.leave}</div>
              <div className={styles.statLabel}>연차</div>
            </Card>
          </div>
        </div>
      </div>

      {/* 통계 차트 섹션 */}
      <div className={styles.chartSection}>
        <Card>
          <h3 className={styles.chartTitle}>통계</h3>
          
          {loading ? (
            <div className={styles.loadingMessage}>데이터를 불러오는 중...</div>
          ) : (
            <div className={styles.chartContainer}>
              {/* Y축 레이블 */}
              <div className={styles.yAxis}>
                <div className={styles.yLabel}>10</div>
                <div className={styles.yLabel}>8</div>
                <div className={styles.yLabel}>6</div>
                <div className={styles.yLabel}>4</div>
                <div className={styles.yLabel}>2</div>
                <div className={styles.yLabel}>0</div>
              </div>

              {/* 차트 영역 */}
              <div className={styles.chart}>
                {/* 그리드 라인 */}
                <div className={styles.gridLines}>
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={styles.gridLine} />
                  ))}
                </div>

                {/* 월별 막대 */}
                <div className={styles.bars}>
                  {monthlyData.map((data, index) => (
                    <div key={index} className={styles.barGroup}>
                      <div className={styles.barContainer}>
                        {/* 출석 */}
                        <div 
                          className={`${styles.bar} ${styles.barPresent}`}
                          style={{ height: `${getBarHeight(data.present)}px` }}
                          title={`출석: ${data.present}명`}
                        />
                        {/* 지각 */}
                        <div 
                          className={`${styles.bar} ${styles.barLate}`}
                          style={{ height: `${getBarHeight(data.late)}px` }}
                          title={`지각: ${data.late}명`}
                        />
                        {/* 연차 */}
                        <div 
                          className={`${styles.bar} ${styles.barLeave}`}
                          style={{ height: `${getBarHeight(data.leave)}px` }}
                          title={`연차: ${data.leave}명`}
                        />
                      </div>
                      <div className={styles.monthLabel}>{data.month}</div>
                    </div>
                  ))}
                </div>
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
    </div>
  );
}
