import React, { useState, useEffect } from 'react';
import { Card, DataTable, Select, Button } from '../../components/common'; // 공용 컴포넌트 경로 확인
import api from '../../api/axios'; // API 인스턴스 경로 확인
import styles from './AttendanceStats.module.css';

export default function AttendanceStats() {
  // 1. 검색 조건 상태
  const [searchParams, setSearchParams] = useState({
    year: new Date().getFullYear(),
    month: '전체',
    department: '전체'
  });

  // 2. 통계 데이터 상태
  const [statsData, setStatsData] = useState({
    avgWorkingHours: 0,
    overtimeHours: 0,
    leaveUsageRate: 0,
    // 근무시간 분포 (API 응답 형태에 맞게 임시 정의)
    timeDistribution: [
        { label: '초과', value: 0 },
        { label: '정상', value: 0 },
        { label: '미달', value: 0 }
    ]
  });

  // 3. 직원 목록 및 로딩 상태
  const [employeeStats, setEmployeeStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]); // 선택된 직원 ID 목록

  // 4. 드롭다운 옵션 (실제 API에서 가져와야 하지만, 임시 정의)
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  const months = ['전체', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const departments = ['전체', '경영기획본부', '보안연구본부', '사이버관제본부', '자율보안본부', '침해사고대응본부']; // 실제 데이터로 대체 필요

  // 5. 데이터 로드 (API 연동)
  useEffect(() => {
    // 페이지 로드 시 기본 통계 데이터 조회
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const loadStats = async () => {
    try {
      setLoading(true);

      const params = {
        year: searchParams.year,
        month: searchParams.month === '전체' ? null : searchParams.month,
        department: searchParams.department === '전체' ? null : searchParams.department
      };

      // 1. 통계 데이터 API 호출 (예시 엔드포인트)
      const statsResponse = await api.get('/attendance/statistics/summary', { params });
      const summary = statsResponse.data?.data || {};

      setStatsData({
        avgWorkingHours: summary.averageWorkingHours || 0,
        overtimeHours: summary.extendedWorkingHours || 0,
        leaveUsageRate: summary.leaveUsageRate || 0,
        timeDistribution: summary.timeDistribution || [
          { label: '초과', value: 0 },
          { label: '정상', value: 0 },
          { label: '미달', value: 0 }
        ]
      });

      // 2. 직원 목록 API 호출 (예시 엔드포인트)
      const employeeResponse = await api.get('/attendance/statistics/employees', { params });
      setEmployeeStats(employeeResponse.data?.data || []);

    } catch (error) {
      console.error('근태 통계 데이터 로드 실패:', error);
      // API 실패 시 0 또는 빈 배열로 UI를 유지
      setStatsData({
        avgWorkingHours: 0,
        overtimeHours: 0,
        leaveUsageRate: 0,
        timeDistribution: [
          { label: '초과', value: 0 },
          { label: '정상', value: 0 },
          { label: '미달', value: 0 }
        ]
      });
      setEmployeeStats([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadStats(); // 조회 버튼 클릭 시 데이터 재로드
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = employeeStats.map(emp => emp.employeeId);
      setSelectedEmployees(allIds);
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleSelectEmployee = (employeeId) => {
    setSelectedEmployees(prev =>
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  // DataTable 헤더
  const tableHeaders = [
    { label: '선택', key: 'checkbox' },
    { label: '사번', key: 'employeeId' },
    { label: '이름', key: 'name' },
    { label: '직급', key: 'position' },
    { label: '총 근무일', key: 'totalWorkDays' },
    { label: '총 근무시간', key: 'totalWorkHours' },
    { label: '휴가', key: 'leaveCount' },
    { label: '결근', key: 'absenceCount' },
    { label: '상태', key: 'status' }
  ];

  // DataTable 렌더링 함수
  const renderEmployeeRow = (item) => {
    const isSelected = selectedEmployees.includes(item.employeeId);
    const statusClass = item.status === '주의' ? styles.statusWarning : styles.statusNormal;

    return (
      <>
        <td>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => handleSelectEmployee(item.employeeId)}
          />
        </td>
        <td>{item.employeeId}</td>
        <td>{item.name}</td>
        <td>{item.position}</td>
        <td>{item.totalWorkDays}일</td>
        <td>{item.totalWorkHours}h</td>
        <td>{item.leaveCount}회</td>
        <td>{item.absenceCount}회</td>
        <td className={statusClass}>{item.status}</td>
      </>
    );
  };

  // 휴가 사용률 차트 계산
  const usageRate = Math.min(100, Math.max(0, statsData.leaveUsageRate));
  const circumference = 30 * 2 * Math.PI;
  const dashoffset = circumference - (usageRate / 100) * circumference;

  // 근무시간 분포 차트 데이터 정렬 (예시: 초과 > 정상 > 미달 순)
  const sortedDistribution = statsData.timeDistribution.sort((a, b) => {
    if (a.label === '초과') return -1;
    if (b.label === '초과') return 1;
    if (a.label === '정상') return -1;
    if (b.label === '정상') return 1;
    return 0;
  });
  const maxDistributionValue = Math.max(...sortedDistribution.map(d => d.value), 1); // 0 방지

  // 총 근무일 체크박스 상태
  const isAllSelected = employeeStats.length > 0 && selectedEmployees.length === employeeStats.length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>근태 통계</h1>
      </div>

      {/* 검색 및 조회 섹션 */}
      <div className={styles.searchSection}>
        <div className={styles.searchGroup}>
          <label>년도</label>
          <Select
            options={years.map(y => ({ value: y, label: y }))}
            value={searchParams.year}
            onChange={(e) => setSearchParams(prev => ({ ...prev, year: e.target.value }))}
          />
        </div>
        <div className={styles.searchGroup}>
          <label>월</label>
          <Select
            options={months.map(m => ({ value: m, label: m }))}
            value={searchParams.month}
            onChange={(e) => setSearchParams(prev => ({ ...prev, month: e.target.value }))}
          />
        </div>
        <div className={styles.searchGroup}>
          <label>부서</label>
          <Select
            options={departments.map(d => ({ value: d, label: d }))}
            value={searchParams.department}
            onChange={(e) => setSearchParams(prev => ({ ...prev, department: e.target.value }))}
          />
        </div>
        <Button onClick={handleSearch} className={styles.searchButton}>조회</Button>
      </div>

      {/* 통계 카드 섹션 */}
      <div className={styles.statsGrid}>
        {/* 평균 근무시간 */}
        <Card className={styles.statsCard}>
          <div className={styles.statsLabel}>평균 근무시간</div>
          <div className={`${styles.statsValue} ${styles.largeValue}`}>
            {statsData.avgWorkingHours !== 0 ? `${statsData.avgWorkingHours}시간` : '0'}
          </div>
        </Card>

        {/* 연장근로 통합 */}
        <Card className={styles.statsCard}>
          <div className={styles.statsLabel}>연장근로 통합</div>
          <div className={styles.statsValue}>
            {statsData.overtimeHours !== 0 ? `${statsData.overtimeHours}시간` : '0'}
          </div>
        </Card>

        {/* 휴가 사용률 (도넛 차트) */}
        <Card className={styles.statsCard}>
          <div className={styles.statsLabel}>휴가 사용률</div>
          <div className={styles.chartWrapper}>
            <svg viewBox="0 0 70 70" className={styles.donutChart}>
              <circle
                className={styles.chartBackground}
                cx="35" cy="35" r="30"
              />
              <circle
                className={styles.chartForeground}
                cx="35" cy="35" r="30"
                strokeDasharray={circumference}
                strokeDashoffset={dashoffset}
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
              <text x="35" y="38" className={styles.chartText}>
                {usageRate}%
              </text>
            </svg>
          </div>
        </Card>

        {/* 근무시간 분포 (바 차트) */}
        <Card className={styles.statsCard}>
          <div className={styles.statsLabel}>근무시간 분포</div>
          <div className={styles.barChartContainer}>
            {sortedDistribution.map((item, index) => (
              <div key={index} className={styles.barChartItem}>
                <span className={styles.distributionLabel}>{item.label}</span>
                <div className={styles.barBackground}>
                  <div 
                    className={styles.barFill} 
                    style={{ 
                      width: `${(item.value / maxDistributionValue) * 100}%`,
                      backgroundColor: item.label === '초과' ? '#d9534f' : (item.label === '정상' ? '#5cb85c' : '#f0ad4e')
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 직원 목록 테이블 */}
      <div className={styles.tableSection}>
        <h2 className={styles.tableTitle}>직원별 근태 현황</h2>
        {loading ? (
          <div className={styles.loadingMessage}>데이터를 불러오는 중입니다...</div>
        ) : (
          <DataTable
            headers={tableHeaders}
            data={employeeStats}
            renderRow={renderEmployeeRow}
            emptyMessage="조회된 직원 근태 기록이 없습니다."
            // '선택' 헤더에 전체 선택 체크박스 추가
            renderHeaderCell={(header) => 
                header.key === 'checkbox' ? (
                    <th>
                        <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} />
                    </th>
                ) : (
                    <th>{header.label}</th>
                )
            }
          />
        )}
      </div>
    </div>
  );
}