import React, { useState, useEffect } from 'react';
import styles from "./CareerManagementPage.module.css"
import CareerSearchFilter from '../../../components/HR/career&edu/CareerSearchFilter.jsx';
import EmployeeSearchModal from '../../../components/HR/AppointmentApply/EmployeeSearchModal';
import CareerDetailModal from '../../../components/HR/career&edu/CareerDetailModal';
import DataTable from '../../../components/common/DataTable.jsx';
import tableStyles from '../../../components/common/DataTable.module.css'; 
import { Button } from '../../../components/common';
import { FaSearch } from "react-icons/fa";
import { searchEmployees } from '../../../api/employee';
import { fetchAllWorkExperiences } from '../../../api/workExperience';
import { fetchCertificatesByEmployeeId } from '../../../api/certificate';

// 테이블 헤더
const EMPLOYEE_TABLE_HEADERS = [
    '사번', '이름', '부서', '팀', '직급', '경력 수', '자격증 수', <FaSearch/>
];

const CareerManagementPage = () => {
    const [searchParams, setSearchParams] = useState({
        name: '',
        employeeId: '',
        department: '',
        team: ''
    });
    
    const [employees, setEmployees] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [isEmployeeSearchOpen, setIsEmployeeSearchOpen] = useState(false);
    const [isCareerDetailOpen, setIsCareerDetailOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // 페이지 로드 시 전체 목록 조회
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    // 데이터 조회 함수
    const fetchData = async (params = {}) => {
        setIsLoading(true);

        try {
            // 1. 전체 경력 정보 조회 (한 번의 API 호출)
            let workExpCountMap = {};
    
            const allWorkExpResponse = await fetchAllWorkExperiences();
            const allWorkExperiences = allWorkExpResponse.data || allWorkExpResponse || [];
            
            // 2. 직원별 경력 개수 맵 생성
            if (Array.isArray(allWorkExperiences)) {
                allWorkExperiences.forEach(exp => {
                    const empId = exp.employeeId || exp.employee?.id;
                    if (empId) {
                        workExpCountMap[empId] = (workExpCountMap[empId] || 0) + 1;
                    }
                });
            }

            // 3. 직원 검색 API 호출
            const apiParams = {};
            if (params.name?.trim()) apiParams.name = params.name.trim();
            if (params.employeeId?.trim()) {
                // employeeId는 숫자로 변환해서 전송 (백엔드에서 id로 검색)
                const empId = parseInt(params.employeeId.trim(), 10);
                if (!isNaN(empId)) {
                    apiParams.id = empId;
                }
            }
            if (params.department?.trim()) apiParams.departmentName = params.department.trim();
            
            const response = await searchEmployees(apiParams, currentPage, pageSize);
            
            let employeeList = response.data?.content || response.content || response.data || [];
            const total = response.data?.totalElements || response.totalElements || employeeList.length || 0;
            
            if (!Array.isArray(employeeList)) {
                employeeList = [];
            }

            // 4. 각 직원의 자격증 개수만 추가 조회
            const enrichedEmployees = await Promise.all(
                employeeList.map(async (employee) => {
                    try {
                        // 경력 개수는 맵에서 가져오기
                        const careerCount = workExpCountMap[employee.id] || 0;

                        // 자격증 개수만 API 호출 (실패해도 계속 진행)
                        let certCount = 0;
                        const certResponse = await fetchCertificatesByEmployeeId(employee.id);
                        const certificates = certResponse.data || certResponse || [];
                        certCount = Array.isArray(certificates) ? certificates.length : 0;

                        return {
                            ...employee,
                            careerCount,
                            certCount
                        };
                    } catch (error) {
                        console.error(`❌ 직원 ${employee.id} 처리 실패:`, error);
                        return {
                            ...employee,
                            careerCount: 0,
                            certCount: 0
                        };
                    }
                })
            );

            setEmployees(enrichedEmployees);
            setTotalCount(total);

        } catch (error) {
            console.error("❌ 경력 데이터 조회 실패:", error);
            console.error("에러 상세:", {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                message: error.message
            });
            
            const errorMessage = error.response?.data?.message || error.message || "데이터를 불러오는 데 실패했습니다.";
            alert(`오류 발생: ${errorMessage}`);
            
            setEmployees([]);
            setTotalCount(0);
        } finally {
            setIsLoading(false);
        }
    };

    // 검색 필터 변경 핸들러
    const handleSearchChange = (name, value) => {
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    // 검색 버튼 클릭 핸들러
    const handleSearch = () => {
        setCurrentPage(0); // 검색 시 첫 페이지로
        fetchData(searchParams);
    };

    // 리셋 핸들러
    const handleReset = () => {
        setSearchParams({
            name: '',
            employeeId: '',
            department: '',
            team: ''
        });
        setCurrentPage(0);
        fetchData();
    };

    // 직원 검색 모달 열기
    const handleOpenEmployeeSearch = () => {
        setIsEmployeeSearchOpen(true);
    };

    // 직원 선택 핸들러
    const handleSelectEmployee = (employee) => {
        setSearchParams({
            name: employee.name || '',
            employeeId: employee.id ? String(employee.id) : '', // id를 employeeId로 사용
            department: employee.departmentName || '',
            team: employee.teamName || ''
        });
        setIsEmployeeSearchOpen(false);
    };
    // 상세 보기 핸들러
    const handleViewDetail = (employee) => {
        setSelectedEmployee(employee);
        setIsCareerDetailOpen(true);
    };

    // 페이지 변경 핸들러
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // 총 페이지 수 계산
    const totalPages = Math.ceil(totalCount / pageSize);
    
    // 테이블 행 렌더링 함수
    // 테이블 행 렌더링 함수
    const renderEmployeeRow = (employee) => { 
        return (
            <>
                <td className={tableStyles.tableData}>{employee.id || '-'}</td>
                <td className={tableStyles.tableData}>{employee.name}</td>
                <td className={tableStyles.tableData}>{employee.departmentName || '-'}</td>
                <td className={tableStyles.tableData}>{employee.teamName || '-'}</td>
                <td className={tableStyles.tableData}>{employee.positionName || '-'}</td>
                <td className={tableStyles.tableData}>{employee.careerCount || 0}</td>
                <td className={tableStyles.tableData}>{employee.certCount || 0}</td>
                
                <td className={tableStyles.tableAction}>
                    <Button 
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetail(employee)}
                    >
                        <FaSearch />
                    </Button>
                </td>
            </>
        );
    };


    return (
        <div className={styles.pageContainer}>
            {/* 직원 검색 모달 */}
            <EmployeeSearchModal
                isOpen={isEmployeeSearchOpen}
                onClose={() => setIsEmployeeSearchOpen(false)}
                onSelectEmployee={handleSelectEmployee}
            />

            {/* 경력 상세 모달 */}
            <CareerDetailModal
                isOpen={isCareerDetailOpen}
                onClose={() => setIsCareerDetailOpen(false)}
                employeeId={selectedEmployee?.id}
                employeeName={selectedEmployee?.name}
            />

            {/* 검색 필터 */}
            <CareerSearchFilter 
                searchParams={searchParams}
                onSearchChange={handleSearchChange}
                onSearchSubmit={handleSearch}
                onReset={handleReset}
                onOpenEmployeeSearch={handleOpenEmployeeSearch}
            />
            
            {/* 로딩 및 데이터 없음 UI */}
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

            {/* 페이지네이션 */}
            {!isLoading && totalPages > 1 && (
                <div className={styles.pagination}>
                    <button 
                        onClick={() => handlePageChange(0)}
                        disabled={currentPage === 0}
                        className={styles.pageButton}
                    >
                        처음
                    </button>
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        className={styles.pageButton}
                    >
                        이전
                    </button>
                    
                    <span className={styles.pageInfo}>
                        {currentPage + 1} / {totalPages} 페이지 (총 {totalCount}명)
                    </span>
                    
                    <button 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages - 1}
                        className={styles.pageButton}
                    >
                        다음
                    </button>
                    <button 
                        onClick={() => handlePageChange(totalPages - 1)}
                        disabled={currentPage >= totalPages - 1}
                        className={styles.pageButton}
                    >
                        마지막
                    </button>
                </div>
            )}
        </div>
    );
};

export default CareerManagementPage;