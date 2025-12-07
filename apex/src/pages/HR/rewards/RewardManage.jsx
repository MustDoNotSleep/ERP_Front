import React, { useState, useEffect } from 'react';
import styles from './RewardManage.module.css';

// API 호출을 위한 axios 인스턴스 (경로 확인 필요)
import api from '../../../api/axios'; 

// 모달 및 아이콘 Import
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

  // 옵션 데이터 상태
  const [rewardTypes, setRewardTypes] = useState([{ value: '', label: '선택' }]);

  // 통합된 입력값 상태
  const [inputValues, setInputValues] = useState({
    employeeName: '',
    employeeId: '',
    deptName: '',
    rewardType: '', 
    positionName: '', 
  });

  const [rewardData, setRewardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRewards, setSelectedRewards] = useState([]);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 10;

  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [currentReward, setCurrentReward] = useState(null);
  const [isEmpSearchOpen, setIsEmpSearchOpen] = useState(false);

  // 통합된 입력 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues(prev => ({ ...prev, [name]: value }));
  };

  // ✨ [기능] 검색 조건 초기화 함수
  const handleReset = () => {
    setInputValues({
      employeeName: '',
      employeeId: '',
      deptName: '',
      rewardType: '', 
      positionName: '', 
    });
  };

  // Enum 데이터 로드
  const loadEnums = async () => {
    try {
      const response = await api.get('/hr/rewards/enums');
      const { rewardTypes: types } = response.data;
      
      const formattedTypes = types.map(t => ({
        value: t.key || t.name || t.code, 
        label: t.label
      }));

      setRewardTypes([{ value: '', label: '선택' }, ...formattedTypes]);
    } catch (error) {
      console.error('Enum 데이터 로드 실패:', error);
    }
  };

  // 조회 로직
  const loadRewards = async () => {
    setLoading(true);
    try {
        const params = {};
        if (inputValues.employeeName) params.employeeName = inputValues.employeeName;
        if (inputValues.employeeId) params.employeeId = inputValues.employeeId;
        if (inputValues.deptName) params.deptName = inputValues.deptName;
        if (inputValues.rewardType && inputValues.rewardType !== '') {
            params.rewardType = inputValues.rewardType;
        }

        const response = await api.get('/hr/rewards', { params });
        setRewardData(response.data || []);
        setCurrentPage(0); 
    } catch (err) {
        console.warn("⚠️ API 호출 실패", err);
        setRewardData([]);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    loadEnums();
    loadRewards(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEmployeeSelect = (employee) => {
      if (!employee) return;
      setInputValues(prev => ({
          ...prev,
          employeeId: employee.employeeId || employee.id || '',
          employeeName: employee.employeeName || employee.name || '',
          deptName: employee.teamName || employee.department?.teamName || '',
          positionName: employee.positionName || employee.position || '',
      }));
      setIsEmpSearchOpen(false);
  };

  const handleSearch = () => {
    loadRewards();
  };

  const handleRegister = () => {
    if (!inputValues.employeeId) {
      alert('등록 하기 전에 직원 검색을 먼저 해주세요.');
      setIsEmpSearchOpen(true); 
      return;
    }
    
    const newReward = {
      rewardId: null, 
      isNew: true,
      employeeId: inputValues.employeeId,
      employeeName: inputValues.employeeName,
      deptName: inputValues.deptName,
      positionName: inputValues.positionName,
      rewardDate: new Date().toISOString().substring(0, 10),
      rewardType: inputValues.rewardType, 
      rewardItem: '',
      rewardValue: '',
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
          
          loadRewards(); 
          handleCloseModal();
      } catch (e) {
          console.error("저장 실패", e);
          alert("저장 중 오류가 발생했습니다.");
      }
  };

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

  // 페이지네이션
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
  
  const isAllSelected = rewardData.length > 0 && selectedRewards.length === rewardData.length;

  const renderField = (label, name, value, type = 'text', options = [], readOnly = false, showSearchButton = false) => (
    <div className={styles.inputGroup}>
      <label className={styles.inputLabel}>{label}</label>
      {showSearchButton ? (
        <div style={{ display: 'flex', gap: '5px', width: '100%' }}>
          <input 
            type="text" name={name} value={value} onChange={handleInputChange} 
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
        <Select options={options} value={value} name={name} onChange={handleInputChange} className={styles.inputField} />
      ) : (
        <input 
          type={type} name={name} value={value} onChange={handleInputChange} className={styles.inputField}
          readOnly={readOnly}
          style={readOnly ? { backgroundColor: '#f5f5f5' } : {}}
        />
      )}
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.searchSection}> 
        <h1 className={styles.title}>포상 관리</h1>
        
        <div style={{ 
          backgroundColor: '#FFF3CD', border: '1px solid #FFC107', borderRadius: '4px', 
          padding: '12px 16px', marginBottom: '16px', color: '#856404', fontSize: '14px', fontWeight: '500'
        }}>
          ⚠️ <strong>조회</strong>와 <strong>등록</strong>은 별도 기능입니다. 한 번에 하나의 기능만 사용해주세요.
        </div>

        <div className={styles.searchRow}>
            <div className={styles.fieldsWrapper}>
                {renderField('이름', 'employeeName', inputValues.employeeName, 'text', [], false, true)}
                {renderField('사원번호', 'employeeId', inputValues.employeeId, 'text', [], true, false)}
                {renderField('부서', 'deptName', inputValues.deptName, 'text', [], true, false)}
                {renderField('포상종류', 'rewardType', inputValues.rewardType, 'select', rewardTypes, false)}
            </div>
            
            {/* ✨ 버튼 순서 수정: [조회] -> [등록] -> [초기화] */}
            <div className={styles.buttonWrapper}>
                {/* 1. 조회 버튼 */}
                <Button onClick={handleSearch} className="btn btn-primary btn-md">조회</Button>
                
                <span style={{ margin: '0 4px' }}></span>
                
                {/* 2. 등록 버튼 */}
                <Button onClick={handleRegister} className="btn btn-secondary btn-md">등록</Button>

                <span style={{ margin: '0 4px' }}></span>

                {/* 3. 초기화 버튼 (맨 오른쪽) */}
                <Button onClick={handleReset} className="btn btn-light btn-md">초기화</Button>
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
              {currentData.length > 0 ? currentData.map(renderRewardRow) : <tr><td colSpan="8" className={styles.emptyCell}>데이터 없음</td></tr>}
            </tbody>
          </table>
        }
      </div>

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

      {!loading && totalPages > 0 && (
          <div className={styles.pagination}>
              <button onClick={() => handlePageChange(0)} disabled={currentPage === 0} className={styles.pageButton}>처음</button>
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0} className={styles.pageButton}>이전</button>
              <span className={styles.pageInfo}>{currentPage + 1} / {totalPages} 페이지 (총 {totalCount}건)</span>
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages - 1} className={styles.pageButton}>다음</button>
              <button onClick={() => handlePageChange(totalPages - 1)} disabled={currentPage >= totalPages - 1} className={styles.pageButton}>마지막</button>
          </div>
      )}

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