import React, { useState, useEffect } from 'react';
import { FilterCard, FilterGroup, Select } from '../../../components/common';
import DataTable from '../../../components/common/DataTable';
import tableStyles from '../../../components/common/DataTable.module.css';
import styles from './TrainingStatus.module.css';
import { fetchCourseApplications } from '../../../api/course';

/**
 * 교육 이수 현황 페이지
 * 인사팀용 - 전체 직원의 교육 이수 현황을 조회하고 관리
 */
const TrainingStatus = () => {
    const currentYear = new Date().getFullYear();
    
    // 검색 조건
    const [filters, setFilters] = useState({
        year: currentYear.toString(),
        status: ''
    });

    // 교육 이수 데이터
    const [trainingData, setTrainingData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 0,
        size: 20,
        totalElements: 0,
        totalPages: 0
    });

    // 연도 옵션 (최근 5년)
    const yearOptions = Array.from({ length: 5 }, (_, i) => {
        const year = currentYear - i;
        return { value: year.toString(), label: year.toString() };
    });

    // 교육 상태 옵션 (신청 승인 여부)
    const statusOptions = [
        { value: '', label: '전체' },
        { value: 'PENDING', label: '대기' },
        { value: 'APPROVED', label: '승인' },
        { value: 'REJECTED', label: '반려' }
    ];

    // 테이블 헤더 정의 - 교육 신청 기준
    const TABLE_HEADERS = [
        '선택', '이름', '부서', '교육명', '교육기간', '신청일', '이수상태'
    ];

    // Mock 데이터 제거 - 실제 API 사용
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, pagination.page]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetchCourseApplications(
                pagination.page,
                pagination.size,
                filters.status || null
            );
            
            // API 응답 구조: { success, message, data: { content, pageNumber, pageSize, totalElements, totalPages } }
            const responseData = response.data || response;
            setTrainingData(responseData.content || []);
            setPagination(prev => ({
                ...prev,
                page: responseData.pageNumber || 0,
                totalElements: responseData.totalElements || 0,
                totalPages: responseData.totalPages || 0
            }));
        } catch (error) {
            console.error('교육 이수 현황 조회 실패:', error);
            alert('교육 이수 현황을 불러오는데 실패했습니다.');
            setTrainingData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearch = () => {
        setPagination(prev => ({ ...prev, page: 0 }));
        fetchData();
    };

    const handleReset = () => {
        setFilters({
            year: currentYear.toString(),
            status: ''
        });
        setPagination(prev => ({ ...prev, page: 0 }));
    };

    const handleRowSelect = (id) => {
        setSelectedRows(prev => 
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    const getCompletionStatusLabel = (status) => {
        switch (status) {
            case 'PENDING':
                return '대기';
            case 'APPROVED':
                return '승인';
            case 'REJECTED':
                return '반려';
            default:
                return '-';
        }
    };

    const formatDateRange = (startDate, endDate) => {
        if (!startDate || !endDate) return '-';
        return `${startDate} ~ ${endDate}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return dateString.split('T')[0]; // YYYY-MM-DD 형식으로 변환
    };

    // 테이블 행 렌더링 로직
    const renderTrainingRow = (item) => {
        return (
            <>
                <td className={tableStyles.tableData}>
                    <input 
                        type="checkbox" 
                        checked={selectedRows.includes(item.id)}
                        onChange={() => handleRowSelect(item.id)}
                    />
                </td>
                <td className={tableStyles.tableData}>{item.employeeName || '-'}</td>
                <td className={tableStyles.tableData}>{item.departmentName || '-'}</td>
                <td className={tableStyles.tableData}>{item.courseName || '-'}</td>
                <td className={tableStyles.tableData}>
                    {formatDateRange(item.startDate, item.endDate)}
                </td>
                <td className={tableStyles.tableData}>{formatDate(item.applicationDate)}</td>
                <td className={tableStyles.tableData}>
                    <span className={styles[`status-${item.status?.toLowerCase()}`]}>
                        {getCompletionStatusLabel(item.status)}
                    </span>
                </td>
            </>
        );
    };

    return (
        <div className={styles.container}>

            {/* 필터 섹션 */}
            <FilterCard 
                title="교육 이수 현황" 
                onSearch={handleSearch}
                onReset={handleReset}
            >
                <FilterGroup label="년도">
                    <Select 
                        name="year"
                        value={filters.year}
                        onChange={handleFilterChange}
                        options={yearOptions}
                    />
                </FilterGroup>

                <FilterGroup label="승인상태">
                    <Select 
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        options={statusOptions}
                        placeholder="전체"
                    />
                </FilterGroup>
            </FilterCard>

            {/* 결과 테이블 */}
            <div className={styles.tableSection}>
                {loading ? (
                    <div className={styles.loading}>데이터를 불러오는 중...</div>
                ) : (
                    <DataTable
                        headers={TABLE_HEADERS}
                        data={trainingData}
                        renderRow={renderTrainingRow}
                        emptyMessage="교육 이수 데이터가 없습니다."
                    />
                )}
            </div>
        </div>
    );
};

export default TrainingStatus;
