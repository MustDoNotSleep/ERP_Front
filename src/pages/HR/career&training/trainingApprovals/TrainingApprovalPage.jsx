import React, { useState } from 'react';
import styles from "./TrainingApprovalPage.module.css"
import tableStyles from "../../../../components/common/DataTable.module.css";
import DataTable from '../../../../components/common/DataTable';
import { TRAINING_APPROVAL_LIST_MOCK } from '../../../../models/data/TrainingMOCK';
import TrainingApprovalFilter from '../../../../components/HR/career&edu/careerApproval/TrainingApprovalFilter';

const TABLE_HEADERS = [
    '선택', '신청일자', '사번', '이름', '부서', '직급', '교육명', '상태'
];

const TrainingApprovalPage = () => {
    
    const [approvals, setApprovals] = useState(TRAINING_APPROVAL_LIST_MOCK);
    const [selectedRows, setSelectedRows] = useState([]);
    
    // 검색 필터 상태
    const [searchParams, setSearchParams] = useState({
        departmentId: '', positionId: '', courseName: '', applicationDate: '', approvalStatus: '',
    });

    // --- 핸들러 함수 ---
    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        console.log('🐥 검색 시작!', searchParams);
        // TODO: API 호출 로직
    };
    
    // (내용 채움)
    const handleRowSelect = (id) => {
        setSelectedRows(prev => 
            prev.includes(id) 
                ? prev.filter(rowId => rowId !== id) 
                : [...prev, id]
        );
    };

    // (내용 채움)
    const handleAction = (action) => {
        console.log(`🚀 ${action} 처리:`, selectedRows);
        // TODO: API 호출 로직
        setSelectedRows([]); // 처리 후 선택 해제
    };

    // 3. 테이블 행 렌더링 로직
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

            {/* --- B. 데이터 테이블 영역 --- */}
            <DataTable
                headers={TABLE_HEADERS}
                data={approvals}
                renderRow={renderApprovalRow}
            />

            {/* --- C. 액션 버튼 영역 --- */}
            <div className={styles.buttonGroup}>
                <button 
                    onClick={() => handleAction('반려')} 
                    className={styles.rejectButton} 
                >
                    반려
                </button>
                {/* (잘린 부분 복구) */}
                <button 
                    onClick={() => handleAction('승인')} 
                    className={styles.approveButton} 
                >
                    승인
                </button>
            </div>
        </div>
    );
};

// ⬇️ 이게 없어서 발생한 오류입니다!
export default TrainingApprovalPage;