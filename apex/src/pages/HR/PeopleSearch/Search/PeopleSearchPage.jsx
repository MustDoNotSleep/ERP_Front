import React, { useState } from 'react';
// 페이지 및 테이블 스타일
import styles from "./PeopleSearchPage.module.css"; 
import tableStyles from "../../../../components/common/DataTable.module.css";

// 공통 컴포넌트
import DataTable from '../../../../components/common/DataTable';
import PeopleSearchFilter from '../../../../components/HR/PeopleSearch/PeopleSearchFilter.jsx';
// 목 데이터
import { EMPLOYEE_SEARCH_MOCK_DATA } from '../../../../models/data/PeopleSearchMock.js';

const TABLE_HEADERS = [
    '사번', '이름', '소속', '직급', '이메일', '내선번호'
];

const PeopleSearchPage = () => {
    
    // 테이블에 표시될 직원 목록 상태
    // eslint-disable-next-line no-unused-vars
    const [employees, setEmployees] = useState(EMPLOYEE_SEARCH_MOCK_DATA);
    
    // 검색 필터 상태
    const [searchParams, setSearchParams] = useState({
        name: ' ',          // 이미지의 기본값
        employeeId: ' ', // 이미지의 기본값
        position: '전체',       // 이미지의 기본값
        department: '전체',   // 이미지의 기본값
    });

    // --- 핸들러 함수 ---

    // 검색 필터 값 변경 핸들러 
    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    // '조회' 버튼 클릭 핸들러
    const handleSearch = () => {
        console.log('검색 시작', searchParams);
        // TODO: searchParams를 기반으로 API 호출
        // 예: setEmployees(apiResult);
    };
    
    // 테이블 행 렌더링 함수
    const renderEmployeeRow = (employee) => { 
        return (
            <>
                <td className={tableStyles.tableData}>{employee.employeeId}</td>
                <td className={tableStyles.tableData}>{employee.name}</td>
                <td className={tableStyles.tableData}>{employee.department}</td>
                <td className={tableStyles.tableData}>{employee.position}</td>
                <td className={tableStyles.tableData}>{employee.email}</td>
                <td className={tableStyles.tableData}>{employee.extension}</td>
            </>
        );
    };

    return (
        <div className={styles.pageContainer}>
            
            {/* --- A. 검색 필터 영역 --- */}
            <div className={styles.filterSection}>
                <PeopleSearchFilter
                    searchParams={searchParams}
                    onSearchChange={handleSearchChange} 
                    onSearchSubmit={handleSearch}       
                />
            </div>

            {/* --- B. 데이터 테이블 영역 --- */}
            <DataTable
                headers={TABLE_HEADERS}
                data={employees}
                renderRow={renderEmployeeRow}
            />

            {/* --- C. 페이지네이션 영역 (이미지에 있지만 템플릿에 없음) --- */}
            
            {/* --- D. 액션 버튼 영역 (템플릿에 있지만 이미지에 없음) --- */}
        </div>
    );
};

export default PeopleSearchPage;