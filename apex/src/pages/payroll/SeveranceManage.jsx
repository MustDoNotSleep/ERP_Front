import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import EmployeeSearchModal from '../../components/common/EmployeeSearchModal';
import { fetchUniqueDepartmentNames } from '../../api/department';
import { fetchAllSeverance, fetchRetirementSeverance } from '../../api/severance';
import styles from './PayrollSettlement.module.css';

/**
 * 퇴직금 정산 관리 페이지 (관리자용)
 * 탭1: 전 직원 예상 퇴직금 조회
 * 탭2: 퇴직자 퇴직금 정산 처리
 */
export default function SeveranceManage() {
  const currentYear = new Date().getFullYear();
  
  // 탭 상태
  const [activeTab, setActiveTab] = useState('expected'); // 'expected' | 'settlement'
  
  // 공통 상태
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEmployeeSearchOpen, setIsEmployeeSearchOpen] = useState(false);
  
  // ========== 탭1: 예상 퇴직금 상태 ==========
  const [expectedFilters, setExpectedFilters] = useState({
    employeeId: '',
    employeeName: '',
    department: '전체'
  });
  const [expectedList, setExpectedList] = useState([]);
  const [allExpectedList, setAllExpectedList] = useState([]);
  const [expectedSummary, setExpectedSummary] = useState({
    totalEmployees: 0,
    totalExpectedAmount: 0,
    averageExpectedAmount: 0
  });

  // ========== 탭2: 퇴직금 정산 상태 ==========
  const [settlementFilters, setSettlementFilters] = useState({
    year: currentYear,
    employeeId: '',
    employeeName: '',
    department: '전체',
    status: '전체'
  });
  const [settlementList, setSettlementList] = useState([]);
  const [allSettlementList, setAllSettlementList] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [settlementSummary, setSettlementSummary] = useState({
    totalAmount: 0,
    totalCount: 0,
    calculatedCount: 0,
    paidCount: 0
  });

  useEffect(() => {
    loadDepartments();
    if (activeTab === 'expected') {
      loadExpectedSeverance();
    } else {
      loadSettlementData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const loadDepartments = async () => {
    try {
      const response = await fetchUniqueDepartmentNames();
      let deptList = [];
      if (response.data && Array.isArray(response.data)) {
        deptList = response.data;
      } else if (Array.isArray(response)) {
        deptList = response;
      }
      setDepartments(deptList);
    } catch (error) {
      console.error('부서 목록 조회 실패:', error);
    }
  };

  // ========== 탭1: 예상 퇴직금 로직 ==========
  const loadExpectedSeverance = async () => {
    setLoading(true);
    try {
      // 전체 직원 예상 퇴직금 조회 (백엔드에서 한번에 계산)
      const severanceData = await fetchAllSeverance();
      console.log('전체 예상 퇴직금 데이터:', severanceData);
      
      // 백엔드 응답을 프론트엔드 형식으로 변환
      const formattedData = severanceData.map(item => ({
        id: item.employeeId,
        employeeId: item.employeeId,
        employeeName: item.employeeName,
        departmentName: item.departmentName || '-',
        positionName: item.positionName || '-',
        hireDate: item.hireDate,
        yearsOfService: item.workYears || 0,
        averageSalary: Math.floor(item.last3MonthsAverage || 0),
        expectedSeveranceAmount: Math.floor(item.severancePay || 0),
        averageDailyWage: Math.floor(item.averageDailyWage || 0),
        totalWorkDays: item.totalWorkDays || 0
      }));

      // 근속 1년 미만 필터링
      const validResults = formattedData.filter(item => item.yearsOfService >= 1);
      
      console.log('계산된 예상 퇴직금:', validResults);
      
      setAllExpectedList(validResults);
      applyExpectedFilters(validResults);
    } catch (error) {
      console.error('예상 퇴직금 조회 실패:', error);
      toast.error('예상 퇴직금 조회에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const applyExpectedFilters = (data = allExpectedList) => {
    let filtered = [...data];

    if (expectedFilters.employeeId) {
      filtered = filtered.filter(item =>
        String(item.employeeId).includes(expectedFilters.employeeId)
      );
    }

    if (expectedFilters.employeeName) {
      filtered = filtered.filter(item =>
        item.employeeName.includes(expectedFilters.employeeName)
      );
    }

    if (expectedFilters.department !== '전체') {
      filtered = filtered.filter(item =>
        item.departmentName === expectedFilters.department
      );
    }

    filtered = filtered.filter(item => item.yearsOfService >= 1);

    setExpectedList(filtered);

    const totalEmployees = filtered.length;
    const totalExpectedAmount = filtered.reduce((sum, item) => sum + item.expectedSeveranceAmount, 0);
    const averageExpectedAmount = totalEmployees > 0 ? totalExpectedAmount / totalEmployees : 0;

    setExpectedSummary({
      totalEmployees,
      totalExpectedAmount,
      averageExpectedAmount
    });
  };

  // ========== 탭2: 퇴직금 정산 로직 ==========
  const loadSettlementData = async () => {
    setLoading(true);
    try {
      // 퇴직자 목록 및 퇴직금 조회
      const year = settlementFilters.year || null;
      const retirementData = await fetchRetirementSeverance(year);
      console.log('퇴직자 데이터:', retirementData);
      
      // 백엔드 응답을 프론트엔드 형식으로 변환
      const formattedData = retirementData.map(item => ({
        id: item.employeeId,
        employeeId: item.employeeId,
        employeeName: item.employeeName,
        departmentName: item.departmentName || '-',
        positionName: item.positionName || '-',
        hireDate: item.hireDate,
        retirementDate: item.severanceDate, // severanceDate가 퇴사일
        yearsOfService: item.workYears || 0,
        averageSalary: Math.floor(item.last3MonthsAverage || 0),
        severanceAmount: Math.floor(item.severancePay || 0),
        status: '계산완료' // 기본값, 백엔드에서 상태 필드 추가되면 변경
      }));
      
      setAllSettlementList(formattedData);
      applySettlementFilters(formattedData);
    } catch (error) {
      console.error('퇴직금 정산 내역 조회 실패:', error);
      toast.error('퇴직금 정산 내역 조회에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const applySettlementFilters = (data = allSettlementList) => {
    let filtered = [...data];

    if (settlementFilters.employeeId) {
      filtered = filtered.filter(item =>
        String(item.employeeId).includes(settlementFilters.employeeId)
      );
    }

    if (settlementFilters.employeeName) {
      filtered = filtered.filter(item =>
        item.employeeName.includes(settlementFilters.employeeName)
      );
    }

    if (settlementFilters.department !== '전체') {
      filtered = filtered.filter(item =>
        item.departmentName === settlementFilters.department
      );
    }

    if (settlementFilters.status !== '전체') {
      filtered = filtered.filter(item => item.status === settlementFilters.status);
    }

    setSettlementList(filtered);

    const totalCount = filtered.length;
    const totalAmount = filtered.reduce((sum, item) => sum + item.severanceAmount, 0);
    const calculatedCount = filtered.filter(item => item.status === '계산완료' || item.status === '지급완료').length;
    const paidCount = filtered.filter(item => item.status === '지급완료').length;

    setSettlementSummary({
      totalAmount,
      totalCount,
      calculatedCount,
      paidCount
    });
  };

  const handleEmployeeSelect = (employee) => {
    if (activeTab === 'expected') {
      setExpectedFilters({
        ...expectedFilters,
        employeeId: String(employee.id || employee.employeeId || ''),
        employeeName: employee.name || ''
      });
    } else {
      setSettlementFilters({
        ...settlementFilters,
        employeeId: String(employee.id || employee.employeeId || ''),
        employeeName: employee.name || ''
      });
    }
    setIsEmployeeSearchOpen(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR').format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      '계산완료': { backgroundColor: '#fef3c7', color: '#92400e' },
      '지급완료': { backgroundColor: '#d1fae5', color: '#065f46' }
    };
    const style = statusStyles[status] || { backgroundColor: '#e5e7eb', color: '#374151' };
    return (
      <span style={{
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.875rem',
        fontWeight: '500',
        ...style
      }}>
        {status}
      </span>
    );
  };

  return (
    <div className={styles.container}>
      {/* 탭 네비게이션 */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #e5e7eb', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setActiveTab('expected')}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            fontWeight: '600',
            border: 'none',
            borderBottom: activeTab === 'expected' ? '3px solid #3b82f6' : '3px solid transparent',
            color: activeTab === 'expected' ? '#3b82f6' : '#6b7280',
            backgroundColor: 'transparent',
            cursor: 'pointer'
          }}
        >
          전 직원 예상 퇴직금
        </button>
        <button
          onClick={() => setActiveTab('settlement')}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            fontWeight: '600',
            border: 'none',
            borderBottom: activeTab === 'settlement' ? '3px solid #3b82f6' : '3px solid transparent',
            color: activeTab === 'settlement' ? '#3b82f6' : '#6b7280',
            backgroundColor: 'transparent',
            cursor: 'pointer'
          }}
        >
          퇴직자 퇴직금 정산
        </button>
      </div>

      {/* 탭1: 예상 퇴직금 */}
      {activeTab === 'expected' && (
        <>
          <div className={styles.filterSection}>
            <div className={styles.filterTitle}>예상 퇴직금 조회</div>
            <div className={styles.filterRow}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>사번</label>
                <input
                  type="text"
                  placeholder="사번 입력"
                  value={expectedFilters.employeeId}
                  onChange={(e) => setExpectedFilters({ ...expectedFilters, employeeId: e.target.value })}
                  className={styles.filterInput}
                />
              </div>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>이름</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="이름 입력"
                    value={expectedFilters.employeeName}
                    onChange={(e) => setExpectedFilters({ ...expectedFilters, employeeName: e.target.value })}
                    className={styles.filterInput}
                  />
                  <button onClick={() => setIsEmployeeSearchOpen(true)} className={styles.btnSecondary}>검색</button>
                </div>
              </div>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>부서</label>
                <select
                  value={expectedFilters.department}
                  onChange={(e) => setExpectedFilters({ ...expectedFilters, department: e.target.value })}
                  className={styles.filterSelect}
                >
                  <option value="전체">전체</option>
                  {departments.map((deptName, index) => (
                    <option key={index} value={deptName}>{deptName}</option>
                  ))}
                </select>
              </div>
              <div className={styles.filterActions}>
                <button onClick={() => applyExpectedFilters()} className={styles.btnPrimary}>조회</button>
              </div>
            </div>
          </div>

          <div className={styles.summarySection}>
            <div className={styles.summaryCard}>
              <div className={styles.summaryLabel}>총 직원 수</div>
              <div className={styles.summaryValue}>{expectedSummary.totalEmployees}명</div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryLabel}>예상 퇴직금 총액</div>
              <div className={styles.summaryValue}>₩{formatCurrency(expectedSummary.totalExpectedAmount)}</div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryLabel}>1인당 평균</div>
              <div className={styles.summaryValue}>₩{formatCurrency(expectedSummary.averageExpectedAmount)}</div>
            </div>
          </div>

          <div className={styles.tableSection}>
            <div className={styles.tableHeader}>
              <div className={styles.tableTitle}>전 직원 예상 퇴직금 목록 (근속 1년 이상)</div>
            </div>
            {loading ? (
              <div className={styles.loadingState}>데이터를 불러오는 중...</div>
            ) : expectedList.length === 0 ? (
              <div className={styles.emptyState}>조회된 직원이 없습니다.</div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>사번</th>
                    <th>이름</th>
                    <th>부서</th>
                    <th>직급</th>
                    <th>입사일</th>
                    <th>근속년수</th>
                    <th>평균급여</th>
                    <th>예상 퇴직금</th>
                  </tr>
                </thead>
                <tbody>
                  {expectedList.map((item) => (
                    <tr key={item.id}>
                      <td>{item.employeeId}</td>
                      <td>{item.employeeName}</td>
                      <td>{item.departmentName}</td>
                      <td>{item.positionName}</td>
                      <td>{formatDate(item.hireDate)}</td>
                      <td>{item.yearsOfService.toFixed(1)}년</td>
                      <td>{formatCurrency(item.averageSalary)}</td>
                      <td style={{ fontWeight: '600', color: '#3b82f6' }}>
                        {formatCurrency(item.expectedSeveranceAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* 탭2: 퇴직금 정산 */}
      {activeTab === 'settlement' && (
        <>
          <div className={styles.filterSection}>
            <div className={styles.filterTitle}>퇴직금 정산 관리</div>
            <div className={styles.filterRow}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>퇴직연도</label>
                <select
                  value={settlementFilters.year}
                  onChange={(e) => {
                    const newYear = e.target.value === '전체' ? null : parseInt(e.target.value);
                    setSettlementFilters({ ...settlementFilters, year: newYear });
                    // 연도 변경 시 즉시 데이터 다시 로드
                    setTimeout(() => loadSettlementData(), 0);
                  }}
                  className={styles.filterSelect}
                >
                  <option value="전체">전체</option>
                  {Array.from({ length: 5 }, (_, i) => currentYear - i).map(year => (
                    <option key={year} value={year}>{year}년</option>
                  ))}
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>사번</label>
                <input
                  type="text"
                  placeholder="사번 입력"
                  value={settlementFilters.employeeId}
                  onChange={(e) => setSettlementFilters({ ...settlementFilters, employeeId: e.target.value })}
                  className={styles.filterInput}
                />
              </div>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>상태</label>
                <select
                  value={settlementFilters.status}
                  onChange={(e) => setSettlementFilters({ ...settlementFilters, status: e.target.value })}
                  className={styles.filterSelect}
                >
                  <option value="전체">전체</option>
                  <option value="계산완료">계산완료</option>
                  <option value="지급완료">지급완료</option>
                </select>
              </div>
              <div className={styles.filterActions}>
                <button onClick={() => applySettlementFilters()} className={styles.btnPrimary}>조회</button>
              </div>
            </div>
          </div>

          <div className={styles.summarySection}>
            <div className={styles.summaryCard}>
              <div className={styles.summaryLabel}>총 대상 인원</div>
              <div className={styles.summaryValue}>{settlementSummary.totalCount}명</div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryLabel}>총 퇴직금</div>
              <div className={styles.summaryValue}>₩{formatCurrency(settlementSummary.totalAmount)}</div>
            </div>
          </div>

          <div className={styles.tableSection}>
            <div className={styles.tableHeader}>
              <div className={styles.tableTitle}>퇴직자 정산 목록</div>
            </div>
            {loading ? (
              <div className={styles.loadingState}>데이터를 불러오는 중...</div>
            ) : settlementList.length === 0 ? (
              <div className={styles.emptyState}>조회된 퇴직자가 없습니다.</div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={selectedIds.length === settlementList.length && settlementList.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds(settlementList.map(item => item.id));
                          } else {
                            setSelectedIds([]);
                          }
                        }}
                      />
                    </th>
                    <th>사번</th>
                    <th>이름</th>
                    <th>부서</th>
                    <th>직급</th>
                    <th>퇴사일</th>
                    <th>근속년수</th>
                    <th>퇴직금</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {settlementList.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item.id)}
                          onChange={() => {
                            if (selectedIds.includes(item.id)) {
                              setSelectedIds(selectedIds.filter(id => id !== item.id));
                            } else {
                              setSelectedIds([...selectedIds, item.id]);
                            }
                          }}
                        />
                      </td>
                      <td>{item.employeeId}</td>
                      <td>{item.employeeName}</td>
                      <td>{item.departmentName}</td>
                      <td>{item.positionName}</td>
                      <td>{formatDate(item.retirementDate)}</td>
                      <td>{item.yearsOfService.toFixed(1)}년</td>
                      <td style={{ fontWeight: '600', color: '#3b82f6' }}>
                        {formatCurrency(item.severanceAmount)}
                      </td>
                      <td>{getStatusBadge(item.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {isEmployeeSearchOpen && (
        <EmployeeSearchModal
          isOpen={isEmployeeSearchOpen}
          onClose={() => setIsEmployeeSearchOpen(false)}
          onSelect={handleEmployeeSelect}
        />
      )}
    </div>
  );
}