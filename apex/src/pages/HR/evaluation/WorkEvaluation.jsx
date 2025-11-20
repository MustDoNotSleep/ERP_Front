import React, { useState, useEffect } from 'react';
import { Select, Button } from '../../../components/common';

// ✅ API Import 활성화 (경로 확인 필요)
import api from '../../../api/axios';
import styles from './WorkEvaluation.module.css';
import { FaSearch } from 'react-icons/fa';
import WorkEvaluationModal from '../../../components/HR/Evaluation/WorkEvaluationModal';

export default function WorkEvaluation() {

  const [searchParams, setSearchParams] = useState({
    year: new Date().getFullYear(),
    quarter: '1분기',
    department: '선택'
  });


  const [evaluationData, setEvaluationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState(null);


  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  const quarters = ['1분기', '2분기', '3분기', '4분기'];
  const departments = ['선택', '경영기획팀', '보안연구팀', '사이버관제팀', '자율보안팀'];


  /**
   * 평가 데이터를 API에서 로드하는 함수
   */
  const loadEvaluations = async () => {
    setLoading(true);
    // API에 보낼 필터 파라미터 구성
    const filters = {
        year: searchParams.year,
        quarter: searchParams.quarter,
        // '선택'은 null로 처리하여 서버에서 전체 부서를 조회하도록 함
        department: searchParams.department === '선택' ? null : searchParams.department
    };

    try {
      // ✅ API 호출 활성화
      const response = await api.get('/hr/evaluations', { params: filters });
      setEvaluationData(response.data || []);
      
    } catch (error) {
      console.error("평가 데이터 조회 실패:", error);
      // API 호출 실패 시 빈 배열로 설정 (목 데이터 제거)
      setEvaluationData([]); 
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadEvaluations();
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


  const handleOpenModal = (item) => {
    setCurrentEvaluation({
      ...item,
      year: searchParams.year,
      quarter: searchParams.quarter,
      comment: item.comment || ''
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentEvaluation(null);
  };

  /**
   * 모달에서 수정한 평가 데이터를 저장하는 함수 (API 호출)
   */
  const handleSaveEvaluation = async (updatedData) => {
    try {
        // ✅ API 호출 활성화 (PUT 또는 PATCH 사용)
        await api.put(`/hr/evaluations/${updatedData.id}`, updatedData);

        // 성공 시 로컬 상태 업데이트
        setEvaluationData(prevData =>
            prevData.map(item => (item.id === updatedData.id ? updatedData : item))
        );
        alert(`${updatedData.name}님의 평가 내용이 저장되었습니다.`);
        handleCloseModal();
    } catch (error) {
        console.error("평가 내용 저장 실패:", error);
        alert("평가 내용 저장에 실패했습니다.");
    }
  };


  // DataTable 헤더
  const tableHeaders = [
    { label: '사번', key: 'employeeId' },
    { label: '이름', key: 'name' },
    { label: '근무태도', key: 'workAttitude' },
    { label: '목표달성', key: 'goalAchievement' },
    { label: '협업', key: 'collaboration' },
    { label: '기여도', key: 'contribution' },
    { label: '상세', key: 'detail' }
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
        {/* 상세 버튼 셀 */}
        <td className={styles.iconCell}>
          <FaSearch
            className={styles.detailIcon}
            onClick={() => handleOpenModal(item)} // 모달 연결
          />
        </td>
      </>
    );
  };


  const isAllSelected = evaluationData.length > 0 && selectedEmployees.length === evaluationData.length;


  return (
    <div className={styles.container}>

      <div className={styles.searchSection}> 
        <h1 className={styles.title}>평가 관리</h1>

        <div className={styles.filterRow}>

          {/* 년도 */}
          <div className={styles.searchGroup}>
            <label>년도</label>
            <Select
              options={years.map(y => ({ value: y, label: y }))}
              value={searchParams.year}
              name="year"
              onChange={handleSearchChange}
            />
          </div>
          {/* 분기 */}
          <div className={styles.searchGroup}>
            <label>분기</label>
            <Select
              options={quarters.map(q => ({ value: q, label: q }))}
              value={searchParams.quarter}
              name="quarter"
              onChange={handleSearchChange}
            />
          </div>
          {/* 부서 */}
          <div className={styles.searchGroup}>
            <label>부서</label>
            <Select
              options={departments.map(d => ({ value: d, label: d }))}
              value={searchParams.department}
              name="department"
              onChange={handleSearchChange}
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
            <tbody>{evaluationData.length > 0 ? (
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
            )}</tbody>
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

        {/* 버튼 영역 (임시저장/제출) */}
        <div className={styles.actionButtons}>
          <Button className={styles.saveButton} onClick={() => alert("임시 저장 기능 구현 필요")}>임시저장</Button>
          <Button className={styles.submitButton} onClick={() => alert(`${selectedEmployees.length}명 선택, 최종 제출 기능 구현 필요`)}>제출</Button>
        </div>
      </div>

      {/* WorkEvaluationModal 컴포넌트 추가 */}
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