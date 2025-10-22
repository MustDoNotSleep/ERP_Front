import React, { useState, useEffect } from 'react';
// 페이지 및 테이블 스타일
import styles from "./PeopleSearchPage.module.css"; 
import tableStyles from "../../../../components/common/DataTable.module.css";

// 공통 컴포넌트
import DataTable from '../../../../components/common/DataTable';
import PeopleSearchFilter from '../../../../components/HR/PeopleSearch/PeopleSearchFilter.jsx';

const API_BASE_URL = 'https://xtjea0rsb6.execute-api.ap-northeast-2.amazonaws.com/dev';

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
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // 1. 직급 목록 조회
                const positionsRes = await fetch(`${API_BASE_URL}/get?type=positions`);
                const positionsData = await positionsRes.json();
                if (positionsData.data) {
                    setPositions(positionsData.data);
                }

                // 2. 부서(팀) 목록 조회
                const departmentsRes = await fetch(`${API_BASE_URL}/get?type=departments`);
                const departmentsData = await departmentsRes.json();
                if (departmentsData.data) {
                    // teamName만 추출 (중복 제거)
                    const uniqueTeams = [...new Set(departmentsData.data.map(dept => dept.teamName))];
                    setTeams(uniqueTeams);
                }

                
            } catch (error) {
                console.error('초기 데이터 로드 실패:', error);
                alert('직급/팀 목록을 불러오는 데 실패했습니다.');
            }
        };

        fetchInitialData();
    }, []);

    // --- 핸들러 함수 ---

    // 검색 필터 값 변경 핸들러 
    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    // '조회' 버튼 클릭 핸들러
    const handleSearch = async () => {
        console.log('검색 시작', searchParams);
        setIsLoading(true);

        try {
            // 쿼리 파라미터 생성 (빈 값 제외)
            const params = new URLSearchParams();
            if (searchParams.name) params.append('name', searchParams.name);
            if (searchParams.employeeId) params.append('employeeId', searchParams.employeeId);
            if (searchParams.positionName) params.append('positionName', searchParams.positionName);
            if (searchParams.teamName) params.append('teamName', searchParams.teamName);

            // JWT 토큰 가져오기 (localStorage 또는 sessionStorage에서)
            const token = localStorage.getItem('token'); // 또는 적절한 방법으로 토큰 관리
            console.log('🌐 API 호출 URL:', API_BASE_URL);

            console.log('🔑 토큰 존재 여부:', !!token);

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
    
    // 테이블 행 렌더링 함수
    const renderEmployeeRow = (employee) => { 
        return (
            <>
                <td className={tableStyles.tableData}>{employee.employeeId}</td>
                <td className={tableStyles.tableData}>{employee.name}</td>
                <td className={tableStyles.tableData}>{employee.teamName || '-'}</td>
                <td className={tableStyles.tableData}>{employee.positionName || '-'}</td>
                <td className={tableStyles.tableData}>{employee.email}</td>
                <td className={tableStyles.tableData}>{employee.internalNumber || '-'}</td>
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
                    positions={positions}
                    teams={teams}
                />
            </div>

            {/* --- B. 로딩 표시 --- */}
            {isLoading && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    로딩 중...
                </div>
            )}

            {/* --- C. 데이터 테이블 영역 --- */}
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