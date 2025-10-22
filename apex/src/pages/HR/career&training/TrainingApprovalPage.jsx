import React, { useState, useEffect } from 'react'; // 1. useEffect 추가
import styles from "./TrainingApprovalPage.module.css"
import tableStyles from "../../../components/common/DataTable.module.css";
import DataTable from '../../../components/common/DataTable';
import TrainingApprovalFilter from '../../../components/HR/career&edu/TrainingApprovalFilter';
import axios from 'axios'; // 2. axios 추가

// 3. ⬇️ Mock 데이터 import는 삭제
// import { TRAINING_APPROVAL_LIST_MOCK } from '../../../models/data/TrainingMOCK';

// 4. ⚠️ 요청하신 API URL (이 URL 하나로 조회/상태변경이 모두 된다고 가정한 코드입니다.)
const API_URL = 'https://xtjea0rsb6.execute-api.ap-northeast-2.amazonaws.com/dev/erp-education';

const TABLE_HEADERS = [
    '선택', '신청일자', '사번', '이름', '부서', '직급', '교육명', '상태'
];

const TrainingApprovalPage = () => {
    
    // 5. ⬇️ Mock 데이터 대신 빈 배열로 초기화
    const [approvals, setApprovals] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // 6. 로딩 상태 추가
    
    const [searchParams, setSearchParams] = useState({
        departmentId: '', positionId: '', courseName: '', applicationDate: '', approvalStatus: '',
    });

    // 7. (핵심) 데이터 조회 함수 (검색 겸용)
    const fetchData = async (params = {}) => {
        setIsLoading(true);
        try {
            // 가정 1: 'GET' 요청을 API_URL로 보내 목록을 가져옴
            const response = await axios.get(API_URL, { params });
            
            setApprovals(response.data); // 서버 응답 데이터로 상태 업데이트
        } catch (error) {
            console.error("❌ 교육 신청 목록 조회 실패:", error);
            alert("데이터를 불러오는 데 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    // 8. (핵심) 페이지가 처음 렌더링될 때 전체 목록 조회
    useEffect(() => {
        fetchData(); // (params 없이) 전체 목록 1회 호출
    }, []); // 빈 배열[]: "페이지 로드 시 딱 한 번만 실행"

    // --- 핸들러 함수 ---
    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    // 9. (핵심) 검색 버튼 핸들러
    const handleSearch = () => {
        console.log('🐥 검색 시작!', searchParams);
        fetchData(searchParams); // 검색 조건을 담아 조회
    };
    
    // 10. (핵심) 행 선택 핸들러 (MOCK 코드와 동일)
    const handleRowSelect = (id) => {
        setSelectedRows(prev => 
            prev.includes(id) 
                ? prev.filter(rowId => rowId !== id) 
                : [...prev, id]
        );
    };

    // 11. (핵심) 승인/반려 버튼 핸들러
    const handleAction = async (action) => { // 'action'은 "반려" 또는 "승인"
        if (selectedRows.length === 0) {
            alert(`먼저 ${action}할 항목을 선택해주세요.`);
            return;
        }

        console.log(`🚀 ${action} 처리:`, selectedRows);
        setIsLoading(true);

        try {
            // 서버에 보낼 데이터 (예시)
            const payload = {
                requestIds: selectedRows, // 예: ["req-edu-001", "req-edu-002"]
                status: action,           // 예: "반려" 또는 "승인"
            };

            // 가정 2: 'POST' 요청을 (등록과) 같은 API_URL로 보내 상태를 변경
            await axios.post(API_URL, payload);

            alert(`선택된 항목이 ${action} 처리되었습니다.`);
            setSelectedRows([]); // 선택 해제
            fetchData(); // 12. (중요) 목록을 새로고침해서 변경사항을 반영

        } catch (error) {
            console.error(`❌ ${action} 처리 실패:`, error);
            alert("처리 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    // 테이블 행 렌더링 로직 (수정 없음)
    const renderApprovalRow = (item) => { 
        return (
            <>
                <td className={tableStyles.tableData}>
                    <input 
                        type="checkbox" 
                        checked={selectedRows.includes(item.requestId)}
                        onChange={() => handleRowSelect(item.requestId)}
                    />
                </td>
                <td className={tableStyles.tableData}>{item.applicationDate}</td>
                <td className={tableStyles.tableData}>{item.employeeId}</td>
                <td className={tableStyles.tableData}>{item.employeeName}</td>
                <td className={tableStyles.tableData}>{item.department}</td>
                <td className={tableStyles.tableData}>{item.position}</td>
                <td className={tableStyles.tableData}>{item.courseName}</td>
                <td className={tableStyles.tableData}>{item.status}</td> 
                {/* ⚠️ MOCK 데이터의 status CSS 적용 로직이 있다면 그대로 유지하세요 */}
            </>
        );
    };


    return (
        <div className={styles.pageContainer}>
            
            {/* --- A. 검색 필터 영역 --- */}
            <div className={styles.filterSection}>
                <TrainingApprovalFilter
                    searchParams={searchParams}
                    onSearchChange={handleSearchChange}
                    onSearchSubmit={handleSearch}
                />
            </div>

            {/* 13. 로딩 및 데이터 없음 UI 추가 */}
            {isLoading && <p>데이터를 불러오는 중입니다...</p>}

            {/* --- B. 데이터 테이블 영역 --- */}
            {!isLoading && approvals.length > 0 && (
                <DataTable
                    headers={TABLE_HEADERS}
                    data={approvals}
                    renderRow={renderApprovalRow}
                />
            )}

            {!isLoading && approvals.length === 0 && (
                <div className={styles.noDataMessage}>조회된 데이터가 없습니다.</div>
            )}

            {/* --- C. 액션 버튼 영역 --- */}
            <div className={styles.buttonGroup}>
                <button 
                    onClick={() => handleAction('반려')} 
                    className={styles.rejectButton} 
                    disabled={isLoading} // 14. 로딩 중 비활성화
                >
                    반려
                </button>
                <button 
                    onClick={() => handleAction('승인')} 
                    className={styles.approveButton} 
                    disabled={isLoading} // 15. 로딩 중 비활성화
                >
                    {isLoading ? "처리 중..." : "승인"}
                </button>
            </div>
        </div>
    );
};

export default TrainingApprovalPage;