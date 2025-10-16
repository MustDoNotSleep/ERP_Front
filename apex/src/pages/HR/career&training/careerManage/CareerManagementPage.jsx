import React, { useState } from 'react';
import styles from "./CareerManagementPage.module.css"
import CareerSearchFilter from '../../../../components/HR/career&edu/careerManage/CareerSearchFilter.jsx';
// import Pagination from '../components/common/Pagination'; 
import DataTable from '../../../../components/common/DataTable';
import tableStyles from '../../../../components/common/DataTable.module.css'; 
import { FaSearch } from "react-icons/fa";
import { EMPLOYEE_LIST_MOCK_DATA } from '../../../../models/Employee.js';

// 1. 테이블 헤더 정의 (DataTable에 전달할 값)
const EMPLOYEE_TABLE_HEADERS = [
    '사번', '이름', '직급', '직급근속', '인사발령이력', '자격증', '어학성적', <FaSearch/>
];

// 💡 임시 함수: Full Data에서 테이블에 필요한 경력 상세 정보를 추출/변환합니다.
// 실제 애플리케이션에서는 백엔드의 JOIN 쿼리나 별도 API 호출로 대체됩니다.
const getCareerDataForTable = (employeeId) => {
    switch (employeeId) {
        case 12345: return { position: '수석', years: '4년 8개월', appt: '승진', cert: '정보보안기사', lang: 'TOEIC 900점' };
        case 12346: return { position: '사원', years: '1년 3개월', appt: '신규입사', cert: '-', lang: '-' };
        case 12347: return { position: '대리', years: '2년 1개월', appt: '승진', cert: 'ADsP', lang: 'HSK 4급' };
        case 12348: return { position: '선임', years: '3년 1개월', appt: '직무변경', cert: 'CPA', lang: 'OPic IM3' };
        default: return { position: '미정', years: '-', appt: '-', cert: '-', lang: '-' };
    }
};

const CareerManagementPage = () => {
    const [searchParams, setSearchParams] = useState({ /* ... */ });
    const [employees] = useState(EMPLOYEE_LIST_MOCK_DATA); 

    const handleSearchChange = (name, value) => { /* ... */ };
    const handleSearch = () => { console.log('🐥 검색 시작!', searchParams); };
    const handleViewDetail = (employeeId) => {
        console.log(`사번 ${employeeId}의 상세 경력 정보 보기`);
        // TODO: 상세 모달/페이지 이동 로직
    };
    
    const renderEmployeeRow = (employee) => { 
        const career = getCareerDataForTable(employee.employeeId);
        return (
            <>
                <td className={tableStyles.tableData}>{employee.employeeId}</td>
                <td className={tableStyles.tableData}>{employee.name}</td>
                <td className={tableStyles.tableData}>{career.position}</td>
                <td className={tableStyles.tableData}>{career.years}</td>
                <td className={tableStyles.tableData}>{career.appt}</td>
                <td className={tableStyles.tableData}>{career.cert}</td>
                <td className={tableStyles.tableData}>{career.lang}</td>
                
                <td className={tableStyles.tableAction}>
                    <button 
                        className={tableStyles.viewButton}
                        onClick={() => handleViewDetail(employee.employeeId)} // 🔥 카멜 케이스
                    >
                        <FaSearch />
                    </button>
                </td>
            </>
        );
    };


    return (
        <div className={styles.pageContainer}>
            {/* 1. 검색 필터 컴포넌트 */}
            <CareerSearchFilter 
                searchParams={searchParams}
                onSearchChange={handleSearchChange}
                onSearchSubmit={handleSearch}
            />
            
            {/* 2. 직원 목록 테이블 (DataTable 컴포넌트 사용) */}
            <DataTable
                headers={EMPLOYEE_TABLE_HEADERS} // 헤더 목록 전달
                data={employees}             // 데이터 목록 전달
                renderRow={renderEmployeeRow}  // 행을 어떻게 그릴지 함수 전달 (핵심!)
            />

            {/* 3. 페이지네이션 컴포넌트 */}
            {/* <Pagination 
                currentPage={1} 
                totalPages={5} 
                onPageChange={(page) => console.log('페이지 이동:', page)} 
            /> */}
        </div>
    );
};

export default CareerManagementPage;