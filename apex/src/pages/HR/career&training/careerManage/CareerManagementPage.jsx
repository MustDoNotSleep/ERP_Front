import React, { useState, useEffect } from 'react';
import styles from "./CareerManagementPage.module.css"
import CareerSearchFilter from '../../../../components/HR/career&edu/careerManage/CareerSearchFilter.jsx';
import DataTable from '../../../../components/common/DataTable';
import tableStyles from '../../../../components/common/DataTable.module.css'; 
import { FaSearch } from "react-icons/fa";
import axios from 'axios'; // 1. axios import

// 2. API URL
const API_URL = 'https://xtjea0rsb6.execute-api.ap-northeast-2.amazonaws.com/dev/erp-workexperience';

// 3. MOCK 데이터 관련 코드 모두 삭제

const EMPLOYEE_TABLE_HEADERS = [
    '사번', '이름', '직급', '직급근속', '인사발령이력', '자격증', '어학성적', <FaSearch/>
];

const CareerManagementPage = () => {
    // 4. (✅ 핵심 수정 1)
    // CareerSearchFilter의 name 속성('name', 'employeeId', 'department', 'team')과
    // state의 키(key)를 정확히 일치시킵니다.
    const [searchParams, setSearchParams] = useState({
        name: '',
        employeeId: '',
        department: '',
        team: ''
    });
    
    // 5. MOCK 데이터 대신 빈 배열[]로 state 초기화
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(false); 

    // 6. 데이터 조회 함수 (변경 없음)
    const fetchData = async (params = {}) => {
        setIsLoading(true);
        console.log("🚀 API 요청 파라미터:", params); // 어떤 조건으로 검색하는지 확인
        try {
            const response = await axios.get(API_URL, { params });
            setEmployees(response.data); 
        } catch (error) {
            console.error("❌ 경력 데이터 조회 실패:", error);
            alert("데이터를 불러오는 데 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    // 7. 페이지 첫 로드 시 전체 목록 조회 (변경 없음)
    useEffect(() => {
        fetchData();
    }, []); 

    // 8. (✅ 핵심 수정 2)
    // CareerSearchFilter에서 (name, value)를 받아 state를 업데이트하는 함수
    const handleSearchChange = (name, value) => {
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    // 9. (✅ 핵심 수정 3)
    // '조회' 버튼 클릭 시 fetchData를 호출하는 함수
    const handleSearch = () => {
        console.log('🐥 API 검색 시작!', searchParams);
        fetchData(searchParams); // state에 저장된 searchParams로 API 호출
    };

    // 상세 보기 핸들러 (변경 없음)
    const handleViewDetail = (employeeId) => {
        console.log(`사번 ${employeeId}의 상세 경력 정보 보기`);
        // TODO: 상세 모달/페이지 이동 로직
    };
    
    // 10. 테이블 행 렌더링 함수 (변경 없음)
    // (API가 'position', 'years' 등을 모두 보내준다고 가정)
    const renderEmployeeRow = (employee) => { 
        return (
            <>
                <td className={tableStyles.tableData}>{employee.employeeId}</td>
                <td className={tableStyles.tableData}>{employee.name}</td>
                <td className={tableStyles.tableData}>{employee.position}</td>
                <td className={tableStyles.tableData}>{employee.years}</td>
                <td className={tableStyles.tableData}>{employee.appt}</td>
                <td className={tableStyles.tableData}>{employee.cert}</td>
                <td className={tableStyles.tableData}>{employee.lang}</td>
                <td className={tableStyles.tableAction}>
                    <button 
                        className={tableStyles.viewButton}
                        onClick={() => handleViewDetail(employee.employeeId)}
                    >
                        <FaSearch />
                    </button>
                </td>
            </>
        );
    };

    return (
        <div className={styles.pageContainer}>
            {/* 1. 검색 필터 (이제 정상 작동) */}
            <CareerSearchFilter 
                searchParams={searchParams}
                onSearchChange={handleSearchChange} // ✅ 구현된 함수 연결
                onSearchSubmit={handleSearch}       // ✅ 구현된 함수 연결
            />
            
            {/* 2. 로딩 및 데이터 없음 UI */}
            {isLoading && <p>데이터를 불러오는 중입니다...</p>}

            {!isLoading && employees.length > 0 && (
                <DataTable
                    headers={EMPLOYEE_TABLE_HEADERS}
                    data={employees}            
                    renderRow={renderEmployeeRow} 
                />
            )}

            {!isLoading && employees.length === 0 && (
                <div className={styles.noDataMessage}>조회된 데이터가 없습니다.</div>
            )}
        </div>
    );
};

export default CareerManagementPage;