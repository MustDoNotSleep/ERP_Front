import React, { useState, useEffect } from 'react';
import { Card, DataTable, Select, Button } from '../../components/common';
import { fetchAttendancesByPeriod } from '../../api/attendance';
import { fetchLeaves } from '../../api/leave';
import { fetchUniqueDepartmentNames } from '../../api/department';
import { LEAVE_TYPE_INFO } from '../../models/LeaveType';
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

  // 4. 드롭다운 옵션
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  const months = ['전체', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const [departments, setDepartments] = useState(['전체']); // API에서 불러올 부서 목록

  // 5. 부서 목록 로드
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const response = await fetchUniqueDepartmentNames();
        const deptNames = response.data || response || [];
        setDepartments(['전체', ...deptNames]);
      } catch (error) {
        console.error('부서 목록 로드 실패:', error);
        // 실패 시 기본값 유지
        setDepartments(['전체', '경영기획본부', '보안연구본부', '사이버관제본부', '자율보안본부', '침해사고대응본부']);
      }
    };
    loadDepartments();
  }, []);

  // 6. 데이터 로드 (API 연동)
  useEffect(() => {
    // 페이지 로드 시 기본 통계 데이터 조회
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const loadStats = async () => {
    try {
      setLoading(true);

      // 기간 계산 (년도, 월 기반)
      const year = searchParams.year;
      const month = searchParams.month === '전체' ? null : parseInt(searchParams.month);
      
      let startDate, endDate;
      if (month) {
        // 특정 월 선택
        startDate = `${year}-${String(month).padStart(2, '0')}-01`;
        const lastDay = new Date(year, month, 0).getDate();
        endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;
      } else {
        // 전체 월 선택 (1년 전체)
        startDate = `${year}-01-01`;
        endDate = `${year}-12-31`;
      }

      // 1. 기간별 전체 근태 데이터 조회
      const attendanceResponse = await fetchAttendancesByPeriod(startDate, endDate);
      const attendances = attendanceResponse.data || [];

      // 2. 기간별 전체 휴가 데이터 조회
      let leaves = [];
      try {
        const leaveResponse = await fetchLeaves(0, 1000); // 모든 휴가 조회
        leaves = leaveResponse.data?.content || leaveResponse.data || [];
      } catch (error) {
        console.warn('휴가 데이터 조회 실패:', error);
        leaves = [];
      }

      // 3. 부서 필터링 적용
      let filteredAttendances = attendances;
      if (searchParams.department !== '전체') {
        filteredAttendances = attendances.filter(
          att => att.departmentName === searchParams.department
        );
      }

      // 4. 직원별 데이터 집계 (한 달 단위로 계산)
      const employeeMap = new Map();
      
      // 기간 내 근무일수 계산 (주말 제외)
      const start = new Date(startDate);
      const end = new Date(endDate);
      let workingDaysInPeriod = 0;
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dayOfWeek = d.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 주말 제외
          workingDaysInPeriod++;
        }
      }
      
      filteredAttendances.forEach(att => {
        const empId = att.employeeId;
        if (!empId) return;

        if (!employeeMap.has(empId)) {
          employeeMap.set(empId, {
            employeeId: att.employeeId,
            name: att.employeeName,
            departmentName: att.departmentName, // API 응답에 직급 정보가 없음
            totalWorkDays: 0,
            totalWorkHours: 0,
            avgMonthlyWorkHours: 0, // 월 평균 근무시간
            leaveCount: 0,
            absenceCount: 0,
            status: '정상'
          });
        }

        const emp = employeeMap.get(empId);
        emp.totalWorkDays += 1;
        emp.totalWorkHours += att.workHours || 0;
        
        // 휴가 체크 (근태 데이터에 휴가 정보가 있는 경우)
        // LEAVE_TYPE_INFO에서 정의된 모든 휴가 타입의 이름 추출
        const leaveTypeNames = Object.values(LEAVE_TYPE_INFO).map(info => info.name);
        const isLeave = att.isOnLeave || 
                       leaveTypeNames.some(type => att.attendanceType?.includes(type));
        
        if (isLeave) {
          emp.leaveCount += 1;
        }
        
        // 결근 체크 (출근 기록이 없거나 근무시간이 0인 경우, 단 모든 휴가 타입은 제외)
        if (!isLeave && (!att.checkIn || att.workHours === 0 || att.attendanceType === '결근')) {
          emp.absenceCount += 1;
        }
      });
      
      // 각 직원의 월 평균 근무시간 계산
      employeeMap.forEach((emp, empId) => {
        // 한 달(22일 기준) 평균으로 환산
        if (workingDaysInPeriod > 0) {
          emp.avgMonthlyWorkHours = ((emp.totalWorkHours / workingDaysInPeriod) * 22).toFixed(1);
        }
      });

      // 5. 휴가 API 데이터 추가 집계 (Leave API에서 가져온 데이터)
      leaves.forEach(leave => {
        // API 응답 구조에 따라 유연하게 처리
        const empId = leave.employeeId || leave.employee?.employeeId;
        const isApproved = leave.status === 'APPROVED' || leave.status === '승인';
        
        if (empId && employeeMap.has(empId) && isApproved) {
          const emp = employeeMap.get(empId);
          // 이미 근태 데이터에서 집계했을 수 있으므로 중복 체크
          // (여기서는 Leave API가 추가 휴가 정보를 제공한다고 가정)
          emp.leaveCount += 1;
        }
      });

      // 6. 상태 판단 (결근 2회 이상 또는 월평균 근무시간이 기준 미달)
      employeeMap.forEach((emp, empId) => {
        const monthlyHours = parseFloat(emp.avgMonthlyWorkHours);
        // 총 근무일이 20일 이상인 경우에만 근무시간 기준 적용
        if (emp.absenceCount >= 2) {
          emp.status = '주의';
        } else if (emp.totalWorkDays >= 20 && monthlyHours < 160) {
          emp.status = '주의'; // 충분히 근무했는데 시간이 부족한 경우만
        }
      });

      const employeeList = Array.from(employeeMap.values());
      setEmployeeStats(employeeList);

      // 7. 전체 통계 계산 (월평균 기준)
      const totalMonthlyWorkHours = employeeList.reduce((sum, emp) => sum + parseFloat(emp.avgMonthlyWorkHours || 0), 0);
      const avgWorkingHours = employeeList.length > 0 
        ? (totalMonthlyWorkHours / employeeList.length).toFixed(1) 
        : 0;

      // 연장근로 평균 계산 (월 160시간 초과 근무)
      const totalOvertimeHours = employeeList.reduce((sum, emp) => {
        const monthlyHours = parseFloat(emp.avgMonthlyWorkHours || 0);
        const overtime = Math.max(0, monthlyHours - 160);
        return sum + overtime;
      }, 0);
      const avgOvertimeHours = employeeList.length > 0
        ? (totalOvertimeHours / employeeList.length).toFixed(1)
        : 0;

      // 휴가 사용률 계산 (전체 직원 기준)
      const totalLeaves = employeeList.reduce((sum, emp) => sum + emp.leaveCount, 0);
      const leaveUsageRate = employeeList.length > 0
        ? ((totalLeaves / (employeeList.length * 15)) * 100).toFixed(1) // 15일 기준
        : 0;

      // 근무시간 분포 (초과/정상/미달) - 월평균 기준
      let overCount = 0, normalCount = 0, underCount = 0;
      employeeList.forEach(emp => {
        const monthlyHours = parseFloat(emp.avgMonthlyWorkHours || 0);
        
        // 총 근무일이 20일 미만이면 무조건 정상으로 처리
        if (emp.totalWorkDays < 20) {
          normalCount++;
        } else if (monthlyHours > 176) {
          overCount++; // 주 44시간 기준 (176시간/월)
        } else if (monthlyHours >= 160) {
          normalCount++; // 주 40시간 기준 (160시간/월)
        } else {
          underCount++;
        }
      });

      setStatsData({
        avgWorkingHours: parseFloat(avgWorkingHours),
        overtimeHours: parseFloat(avgOvertimeHours),
        leaveUsageRate: parseFloat(leaveUsageRate),
        timeDistribution: [
          { label: '초과', value: overCount },
          { label: '정상', value: normalCount },
          { label: '미달', value: underCount }
        ]
      });

    } catch (error) {
      console.error('근태 통계 데이터 로드 실패:', error);
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
    { label: '직급', key: 'departmentName' },
    { label: '총 근무일', key: 'totalWorkDays' },
    { label: '월평균 근무시간', key: 'avgMonthlyWorkHours' },
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
        <td>{item.departmentName}</td>
        <td>{item.totalWorkDays}일</td>
        <td>{item.avgMonthlyWorkHours}h</td>
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
          <div className={styles.statsLabel}>월평균 근무시간</div>
          <div className={`${styles.statsValue} ${styles.largeValue}`}>
            {statsData.avgWorkingHours !== 0 ? `${statsData.avgWorkingHours}시간` : '0'}
          </div>
        </Card>

        {/* 연장근로 통합 */}
        <Card className={styles.statsCard}>
          <div className={styles.statsLabel}>월평균 연장근무 시간</div>
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