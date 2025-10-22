import React, { useState, useEffect } from 'react'; // 1. useEffect 추가
import styles from "./CareerManagementPage.module.css"
import CareerSearchFilter from '../../../components/HR/career&edu/CareerSearchFilter.jsx';
import DataTable from '../../../components/common/DataTable.jsx';
import tableStyles from '../../../components/common/DataTable.module.css'; 
import { FaSearch } from "react-icons/fa";
import axios from 'axios'; // 2. axios 추가

// 3. MOCK 데이터 import 삭제
import { EMPLOYEE_LIST_MOCK_DATA } from '../../../models/data/EmployeeMOCK.js';

const MOCK_DEPARTMENTS = [
    { value: '101', name: '경영지원본부' },
    { value: '102', name: '기술연구소' },
    { value: '103', name: '영업본부' },
];

const MOCK_TEAMS = [
    { value: '개발팀', name: '개발팀' },
    { value: '인사팀', name: '인사팀' },
    { value: '마케팅팀', name: '마케팅팀' },
];

// 4. ✨ "마법 스위치"를 만듭니다.
// true로 설정하면 MOCK 데이터를, false로 설정하면 실제 API를 호출합니다.
const USE_MOCK_DATA = true;

// 5. API URL 정의
const API_URL = 'https://xtjea0rsb6.execute-api.ap-northeast-2.amazonaws.com/dev/erp-workexperience';

// 테이블 헤더 (변경 없음)
const EMPLOYEE_TABLE_HEADERS = [
    '사번', '이름', '직급', '직급근속', '인사발령이력', '자격증', '어학성적', <FaSearch/>
];

// 6. MOCK 데이터를 만들던 임시 함수 삭제
const getCombinedMockData = () => {
    return EMPLOYEE_LIST_MOCK_DATA.map(employee => {
        // MOCK_CAREER_DATA_MAP은 EmployeeMOCK.js에 사번을 키로 하는 경력 데이터라고 가정합니다.
        // 사번 끝자리(임시로)나 이름으로 임의의 경력 데이터를 생성
        const lastDigit = employee.employeeId % 10;

        // 사번이 짝수/홀수 등에 따라 경력 데이터를 임의로 부여
        const years = lastDigit % 2 === 0 ? '3년' : '1년';
        const apptCount = lastDigit % 4; // 발령 0~3회
        const certCount = lastDigit % 3; // 자격증 0~2개
        const languageScore = lastDigit > 2 ? 'TOEIC 850' : 'N/A';
        
        // 현재 MOCK 데이터에 'position' 필드가 없으므로, 임시로 'positionId'를 기반으로 직급을 부여합니다.
        // 실제 API 데이터에는 'position' 필드가 있을 것으로 예상됩니다.
        let positionName = '사원';
        if (employee.positionId === 10) positionName = '부장';
        else if (employee.positionId === 8) positionName = '대리';
        else if (employee.positionId === 7) positionName = '선임';
        return {
            ...employee, // 사번, 이름 등 기본 정보
            // 경력 정보 필드 추가 (API 응답 형태를 MOCK 데이터로 재현)
            position: positionName, // 임시 직급명
            years: years,           // 임시 직급근속
            appt: apptCount,        // 임시 인사발령이력 횟수
            cert: certCount,        // 임시 자격증 횟수
            lang: languageScore     // 임시 어학성적
        };
    });
};
// 7. MOCK 데이터를 필터링하는 로직 (검색 기능)
const filterCombinedMockData = (data, params) => {
    const nameQuery = params.name?.trim().toLowerCase();
    const idQuery = params.employeeId?.trim();
    const deptQuery = params.department?.trim();
    const teamQuery = params.team?.trim();

    return data.filter(item => {
        const nameMatch = !nameQuery || item.name.toLowerCase().includes(nameQuery);
        const idMatch = !idQuery || item.employeeId.includes(idQuery);
        
        // 부서/팀 필터링 (MOCK 데이터의 키에 맞게 조정 필요)
        const departmentMatch = !deptQuery || (item.departmentName || item.department || '').includes(deptQuery); 
        const teamMatch = !teamQuery || (item.teamName || item.team || '').includes(teamQuery);

        return nameMatch && idMatch && departmentMatch && teamMatch;
    });
};

const CareerManagementPage = () => {
    const [searchParams, setSearchParams] = useState({
        name: '',
        employeeId: '',
        department: '',
        team: ''
        // (CareerSearchFilter에 있는 다른 필드들)
    });
    
    // 9. MOCK 데이터 대신 빈 배열[]로 state 초기화
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // 10. 로딩 상태 추가

    const [departments, setDepartments] = useState([]);
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        // 필터 옵션 로드
        if (USE_MOCK_DATA) {
            // Mock 데이터를 사용하여 옵션 설정
            setDepartments(MOCK_DEPARTMENTS);
            setTeams(MOCK_TEAMS);
        } else {
            // TODO: 실제 API를 호출하여 부서/팀 목록을 가져오는 로직 (생략)
            // fetchFilterOptions();
        }
        
        // 페이지 로드 시 전체 목록 조회 (기존 로직 유지)
        fetchData(); 
    }, []);

    // 11. (핵심) 데이터 조회 함수
    const fetchData = async (params = {}) => {
        setIsLoading(true);
        // ✨ MOCK 데이터 사용 시 로직 ✨
        if (USE_MOCK_DATA) {
            console.log("🛠️ MOCK 데이터를 사용하여 경력 목록 조회/필터링");
            await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 딜레이
            
            // 전체 MOCK 데이터를 가져와서 필터링
            const combinedData = getCombinedMockData();
            const filteredData = filterCombinedMockData(combinedData, params);
            
            setEmployees(filteredData);
            setIsLoading(false);
            return;
        }

        // 🚀 실제 API 사용 시 로직
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

    // 12. (핵심) 페이지가 처음 렌더링될 때 전체 목록 조회
    useEffect(() => {
        fetchData(); // (params 없이) 전체 목록을 불러옵니다.
    }, []); // 빈 배열[]: "페이지 로드 시 딱 한 번만 실행"

    // 13. (핵심) 검색 필터 변경 핸들러 구현
    // (CareerSearchFilter가 (name, value)를 직접 전달한다고 가정)
    const handleSearchChange = (name, value) => {
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    // 14. (핵심) 검색 버튼 클릭 핸들러 수정
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
                departments={departments} // 추가!
                teams={teams}
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