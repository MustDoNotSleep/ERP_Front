import React, { useState, useEffect } from 'react'; // 1. useEffect 추가
import styles from "./AppointmentApprovePage.module.css";
import tableStyles from "../../../../components/common/DataTable.module.css";
import DataTable from '../../../../components/common/DataTable';
import AppointmentApproveFilter from '../../../../components/HR/AppointmentApprove/AppointmentApproveFilter';
import axios from 'axios'; // 2. axios 추가

// ⬇️ Mock 데이터 import는 삭제
// import { APPOINTMENT_APPROVE_LIST_MOCK } from '../../../../models/data/AppointmentApproveMOCK'; 

// 3. 요청하신 API URL
// ⚠️ 이 URL 하나로 '조회'와 '상태변경'이 모두 된다고 가정한 코드입니다.
const API_URL = 'https://xtjea0rsb6.execute-api.ap-northeast-2.amazonaws.com/dev/erp-appointment';


const TABLE_HEADERS = [
    '선택', '요청일', '사번', '이름', '발령 구분', '요청자', '상태', '승인자'
];

const AppointmentApprovePage = () => {
    
    // 4. Mock 데이터 대신 빈 배열로 초기화
    const [approvals, setApprovals] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // 5. 로딩 상태 추가
    
    const [searchParams, setSearchParams] = useState({
        employeeName: '',
        employeeId: '',
        requestDate: '',
        departmentId: '',
    });

    // 6. (핵심) 데이터 조회 함수 (검색 겸용)
    const fetchData = async (params = {}) => {
        setIsLoading(true);
        try {
            // 가정 1: 'GET' 요청을 API_URL로 보내 목록을 가져옴
            const response = await axios.get(API_URL, { params });
            
            setApprovals(response.data); // 서버 응답 데이터로 상태 업데이트
        } catch (error) {
            console.error("❌ 인사발령 목록 조회 실패:", error);
            alert("데이터를 불러오는 데 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    // 7. (핵심) 페이지가 처음 렌더링될 때 전체 목록 조회
    useEffect(() => {
        fetchData(); // 전체 목록 1회 호출
    }, []); // 빈 배열[]: "페이지 로드 시 딱 한 번만 실행"

    // --- 핸들러 함수 ---
    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    // 8. (핵심) 검색 버튼 핸들러
    const handleSearch = () => {
        console.log('🐥 인사발령 검색 시작!', searchParams);
        fetchData(searchParams); // 검색 조건을 담아 조회
    };
    
    const handleRowSelect = (id) => {
        setSelectedRows(prev => 
            prev.includes(id) 
                ? prev.filter(rowId => rowId !== id) 
                : [...prev, id]
        );
    };

    // 9. (핵심) 승인/반려 버튼 핸들러
    const handleAction = async (action) => { // 'action'은 "반려" 또는 "최종승인"
        if (selectedRows.length === 0) {
            alert(`먼저 ${action}할 항목을 선택해주세요.`);
            return;
        }

        console.log(`🚀 ${action} 처리:`, selectedRows);
        setIsLoading(true);

        try {
            // 서버에 보낼 데이터 (예시)
            const payload = {
                requestIds: selectedRows, // 예: ["req-001", "req-002"]
                status: action,           // 예: "반려" 또는 "최종승인"
            };

            // 가정 2: 'POST' 요청을 (신청과) 같은 API_URL로 보내 상태를 변경
            await axios.post(API_URL, payload);

            alert(`선택된 항목이 ${action} 처리되었습니다.`);
            setSelectedRows([]); // 선택 해제
            fetchData(); // 10. (중요) 목록을 새로고침해서 변경사항을 반영

        } catch (error) {
            console.error(`❌ ${action} 처리 실패:`, error);
            alert("처리 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    // 테이블 행 렌더링 로직 (수정 없음)
    const renderApproveRow = (item) => {
        
        let statusStyle = '';
        if (item.status === '반려') {
            statusStyle = styles.statusRejected;
        } else if (item.status === '대기') {
            statusStyle = styles.statusPending;
        } else if (item.status === '최종승인') {
            statusStyle = styles.statusApproved;
        }

        return (
            <>
                <td className={tableStyles.tableData}>
                    <input 
                        type="checkbox" 
                        // ⚠️ 'item.requestId'가 MOCK 데이터의 고유 ID였습니다.
                        // 실제 데이터의 고유 ID 키(key)로 변경해야 할 수 있습니다. (예: item.id)
                        checked={selectedRows.includes(item.requestId)}
                        onChange={() => handleRowSelect(item.requestId)}
                    />
                </td>
                <td className={tableStyles.tableData}>{item.requestDate}</td>
                <td className={tableStyles.tableData}>{item.employeeId}</td>
                <td className={tableStyles.tableData}>{item.employeeName}</td>
                <td className={tableStyles.tableData}>{item.appointmentType}</td>
                <td className={tableStyles.tableData}>{item.requesterName}</td>
                <td className={`${tableStyles.tableData} ${statusStyle}`}>
                    {item.status}
                </td>
                <td className={tableStyles.tableData}>{item.approverName}</td>
            </>
        );
    };

    return (
        <div className={styles.pageContainer}>
            
            <div className={styles.filterSection}>
                <AppointmentApproveFilter
                    searchParams={searchParams}
                    onSearchChange={handleSearchChange}
                    onSearchSubmit={handleSearch}
                />
            </div>

            {/* 11. 로딩 중일 때 표시 */}
            {isLoading && <p>데이터를 불러오는 중입니다...</p>}

            {/* 데이터가 있을 때만 테이블 표시 */}
            {!isLoading && approvals.length > 0 && (
                <DataTable
                    headers={TABLE_HEADERS}
                    data={approvals}
                    renderRow={renderApproveRow}
                />
            )}
            
            {/* 데이터가 없을 때 메시지 */}
            {!isLoading && approvals.length === 0 && (
                <div className={styles.noDataMessage}>조회된 데이터가 없습니다.</div>
            )}

            <div className={styles.buttonGroup}>
                <button 
                    onClick={() => handleAction('반려')} 
                    className={styles.rejectButton} 
                    disabled={isLoading} // 12. 로딩 중 비활성화
                >
                    반려
                </button>
                <button 
                    onClick={() => handleAction('최종승인')} 
                    className={styles.approveButton} 
                    disabled={isLoading} // 13. 로딩 중 비활성화
                >
                    {isLoading ? "처리 중..." : "최종승인"}
                </button>
            </div>
        </div>
    );
};

export default AppointmentApprovePage;