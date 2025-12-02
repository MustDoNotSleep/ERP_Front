import React, { useState, useEffect } from 'react';
import styles from './RewardManage.module.css'; 

// ✨ 새로 Import 할 모달 컴포넌트 (경로를 적절히 수정하세요)
import RewardManageModal from '../../../components/HR/rewards/RewardManageModal.jsx'; 

// --- 내부 컴포넌트 정의 (Import 오류 방지용) ---
const Select = ({ options, value, name, onChange, className }) => (
  <select name={name} value={value} onChange={onChange} className={className}>
    {options.map((opt, idx) => (
      <option key={idx} value={opt.value}>{opt.label}</option>
    ))}
  </select>
);

const Button = ({ onClick, className, children }) => (
  <button onClick={onClick} className={className}>
    {children}
  </button>
);
// ------------------------------------------

export default function RewardManage() {

  // 필터링 옵션 데이터
  const departments = [
    '총무팀', '인사팀', '재무회계팀', '보안관제팀', 'CERT팀', 
    '침해사고대응팀', '모의해킹팀', '보안컨설팅', 'AI팀', '클라우드팀', 
    '연구기획팀', '미래보안기술팀'
  ];

  const rewardTypes = ['선택','공로상', '우수사원상', '특별포상'];
  const rewardForms = ['선택','상금', '포인트', '연차', '상패/감사장'];
  const rewardReasons = ['선택', '팀 기여 우수', '핵심 기술 개발', '장기 근속', '기타'];

  // 검색 파라미터 상태
  const [searchParams, setSearchParams] = useState({
    name: '',
    employeeId: '',
    requestDate: '',
    department: departments[0], 
    rewardType: rewardTypes[0], 
    rewardForm: rewardForms[0], 
    rewardReason: rewardReasons[0], 
  });

  const [rewardData, setRewardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRewards, setSelectedRewards] = useState([]);

  // ✨ 모달 관련 상태 추가
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReward, setCurrentReward] = useState(null);

  // 데이터 로드 함수 (더미 데이터)
  const loadRewards = async () => {
    setLoading(true);
    const dummyData = [
        { id: 1, recommendDate: '2025/08/10', employeeId: '12345', name: '김철수', rewardType: '공로상', rewardForm: '연차', status: '승인', approver: '이부장', comment: '탁월한 성과를 인정하여 포상.' },
        { id: 2, recommendDate: '2025/08/11', employeeId: '12346', name: '최사원', rewardType: '개인상', rewardForm: '연차', status: '대기', approver: '-', comment: '아직 심사 중입니다.' },
    ];
    await new Promise(resolve => setTimeout(resolve, 500)); 
    setRewardData(dummyData);
    setLoading(false);
  };

  useEffect(() => {
    loadRewards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    const { name, employeeId, requestDate, department } = searchParams;
    console.log("조회 실행:", { name, employeeId, requestDate, department });
    loadRewards();
  };

  // ✨ 모달 열기 (상세 조회용)
  const handleOpenModal = (rewardItem) => {
      setCurrentReward({ ...rewardItem, isNew: false });
      setIsModalOpen(true);
  };

  // ✨ 모달 열기 (등록용)
  const handleRegister = () => {
    // 등록 시 기본값 설정 (id는 임시로 -1, isNew: true)
    const newReward = {
        id: -1, 
        isNew: true,
        employeeId: '', 
        name: '', 
        recommendDate: new Date().toISOString().substring(0, 10).replace(/-/g, '/'), // 오늘 날짜
        rewardType: rewardTypes[0], 
        rewardForm: rewardForms[0],
        rewardReason: rewardReasons[0],
        amount: 0,
        comment: '',
        teamName: '인사팀', // 예시 부서
        positionName: '사원', // 예시 직급
    };
    setCurrentReward(newReward);
    setIsModalOpen(true);
  };

  // ✨ 모달 닫기
  const handleCloseModal = () => {
      setIsModalOpen(false);
      setCurrentReward(null);
  };

  // ✨ 모달에서 데이터 저장/등록 시 처리
  const handleSaveReward = (updatedData) => {
      if (updatedData.isNew) {
          alert(`새 포상이 등록되었습니다: ${updatedData.name}`);
      } else {
          alert(`포상 내용이 수정되었습니다: ${updatedData.name}`);
      }
      
      // 실제 API 호출 후 loadRewards();
      loadRewards(); 
      handleCloseModal();
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = rewardData.map(item => item.id);
      setSelectedRewards(allIds);
    } else {
      setSelectedRewards([]);
    }
  };

  const handleSelectReward = (id) => {
    setSelectedRewards(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const tableHeaders = [
    { label: '추천일', key: 'recommendDate' },
    { label: '사번', key: 'employeeId' },
    { label: '이름', 'key': 'name' },
    { label: '포상종류', 'key': 'rewardType' },
    { label: '포상형태', 'key': 'rewardForm' },
    { label: '상태', 'key': 'status' },
    { label: '승인자', 'key': 'approver' },
    { label: '상세', 'key': 'detail' }
  ];

  const renderRewardRow = (item) => {
    const isSelected = selectedRewards.includes(item.id);
    return (
      <tr key={item.id}>
        <td>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => handleSelectReward(item.id)}
          />
        </td>
        <td>{item.recommendDate}</td>
        <td>{item.employeeId}</td>
        <td>{item.name}</td>
        <td>{item.rewardType}</td>
        <td>{item.rewardForm}</td>
        <td>
          <span className={styles[`status-${item.status}`] || styles.statusCommon}>
            {item.status}
          </span>
        </td>
        <td>{item.approver}</td>
        {/* ✨ 상세 버튼 클릭 시 모달 열기 */}
        <td className={styles.detailIconCell} 
            onClick={() => handleOpenModal(item)}>
          &#128269;
        </td>
      </tr>
    );
  };

  const isAllSelected = rewardData.length > 0 && selectedRewards.length === rewardData.length;

  const renderField = (label, name, value, type = 'text', options = []) => (
    <div className={styles.inputGroup}>
      <label className={styles.inputLabel}>{label}</label>
      {type === 'select' ? (
        <Select
          options={options.map(o => ({ value: o, label: o }))}
          value={value}
          name={name}
          onChange={handleChange}
          className={styles.inputField}
        />
      ) : (
        <input 
          type={type}
          name={name} 
          value={value} 
          onChange={handleChange} 
          className={styles.inputField}
          placeholder={label === '요청일' ? "YYYY/MM/DD" : ""}
        />
      )}
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.searchSection}> 
        <h1 className={styles.title}>포상 관리</h1>

        {/* --- 1행: 조회 영역 (이름, 사원번호, 요청일, 부서 + 조회 버튼) --- */}
        <div className={styles.searchRow}>
            <div className={styles.fieldsWrapper}>
                {renderField('이름', 'name', searchParams.name)}
                {renderField('사원번호', 'employeeId', searchParams.employeeId)}
                {renderField('요청일', 'requestDate', searchParams.requestDate)}
                {renderField('부서', 'department', searchParams.department, 'select', departments)}
            </div>
            <div className={styles.buttonWrapper}>
                <Button onClick={handleSearch} className={styles.largeButton}>조회</Button>
            </div>
        </div>

        {/* --- 2행: 등록 영역 (포상종류, 포상사유, 포상형태 + 등록 버튼) --- */}
        <div className={styles.registerRow}>
            <div className={styles.fieldsWrapper}>
                {renderField('포상종류', 'rewardType', searchParams.rewardType, 'select', rewardTypes)}
                {renderField('포상사유', 'rewardReason', searchParams.rewardReason, 'select', rewardReasons)}
                {renderField('포상형태', 'rewardForm', searchParams.rewardForm, 'select', rewardForms)}
            </div>
            <div className={styles.buttonWrapper}>
                <Button onClick={handleRegister} className={styles.largeButtonRegister}>등록</Button>
            </div>
        </div>

      </div>

      <div className={styles.tableSection}>
        {loading ? (
          <div className={styles.loadingMessage}>데이터를 불러오는 중입니다...</div>
        ) : (
          <table className={styles.rewardTable}>
            <thead>
              <tr>
                <th className={styles.checkboxHeader}>
                  <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} />
                </th>
                {tableHeaders.map(header => (
                  <th key={header.key} className={styles.tableHeaderCell}>{header.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rewardData.length > 0 ? (
                rewardData.map((item) => renderRewardRow(item))
              ) : (
                <tr>
                  <td colSpan={tableHeaders.length + 1} className={styles.emptyCell}>
                    조회된 포상 기록이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className={styles.footerSection}>
        <div className={styles.pagination}>
          <div className={styles.pageArrow}>&#9664;</div>
          <div className={styles.pageNumber}>1</div>
          <div className={styles.pageArrow}>&#9654;</div>
        </div>
      </div>
      
      {/* ✨ RewardManageModal 컴포넌트 연결 */}
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