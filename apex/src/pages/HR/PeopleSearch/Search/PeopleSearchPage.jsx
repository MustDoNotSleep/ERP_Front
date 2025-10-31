import React, { useState, useEffect } from 'react';
// 페이지 및 테이블 스타일
import styles from "./PeopleSearchPage.module.css"; 
import tableStyles from "../../../../components/common/DataTable.module.css";

// 공통 컴포넌트
import DataTable from '../../../../components/common/DataTable';
import PeopleSearchFilter from '../../../../components/HR/PeopleSearch/PeopleSearchFilter.jsx';

// API 모듈 - employee만 사용
import { searchEmployees, fetchEmployees } from '../../../../api/employee';

// MOCK 데이터 (API 실패 시 fallback용)
import { EMPLOYEE_SEARCH_MOCK_DATA } from '../../../../models/data/PeopleSearchMock.js';

// ✨ "마법 스위치" - 개발 중에는 true로 설정
const USE_MOCK_DATA = false; // API 연결 시 false, MOCK 사용 시 true


const TABLE_HEADERS = [
    '사번', '이름', '소속', '직급', '이메일', '내선번호'
];

const PeopleSearchPage = () => {
    
    // 테이블에 표시될 직원 목록 상태
    const [employees, setEmployees] = useState([]);
    
    // API로 가져올 직급/팀 목록
    const [positions, setPositions] = useState([]);
    const [teams, setTeams] = useState([]);
    
    // 부서/직급 이름 → ID 매핑
    const [departmentMap, setDepartmentMap] = useState(new Map());
    const [positionMap, setPositionMap] = useState(new Map());
    
    // 로딩 상태
    const [isLoading, setIsLoading] = useState(false);
    
    // 페이지네이션 상태
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(12);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    
    // 검색 필터 상태 (백엔드 API에 맞춤: name, email, departmentId, positionId)
    const [searchParams, setSearchParams] = useState({
        name: '',
        email: '',
        employeeId: '',
        positionName: '',
        teamName: '',
    });

    // --- 초기 데이터 로드 (직원 목록에서 직급/팀 추출) ---
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setIsLoading(true);
                
                if (USE_MOCK_DATA) {
                    // MOCK 데이터에서 직급/팀 추출
                    const uniquePositions = [...new Set(EMPLOYEE_SEARCH_MOCK_DATA.map(emp => emp.position))];
                    const uniqueTeams = [...new Set(EMPLOYEE_SEARCH_MOCK_DATA.map(emp => emp.department))];
                    setPositions(uniquePositions.map(pos => ({ positionName: pos })));
                    setTeams(uniqueTeams);
                    
                    // 초기 직원 목록도 표시
                    setEmployees(EMPLOYEE_SEARCH_MOCK_DATA);
                } else {                    
                    try {
                        // 직원 목록 조회 (한 번에 모든 정보 포함)
                        const employeesData = await fetchEmployees(currentPage, pageSize);
                        // 응답 구조: { success, message, data: { content: [...], pageNumber, pageSize, totalPages, totalElements } }
                        let empList;
                        let pageInfo;
                        
                        if (employeesData.data && employeesData.data.content && Array.isArray(employeesData.data.content)) {
                            empList = employeesData.data.content;
                            pageInfo = employeesData.data;
                        } else if (employeesData.content && Array.isArray(employeesData.content)) {
                            empList = employeesData.content;
                            pageInfo = employeesData;
                        } else if (Array.isArray(employeesData)) {
                            empList = employeesData;
                            pageInfo = null;
                        } else {
                            throw new Error('Invalid response structure');
                        }
                        setEmployees(empList);
                        
                        // 페이지네이션 정보 저장
                        if (pageInfo) {
                            setTotalPages(pageInfo.totalPages || 0);
                            setTotalElements(pageInfo.totalElements || empList.length);
                    
                        }
                        
                        // 직원 목록에서 직급/팀 추출
                        const uniquePositions = [...new Set(empList.map(emp => emp.positionName || emp.position))].filter(Boolean);
                        const uniqueTeams = [...new Set(empList.map(emp => emp.teamName || emp.departmentName || emp.department))].filter(Boolean);
                        
                        setPositions(uniquePositions.map(pos => ({ positionName: pos })));
                        setTeams(uniqueTeams);
                        
                        // 부서/직급 이름 → ID 매핑 생성 (검색 시 사용)
                        const deptMap = new Map();
                        const posMap = new Map();
                        
                        empList.forEach(emp => {
                            if (emp.departmentId && emp.departmentName) {
                                deptMap.set(emp.departmentName, emp.departmentId);
                            }
                            if (emp.positionId && emp.positionName) {
                                posMap.set(emp.positionName, emp.positionId);
                            }
                        });
                        
                        setDepartmentMap(deptMap);
                        setPositionMap(posMap);
                        
                    } catch (apiError) {
                        
                        // API 실패 시 MOCK 데이터 사용
                        const uniquePositions = [...new Set(EMPLOYEE_SEARCH_MOCK_DATA.map(emp => emp.position))];
                        const uniqueTeams = [...new Set(EMPLOYEE_SEARCH_MOCK_DATA.map(emp => emp.department))];
                        setPositions(uniquePositions.map(pos => ({ positionName: pos })));
                        setTeams(uniqueTeams);
                        setEmployees(EMPLOYEE_SEARCH_MOCK_DATA);
                    }
                }
            } catch (error) {
                alert('직원 목록을 불러오는 데 실패했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- 핸들러 함수 ---

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    // 검색 조건 초기화
    const handleReset = async () => {
        setSearchParams({
            name: '',
            email: '',
            employeeId: '',
            positionName: '',
            teamName: '',
        });
        
        setCurrentPage(0); // 첫 페이지로 리셋
        setIsLoading(true);
        
        // MOCK 데이터 또는 전체 직원 목록으로 복원
        if (USE_MOCK_DATA) {
            setEmployees(EMPLOYEE_SEARCH_MOCK_DATA);
            setIsLoading(false);
        } else {
            // 실제 API로 전체 목록 다시 로드 (pageSize 사용)
            try {
                const data = await fetchEmployees(0, pageSize);
                
                let employeeList;
                let pageInfo;
                
                if (data.data && data.data.content) {
                    employeeList = data.data.content;
                    pageInfo = data.data;
                } else if (data.content) {
                    employeeList = data.content;
                    pageInfo = data;
                } else {
                    employeeList = data;
                    pageInfo = null;
                }
                
                setEmployees(employeeList);
                
                // 페이지네이션 정보 업데이트
                if (pageInfo) {
                    setTotalPages(pageInfo.totalPages || 0);
                    setTotalElements(pageInfo.totalElements || employeeList.length);
                }
            } catch (error) {
                setEmployees(EMPLOYEE_SEARCH_MOCK_DATA);
            } finally {
                setIsLoading(false);
            }
        }
    };

    // 3. ✨ (핵심) '조회' 버튼 클릭 핸들러 수정
    const handleSearch = async () => {
        setIsLoading(true);

        // 백엔드 API에 맞춰 파라미터 변환: name, email, departmentId, positionId
        const apiParams = {
            name: searchParams.name.trim(),
            email: searchParams.email.trim(),
            departmentId: searchParams.teamName ? departmentMap.get(searchParams.teamName) : undefined,
            positionId: searchParams.positionName ? positionMap.get(searchParams.positionName) : undefined,
        };

        // "마법 스위치"가 켜져 있으면 MOCK 데이터 사용
        if (USE_MOCK_DATA) {
            // 실제 API처럼 0.5초의 딜레이
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const filteredEmployees = EMPLOYEE_SEARCH_MOCK_DATA.filter(employee => {
                const nameMatch = !searchParams.name || employee.name.toLowerCase().includes(searchParams.name.toLowerCase());
                const emailMatch = !searchParams.email || employee.email.toLowerCase().includes(searchParams.email.toLowerCase());
                const idMatch = !searchParams.employeeId || String(employee.employeeId).includes(searchParams.employeeId);
                const positionMatch = !searchParams.positionName || employee.position === searchParams.positionName;
                const teamMatch = !searchParams.teamName || employee.department === searchParams.teamName;

                return nameMatch && emailMatch && idMatch && positionMatch && teamMatch;
            });

            setEmployees(filteredEmployees);
            setIsLoading(false);
            return;
        }

        // --- 실제 API 호출 ---
        try {
            // searchEmployees API 사용 (항상 첫 페이지부터 검색)
            setCurrentPage(0); // 검색 시 첫 페이지로 리셋
            const data = await searchEmployees(apiParams, 0, pageSize);
            
            // 응답 데이터 처리: { success, message, data: { content: [...], totalPages, totalElements } }
            let employeeList;
            let pageInfo;
            
            if (data.data && data.data.content && Array.isArray(data.data.content)) {
                employeeList = data.data.content;
                pageInfo = data.data;
            } else if (data.content && Array.isArray(data.content)) {
                employeeList = data.content;
                pageInfo = data;
            } else if (Array.isArray(data)) {
                employeeList = data;
                pageInfo = null;
            } else {
                employeeList = [];
                pageInfo = null;
            }
            
            setEmployees(employeeList);
            
            // 페이지네이션 정보 저장
            if (pageInfo) {
                setTotalPages(pageInfo.totalPages || 0);
                setTotalElements(pageInfo.totalElements || employeeList.length);
            }
            
        } catch (error) {
            // API 실패 시 MOCK 데이터로 fallback
            console.warn('⚠️ MOCK 데이터로 전환하여 검색');
            const filteredEmployees = EMPLOYEE_SEARCH_MOCK_DATA.filter(employee => {
                const nameMatch = !searchParams.name || employee.name.toLowerCase().includes(searchParams.name.toLowerCase());
                const emailMatch = !searchParams.email || employee.email.toLowerCase().includes(searchParams.email.toLowerCase());
                const idMatch = !searchParams.employeeId || String(employee.employeeId).includes(searchParams.employeeId);
                const positionMatch = !searchParams.positionName || employee.position === searchParams.positionName;
                const teamMatch = !searchParams.teamName || employee.department === searchParams.teamName;

                return nameMatch && emailMatch && idMatch && positionMatch && teamMatch;
            });
            setEmployees(filteredEmployees);
        } finally {
            setIsLoading(false);
        }
    };
    
    // 페이지 변경 핸들러
    const handlePageChange = async (newPage) => {
        if (newPage < 0 || newPage >= totalPages) return;
        
        setCurrentPage(newPage);
        setIsLoading(true);
        
        try {
            const data = await fetchEmployees(newPage, pageSize);
            
            let employeeList;
            if (data.data && data.data.content) {
                employeeList = data.data.content;
            } else if (data.content) {
                employeeList = data.content;
            } else {
                employeeList = data;
            }
            
            setEmployees(employeeList);
        } catch (error) {
            console.error('페이지 로드 실패:', error);
        } finally {
            setIsLoading(false);
        }
    };
    
    // 페이지 크기 변경 핸들러
    const handlePageSizeChange = async (newSize) => {
        setPageSize(newSize);
        setCurrentPage(0); // 첫 페이지로 리셋
        setIsLoading(true);
        
        try {
            const data = await fetchEmployees(0, newSize);
            
            let employeeList;
            let pageInfo;
            
            if (data.data && data.data.content) {
                employeeList = data.data.content;
                pageInfo = data.data;
            } else if (data.content) {
                employeeList = data.content;
                pageInfo = data;
            } else {
                employeeList = data;
                pageInfo = null;
            }
            
            setEmployees(employeeList);
            
            if (pageInfo) {
                setTotalPages(pageInfo.totalPages || 0);
                setTotalElements(pageInfo.totalElements || employeeList.length);
            }
        } catch (error) {
            console.error('페이지 크기 변경 실패:', error);
        } finally {
            setIsLoading(false);
        }
    };
    
    // 4. ✨ (핵심) 테이블 행 렌더링 함수 - API 응답 구조에 맞게 수정
    const renderEmployeeRow = (employee) => { 
        return (
            <>
                {/* API 응답: id, name, departmentName, positionName, email, internalNumber */}
                <td className={tableStyles.tableData}>{employee.id || employee.employeeId}</td>
                <td className={tableStyles.tableData}>{employee.name}</td>
                <td className={tableStyles.tableData}>{employee.departmentName || employee.department || '-'}</td>
                <td className={tableStyles.tableData}>{employee.positionName || employee.position || '-'}</td>
                <td className={tableStyles.tableData}>{employee.email}</td>
                <td className={tableStyles.tableData}>{employee.internalNumber || employee.extension || '-'}</td>
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
                    onReset={handleReset}
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
                <>
                    <DataTable
                        headers={TABLE_HEADERS}
                        data={employees}
                        renderRow={renderEmployeeRow}
                    />
                    
                    {/* 페이지네이션 UI */}
                    {totalPages > 1 && (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '20px',
                            marginTop: '20px',
                            borderTop: '1px solid #e0e0e0'
                        }}>
                            {/* 페이지 크기 선택 */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <label>페이지 크기:</label>
                                <select
                                    value={pageSize}
                                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                                    style={{
                                        padding: '6px 12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px'
                                    }}
                                >
                                    <option value={12}>기본</option>
                                    <option value={10}>10개</option>
                                    <option value={20}>20개</option>
                                </select>
                            </div>
                            
                            {/* 페이지 네비게이션 */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 0}
                                    style={{
                                        padding: '8px 16px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        background: currentPage === 0 ? '#f5f5f5' : 'white',
                                        cursor: currentPage === 0 ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    이전
                                </button>
                                
                                <span style={{ margin: '0 10px', fontWeight: 'bold' }}>
                                    {currentPage + 1} / {totalPages} 페이지
                                </span>
                                
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage >= totalPages - 1}
                                    style={{
                                        padding: '8px 16px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        background: currentPage >= totalPages - 1 ? '#f5f5f5' : 'white',
                                        cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    다음
                                </button>
                            </div>
                            
                            {/* 전체 개수 표시 */}
                            <div style={{ color: '#666' }}>
                                총 {totalElements}명
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default PeopleSearchPage;
