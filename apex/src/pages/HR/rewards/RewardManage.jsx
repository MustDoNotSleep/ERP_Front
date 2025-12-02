import React, { useState, useEffect } from 'react';
import styles from './RewardManage.module.css';

// ✨ API 호출을 위한 axios 인스턴스
import api from '../../../api/axios'; 

// ✨ 모달 및 아이콘 Import
import RewardManageModal from '../../../components/HR/rewards/RewardManageModal.jsx'; 
import EmployeeSearchModal from '../../../components/common/EmployeeSearchModal.jsx'; 

// --- 내부 컴포넌트 정의 ---
const Select = ({ options, value, name, onChange, className }) => (
  <select name={name} value={value} onChange={onChange} className={className}>
    {options.map((opt, idx) => (
      <option key={idx} value={opt.value}>{opt.label}</option>
    ))}
  </select>
);

const Button = ({ onClick, className, children, style }) => (
  <button onClick={onClick} className={className} style={style}>
    {children}
  </button>
);
// ------------------------------------------

export default function RewardManage() {

  // 옵션 데이터
  const rewardTypes = ['선택','공로상', '우수사원상', '특별포상'];
  const rewardItems = ['선택','상금', '포인트', '연차', '상패/감사장'];
  const rewardValue = ['선택', '팀 기여 우수', '핵심 기술 개발', '장기 근속', '기타'];

  // 검색 파라미터 상태
  const [searchParams, setSearchParams] = useState({
    employeeName: '',
    employeeId: '',
    department: '', 
    rewardDate: '',
    rewardType: rewardTypes[0], 
    rewardItem: rewardItems[0], 
    rewardValue: rewardValue[0], 
  });

  const [rewardData, setRewardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRewards, setSelectedRewards] = useState([]);

  // ✅ [추가] 페이지네이션 상태 관리
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 (0부터 시작)
  const ITEMS_PER_PAGE = 10; // 페이지당 보여줄 개수

  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [currentReward, setCurrentReward] = useState(null);
  const [isEmpSearchOpen, setIsEmpSearchOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // ⭐ 데이터 로드 함수
  const loadRewards = async () => {
    setLoading(true);
    try {
        const response = await api.get('/hr/rewards', { params: searchParams });
        console.log("✅ DB 데이터 로드 성공:", response.data);
        setRewardData(response.data || []);
        setCurrentPage(0); // ✅ 검색 시 첫 페이지로 초기화
    } catch (err) {
        console.warn("⚠️ API 호출 실패, 더미 데이터를 표시합니다.", err);
        // 더미 데이터...
        setRewardData([]);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    loadRewards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleEmployeeSelect = (employee) => {
      if (!employee) return;
      setSelectedEmployee(employee); 
      setSearchParams(prev => ({
          ...prev,
          employeeName: employee.employeeName || employee.name,
          employeeId: employee.id || employee.employeeId, 
          department: employee.teamName || employee.department?.teamName || '',
          positionName: employee.positionName || employee.position || '' 
      }));
      setIsEmpSearchOpen(false);
  };

  const handleSearch = () => {
    loadRewards();
  };

  const handleRegister = () => {
    const today = new Date().toISOString().substring(0, 10).replace(/-/g, '/');
    const newReward = {
      rewardId: null, 
      isNew: true,
      employeeId: searchParams.employeeId || '', 
      employeeName: searchParams.employeeName || '', 
      departmentName: searchParams.department || '', 
      rewardDate: searchParams.rewardDate || today,
      positionName: selectedEmployee ? (selectedEmployee.positionName || selectedEmployee.position?.positionName || '') : '',
      rewardType: rewardTypes[0], 
      rewardItem: rewardItems[0],
      rewardValue: rewardValue[0],
      reason: '',
    };
    setCurrentReward(newReward);
    setIsModalOpen(true);
  };

  const handleOpenModal = (rewardItem) => {
      setCurrentReward({ ...rewardItem, isNew: false });
      setIsModalOpen(true);
  };

  const handleCloseModal = () => {
      setIsModalOpen(false);
      setCurrentReward(null);
  };

  const handleSaveReward = async (updatedData) => {
      try {
          const requestDto = {
              employeeId: updatedData.employeeId,
              rewardDate: updatedData.rewardDate,
              rewardType: updatedData.rewardType,
              rewardItem: updatedData.rewardItem,
              rewardValue: updatedData.rewardValue,
              amount: updatedData.amount, 
              reason: updatedData.reason
          };
          await api.post('/hr/rewards', requestDto); 
          alert("저장되었습니다.");
      } catch (e) {
          console.error("저장 실패", e);
          alert("저장 중 오류가 발생했습니다.");
      }
      loadRewards(); 
      handleCloseModal();
  };

  // 일괄 승인/반려 함수
  const handleBulkApprove = async () => {
    if (selectedRewards.length === 0) { alert("승인할 항목을 선택해주세요."); return; }
    if (!window.confirm(`선택한 ${selectedRewards.length}건을 승인하시겠습니까?`)) return;
    try {
      await Promise.all(selectedRewards.map(id => api.put(`/hr/rewards/${id}/approve`)));
      alert("일괄 승인되었습니다.");
      setSelectedRewards([]); 
      loadRewards(); 
    } catch (error) { console.error(error); alert("오류 발생"); }
  };

  const handleBulkReject = async () => {
    if (selectedRewards.length === 0) { alert("반려할 항목을 선택해주세요."); return; }
    if (!window.confirm(`선택한 ${selectedRewards.length}건을 반려하시겠습니까?`)) return;
    try {
      await Promise.all(selectedRewards.map(id => api.put(`/hr/rewards/${id}/reject`)));
      alert("일괄 반려되었습니다.");
      setSelectedRewards([]); 
      loadRewards(); 
    } catch (error) { console.error(error); alert("오류 발생"); }
  };

  // ✅ [추가] 페이지네이션 데이터 계산
  const totalCount = rewardData.length;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const offset = currentPage * ITEMS_PER_PAGE;
  const currentData = rewardData.slice(offset, offset + ITEMS_PER_PAGE);

  const handlePageChange = (newPage) => {
      if (newPage >= 0 && newPage < totalPages) {
          setCurrentPage(newPage);
      }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // ✅ 현재 페이지에 보이는 데이터만 전체 선택할지, 전체 데이터를 선택할지 결정 (여기선 전체 데이터 기준)
      const allIds = rewardData.map(item => item.rewardId);
      setSelectedRewards(allIds);
    } else {
      setSelectedRewards([]);
    }
  };

  const handleSelectReward = (id) => {
    setSelectedRewards(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const tableHeaders = [
    { label: '추천일', key: 'rewardDate' },
    { label: '사번', key: 'employeeId' },
    { label: '이름', key: 'employeeName' },
    { label: '포상종류', key: 'rewardType' },
    { label: '포상형태', key: 'rewardItem' },
    { label: '상태', key: 'status' },
    { label: '승인자', key: 'approverName' },
    { label: '상세', key : 'detail' }
  ];

  const renderRewardRow = (item) => {
    const isSelected = selectedRewards.includes(item.rewardId);
    return (
      <tr key={item.rewardId}>
        <td><input type="checkbox" checked={isSelected} onChange={() => handleSelectReward(item.rewardId)} /></td>
        <td>{item.rewardDate}</td>
        <td>{item.employeeId}</td>
        <td>{item.employeeName}</td>
        <td>{item.rewardTypeName || item.rewardType}</td>
        <td>{item.rewardItemName || item.rewardItem}</td>
        <td><span className={styles[`status-${item.status}`] || styles.statusCommon}>{item.status}</span></td>
        <td>{item.approverName || '-'}</td>
        <td className={styles.detailIconCell} onClick={() => handleOpenModal(item)}>&#128269;</td>
      </tr>
    );
  };
  
  // 전체 선택 체크박스 상태 (전체 데이터 기준)
  const isAllSelected = rewardData.length > 0 && selectedRewards.length === rewardData.length;

  const renderField = (label, name, value, type = 'text', options = [], readOnly = false) => (
    <div className={styles.inputGroup}>
      <label className={styles.inputLabel}>{label}</label>
      {name === 'employeeName' ? (
        <div style={{ display: 'flex', gap: '5px', width: '100%' }}>
          <input 
            type="text" name={name} value={value} onChange={handleChange} 
            className={styles.inputField} placeholder="이름" readOnly={readOnly}
            onClick={() => setIsEmpSearchOpen(true)} style={{ cursor: 'pointer' }}
          />
          <Button 
            onClick={() => setIsEmpSearchOpen(true)} 
            className={styles.smallButton}
            style={{ 
              padding: '8px 16px', backgroundColor: '#007bff', color: 'white',
              border: 'none', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap' 
            }}
          >
            직원 검색
          </Button>
        </div>
      ) : type === 'select' ? (
        <Select options={options.map(o => ({ value: o, label: o }))} value={value} name={name} onChange={handleChange} className={styles.inputField} />
      ) : name === 'rewardDate' ? (
        <input 
          type="date" name={name} value={value} onChange={handleChange} className={styles.inputField}
          readOnly={readOnly}
          style={readOnly ? { backgroundColor: '#f5f5f5' } : {}}
        />
      ) : (
        <input 
          type={type} name={name} value={value} onChange={handleChange} className={styles.inputField}
          placeholder={label === '요청일' ? "YYYY/MM/DD" : ""} readOnly={readOnly}
          style={readOnly ? { backgroundColor: '#f5f5f5' } : {}}
        />
      )}
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.searchSection}> 
        <h1 className={styles.title}>포상 관리</h1>
        <div className={styles.searchRow}>
            <div className={styles.fieldsWrapper}>
                {renderField('이름', 'employeeName', searchParams.employeeName)}
                {renderField('사원번호', 'employeeId', searchParams.employeeId, 'text', [], true)}
                {renderField('부서', 'department', searchParams.department, 'text', [], true)}
                {renderField('요청일', 'rewardDate', searchParams.rewardDate)}
            </div>
            <div className={styles.buttonWrapper}>
                <Button onClick={handleSearch} className={styles.largeButton}>조회</Button>
            </div>
        </div>
        <div className={styles.registerRow}>
            <div className={styles.fieldsWrapper}>
                {renderField('포상종류', 'rewardType', searchParams.rewardType, 'select', rewardTypes)}
                {renderField('포상사유', 'rewardValue', searchParams.rewardValue, 'select', rewardValue)}
                {renderField('포상형태', 'rewardItem', searchParams.rewardItem, 'select', rewardItems)}
            </div>
            <div className={styles.buttonWrapper}>
                <Button onClick={handleRegister} className={styles.largeButtonRegister}>등록</Button>
            </div>
        </div>
      </div>

      <div className={styles.tableSection}>
        {loading ? <div className={styles.loadingMessage}>로딩중...</div> : 
          <table className={styles.rewardTable}>
            <thead>
              <tr>
                <th className={styles.checkboxHeader}><input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} /></th>
                {tableHeaders.map(h => <th key={h.key} className={styles.tableHeaderCell}>{h.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {/* ✅ [중요] 전체 데이터 대신 현재 페이지 데이터(currentData)만 렌더링 */}
              {currentData.length > 0 ? currentData.map(renderRewardRow) : <tr><td colSpan="8" className={styles.emptyCell}>데이터 없음</td></tr>}
            </tbody>
          </table>
        }
      </div>

      {/* 하단 액션 버튼 (우측 정렬) */}
      <div className={styles.footerActionRow} style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', gap: '10px' }}>
          <Button 
            onClick={handleBulkReject} 
            className={styles.rejectBtn}
            style={{ backgroundColor: '#D32F2F', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
          >
            반려
          </Button>
          <Button 
            onClick={handleBulkApprove} 
            className={styles.approveBtn}
            style={{ backgroundColor: '#4E342E', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
          >
            승인
          </Button>
      </div>

      {/* ✅ [추가] 페이지네이션 UI (CareerManagementPage 스타일 적용) */}
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

      <div className={styles.footerSection}></div>

      {isEmpSearchOpen && (
          <EmployeeSearchModal
              isOpen={isEmpSearchOpen}
              onClose={() => setIsEmpSearchOpen(false)}
              onSelectEmployee={handleEmployeeSelect}
          />
      )}

      {isModalOpen && currentReward && (
          <RewardManageModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              rewardData={currentReward}
              onSave={handleSaveReward}
          />
      )}
    </div>
  );
}