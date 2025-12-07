import React, { useState, useEffect } from 'react';
import { fetchMonthlysalary, confirmSalary, markSalaryAsPaid, updateSalary, fetchSalaryById } from '../../api/salary';
import { fetchUniqueDepartmentNames } from '../../api/department';
import { toast } from 'react-toastify';
import EmployeeSearchModal from '../../components/common/EmployeeSearchModal';
import PayslipDetailModal from '../../components/payroll/PayslipDetailModal';
import PayslipModal from '../../components/payroll/PayslipModal';

import { IoIosDownload } from "react-icons/io";
import styles from './PayrollSettlement.module.css';

export default function PayrollSettlement() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [employeeId, setEmployeeId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [department, setDepartment] = useState('전체');
  const [departments, setDepartments] = useState([]);
  
  const [salary, setsalary] = useState([]);
  const [allsalary, setAllsalary] = useState([]); // 전체 데이터 저장
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isEmployeeSearchOpen, setIsEmployeeSearchOpen] = useState(false);
  const [isPayslipDetailOpen, setIsPayslipDetailOpen] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);
  const [payslipData, setPayslipData] = useState(null);

  // 요약 데이터
  const [summary, setSummary] = useState({
    totalAmount: 0,
    totalDeductions: 0,
    netAmount: 0
  });

  useEffect(() => {
    loadsalary();
    loadDepartments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 년도/월 변경 시 자동 재조회
  useEffect(() => {
    if (year && month) {
      loadsalary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  const loadDepartments = async () => {
    try {
      const response = await fetchUniqueDepartmentNames();
      console.log('부서명 API 응답:', response);
      
      // 응답이 문자열 배열로 올 경우
      let deptList = [];
      if (response.data && Array.isArray(response.data)) {
        deptList = response.data;
      } else if (Array.isArray(response)) {
        deptList = response;
      }
      
      console.log('파싱된 부서 목록:', deptList);
      setDepartments(deptList);
    } catch (error) {
      console.error('부서 목록 조회 실패:', error);
    }
  };

  const loadsalary = async () => {
    setLoading(true);
    try {
      const yearMonth = `${year}-${String(month).padStart(2, '0')}`;
      const response = await fetchMonthlysalary(yearMonth);
      
      console.log('급여 API 응답:', response);
      
      // ApiResponse 형태일 경우 data 속성에서 추출
      let salaryData = [];
      if (response && response.data) {
        salaryData = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        salaryData = response;
      }
      
      console.log('급여 데이터:', salaryData);
      setAllsalary(salaryData); // 전체 데이터 저장
      applyFilters(salaryData); // 필터 적용
    } catch (error) {
      console.error('급여 목록 조회 실패:', error);
      toast.error('급여 목록을 불러오는데 실패했습니다.');
      setAllsalary([]);
      setsalary([]);
      calculateSummary([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (data) => {
    let filtered = [...data];

    // 사원번호 필터
    if (employeeId.trim()) {
      filtered = filtered.filter(s => 
        s.employeeId?.toString().includes(employeeId.trim())
      );
    }

    // 이름 필터
    if (employeeName.trim()) {
      filtered = filtered.filter(s => 
        s.employeeName?.includes(employeeName.trim())
      );
    }

    // 부서 필터
    if (department && department !== '전체') {
      filtered = filtered.filter(s => 
        s.departmentName === department
      );
    }

    setsalary(filtered);
    calculateSummary(filtered);
  };

  const calculateSummary = (data) => {
    console.log('요약 계산 데이터:', data);
    
    if (!Array.isArray(data) || data.length === 0) {
      setSummary({ totalAmount: 0, totalDeductions: 0, netAmount: 0 });
      return;
    }
    
    // 첫 번째 데이터 항목 확인
    console.log('첫 번째 급여 항목:', data[0]);
    
    const totalAmount = data.reduce((sum, item) => sum + (item.totalSalary || 0), 0);
    
    const totalDeductions = data.reduce((sum, item) => {
      const deduction = (item.employmentInsurance || 0) + 
                       (item.healthInsurance || 0) + 
                       (item.incomeTax || 0) + 
                       (item.nationalPension || 0) + 
                       (item.otherDeductions || 0);
      return sum + deduction;
    }, 0);
    
    const netAmount = data.reduce((sum, item) => sum + (item.netSalary || 0), 0);
    
    console.log('계산된 요약:', { totalAmount, totalDeductions, netAmount });
    setSummary({ totalAmount, totalDeductions, netAmount });
  };

  const handleSearch = () => {
    applyFilters(allsalary);
  };

  const handleReset = () => {
    setYear(new Date().getFullYear());
    setMonth(new Date().getMonth() + 1);
    setEmployeeId('');
    setEmployeeName('');
    setDepartment('전체');
    setSelectedIds([]);
    // 리셋 후 전체 데이터로 다시 표시
    setsalary(allsalary);
    calculateSummary(allsalary);
  };

  const handleOpenEmployeeSearch = () => {
    setIsEmployeeSearchOpen(true);
  };

  const handleSelectEmployee = (employee) => {
    setEmployeeId(employee.id.toString());
    setEmployeeName(employee.name);
    setIsEmployeeSearchOpen(false);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(salary.map(s => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(sid => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleConfirm = async () => {
    if (selectedIds.length === 0) {
      toast.warning('확정할 급여를 선택해주세요.');
      return;
    }

    try {
      await Promise.all(selectedIds.map(id => confirmSalary(id)));
      toast.success(`${selectedIds.length}건의 급여가 확정되었습니다.`);
      setSelectedIds([]);
      loadsalary();
    } catch (error) {
      console.error('급여 확정 실패:', error);
      toast.error('급여 확정에 실패했습니다.');
    }
  };

  const handlePay = async () => {
    if (selectedIds.length === 0) {
      toast.warning('지급 처리할 급여를 선택해주세요.');
      return;
    }

    try {
      await Promise.all(selectedIds.map(id => markSalaryAsPaid(id)));
      toast.success(`${selectedIds.length}건의 급여가 지급 처리되었습니다.`);
      setSelectedIds([]);
      loadsalary();
    } catch (error) {
      console.error('급여 지급 처리 실패:', error);
      toast.error('급여 지급 처리에 실패했습니다.');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR').format(amount || 0);
  };

  const getStatusBadge = (status) => {
    // 백엔드에서 "지급완료", "확정", "계산완료" 등 한글로 올 경우
    const statusMap = {
      '계산완료': { text: '계산완료', className: styles.statusCalculated },
      'CALCULATED': { text: '계산완료', className: styles.statusCalculated },
      '확정': { text: '확정', className: styles.statusConfirmed },
      'CONFIRMED': { text: '확정', className: styles.statusConfirmed },
      '지급완료': { text: '지급완료', className: styles.statusPaid },
      'PAID': { text: '지급완료', className: styles.statusPaid }
    };
    const info = statusMap[status] || { text: status, className: styles.statusCalculated };
    return <span className={`${styles.statusBadge} ${info.className}`}>{info.text}</span>;
  };

  const handleRowClick = (salary) => {
    setSelectedSalary(salary);
    setIsPayslipDetailOpen(true);
  };

  const handleDownloadPayslip = async (salaryItem, e) => {
    e.stopPropagation(); // 행 클릭 이벤트 방지
    
    // 급여명세서 인쇄용 모달 열기
    try {
      console.log('급여 상세 조회 요청:', salaryItem.id);
      
      // API 호출: fetchSalaryById(salaryId)
      const response = await fetchSalaryById(salaryItem.id);
      
      console.log('급여 상세 조회 응답:', response);
      
      // 응답 데이터 파싱
      let fullPayslipData = null;
      if (response.data) {
        fullPayslipData = response.data;
      } else {
        fullPayslipData = response;
      }

      if (!fullPayslipData) {
        toast.error("상세 급여 정보를 불러오지 못했습니다.");
        return;
      }

      // 인쇄용 모달 열기
      setPayslipData(fullPayslipData);
      setIsPayslipModalOpen(true);
      
    } catch (error) {
      console.error("상세 급여 정보 API 호출 실패:", error);
      toast.error("급여 명세서 상세 내용을 불러오는데 실패했습니다.");
    }
  };

  const handlePayslipUpdate = async (salaryId, updateData) => {
    try {
      console.log('급여 수정 데이터:', salaryId, updateData);
      
      // API 호출
      await updateSalary(salaryId, updateData);
      
      toast.success('급여 정보가 수정되었습니다.');
      
      // 성공 후 급여 목록 재조회
      await loadsalary();
    } catch (error) {
      console.error('급여 수정 실패:', error);
      toast.error('급여 수정에 실패했습니다.');
      throw error; // 모달에서 에러 처리를 위해 다시 throw
    }
  };

  return (
    <div className={styles.container}>
      {/* 필터 섹션 */}
      <div className={styles.filterSection}>
        <div className={styles.filterTitle}>급여정산 및 확정</div>
        <div className={styles.filterRow}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>년도</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className={styles.filterInput}
            />
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>월</label>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className={styles.filterSelect}
            >
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
                <option key={m} value={m}>{m}월</option>
              ))}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>사원번호</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="사번"
                className={styles.filterInput}
                readOnly
                style={{ flex: 1, cursor: 'pointer', backgroundColor: '#f5f5f5' }}
                onClick={handleOpenEmployeeSearch}
              />
              <button
                type="button"
                onClick={handleOpenEmployeeSearch}
                className={styles.btnPrimary}
                style={{
                  padding: '0.5rem 1rem',
                  whiteSpace: 'nowrap',
                  fontSize: '0.875rem'
                }}
              >
                직원 검색
              </button>
            </div>
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>이름</label>
            <input
              type="text"
              value={employeeName}
              readOnly
              placeholder="이름"
              className={styles.filterInput}
              style={{ backgroundColor: '#f5f5f5' }}
            />
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>부서</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="전체">전체</option>
              {departments.map((deptName, index) => (
                <option key={index} value={deptName}>
                  {deptName}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.filterActions}>
            <button onClick={handleReset} className="btn btn-light btn-md">
              초기화
            </button>
            <button onClick={handleSearch} className="btn btn-primary btn-md">
              조회
            </button>
          </div>
        </div>
      </div>

      {/* 요약 섹션 */}
      <div className={styles.summarySection}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>총 지급액</div>
          <div className={styles.summaryValue}>₩{formatCurrency(summary.totalAmount)}</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>총 공제액</div>
          <div className={styles.summaryValue}>₩{formatCurrency(summary.totalDeductions)}</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>실지급액</div>
          <div className={styles.summaryValue}>₩{formatCurrency(summary.netAmount)}</div>
        </div>
      </div>

      {/* 테이블 섹션 */}
      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <div className={styles.tableTitle}>급여 목록</div>
          <div className={styles.tableActions}>
            <button onClick={handleConfirm} className={styles.btnPrimary}>
              확정
            </button>
            <button onClick={handlePay} className={styles.btnPrimary}>
              지급완료
            </button>
          </div>
        </div>

        {loading ? (
          <div className={styles.loadingState}>데이터를 불러오는 중...</div>
        ) : salary.length === 0 ? (
          <div className={styles.emptyState}>조회된 급여 내역이 없습니다.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={selectedIds.length === salary.length && salary.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>사번</th>
                <th>이름</th>
                <th>직급</th>
                <th>부서</th>
                <th>소속</th>
                <th>지급액</th>
                <th>공제액</th>
                <th>실지급액</th>
                <th>상태</th>
                <th>다운로드</th>
              </tr>
            </thead>
            <tbody>
              {salary.map((salary) => (
                <tr 
                  key={salary.id} 
                  onClick={() => handleRowClick(salary)}
                  className={styles.tableRow}
                >
                  <td onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={selectedIds.includes(salary.id)}
                      onChange={() => handleSelectOne(salary.id)}
                    />
                  </td>
                  <td>{salary.employeeId}</td>
                  <td>{salary.employeeName}</td>
                  <td>{salary.positionName}</td>
                  <td>{salary.departmentName}</td>
                  <td>{salary.teamName || '-'}</td>
                  <td>{formatCurrency(salary.totalSalary)}</td>
                  <td>{formatCurrency(
                    (salary.employmentInsurance || 0) + 
                    (salary.healthInsurance || 0) + 
                    (salary.incomeTax || 0) + 
                    (salary.nationalPension || 0) + 
                    (salary.otherDeductions || 0)
                  )}</td>
                  <td>{formatCurrency(salary.netSalary)}</td>
                  <td>{getStatusBadge(salary.salaryStatus)}</td>
                  <td>
                    <button 
                      className={styles.downloadBtn}
                      onClick={(e) => handleDownloadPayslip(salary, e)}
                      title="급여명세서 보기"
                    >
                      <IoIosDownload />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 직원 검색 모달 */}
      <EmployeeSearchModal
        isOpen={isEmployeeSearchOpen}
        onClose={() => setIsEmployeeSearchOpen(false)}
        onSelectEmployee={handleSelectEmployee}
      />

      {/* 급여명세 수정 모달 */}
      <PayslipDetailModal
        isOpen={isPayslipDetailOpen}
        onClose={() => {
          setIsPayslipDetailOpen(false);
          setSelectedSalary(null);
        }}
        salary={selectedSalary}
        onUpdate={handlePayslipUpdate}
      />

      {/* 급여명세서 인쇄용 모달 */}
      <PayslipModal
        isOpen={isPayslipModalOpen}
        onClose={() => {
          setIsPayslipModalOpen(false);
          setPayslipData(null);
        }}
        payslipData={payslipData}
      />
    </div>
  );
}
