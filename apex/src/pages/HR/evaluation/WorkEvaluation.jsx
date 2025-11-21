import React, { useState, useEffect } from 'react';
import { Select, Button } from '../../../components/common';
import api from '../../../api/axios';
import styles from './WorkEvaluation.module.css';
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

  // ✅ [수정 완료] DB teamName 이미지 기준으로 목록 업데이트
  const departments = [
    '선택',
    '총무팀', 
    '인사팀', 
    '재무회계팀', 
    '보안관제팀', 
    'CERT팀', 
    '침해사고대응팀', 
    '모의해킹팀', 
    '보안컨설팅', 
    'AI팀', 
    '클라우드팀', 
    '연구기획팀', 
    '미래보안기술팀'
  ];

  /**
   * 평가 데이터를 API에서 로드하는 함수
   */
  const loadEvaluations = async () => {
    setLoading(true);
    
    // 백엔드 규격에 맞춰 파라미터명 변경 (department -> teamName)
    const filters = {
        year: searchParams.year,
        quarter: searchParams.quarter,
        teamName: searchParams.department === '선택' ? null : searchParams.department
    };

    try {
      // API 호출 (/hr/evaluations)
      const response = await api.get('/hr/evaluations', { params: filters });
      
      // ApiResponse 구조 (status, data, message) 처리
      // 백엔드에서 ApiResponse.success(list)로 감싸서 보내므로 data.data로 접근
      //setEvaluationData(response.data.data || []); 
      setEvaluationData(response.data || []);
    } catch (error) {
      console.error("평가 데이터 조회 실패:", error);
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
      // 백엔드 조회 시 comment에는 "평가자 정보"가 들어있으므로, 
      // 수정 모달을 열 때는 빈 값이나 실제 코멘트를 가져와야 함.
      // 현재는 평가 내용을 새로 입력받는다고 가정하고 빈 문자열로 초기화
      comment: '' 
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentEvaluation(null);
  };

  /**
   * 모달에서 수정한 평가 데이터를 저장하는 함수
   */
  const handleSaveEvaluation = async (updatedData) => {
    try {
        // PUT 요청 (UpdateRequest DTO 구조에 맞춰짐)
        await api.put(`/hr/evaluations/${updatedData.id}`, updatedData);

        // 성공 시 목록 새로고침
        loadEvaluations(); 
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
        <td>{item.positionName}</td>
        <td>{item.workAttitude}</td>
        <td>{item.goalAchievement}</td>
        <td>{item.collaboration}</td>
        <td>{item.contribution}</td>
        
        {/* 상세 컬럼: 평가자 정보(comment 필드 활용) 표시 */}
        <td className={styles.iconCell} 
            style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
            onClick={() => handleOpenModal(item)}>
          {item.comment || '-'}
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
          {/* 부서 (이미지 기준 DB 데이터 반영됨) */}
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

      <div className={styles.footerSection}>
        <div className={styles.pagination}>
          <div className={styles.pageArrow}>&#9664;</div>
          <div className={styles.pageNumber}>1</div>
          <div className={styles.pageArrow}>&#9654;</div>
        </div>

        <div className={styles.actionButtons}>
          <Button className={styles.saveButton} onClick={() => alert("임시 저장 기능 구현 필요")}>임시저장</Button>
          <Button className={styles.submitButton} onClick={() => alert("최종 제출 기능 구현 필요")}>제출</Button>
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