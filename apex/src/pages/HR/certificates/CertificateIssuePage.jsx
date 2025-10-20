import React, { useState } from 'react';
import styles from "./CertificateIssuePage.module.css";
import tableStyles from "../../../components/common/DataTable.module.css"; 
import DataTable from '../../../components/common/DataTable';
import CertificateIssueFilter from '../../../components/HR/certificate/CertificateIssueFilter';

// ✨ 목 데이터 임포트
import { CERTIFICATE_ISSUE_MOCK } from '../../../models/data/CertificateIssueMOCK';

// 1. 테이블 헤더 정의
const TABLE_HEADERS = [
    '선택', '신청일자', '사번', '이름', '증명서', '부수', '발급일자', '상태'
];

const CertificateIssuePage = () => {
    
    const [requests, setRequests] = useState(CERTIFICATE_ISSUE_MOCK);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchParams, setSearchParams] = useState({
        employeeName: '', employeeId: '', certificateType: '', 
        applicationDate: '', issueStatus: '',
    });

    // --- 핸들러 함수 ---
    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        console.log('🐥 증명서 조회 시작!', searchParams);
        // TODO: API 호출 로직
    };
    
    const handleRowSelect = (id) => {
        setSelectedRows(prev => 
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    // 액션 핸들러 (반려, 승인)
    const handleAction = (action) => {
        if (selectedRows.length === 0) {
            alert('선택된 항목이 없습니다.');
            return;
        }
        console.log(`Action: ${action}, Selected IDs:`, selectedRows);
        alert(`선택된 ${selectedRows.length}건을 ${action} 처리합니다.`);
        setSelectedRows([]);
    };


    // 3. 테이블 행 렌더링 로직
    const renderRequestRow = (item) => { 
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
                <td className={tableStyles.tableData}>{item.name}</td>
                <td className={tableStyles.tableData}>{item.type}</td>
                <td className={tableStyles.tableData}>{item.count}</td>
                <td className={tableStyles.tableData}>{item.issueDate}</td>
                <td className={tableStyles.tableData}>{item.status}</td>
            </>
        );
    };


    return (
        <div className={styles.pageContainer}>            
            {/* --- A. 검색 필터 영역 --- */}
            <div className={styles.filterSection}>
                <CertificateIssueFilter
                    searchParams={searchParams}
                    onSearchChange={handleSearchChange}
                    onSearchSubmit={handleSearch}
                />
            </div>

            {/* --- B. 데이터 테이블 영역 --- */}
            <DataTable
                headers={TABLE_HEADERS}
                data={requests}
                renderRow={renderRequestRow}
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
                    onClick={() => handleAction('승인')} 
                    className={styles.approveButton} 
                >
                    승인
                </button>
            </div>
        </div>
    );
};

export default CertificateIssuePage;