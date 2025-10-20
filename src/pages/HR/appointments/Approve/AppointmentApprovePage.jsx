import React, { useState } from 'react';
import styles from "./AppointmentApprovePage.module.css";
import tableStyles from "../../../../components/common/DataTable.module.css";
import DataTable from '../../../../components/common/DataTable';
import AppointmentApproveFilter from '../../../../components/HR/AppointmentApprove/AppointmentApproveFilter';
// ⬇️ Mock 데이터를 import 합니다. (경로는 실제 파일 위치에 맞게 수정하세요)
import { APPOINTMENT_APPROVE_LIST_MOCK } from '../../../../models/data/AppointmentApproveMOCK'; 

// 테이블 헤더는 페이지 컴포넌트 내에 유지
const TABLE_HEADERS = [
    '선택', '요청일', '사번', '이름', '발령 구분', '요청자', '상태', '승인자'
];

const AppointmentApprovePage = () => {
    
    // ⬇️ import한 Mock 데이터로 useState 초기화
    const [approvals, setApprovals] = useState(APPOINTMENT_APPROVE_LIST_MOCK);
    const [selectedRows, setSelectedRows] = useState([]);
    
    const [searchParams, setSearchParams] = useState({
        employeeName: '',
        employeeId: '',
        requestDate: '',
        departmentId: '',
    });

    // --- 핸들러 함수 ---
    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        console.log('🐥 인사발령 검색 시작!', searchParams);
        // TODO: API 호출 로직
    };
    
    const handleRowSelect = (id) => {
        setSelectedRows(prev => 
            prev.includes(id) 
                ? prev.filter(rowId => rowId !== id) 
                : [...prev, id]
        );
    };

    const handleAction = (action) => {
        console.log(`🚀 ${action} 처리:`, selectedRows);
        // TODO: 선택된 항목(selectedRows)에 대해 '반려' 또는 '최종승인' API 호출
        setSelectedRows([]);
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
            
            {/* --- A. 검색 필터 영역 --- */}
            <div className={styles.filterSection}>
                <AppointmentApproveFilter
                    searchParams={searchParams}
                    onSearchChange={handleSearchChange}
                    onSearchSubmit={handleSearch}
                />
            </div>

            {/* --- B. 데이터 테이블 영역 --- */}
            <DataTable
                headers={TABLE_HEADERS}
                data={approvals}
                renderRow={renderApproveRow}
            />

            {/* --- C. 액션 버튼 영역 --- */}
            <div className={styles.buttonGroup}>
                <button 
                    onClick={() => handleAction('반려')} 
                    className={styles.rejectButton} 
                >
                    반려
                </button>
                <button 
                    onClick={() => handleAction('최종승인')} 
                    className={styles.approveButton} 
                >
                    최종승인
                </button>
            </div>
        </div>
    );
};

export default AppointmentApprovePage;