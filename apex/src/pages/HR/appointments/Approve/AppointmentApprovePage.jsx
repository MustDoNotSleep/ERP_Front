import React, { useState, useEffect } from 'react';
import styles from "./AppointmentApprovePage.module.css";
import tableStyles from "../../../../components/common/DataTable.module.css";
import DataTable from '../../../../components/common/DataTable';
import AppointmentApproveFilter from '../../../../components/HR/AppointmentApprove/AppointmentApproveFilter';
import EmployeeSearchModal from '../../../../components/HR/AppointmentApply/EmployeeSearchModal';
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
const USE_MOCK_DATA = false;


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
    const [statusFilter, setStatusFilter] = useState('ALL'); // 상태 필터: 'ALL', 'PENDING', 'APPROVED', 'REJECTED'
    const [hasWarned, setHasWarned] = useState(false); // 첫 선택 시 경고 플래그
    const [isEmployeeSearchOpen, setIsEmployeeSearchOpen] = useState(false); // 직원 검색 모달
    
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
            const response = await fetchAppointmentRequests(0, 100);
            
            // 응답 구조: { success, message, data: { content: [...], ... } }
            let requestList;
            
            if (response.data && response.data.content) {
                requestList = response.data.content;
            } else if (response.content) {
                requestList = response.content;
            } else if (Array.isArray(response.data)) {
                requestList = response.data;
            } else if (Array.isArray(response)) {
                requestList = response;
            } else {
                requestList = [];
            }
            
            // 클라이언트 사이드 필터링
            let filteredData = requestList;
            
            if (params.employeeName) {
                filteredData = filteredData.filter(item => 
                    item.targetEmployeeName?.includes(params.employeeName)
                );
            }
            if (params.employeeId) {
                filteredData = filteredData.filter(item => 
                    String(item.targetEmployeeId).includes(params.employeeId)
                );
            }
            
            console.log('📋 조회된 발령 목록:', filteredData);
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

    // 직원 검색 모달 열기
    const handleOpenEmployeeSearch = () => {
        setIsEmployeeSearchOpen(true);
    };

    // 직원 선택 핸들러
    const handleSelectEmployee = (employee) => {
        setSearchParams(prev => ({
            ...prev,
            employeeName: employee.name,
            employeeId: employee.id ? String(employee.id) : ''
        }));
        setIsEmployeeSearchOpen(false);
    };
    
    const handleRowSelect = (id) => {
        const selectedItem = approvals.find(item => (item.id || item.requestId) === id);
        const status = selectedItem?.status || selectedItem?.approvalStatus;
        
        // 최종 처리된 항목(승인/반려)은 선택 불가
        if (status === 'APPROVED' || status === '최종승인' || status === 'REJECTED' || status === '반려') {
            alert('이미 처리 완료된 항목은 선택할 수 없습니다.');
            return;
        }

        // 첫 선택 시 경고 메시지
        if (!hasWarned && selectedRows.length === 0) {
            const confirmed = window.confirm(
                '⚠️ 중요 안내\n\n' +
                '승인 또는 반려 처리 후에는 되돌릴 수 없습니다.\n' +
                '신중하게 선택해주세요.\n\n' +
                '계속 진행하시겠습니까?'
            );
            if (!confirmed) {
                return;
            }
            setHasWarned(true);
        }
        
        setSelectedRows(prev => 
            prev.includes(id) 
                ? prev.filter(rowId => rowId !== id) 
                : [...prev, id]
        );
    };

    // 8. (핵심) 승인/반려 버튼 핸들러
    const handleAction = async (action) => { // 'action'은 "반려" 또는 "최종승인"
        console.log('🎯 handleAction 호출됨:', { action, selectedRows });
        
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
                console.log(`📤 API 호출 준비 - action: ${action}, requestId: ${requestId}`);
                
                if (action === '최종승인') {
                    console.log(`✅ approveAppointmentRequest 호출: ${requestId}`);
                    return approveAppointmentRequest(requestId, '승인되었습니다.');
                } else {
                    console.log(`❌ rejectAppointmentRequest 호출: ${requestId}`);
                    return rejectAppointmentRequest(requestId, '반려되었습니다.');
                }
            });
            
            const results = await Promise.all(promises);
            console.log('✅ 처리 결과:', results);

            alert(`선택된 항목이 ${action} 처리되었습니다.`);
            setSelectedRows([]); // 선택 해제
            fetchData(); // 목록을 새로고침해서 변경사항을 반영

        } catch (error) {
            console.error(`❌ ${action} 처리 실패:`, error);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || '처리 중 오류가 발생했습니다.';
            alert(errorMessage);
        } finally {
            setIsLoading(false);
            setHasWarned(false); // 처리 완료 후 경고 플래그 리셋
        }
    };

    // 테이블 행 렌더링 로직 - 백엔드 응답 구조에 맞게 수정
    const renderApproveRow = (item) => {
        
        let statusStyle = '';
        const status = item.status || item.approvalStatus;
        
        if (status === 'REJECTED' || status === '반려') {
            statusStyle = styles.statusRejected;
        } else if (status === 'PENDING' || status === '대기') {
            statusStyle = styles.statusPending;
        } else if (status === 'APPROVED' || status === '최종승인') {
            statusStyle = styles.statusApproved;
        }

        // 백엔드 응답 구조에 맞게 필드 매핑
        const id = item.id || item.requestId;
        const requestDate = item.createdAt || item.requestDate;
        const employeeId = item.targetEmployeeId || item.employeeId;
        const employeeName = item.targetEmployeeName || item.employeeName;
        const appointmentType = item.appointmentType;
        const requesterName = item.requesterName || '-';
        const approverName = item.approverName || '-';

        // 처리 완료된 항목인지 확인
        const isProcessed = status === 'APPROVED' || status === '최종승인' || status === 'REJECTED' || status === '반려';

        return (
            <>
                <td className={tableStyles.tableData} style={{ 
                    backgroundColor: isProcessed ? '#f5f5f5' : 'transparent',
                    opacity: isProcessed ? 0.7 : 1
                }}>
                    <input 
                        type="checkbox" 
                        checked={selectedRows.includes(id)}
                        onChange={() => handleRowSelect(id)}
                        disabled={isProcessed}
                        style={{ cursor: isProcessed ? 'not-allowed' : 'pointer' }}
                    />
                </td>
                <td className={tableStyles.tableData}>{requestDate}</td>
                <td className={tableStyles.tableData}>{employeeId}</td>
                <td className={tableStyles.tableData}>{employeeName}</td>
                <td className={tableStyles.tableData}>{appointmentType}</td>
                <td className={tableStyles.tableData}>{requesterName}</td>
                <td className={`${tableStyles.tableData} ${statusStyle}`}>
                    {status === 'APPROVED' ? '최종승인' : status === 'REJECTED' ? '반려' : status === 'PENDING' ? '대기' : status}
                </td>
                <td className={tableStyles.tableData}>{approverName}</td>
            </>
        );
    };

    // 상태 필터링 적용
    const filteredApprovals = approvals.filter(item => {
        const status = item.status || item.approvalStatus || '';
        
        if (statusFilter === 'ALL') {
            return true;
        } else if (statusFilter === 'PENDING') {
            return status === 'PENDING' || status === '대기';
        } else if (statusFilter === 'APPROVED') {
            return status === 'APPROVED' || status === '최종승인';
        } else if (statusFilter === 'REJECTED') {
            return status === 'REJECTED' || status === '반려';
        }
        
        return true;
    });

    return (
        <div className={styles.pageContainer}>
            
            {/* 직원 검색 모달 */}
            <EmployeeSearchModal
                isOpen={isEmployeeSearchOpen}
                onClose={() => setIsEmployeeSearchOpen(false)}
                onSelectEmployee={handleSelectEmployee}
            />

            <div className={styles.filterSection}>
                <AppointmentApproveFilter
                    searchParams={searchParams}
                    onSearchChange={handleSearchChange}
                    onSearchSubmit={handleSearch}
                    onReset={handleReset}
                    onOpenEmployeeSearch={handleOpenEmployeeSearch}
                    statusFilter={statusFilter}
                    onStatusFilterChange={(e) => setStatusFilter(e.target.value)}
                />
            </div>

            {/* 11. 로딩 중일 때 표시 */}
            {isLoading && <p>데이터를 불러오는 중입니다...</p>}

            {/* 데이터가 있을 때만 테이블 표시 */}
            {!isLoading && filteredApprovals.length > 0 && (
                <DataTable
                    headers={TABLE_HEADERS}
                    data={filteredApprovals}
                    renderRow={renderApproveRow}
                />
            )}
            
            {/* 데이터가 없을 때 메시지 */}
            {!isLoading && filteredApprovals.length === 0 && (
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