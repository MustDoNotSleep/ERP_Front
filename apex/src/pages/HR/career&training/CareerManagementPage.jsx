import React, { useState, useEffect } from 'react'; // 1. useEffect 추가
import styles from "./CareerManagementPage.module.css"
import CareerSearchFilter from '../../../components/HR/career&edu/CareerSearchFilter.jsx';
import DataTable from '../../../components/common/DataTable.jsx';
import tableStyles from '../../../components/common/DataTable.module.css'; 
import { FaSearch } from "react-icons/fa";
import axios from 'axios'; // 2. axios 추가

// 3. MOCK 데이터 import 삭제
// import { EMPLOYEE_LIST_MOCK_DATA } from '../../../models/data/EmployeeMOCK.js';

// 4. API URL 정의
const API_URL = 'https://xtjea0rsb6.execute-api.ap-northeast-2.amazonaws.com/dev/erp-workexperience';

// 테이블 헤더 (변경 없음)
const EMPLOYEE_TABLE_HEADERS = [
    '사번', '이름', '직급', '직급근속', '인사발령이력', '자격증', '어학성적', <FaSearch/>
];

// 5. MOCK 데이터를 만들던 임시 함수 삭제
// const getCareerDataForTable = (employeeId) => { ... };

const CareerManagementPage = () => {
    // 6. 검색 파라미터 state 정의 (필터 컴포넌트에 맞게 초기화)
    const [searchParams, setSearchParams] = useState({
        name: '',
        employeeId: '',
        department: '',
        team: ''
        // (CareerSearchFilter에 있는 다른 필드들)
    });
    
    // 7. MOCK 데이터 대신 빈 배열[]로 state 초기화
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // 8. 로딩 상태 추가

    // 9. (핵심) 데이터 조회 함수
    const fetchData = async (params = {}) => {
        setIsLoading(true);
        try {
            // API로 GET 요청 (검색 파라미터 포함)
            const response = await axios.get(API_URL, { params });
            setEmployees(response.data); // 서버에서 받은 데이터로 상태 업데이트
        } catch (error) {
            console.error("❌ 경력 데이터 조회 실패:", error);
            alert("데이터를 불러오는 데 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    // 10. (핵심) 페이지가 처음 렌더링될 때 전체 목록 조회
    useEffect(() => {
        fetchData(); // (params 없이) 전체 목록을 불러옵니다.
    }, []); // 빈 배열[]: "페이지 로드 시 딱 한 번만 실행"

    // 11. (핵심) 검색 필터 변경 핸들러 구현
    // (CareerSearchFilter가 (name, value)를 직접 전달한다고 가정)
    const handleSearchChange = (name, value) => {
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    // 12. (핵심) 검색 버튼 클릭 핸들러 수정
    const handleSearch = () => {
        console.log('🐥 API 검색 시작!', searchParams);
        fetchData(searchParams); // 검색 조건(searchParams)을 넣어서 조회
    };

    // 상세 보기 핸들러 (변경 없음, TODO는 유효)
    const handleViewDetail = (employeeId) => {
        console.log(`사번 ${employeeId}의 상세 경력 정보 보기`);
        // TODO: 상세 모달/페이지 이동 로직
        // (아마도 '.../erp-workexperience/{employeeId}' 같은 다른 API 호출이 필요)
    };
    
    // 13. (핵심) 테이블 행 렌더링 함수 수정
    const renderEmployeeRow = (employee) => { 
        // ❌ MOCK 함수 호출 삭제: const career = getCareerDataForTable(employee.employeeId);
        
        // ⬇️ API가 'position', 'years' 등을 'employee' 객체에 모두 담아준다고 가정
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
            {/* 1. 검색 필터 (변경 없음) */}
            <CareerSearchFilter 
                searchParams={searchParams}
                onSearchChange={handleSearchChange}
                onSearchSubmit={handleSearch}
            />
            
            {/* 14. 로딩 및 데이터 없음 UI 추가 */}
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

            {/* 3. 페이지네이션 (변경 없음) */}
            {/* ... */}
        </div>
    );
};

export default CareerManagementPage;