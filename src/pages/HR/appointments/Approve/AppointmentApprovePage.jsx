import React, { useState } from 'react';
import styles from "./AppointmentApprovePage.module.css"; // (3)번 파일
import tableStyles from "../../../../components/common/DataTable.module.css";
import DataTable from '../../../../components/common/DataTable';
// eslint-disable-next-line no-unused-vars
import { APPOINTMENT_APPROVAL_LIST_MOCK } from '../../../../models/data/AppointmentApproveMOCK'; // (5)번 파일
import AppointmentApprovalFilter from '../../../../components/HR/AppointmentApprove/AppointmentApproveFilter'; // (2)번 파일

// 1. 이미지에 맞게 테이블 헤더 변경
const TABLE_HEADERS = [
    '선택', '요청일', '사번', '이름', '발령 구분', '요청자', '상태', '승인자'
];

const AppointmentApprovePage = () => {
    
   const [approvals] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    
    // 2. 이미지의 필터에 맞게 searchParams 상태 변경
    const [searchParams, setSearchParams] = useState({
        employeeName: '',
        employeeId: '',
        applicationDate: '',
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
    
    // 체크박스 선택 핸들러 (로직 유지)
    const handleRowSelect = (id) => {
        setSelectedRows(prev => 
            prev.includes(id) 
                ? prev.filter(rowId => rowId !== id) 
                : [...prev, id]
        );
    };

    // 3. 버튼 액션 핸들러 (버튼명 변경)
    const handleAction = (action) => {
        console.log(`🚀 ${action} 처리:`, selectedRows);
        // TODO: 선택된 row들(selectedRows)에 대해 '반려' 또는 '최종승인' API 호출
    };

    // 4. 테이블 행 렌더링 로직 (데이터 필드명 변경)
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
                <td className={tableStyles.tableData}>{item.appointmentType}</td>
                <td className={tableStyles.tableData}>{item.requesterName}</td>
                {/* 상태에 따라 다른 스타일 적용 */}
                <td className={`${tableStyles.tableData} ${styles[item.status.toLowerCase()]}`}>
                    {item.status}
                </td>
                <td className={tableStyles.tableData}>{item.approverName}</td>
            </>
        );
    };

    return (
        <div className={styles.pageContainer}>
            {/* --- 페이지 타이틀 --- */}
            <h2 className={styles.pageTitle}>인사 발령 관리</h2>
            
            {/* --- A. 검색 필터 영역 --- */}
            <div className={styles.filterSection}>
                <AppointmentApprovalFilter
                    searchParams={searchParams}
                    onSearchChange={handleSearchChange} // 이벤트 핸들러 전달
                    onSearchSubmit={handleSearch}     // 검색 버튼 핸들러 전달
                />
            </div>

            {/* --- B. 데이터 테이블 영역 --- */}
            <DataTable
                headers={TABLE_HEADERS}
                data={approvals}
                renderRow={renderApprovalRow}
            />

            {/* --- D. 페이지네이션 (이미지 참고) --- */}
            <div className={styles.pagination}>
                <button>&lt;</button>
                <span>1</span>
                <button>&gt;</button>
            </div>

            {/* --- C. 액션 버튼 영역 (이미지 참고) --- */}
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