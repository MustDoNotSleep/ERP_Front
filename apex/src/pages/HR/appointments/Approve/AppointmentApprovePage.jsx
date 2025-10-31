import React, { useState, useEffect } from 'react';
import styles from "./AppointmentApprovePage.module.css";
import tableStyles from "../../../../components/common/DataTable.module.css";
import DataTable from '../../../../components/common/DataTable';
import AppointmentApproveFilter from '../../../../components/HR/AppointmentApprove/AppointmentApproveFilter';
import { Button } from '../../../../components/common';
import { 
    fetchAppointmentRequests, 
    approveAppointmentRequest, 
    rejectAppointmentRequest 
} from '../../../../api/appointment';

// ⬇️ Mock 데이터 import는 삭제
import { APPOINTMENT_APPROVE_LIST_MOCK } from '../../../../models/data/AppointmentApproveMOCK'; 

// 2. ✨ "마법 스위치"를 만듭니다.
// true로 설정하면 MOCK 데이터를, false로 설정하면 실제 API를 호출합니다.
const USE_MOCK_DATA = true;


const TABLE_HEADERS = [
    '선택', '요청일', '사번', '이름', '발령 구분', '요청자', '상태', '승인자'
];

// --- MOCK 데이터 관련 함수 (내부 함수로 추가) ---

// MOCK 데이터를 필터링하는 로직 (검색 기능)
const filterMockData = (data, params) => {
    // 검색어가 없으면 전체 반환
    if (!params.employeeName && !params.employeeId && !params.requestDate && !params.departmentId) {
        return data;
    }

    const nameQuery = params.employeeName?.trim().toLowerCase();
    const idQuery = params.employeeId?.trim();
    const dateQuery = params.requestDate?.trim(); // requestDate는 yyyy-mm-dd 형식이라고 가정
    const deptQuery = params.departmentId?.trim(); // MOCK 데이터에는 department가 없어서 departmentId로 가정하고 employeeId로 대체

    return data.filter(item => {
        const nameMatch = !nameQuery || item.employeeName.toLowerCase().includes(nameQuery);
        const idMatch = !idQuery || item.employeeId.includes(idQuery);
        
        // MOCK 데이터에는 departmentId가 없으므로 임의로 employeeId로 대체하여 필터링한다고 가정합니다.
        // 실제 MOCK 데이터에 department 필드가 있다면, 그 필드로 변경해야 합니다.
        const departmentMatch = !deptQuery || item.employeeId.includes(deptQuery); 
        
        // requestDate는 정확히 일치하거나 (만약 item.requestDate가 'YYYY-MM-DD' 형식이라면)
        const dateMatch = !dateQuery || item.requestDate === dateQuery; 

        return nameMatch && idMatch && departmentMatch && dateMatch;
    });
};

// MOCK 데이터의 상태를 변경하는 함수
const updateMockStatus = (data, requestIds, newStatus) => {
    // MOCK 데이터는 불변성이 없으므로, map으로 새 배열 생성
    return data.map(item => {
        if (requestIds.includes(item.requestId)) {
            return {
                ...item,
                status: newStatus,
                approverName: newStatus === '최종승인' ? '시스템_승인자' : item.approverName // 임의 승인자 설정
            };
        }
        return item;
    });
};

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

        // ✨ MOCK 데이터 사용 시 로직 ✨
        if (USE_MOCK_DATA) {
            console.log("🛠️ MOCK 데이터를 사용하여 인사발령 목록 조회/필터링");
            await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 딜레이
            
            // 필터링 적용
            const filteredData = filterMockData(APPOINTMENT_APPROVE_LIST_MOCK, params);
            setApprovals(filteredData);
            setIsLoading(false);
            return;
        }

        // 🚀 실제 API 사용 시 로직
        try {
            // fetchAppointmentRequests API 사용
            const data = await fetchAppointmentRequests(0, 100, params.status);
            
            // 클라이언트 사이드 필터링 (필요시)
            let filteredData = data.content || data;
            
            if (params.employeeName) {
                filteredData = filteredData.filter(item => 
                    item.employee?.name?.includes(params.employeeName)
                );
            }
            if (params.employeeId) {
                filteredData = filteredData.filter(item => 
                    String(item.employee?.employeeId).includes(params.employeeId)
                );
            }
            
            setApprovals(filteredData);
        } catch (error) {
            console.error("❌ 인사발령 목록 조회 실패:", error);
            alert("데이터를 불러오는 데 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    // 6. (핵심) 페이지가 처음 렌더링될 때 전체 목록 조회
    useEffect(() => {
        fetchData(); // 전체 목록 1회 호출
    }, []); // 빈 배열[]: "페이지 로드 시 딱 한 번만 실행"

    // --- 핸들러 함수 ---
    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    // 7. (핵심) 검색 버튼 핸들러
    const handleSearch = () => {
        console.log('🐥 인사발령 검색 시작!', searchParams);
        fetchData(searchParams); // 검색 조건을 담아 조회
    };

    // 리셋 핸들러 추가
    const handleReset = () => {
        setSearchParams({
            employeeName: '',
            employeeId: '',
            requestDate: '',
            departmentId: ''
        });
        fetchData(); // 전체 목록 다시 로드
    };
    
    const handleRowSelect = (id) => {
        setSelectedRows(prev => 
            prev.includes(id) 
                ? prev.filter(rowId => rowId !== id) 
                : [...prev, id]
        );
    };

    // 8. (핵심) 승인/반려 버튼 핸들러
    const handleAction = async (action) => { // 'action'은 "반려" 또는 "최종승인"
        if (selectedRows.length === 0) {
            alert(`먼저 ${action}할 항목을 선택해주세요.`);
            return;
        }

        console.log(`🚀 ${action} 처리:`, selectedRows);
        setIsLoading(true);

        // ✨ MOCK 데이터 사용 시 로직 ✨
        if (USE_MOCK_DATA) {
            console.log(`🛠️ MOCK 데이터 ${action} 처리`);
            await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 딜레이
            
            // MOCK 데이터 상태 업데이트
            const newApprovals = updateMockStatus(approvals, selectedRows, action);
            setApprovals(newApprovals); // 현재 approvals 상태를 업데이트
            
            // ⚠️ 주의: Mocking 시 'APPOINTMENT_APPROVE_LIST_MOCK' 원본 데이터는 변경되지 않으므로,
            // 페이지를 새로고침하면 원본 상태로 돌아옵니다. 실제 사용 시에는 이 부분을 고려해야 합니다.
            
            alert(`선택된 항목이 ${action} 처리되었습니다.`);
            setSelectedRows([]); // 선택 해제
            setIsLoading(false);
            return;
        }

        // 🚀 실제 API 사용 시 로직
        try {
            // 선택된 각 요청에 대해 승인/반려 처리
            const promises = selectedRows.map(requestId => {
                if (action === '최종승인') {
                    return approveAppointmentRequest(requestId, '승인되었습니다.');
                } else {
                    return rejectAppointmentRequest(requestId, '반려되었습니다.');
                }
            });
            
            await Promise.all(promises);

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
                    onReset={handleReset}
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
                <Button 
                    variant="danger"
                    onClick={() => handleAction('반려')} 
                    disabled={isLoading}
                >
                    반려
                </Button>
                <Button 
                    variant="primary"
                    onClick={() => handleAction('최종승인')} 
                    disabled={isLoading}
                >
                    {isLoading ? "처리 중..." : "최종승인"}
                </Button>
            </div>
        </div>
    );
};

export default AppointmentApprovePage;