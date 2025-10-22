import React, { useState, useEffect } from 'react';
// 페이지 및 테이블 스타일
import styles from "./PeopleSearchPage.module.css"; 
import tableStyles from "../../../../components/common/DataTable.module.css";

// 공통 컴포넌트
import DataTable from '../../../../components/common/DataTable';
import PeopleSearchFilter from '../../../../components/HR/PeopleSearch/PeopleSearchFilter.jsx';

// 1. ✨ 기존에 사용하시던 MOCK 데이터 파일을 import 합니다.
import { EMPLOYEE_SEARCH_MOCK_DATA } from '../../../../models/data/PeopleSearchMock.js';


const API_BASE_URL = 'https://xtjea0rsb6.execute-api.ap-northeast-2.amazonaws.com/dev';

// 2. ✨ "마법 스위치"를 만듭니다.
// true로 설정하면 MOCK 데이터를, false로 설정하면 실제 API를 호출합니다.
const USE_MOCK_DATA = true;


const TABLE_HEADERS = [
    '사번', '이름', '소속', '직급', '이메일', '내선번호'
];

const PeopleSearchPage = () => {
    
    // 테이블에 표시될 직원 목록 상태
    const [employees, setEmployees] = useState([]);
    
    // API로 가져올 직급/팀 목록
    const [positions, setPositions] = useState([]);
    const [teams, setTeams] = useState([]);
    
    // 로딩 상태
    const [isLoading, setIsLoading] = useState(false);
    
    // 검색 필터 상태 (필드명 통일)
    const [searchParams, setSearchParams] = useState({
        name: '',
        employeeId: '',
        positionName: '',
        teamName: '',
    });

    // --- 초기 데이터 로드 (직급/팀 목록) ---
    // (이 부분은 필터 옵션을 위한 것이므로 Mocking하지 않고 그대로 둡니다.)
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // 직급 목록 조회
                const positionsRes = await fetch(`${API_BASE_URL}/get?type=positions`);
                const positionsData = await positionsRes.json();
                if (positionsData.data) {
                    setPositions(positionsData.data);
                }

                // 부서(팀) 목록 조회
                const departmentsRes = await fetch(`${API_BASE_URL}/get?type=departments`);
                const departmentsData = await departmentsRes.json();
                if (departmentsData.data) {
                    const uniqueTeams = [...new Set(departmentsData.data.map(dept => dept.teamName))];
                    setTeams(uniqueTeams);
                }
            } catch (error) {
                console.error('초기 데이터 로드 실패:', error);
                alert('직급/팀 목록을 불러오는 데 실패했습니다.');
            }
        };

        // ✨ Mock 데이터를 사용하더라도, 페이지가 처음 로드될 때
        // '조회' 버튼을 누른 것처럼 Mock 데이터를 한 번 불러옵니다.
        handleSearch();
        
        // 필터 옵션은 실제 API에서 가져옵니다.
        fetchInitialData();
    }, []);

    // --- 핸들러 함수 ---

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    // 3. ✨ (핵심) '조회' 버튼 클릭 핸들러 수정
    const handleSearch = async () => {
        console.log('검색 시작', searchParams);
        setIsLoading(true);

        const cleanedParams = {
            name: searchParams.name.trim().toLowerCase(),
            employeeId: searchParams.employeeId.trim(), // 사번은 대소문자 구분이 필요 없을 수 있습니다.
            positionName: searchParams.positionName,
            teamName: searchParams.teamName,
        };

        // "마법 스위치"가 켜져 있으면...
        if (USE_MOCK_DATA) {
            console.log("🛠️ MOCK 데이터를 사용합니다.");
            // 실제 API처럼 0.5초의 딜레이를 줍니다.
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const filteredEmployees = EMPLOYEE_SEARCH_MOCK_DATA.filter(employee => {
                const nameMatch = !cleanedParams.name || employee.name.toLowerCase().includes(cleanedParams.name);
                // 사번은 정확한 일치 또는 시작하는 문자열 일치 (includes)
                const idMatch = !cleanedParams.employeeId || String(employee.employeeId).includes(cleanedParams.employeeId);
                // 직급은 정확히 일치 (positionName)
                const positionMatch = !cleanedParams.positionName || employee.position === cleanedParams.positionName;
                // 소속은 정확히 일치 (teamName)
                const teamMatch = !cleanedParams.teamName || employee.department === cleanedParams.teamName;

                return nameMatch && idMatch && positionMatch && teamMatch;
            });

            // MOCK 데이터로 상태를 업데이트합니다.
            setEmployees(filteredEmployees);
            setIsLoading(false);
            return; // 여기서 함수를 종료합니다.
        }

        // --- (이하 코드는 "마법 스위치"가 꺼져 있을 때만 실행됩니다.) ---
        console.log("🚀 실제 API를 호출합니다.");
        try {
            const params = new URLSearchParams();
            if (searchParams.name) params.append('name', searchParams.name);
            if (searchParams.employeeId) params.append('employeeId', searchParams.employeeId);
            if (searchParams.positionName) params.append('positionName', searchParams.positionName);
            if (searchParams.teamName) params.append('teamName', searchParams.teamName);

            const token = localStorage.getItem('token');

            const response = await fetch(`${API_BASE_URL}/employees?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.employees) {
                setEmployees(data.employees);
            } else {
                setEmployees([]);
            }
        } catch (error) {
            console.error('직원 조회 실패:', error);
            alert('직원 정보를 조회하는 데 실패했습니다.');
            setEmployees([]);
        } finally {
            setIsLoading(false);
        }
    };
    
    // 4. ✨ (핵심) 테이블 행 렌더링 함수를 MOCK 데이터의 키(key)에 맞게 수정
    const renderEmployeeRow = (employee) => { 
        return (
            <>
                {/* MOCK 데이터의 키를 사용합니다. */}
                <td className={tableStyles.tableData}>{employee.employeeId}</td>
                <td className={tableStyles.tableData}>{employee.name}</td>
                <td className={tableStyles.tableData}>{employee.department || '-'}</td> {/* 소속 */}
                <td className={tableStyles.tableData}>{employee.position || '-'}</td>   {/* 직급 */}
                <td className={tableStyles.tableData}>{employee.email}</td>
                <td className={tableStyles.tableData}>{employee.extension || '-'}</td> {/* 내선번호 */}
            </>
        );
    };

    return (
        <div className={styles.pageContainer}>
            
            <div className={styles.filterSection}>
                <PeopleSearchFilter
                    searchParams={searchParams}
                    onSearchChange={handleSearchChange} 
                    onSearchSubmit={handleSearch}
                    positions={positions}
                    teams={teams}
                />
            </div>

            {isLoading && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    로딩 중...
                </div>
            )}

            {!isLoading && (
                <DataTable
                    headers={TABLE_HEADERS}
                    data={employees}
                    renderRow={renderEmployeeRow}
                />
            )}
        </div>
    );
};

export default PeopleSearchPage;
