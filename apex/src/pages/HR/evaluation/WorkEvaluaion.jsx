import React, { useState, useEffect } from 'react';
// 경로 에러 해결: '../../../'로 수정됨
import { Select, Button } from '../../../components/common'; 
import api from '../../../api/axios'; 
import styles from './WorkEvaluation.module.css';
import { FaPencilAlt, FaSearch } from 'react-icons/fa'; 

// 임시 데이터 정의
const initialEvaluationData = [
  { 
    id: 1, employeeId: 12345, name: '김수석', position: '수석', affiliation: '본부1', department: '경영기획팀',
    workAttitude: 4, goalAchievement: 4, collaboration: 4, contribution: 'B' 
  },
  { 
    id: 2, employeeId: 12346, name: '최사원', position: '사원', affiliation: '본부1', department: '보안연구팀',
    workAttitude: 3, goalAchievement: 2, collaboration: 3, contribution: 'D' 
  },
  { 
    id: 3, employeeId: 12347, name: '윤대리', position: '대리', affiliation: '본부2', department: '사이버관제팀',
    workAttitude: 5, goalAchievement: 3, collaboration: 5, contribution: 'B' 
  },
  { 
    id: 4, employeeId: 12348, name: '홍선임', position: '선임', affiliation: '본부2', department: '자율보안팀',
    workAttitude: 4, goalAchievement: 5, collaboration: 4, contribution: 'A' 
  },
];

export default function WorkEvaluation() {
  const [searchParams, setSearchParams] = useState({
    year: new Date().getFullYear(),
    quarter: '1분기',
    department: '선택' // 소속 제거
  });

  const [evaluationData, setEvaluationData] = useState(initialEvaluationData);
  const [loading, setLoading] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]); 

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  const quarters = ['1분기', '2분기', '3분기', '4분기'];
  const departments = ['선택', '경영기획팀', '보안연구팀', '사이버관제팀', '자율보안팀'];

  const loadEvaluations = async () => {
    // API 연동 로직 (생략)
    console.log("조회 파라미터:", searchParams);
    setLoading(true);
    setTimeout(() => {
      setEvaluationData(initialEvaluationData);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    loadEvaluations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const handleSearch = () => {
    loadEvaluations();
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = evaluationData.map(item => item.id);
      setSelectedEmployees(allIds);
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleSelectEmployee = (id) => {
    setSelectedEmployees(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  // DataTable 헤더: 돋보기 아이콘의 레이블을 '상세'로 변경했습니다.
  const tableHeaders = [
    { label: '사번', key: 'employeeId' },
    { label: '이름', key: 'name' },
    { label: '근무태도', key: 'workAttitude' },
    { label: '목표달성', key: 'goalAchievement' },
    { label: '협업', key: 'collaboration' },
    { label: '기여도', key: 'contribution' },
    { label: '수정', key: 'edit' },
    { label: '상세', key: 'detail' } // ✅ '상세'로 레이블 변경
  ];
  
  const renderEvaluationRow = (item) => {
    const isSelected = selectedEmployees.includes(item.id);

    return (
      <>
        <td>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => handleSelectEmployee(item.id)}
          />
        </td>
        <td>{item.employeeId}</td>
        <td>{item.name}</td>
        <td>{item.workAttitude}</td>
        <td>{item.goalAchievement}</td>
        <td>{item.collaboration}</td>
        <td>{item.contribution}</td>
        <td className={styles.iconCell}>
          <FaPencilAlt className={styles.editIcon} onClick={() => alert(`직원 ID ${item.employeeId} 수정`)} />
        </td>
        <td className={styles.iconCell}>
          <FaSearch className={styles.detailIcon} onClick={() => alert(`직원 ID ${item.employeeId} 상세 조회`)} />
        </td>
      </>
    );
  };

  const isAllSelected = evaluationData.length > 0 && selectedEmployees.length === evaluationData.length;

  return (
    <div className={styles.container}>
      
      {/* 검색 및 조회 섹션 (AttendanceStats 스타일 적용) */}
      <div className={styles.searchSection}>
        <h1 className={styles.title}>평가 관리</h1> 
        
        <div className={styles.filterRow}>
          
          {/* 년도 */}
          <div className={styles.searchGroup}>
            <label>년도</label>
            <Select
              options={years.map(y => ({ value: y, label: y }))}
              value={searchParams.year}
              onChange={(e) => setSearchParams(prev => ({ ...prev, year: e.target.value }))}
            />
          </div>
          {/* 분기 */}
          <div className={styles.searchGroup}>
            <label>분기</label>
            <Select
              options={quarters.map(q => ({ value: q, label: q }))}
              value={searchParams.quarter}
              onChange={(e) => setSearchParams(prev => ({ ...prev, quarter: e.target.value }))}
            />
          </div>
          {/* 부서 */}
          <div className={styles.searchGroup}>
            <label>부서</label>
            <Select
              options={departments.map(d => ({ value: d, label: d }))}
              value={searchParams.department}
              onChange={(e) => setSearchParams(prev => ({ ...prev, department: e.target.value }))}
            />
          </div>
          
          {/* 조회 버튼 */}
          <div className={styles.spacer}></div> 
          <Button onClick={handleSearch} className={styles.searchButton}>조회</Button>
        </div>
      </div>

      {/* 직원 평가 테이블 (HTML Table로 대체) */}
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
                    {evaluationData.length > 0 ? (
                        evaluationData.map((item) => (
                            <tr key={item.id}>
                                {renderEvaluationRow(item)}
                            </tr>
                        ))
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

      {/* 하단 버튼 및 페이지네이션 */}
      <div className={styles.footerSection}>
        {/* 페이지네이션 영역 */}
        <div className={styles.pagination}>
            <div className={styles.pageArrow}>&#9664;</div>
            <div className={styles.pageNumber}>1</div>
            <div className={styles.pageArrow}>&#9654;</div>
        </div>

        {/* 버튼 영역 */}
        <div className={styles.actionButtons}>
          <Button className={styles.saveButton}>임시저장</Button>
          <Button className={styles.submitButton}>제출</Button>
        </div>
      </div>
    </div>
  );
}