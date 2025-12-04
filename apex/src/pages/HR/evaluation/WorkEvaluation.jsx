import React, { useState, useEffect } from 'react';
import { Select, Button } from '../../../components/common';
import api from '../../../api/axios';
import { fetchUniqueDepartmentNames } from '../../../api/department';
import styles from './WorkEvaluation.module.css';
import WorkEvaluationModal from '../../../components/HR/Evaluation/WorkEvaluationModal';

// 현재 분기 계산 함수
const getCurrentQuarter = () => {
  const month = new Date().getMonth() + 1; // 1~12
  if (month >= 1 && month <= 3) return '1분기';
  if (month >= 4 && month <= 6) return '2분기';
  if (month >= 7 && month <= 9) return '3분기';
  return '4분기';
};

export default function WorkEvaluation() {

  const [searchParams, setSearchParams] = useState({
    year: new Date().getFullYear(),
    quarter: getCurrentQuarter(),
    department: '선택'
  });

  const [evaluationData, setEvaluationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [departments, setDepartments] = useState(['선택']); // API에서 가져올 부서 목록

  // ✅ [추가] 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(0); 
  const ITEMS_PER_PAGE = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState(null);

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  const quarters = ['1분기', '2분기', '3분기', '4분기'];

  /**
   * 부서 목록 로드
   */
  const loadDepartments = async () => {
      const response = await fetchUniqueDepartmentNames();
      // 백엔드가 {success, message, data} 형식으로 응답
      const deptNames = response.data || response || [];
      
      setDepartments(['선택', ...deptNames]);
  };

  /**
   * 평가 데이터를 API에서 로드하는 함수
   */
  const loadEvaluations = async () => {
    setLoading(true);
    
    const filters = {
        year: searchParams.year,
        quarter: searchParams.quarter,
        departmentName: searchParams.department === '선택' ? null : searchParams.department
    };

    try {
      const response = await api.get('/hr/evaluations', { params: filters });
      setEvaluationData(response.data || []);
      setCurrentPage(0); // ✅ 검색 시 1페이지로 초기화
    } catch (error) {
      console.error("평가 데이터 조회 실패:", error);
      setEvaluationData([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments(); // 부서 목록 먼저 로드
    loadEvaluations(); // 평가 데이터 로드
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    loadEvaluations();
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // ✅ 현재 페이지 데이터만 선택할지, 전체 선택할지 결정 (여기선 전체 데이터 기준)
      const allIds = evaluationData.map(item => item.id);
      setSelectedEmployees(allIds);
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleSelectEmployee = (id) => {
    setSelectedEmployees(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      // 수정 모드: 기존 데이터 전달
      setCurrentEvaluation({
        ...item,
        year: searchParams.year,
        quarter: searchParams.quarter,
        comment: item.comment || '' 
      });
    } else {
      // 신규 생성 모드: 현재 연도와 현재 분기로 자동 설정
      const currentYear = new Date().getFullYear();
      const currentQuarter = getCurrentQuarter();
      
      setCurrentEvaluation({
        id: null, // 신규 구분용
        employeeId: '',
        name: '',
        departmentName: searchParams.department === '선택' ? '' : searchParams.department,
        positionName: '',
        year: currentYear,
        quarter: currentQuarter,
        workAttitude: 3,
        goalAchievement: 3,
        collaboration: 3,
        contribution: 'C',
        comment: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentEvaluation(null);
  };

  const handleSaveEvaluation = async (updatedData) => {
    try {
        if (updatedData.id) {
            // 수정 모드: PUT 요청
            await api.put(`/hr/evaluations/${updatedData.id}`, updatedData);
            alert(`${updatedData.name}님의 평가 내용이 수정되었습니다.`);
        } else {
            // 신규 생성 모드: POST 요청
            await api.post('/hr/evaluations', updatedData, {
                params: { employeeId: updatedData.employeeId }
            });
            alert(`${updatedData.name}님의 평가가 신규 등록되었습니다.`);
        }
        loadEvaluations(); 
        handleCloseModal();
    } catch (error) {
        console.error("평가 내용 저장 실패:", error);
        const errorMessage = error.response?.data?.message || "평가 내용 저장에 실패했습니다.";
        alert(errorMessage);
    }
  };

  // ✅ [추가] 일괄 임시저장 / 제출 기능 (선택된 항목 처리)
  const handleBulkAction = async (actionType) => {
    if (selectedEmployees.length === 0) {
      alert(`${actionType}할 항목을 선택해주세요.`);
      return;
    }
    alert(`선택된 ${selectedEmployees.length}건을 ${actionType} 처리합니다. (기능 구현 필요)`);
    // 여기에 실제 API 호출 로직 추가 (Promise.all 사용 등)
  };

  // ✅ [추가] 페이지네이션 데이터 계산
  const totalCount = evaluationData.length;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const offset = currentPage * ITEMS_PER_PAGE;
  const currentData = evaluationData.slice(offset, offset + ITEMS_PER_PAGE);

  const handlePageChange = (newPage) => {
      if (newPage >= 0 && newPage < totalPages) {
          setCurrentPage(newPage);
      }
  };

  const tableHeaders = [
    { label: '사번', key: 'employeeId' },
    { label: '이름', key: 'name' },
    { label: '직급', key: 'positionName' },
    { label: '근무태도', key: 'workAttitude' },
    { label: '목표달성', key: 'goalAchievement' },
    { label: '협업', key: 'collaboration' },
    { label: '기여도', key: 'contribution' },
    { label: '상세(평가자)', key: 'detail' }
  ];

  const renderEvaluationRow = (item) => {
    const isSelected = selectedEmployees.includes(item.id);

    return (
      <tr key={item.id}>
        <td>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => handleSelectEmployee(item.id)}
          />
        </td>
        <td>{item.employeeId}</td>
        <td>{item.name}</td>
        <td>{item.positionName}</td>
        <td>{item.workAttitude}</td>
        <td>{item.goalAchievement}</td>
        <td>{item.collaboration}</td>
        <td>{item.contribution}</td>
        
        <td className={styles.iconCell} 
            style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
            onClick={() => handleOpenModal(item)}>
          {item.evaluatorInfo || '미입력'}
        </td>
      </tr>
    );
  };

  const isAllSelected = evaluationData.length > 0 && selectedEmployees.length === evaluationData.length;

  return (
    <div className={styles.container}>

      <div className={styles.searchSection}> 
        <h1 className={styles.title}>평가 관리</h1>

        <div className={styles.filterRow}>
          <div className={styles.searchGroup}>
            <label>년도</label>
            <Select
              options={years.map(y => ({ value: y, label: y }))}
              value={searchParams.year}
              name="year"
              onChange={handleSearchChange}
            />
          </div>
          <div className={styles.searchGroup}>
            <label>분기</label>
            <Select
              options={quarters.map(q => ({ value: q, label: q }))}
              value={searchParams.quarter}
              name="quarter"
              onChange={handleSearchChange}
            />
          </div>
          <div className={styles.searchGroup}>
            <label>부서</label>
            <Select
              options={departments.map(d => ({ value: d, label: d }))}
              value={searchParams.department}
              name="department"
              onChange={handleSearchChange}
            />
          </div>
          <div className={styles.spacer}></div>
          <Button onClick={handleSearch} className={styles.searchButton}>조회</Button>
        </div>
      </div>

      {/* 신규 평가 등록 버튼 */}
      <div className={styles.createButtonWrapper}>
        <Button onClick={() => handleOpenModal(null)} className={styles.createButton}>
          신규 평가 등록
        </Button>
      </div>

      <div className={styles.tableSection}>
        {loading ? (
          <div className={styles.loadingMessage}>데이터를 불러오는 중입니다...</div>
        ) : (
          <table className={styles.evaluationTable}>
            <thead>
              <tr>
                <th className={styles.checkboxHeader}>
                  <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} />
                </th>
                {tableHeaders.map(header => (
                  <th key={header.key}>{header.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* ✅ [중요] 전체 데이터 대신 현재 페이지 데이터(currentData)만 렌더링 */}
              {currentData.length > 0 ? (
                currentData.map((item) => renderEvaluationRow(item))
              ) : (
                <tr>
                  <td colSpan={tableHeaders.length + 1} className={styles.emptyCell}>
                    조회된 근무 평가 기록이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className={styles.footerSection}>
        
        {/* ✅ [추가] 통일된 페이지네이션 UI */}
        {!loading && totalPages > 0 && (
          <div className={styles.pagination}>
              <button 
                  onClick={() => handlePageChange(0)}
                  disabled={currentPage === 0}
                  className={styles.pageButton}
              >
                  처음
              </button>
              <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className={styles.pageButton}
              >
                  이전
              </button>
              
              <span className={styles.pageInfo}>
                  {currentPage + 1} / {totalPages} 페이지 (총 {totalCount}건)
              </span>
              
              <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                  className={styles.pageButton}
              >
                  다음
              </button>
              <button 
                  onClick={() => handlePageChange(totalPages - 1)}
                  disabled={currentPage >= totalPages - 1}
                  className={styles.pageButton}
              >
                  마지막
              </button>
          </div>
        )}

        <div className={styles.actionButtons}>
          <Button className={styles.saveButton} onClick={() => handleBulkAction('임시저장')}>임시저장</Button>
          <Button className={styles.submitButton} onClick={() => handleBulkAction('제출')}>제출</Button>
        </div>
      </div>

      {isModalOpen && currentEvaluation && (
        <WorkEvaluationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          evaluationData={currentEvaluation}
          onSave={handleSaveEvaluation}
        />
      )}

    </div>
  );
}