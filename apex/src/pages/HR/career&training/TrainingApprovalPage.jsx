import React, { useState, useEffect } from 'react'; 
import styles from "./TrainingApprovalPage.module.css"
import tableStyles from "../../../components/common/DataTable.module.css";
import DataTable from '../../../components/common/DataTable';
import TrainingApprovalFilter from '../../../components/HR/career&edu/TrainingApprovalFilter';
import axios from 'axios'; 

// 1. ✨ Mock 데이터 import (유지)
import { TRAINING_APPROVAL_LIST_MOCK } from '../../../models/data/TrainingMOCK';

// 2. ✨ "마법 스위치" (유지)
const USE_MOCK_DATA = true;


// 3. API URL (유지)
const API_URL = 'https://xtjea0rsb6.execute-api.ap-northeast-2.amazonaws.com/dev/erp-education';

const TABLE_HEADERS = [
    '선택', '신청일자', '사번', '이름', '부서', '직급', '교육명', '상태'
];

// --- MOCK 데이터 관련 함수 (내부 함수로 수정) ---

// ⭐️ MOCK 데이터를 필터링하는 로직 (검색 기능 강화) ⭐️
const filterMockData = (data, params) => {
    const { departmentId, positionId, courseName, applicationDate, approvalStatus } = params;

    // 검색어가 없으면 전체 반환
    if (!departmentId && !positionId && !courseName && !applicationDate && !approvalStatus) {
        return data;
    }

    const deptQuery = departmentId?.trim();
    const posQuery = positionId?.trim();
    const courseQuery = courseName?.trim().toLowerCase();
    const dateQuery = applicationDate?.trim();
    const statusQuery = approvalStatus?.trim();

    return data.filter(item => {
        // ✨ 안전하게 문자열로 변환하여 비교 (필터링 문제 해결) ✨
        const itemDeptId = String(item.departmentName || '');
        const itemPosId = String(item.positionName || '');

        // 부서 ID 일치
        const deptMatch = !deptQuery || itemDeptId === deptQuery; 
        // 직급 ID 일치
        const posMatch = !posQuery || itemPosId === posQuery; 
        // 교육명 부분 일치
        const courseMatch = !courseQuery || String(item.courseName || '').toLowerCase().includes(courseQuery);
        // 신청일자 일치
        const dateMatch = !dateQuery || item.applicationDate === dateQuery;
        // 상태 일치
        const statusMatch = !statusQuery || item.status === statusQuery;

        return deptMatch && posMatch && courseMatch && dateMatch && statusMatch;
    });
};

// MOCK 데이터의 상태를 변경하는 함수 (유지)
const updateMockStatus = (data, requestIds, newStatus) => {
    return data.map(item => {
        if (requestIds.includes(item.requestId)) {
            return {
                ...item,
                status: newStatus,
            };
        }
        return item;
    });
};

// ---------------------------------------------


const TrainingApprovalPage = () => {
    
    // 4. State 초기화 (유지)
    const [approvals, setApprovals] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isLoading, setIsLoading] = useState(false); 
    
    const [searchParams, setSearchParams] = useState({
        departmentId: '', positionId: '', courseName: '', applicationDate: '', approvalStatus: '',
    });

    // 5. (핵심) 데이터 조회 함수 (MOCK/API 분기) - 유지
    const fetchData = async (params = {}) => {
        setIsLoading(true);
        
        // ✨ MOCK 데이터 사용 시 로직 ✨
        if (USE_MOCK_DATA) {
            console.log("🛠️ MOCK 데이터를 사용하여 교육 신청 목록 조회/필터링");
            await new Promise(resolve => setTimeout(resolve, 500)); 
            
            // 필터링 적용
            const filteredData = filterMockData(TRAINING_APPROVAL_LIST_MOCK, params);
            setApprovals(filteredData);
            setIsLoading(false);
            return;
        }

        // 🚀 실제 API 사용 시 로직
        try {
            const response = await axios.get(API_URL, { params });
            setApprovals(response.data); 
        } catch (error) {
            console.error("❌ 교육 신청 목록 조회 실패:", error);
            alert("데이터를 불러오는 데 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    // 6. 페이지 초기 로드 (유지)
    useEffect(() => {
        fetchData(); 
    }, []); 

    // --- 핸들러 함수 ---
    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    // 7. 검색 버튼 핸들러 (유지)
    const handleSearch = () => {
        console.log('🐥 검색 시작!', searchParams);
        fetchData(searchParams); 
    };
    
    // 8. 행 선택 핸들러 (유지)
    const handleRowSelect = (id) => {
        setSelectedRows(prev => 
            prev.includes(id) 
                ? prev.filter(rowId => rowId !== id) 
                : [...prev, id]
        );
    };

    // 9. (핵심) 승인/반려 버튼 핸들러 (MOCK/API 분기) - 유지
    const handleAction = async (action) => { 
        if (selectedRows.length === 0) {
            alert(`먼저 ${action}할 항목을 선택해주세요.`);
            return;
        }

        console.log(`🚀 ${action} 처리:`, selectedRows);
        setIsLoading(true);

        // ✨ MOCK 데이터 사용 시 로직 ✨
        if (USE_MOCK_DATA) {
            console.log(`🛠️ MOCK 데이터 ${action} 처리`);
            await new Promise(resolve => setTimeout(resolve, 500)); 
            
            // ⭐️ 현재 approvals 상태를 기반으로 업데이트 ⭐️
            // 이 로직 덕분에 체크박스 선택 후 상태 변경이 정상 작동합니다. (체크박스 문제 해결)
            const newApprovals = updateMockStatus(approvals, selectedRows, action);
            setApprovals(newApprovals); 
            
            alert(`선택된 항목이 ${action} 처리되었습니다.`);
            setSelectedRows([]); 
            setIsLoading(false);
            return;
        }
        
        // 🚀 실제 API 사용 시 로직
        try {
            const payload = {
                requestIds: selectedRows, 
                status: action, 
            };

            await axios.post(API_URL, payload);

            alert(`선택된 항목이 ${action} 처리되었습니다.`);
            setSelectedRows([]); 
            fetchData(); 

        } catch (error) {
            console.error(`❌ ${action} 처리 실패:`, error);
            alert("처리 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    // 테이블 행 렌더링 로직 (유지)
    const renderApprovalRow = (item) => { 
        let statusStyle = '';
        if (item.status === '반려') {
            statusStyle = styles.statusRejected;
        } else if (item.status === '대기') {
            statusStyle = styles.statusPending;
        } else if (item.status === '승인') {
            statusStyle = styles.statusApproved;
        }
        
        return (
            <>
                <td className={tableStyles.tableData}>
                    <input 
                        type="checkbox" 
                        // ⭐️ requestId는 MOCK 데이터에서 유일해야 합니다! ⭐️
                        checked={selectedRows.includes(item.requestId)} 
                        onChange={() => handleRowSelect(item.requestId)}
                    />
                </td>
                <td className={tableStyles.tableData}>{item.applicationDate}</td>
                <td className={tableStyles.tableData}>{item.employeeId}</td>
                <td className={tableStyles.tableData}>{item.employeeName}</td>
                <td className={tableStyles.tableData}>{item.departmentName}</td>
                <td className={tableStyles.tableData}>{item.positionName}</td>
                <td className={tableStyles.tableData}>{item.courseName}</td>
                <td className={`${tableStyles.tableData} ${statusStyle}`}>{item.status}</td> 
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

            {/* 10. 로딩 및 데이터 없음 UI (유지) */}
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

            {/* --- C. 액션 버튼 영역 (유지) --- */}
            <div className={styles.buttonGroup}>
                <button 
                    onClick={() => handleAction('반려')} 
                    className={styles.rejectButton} 
                    disabled={isLoading} 
                >
                    반려
                </button>
                <button 
                    onClick={() => handleAction('승인')} 
                    className={styles.approveButton} 
                    disabled={isLoading}
                >
                    {isLoading ? "처리 중..." : "승인"}
                </button>
            </div>
        </div>
    );
};

export default TrainingApprovalPage;