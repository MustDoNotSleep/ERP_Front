import React, { useState, useEffect } from 'react';
import { FilterCard, FilterGroup, Select } from '../../../components/common';
import DataTable from '../../../components/common/DataTable';
import tableStyles from '../../../components/common/DataTable.module.css';
import styles from './TrainingStatus.module.css';

/**
 * 교육 이수 현황/신청 페이지
 * 인사팀용 - 전체 직원의 교육 이수 현황을 조회하고 관리
 */
const TrainingStatus = () => {
    const currentYear = new Date().getFullYear();
    
    // 검색 조건
    const [filters, setFilters] = useState({
        year: currentYear.toString(),
        educationType: ''
    });

    // 교육 이수 데이터
    const [trainingData, setTrainingData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);

    // 연도 옵션 (최근 5년)
    const yearOptions = Array.from({ length: 5 }, (_, i) => {
        const year = currentYear - i;
        return { value: year.toString(), label: year.toString() };
    });

    // 교육 구분 옵션
    const educationTypeOptions = [
        { value: '', label: '전체' },
        { value: 'INTERNAL', label: '내부교육' },
        { value: 'EXTERNAL', label: '외부교육' },
        { value: 'ONLINE', label: '온라인교육' },
        { value: 'CERTIFICATION', label: '자격증교육' }
    ];

    // 테이블 헤더 정의
    const TABLE_HEADERS = [
        '선택', '교육기간', '교육명', '교육기관', '교육구분', '이수 여부', '점수/등급'
    ];

    // Mock 데이터
    const mockData = React.useMemo(() => [
        {
            id: 1,
            period: 'YYYY/MM/DD~YYYY/MM/DD',
            courseName: '보안사고대응실무',
            organization: 'Apex',
            educationType: '내부교육',
            completionStatus: 'COMPLETED',
            grade: 'A'
        },
        {
            id: 2,
            period: 'YYYY/MM/DD~YYYY/MM/DD',
            courseName: '보안사고대응실무',
            organization: 'Apex',
            educationType: '내부교육',
            completionStatus: 'COMPLETED',
            grade: 'B+'
        },
        {
            id: 3,
            period: 'YYYY/MM/DD~YYYY/MM/DD',
            courseName: 'ISMS-P',
            organization: 'KISA',
            educationType: '외부교육',
            completionStatus: 'COMPLETED',
            grade: 'A'
        },
        {
            id: 4,
            period: 'YYYY/MM/DD~YYYY/MM/DD',
            courseName: 'ISMS-P',
            organization: 'KISA',
            educationType: '외부교육',
            completionStatus: 'IN_PROGRESS',
            grade: '-'
        }
    ], []);

    useEffect(() => {
        // TODO: API 호출로 데이터 가져오기
        const fetchTrainingData = () => {
            // Mock 데이터 설정
            setTrainingData(mockData);
        };
        
        fetchTrainingData();
    }, [filters, mockData]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearch = () => {
        // 검색 시 데이터 재조회는 useEffect에서 처리
    };

    const handleReset = () => {
        setFilters({
            year: currentYear.toString(),
            educationType: ''
        });
    };

    const handleRowSelect = (id) => {
        setSelectedRows(prev => 
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    const getCompletionStatusLabel = (status) => {
        switch (status) {
            case 'COMPLETED':
                return '이수 완료';
            case 'IN_PROGRESS':
                return '이수중';
            case 'NOT_STARTED':
                return '미이수';
            default:
                return '-';
        }
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
                <td className={tableStyles.tableData}>{item.period}</td>
                <td className={tableStyles.tableData}>{item.courseName}</td>
                <td className={tableStyles.tableData}>{item.organization}</td>
                <td className={tableStyles.tableData}>{item.educationType}</td>
                <td className={tableStyles.tableData}>
                    <span className={styles[`status-${item.completionStatus?.toLowerCase()}`]}>
                        {getCompletionStatusLabel(item.completionStatus)}
                    </span>
                </td>
                <td className={tableStyles.tableData}>{item.grade || '-'}</td>
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

                <FilterGroup label="교육구분">
                    <Select 
                        name="educationType"
                        value={filters.educationType}
                        onChange={handleFilterChange}
                        options={educationTypeOptions}
                        placeholder="전체"
                    />
                </FilterGroup>
            </FilterCard>

            {/* 결과 테이블 */}
            <div className={styles.tableSection}>
                <DataTable
                    headers={TABLE_HEADERS}
                    data={trainingData}
                    renderRow={renderTrainingRow}
                    emptyMessage="교육 이수 데이터가 없습니다."
                />
            </div>
        </div>
    );
};

export default TrainingStatus;
