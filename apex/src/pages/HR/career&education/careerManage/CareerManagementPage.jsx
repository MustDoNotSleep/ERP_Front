import React, { useState } from 'react';
import styles from "./CareerManagementPage.module.css"
import CareerSearchFilter from '../../../../components/HR/career&edu/CarrerSearch/CareerSearchFilter'; 
// import Pagination from '../components/common/Pagination'; 
import DataTable from '../../../../components/common/DataTable';

// 1. 테이블 헤더 정의 (DataTable에 전달할 값)
const EMPLOYEE_TABLE_HEADERS = [
    '사번', '이름', '직급', '직급근속', '인사발령이력', '자격증', '어학성적', 'Q'
];

const CareerManagementPage = () => {
    
    // (A) 상태 정의 (이전과 동일)
    const [searchParams, setSearchParams] = useState({ /* ... */ });
    const [employees] = useState([
        { 사번: 12345, 이름: '김선수', 직급: '수석', 직급근속: '4년 8개월', 인사발령이력: '승진', 자격증: '정보보안기사', 어학성적: 'TOEIC 900점' },
        { 사번: 12346, 이름: '최사원', 직급: '사원', 직급근속: '1년 3개월', 인사발령이력: '신규입사', 자격증: '-', 어학성적: '-' },
        { 사번: 12347, 이름: '윤대리', 직급: '대리', 직급근속: '2년 1개월', 인사발령이력: '승진', 자격증: 'ADsP', 어학성적: 'HSK 4급' },
        { 사번: 12348, 이름: '홍선임', 직급: '선임', 직급근속: '3년 1개월', 인사발령이력: '직무변경', 자격증: 'CPA', 어학성적: 'OPic IM3' },
    ]);

    // (B) 핸들러 함수 정의 (이전과 동일)
    const handleSearchChange = (name, value) => { /* ... */ };
    const handleSearch = () => { console.log('🐥 검색 시작!', searchParams); };
    const handleViewDetail = (employeeId) => {
        console.log(`사번 ${employeeId}의 상세 경력 정보 보기`);
        // TODO: 상세 모달/페이지 이동 로직
    };
    
    // (C) 경력 데이터에 특화된 행 렌더링 함수 정의
    const renderEmployeeRow = (employee) => { 
        return (
            <>
                <td className="tableData">{employee.사번}</td>
                <td className="tableData">{employee.이름}</td>
                <td className="tableData">{employee.직급}</td>
                <td className="tableData">{employee.직급근속}</td>
                <td className="tableData">{employee.인사발령이력}</td>
                <td className="tableData">{employee.자격증}</td>
                <td className="tableData">{employee.어학성적}</td>
                <td className="tableAction">
                    <button 
                        className="viewButton"
                        onClick={() => handleViewDetail(employee.사번)}
                    >
                        🔍
                    </button>
                </td>
            </>
        );
    };


    return (
        <div className={styles.pageContainer}>
            <h2 className={styles.pageTitle}>경력 관리</h2>
            
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