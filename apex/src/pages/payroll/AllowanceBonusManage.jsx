import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { fetchSalaryModifications, bulkUpdateFilteredSalaries, deleteSalary } from '../../api/salary';
import AllowanceForm from '../../components/payroll/AllowanceForm';
import AllowanceFilter from '../../components/payroll/AllowanceFilter';
import AllowanceTable from '../../components/payroll/AllowanceTable';
import styles from './AllowanceBonusManage.module.css';

/**
 * 수당/상여 관리 페이지
 * 컴포넌트 구성:
 * - AllowanceForm: 좌측 수당 추가 폼
 * - AllowanceFilter: 우측 상단 필터 섹션
 * - AllowanceTable: 우측 하단 테이블
 */
export default function AllowanceBonusManage() {
  // 수정된 급여 내역만 관리 (이 페이지에서 추가한 수당 내역)
  const [allowances, setAllowances] = useState([]);
  const [allAllowances, setAllAllowances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

  // 월별 급여 수정 내역 로드
  const loadMonthlyData = async (yearMonth) => {
    console.log('📥 loadMonthlyData 호출:', yearMonth);
    setLoading(true);
    try {
      const response = await fetchSalaryModifications(yearMonth);
      console.log('급여 수정 내역 조회 응답:', response);
      
      // 응답 데이터 파싱
      const responseData = response.data || response;
      let salaryData = [];
      
      if (Array.isArray(responseData)) {
        salaryData = responseData;
      } else if (responseData && typeof responseData === 'object') {
        // modifications 필드가 있을 수 있음
        salaryData = Array.isArray(responseData.modifications) 
          ? responseData.modifications 
          : (Array.isArray(responseData.content) ? responseData.content : []);
      }
      
      console.log('파싱된 급여 수정 내역:', salaryData);
      
      // 전체 목록 업데이트 (다른 월 데이터와 병합)
      const otherMonthsData = allAllowances.filter(a => a.paymentDate !== yearMonth);
      const fullList = [...otherMonthsData, ...salaryData];
      setAllAllowances(fullList);
      
      // 현재 월 데이터만 표시
      setAllowances(salaryData);
      
      // 세션 스토리지에 저장
      sessionStorage.setItem('modifiedSalaries', JSON.stringify(fullList));
      
    } catch (error) {
      console.error('급여 수정 내역 조회 실패:', error);
      if (error.response?.status === 404) {
        // 해당 월에 데이터가 없는 경우
        console.log('해당 월에 급여 수정 내역이 없습니다.');
        setAllowances([]);
      } else {
        toast.error('급여 수정 내역을 불러오는데 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드 및 월 변경 시 데이터 로드
  useEffect(() => {
    console.log('🔄 selectedMonth 변경됨:', selectedMonth);
    loadMonthlyData(selectedMonth);
  }, [selectedMonth]); // eslint-disable-line react-hooks/exhaustive-deps

  // 월 변경 핸들러
  const handleMonthChange = (direction) => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    
    if (direction === 'prev') {
      date.setMonth(date.getMonth() - 1);
    } else if (direction === 'next') {
      date.setMonth(date.getMonth() + 1);
    }
    
    const newMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    setSelectedMonth(newMonth);
  };

  // 월 포맷팅 (표시용)
  const formatMonthDisplay = (yearMonth) => {
    const [year, month] = yearMonth.split('-');
    return `${year}년 ${month}월`;
  };

  // 수당 생성
  const handleCreateAllowance = async (formData) => {
    console.log('🚀 handleCreateAllowance 호출됨!');
    console.log('받은 formData:', formData);
    
    try {
      // 타입별 매핑
      const typeMap = {
        '전체': 'ALL',
        '부서별': 'DEPARTMENT',
        '직급별': 'POSITION',
        '개인별': 'EMPLOYEE'
      };
      
      // 카테고리별 필드 매핑 (프론트엔드 카테고리 → 백엔드 수당 타입)
      const categoryFieldMap = {
        '인센티브': 'bonusToAdd',
        '보너스': 'bonusToAdd',
        '명절수당': 'bonusToAdd',
        '야근수당': 'overtimeAllowanceToAdd',
        '야간수당': 'nightAllowanceToAdd',
        '특별수당': 'bonusToAdd',
        '기타': 'bonusToAdd'
      };
      
      // API 요청 데이터 생성
      const requestData = {
        paymentDate: formData.month, // YYYY-MM 형식
        targetType: typeMap[formData.type],
        [categoryFieldMap[formData.category]]: Number(formData.amount),
        bonusReason: formData.description || null, // 지급 사유
        bonusAttachment: formData.file ? formData.file.name : null // 첨부파일명
      };
      
      // 대상별 필드 추가
      if (formData.type === '부서별') {
        requestData.targetDepartment = formData.targetDepartment;
      } else if (formData.type === '직급별') {
        requestData.targetPosition = formData.targetPosition;
      } else if (formData.type === '개인별') {
        requestData.targetEmployeeId = Number(formData.targetEmployee);
      }
      
      console.log('📤 API 요청 데이터:', requestData);
      
      setLoading(true);
      
      // API 호출
      console.log('🌐 bulkUpdateFilteredSalaries 호출 시작...');
      const response = await bulkUpdateFilteredSalaries(requestData);
      console.log('✅ API 응답 받음!');
      console.log('수당 추가 응답 (전체):', response);
      console.log('응답 데이터:', response.data);
      console.log('updatedSalaries:', response.data?.updatedSalaries);
      
      // axios 응답 구조: response.data가 백엔드 응답
      const responseData = response.data || response;
      const updatedSalaries = responseData.updatedSalaries || [];
      const message = responseData.message;
      
      if (updatedSalaries.length > 0) {
        toast.success(message || `${updatedSalaries.length}명의 급여가 수정되었습니다.`);
        
        // 수정 완료 후 현재 월 데이터 다시 로드
        console.log('✅ 수당 추가 성공! 데이터 새로고침...');
        await loadMonthlyData(selectedMonth);
      } else {
        toast.info(message || '수정된 급여가 없습니다.');
      }
    } catch (error) {
      console.error('❌❌❌ 수당 추가 실패:', error);
      console.error('에러 상세:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || '수당 추가에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 필터 검색
  const handleFilterSearch = (filters) => {
    // 현재 선택된 월의 데이터만 필터링 대상으로
    let filtered = allAllowances.filter(a => a.paymentDate === selectedMonth);

    // 대상명으로 필터링
    if (filters.targetName && filters.targetName.trim()) {
      filtered = filtered.filter(a => 
        a.targetName?.includes(filters.targetName.trim())
      );
    }

    // 대상 유형으로 필터링
    if (filters.type && filters.type !== '전체') {
      filtered = filtered.filter(a => a.type === filters.type);
    }

    setAllowances(filtered);
  };

  // 필터 초기화
  const handleFilterReset = () => {
    const filteredByMonth = allAllowances.filter(a => a.paymentDate === selectedMonth);
    setAllowances(filteredByMonth);
  };

  // 수당 삭제
  const handleDeleteAllowance = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) {
      return;
    }

    try {
      await deleteSalary(id);
      
      // 전체 목록에서 삭제
      const updatedFullList = allAllowances.filter(a => a.id !== id);
      setAllAllowances(updatedFullList);
      
      // 현재 월 목록에서도 삭제
      const updatedMonthList = allowances.filter(a => a.id !== id);
      setAllowances(updatedMonthList);
      
      // 세션 스토리지 업데이트 (전체 목록 저장)
      sessionStorage.setItem('modifiedSalaries', JSON.stringify(updatedFullList));
      
      toast.success('급여가 삭제되었습니다.');
    } catch (error) {
      console.error('급여 삭제 실패:', error);
      toast.error('급여 삭제에 실패했습니다.');
    }
  };

  // 수당 상세 보기
  const handleViewAllowance = (modification) => {
    const detailMessage = `
수당 내역 상세

ID: ${modification.id}
지급월: ${modification.paymentDate}
대상 유형: ${modification.type}
대상명: ${modification.targetName || '-'}
적용 인원: ${modification.employeeCount}명
금액: ${new Intl.NumberFormat('ko-KR').format(modification.amount)}원

지급 사유: ${modification.description || '-'}

등록일시: ${modification.createdAt ? new Date(modification.createdAt).toLocaleString('ko-KR') : '-'}
등록자: ${modification.createdBy || '-'}
    `.trim();
    
    alert(detailMessage);
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        {/* 왼쪽: 기타 수당 추가 폼 */}
        <AllowanceForm onSubmit={handleCreateAllowance} />

        {/* 오른쪽: 필터 & 테이블 */}
        <div className={styles.tableSection}>
          <AllowanceFilter 
            onSearch={handleFilterSearch}
            onReset={handleFilterReset}
          />
          
          {/* 월 선택기 */}
          <div className={styles.monthSelector}>
            <button 
              className={styles.monthNavBtn}
              onClick={() => handleMonthChange('prev')}
              title="이전 달"
            >
              ◀
            </button>
            <div className={styles.currentMonth}>
              {formatMonthDisplay(selectedMonth)}
            </div>
            <button 
              className={styles.monthNavBtn}
              onClick={() => handleMonthChange('next')}
              title="다음 달"
            >
              ▶
            </button>
          </div>
          
          <AllowanceTable
            allowances={allowances}
            loading={loading}
            onDelete={handleDeleteAllowance}
            onView={handleViewAllowance}
          />
        </div>
      </div>
    </div>
  );
}
