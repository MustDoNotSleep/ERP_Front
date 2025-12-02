import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FilterCard, FilterGroup, Select } from '../../../components/common';
import DataTable from '../../../components/common/DataTable';
import tableStyles from '../../../components/common/DataTable.module.css';
import styles from './MyTraining.module.css';
import CourseApplicationModal from '../../../components/HR/career&edu/CourseApplicationModal';
import { fetchCourses, createCourseApplication, fetchEmployeeCourseApplications } from '../../../api/course';
import { getCurrentUser } from '../../../api/auth';

/**
 * 나의 교육 신청/이수 현황 페이지
 * 개인용 - 승인된 교육 과정 조회 및 신청, 본인의 교육 이수 현황 확인
 */
const MyTraining = () => {
    const currentYear = new Date().getFullYear();
    
    // 검색 조건
    const [filters, setFilters] = useState({
        year: currentYear.toString(),
        educationType: ''
    });

    // 승인된 교육 과정 데이터
    const [approvedCourses, setApprovedCourses] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // 교육 신청 모달
    const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
    
    // 내 교육 이수 데이터
    const [myTrainingData, setMyTrainingData] = useState([]);
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
        '선택', '교육기간', '교육명', '교육구분', '이수 여부'
    ];

    // 승인된 교육 과정 조회
    const loadApprovedCourses = async () => {
        setLoading(true);
        try {
            const response = await fetchCourses(0, 100, { approvalStatus: 'APPROVED' });
            const courseList = response.data?.content || response.content || response.data || [];
            
            console.log('승인된 교육 과정:', courseList);
            setApprovedCourses(courseList);
        } catch (error) {
            console.error('교육 과정 조회 실패:', error);
            toast.error('교육 과정을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 내 교육 신청/이수 현황 조회
    const loadMyTrainingData = async () => {
        try {
            const currentUser = getCurrentUser();
            if (!currentUser || !currentUser.employeeId) {
                console.error('로그인 정보를 찾을 수 없습니다.');
                return;
            }

            const employeeId = currentUser.employeeId;
            const response = await fetchEmployeeCourseApplications(employeeId, 0, 100);
            const applications = response.data?.content || response.content || response.data || [];
            
            console.log('내 교육 신청 내역:', applications);
            
            // 데이터 포맷팅
            const formattedData = applications.map(app => ({
                id: app.id,
                courseName: app.courseName || '-',
                period: app.startDate && app.endDate 
                    ? `${app.startDate} ~ ${app.endDate}` 
                    : (app.startDate || app.endDate || '-'),
                organization: '내부교육', // 구분은 무조건 내부교육
                educationType: 'INTERNAL',
                completionStatus: app.status || 'PENDING',
                grade: '-',
                // 원본 데이터 보존
                ...app
            }));
            
            setMyTrainingData(formattedData);
        } catch (error) {
            console.error('교육 신청 내역 조회 실패:', error);
            // Mock 데이터로 대체 (개발 중)
            setMyTrainingData([]);
        }
    };

    useEffect(() => {
        loadApprovedCourses();
        loadMyTrainingData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        // 필터 변경 시 데이터 재조회
        loadMyTrainingData();
    }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearch = () => {
        loadMyTrainingData();
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

    // 교육 과정 선택
    const handleCourseSelect = (courseId) => {
        const course = approvedCourses.find(c => c.id === courseId);
        if (!course) return;

        setSelectedCourses(prev => {
            const isAlreadySelected = prev.some(c => c.id === courseId);
            if (isAlreadySelected) {
                return prev.filter(c => c.id !== courseId);
            } else {
                return [...prev, course];
            }
        });
    };

    // 교육 신청 모달 열기
    const handleOpenApplicationModal = () => {
        if (selectedCourses.length === 0) {
            toast.warning('신청할 교육을 선택해주세요.');
            return;
        }
        setIsApplicationModalOpen(true);
    };

    // 교육 신청 제출
    const handleSubmitApplication = async (courses, signature) => {
        try {
            const currentUser = getCurrentUser();
            if (!currentUser || !currentUser.employeeId) {
                toast.error('로그인 정보를 찾을 수 없습니다.');
                return;
            }

            const employeeId = currentUser.employeeId;
            
            // 각 교육에 대해 신청
            const promises = courses.map(course => 
                createCourseApplication({
                    courseId: course.id,
                    employeeId: employeeId,
                    signature: signature
                })
            );

            await Promise.all(promises);

            const totalCost = courses.reduce((sum, c) => sum + (c.cost || c.price || 0), 0);
            
            toast.success(`교육 신청이 완료되었습니다!\n총 ${totalCost.toLocaleString()}원이 사용됩니다.`);
            
            setSelectedCourses([]);
            setIsApplicationModalOpen(false);
            
            // 신청 내역 새로고침
            loadMyTrainingData();
            
        } catch (error) {
            console.error('교육 신청 실패:', error);
            toast.error('교육 신청에 실패했습니다.');
        }
    };

    const getCompletionStatusLabel = (status) => {
        switch (status) {
            case 'COMPLETED':
                return '이수 완료';
            case 'IN_PROGRESS':
                return '이수중';
            case 'NOT_STARTED':
                return '미이수';
            case 'PENDING':
                return '승인 대기';
            case 'APPROVED':
                return '승인됨';
            case 'REJECTED':
                return '반려됨';
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
                <td className={tableStyles.tableData}>{item.period || '-'}</td>
                <td className={tableStyles.tableData}>{item.courseName || '-'}</td>
                <td className={tableStyles.tableData}>{item.organization || '-'}</td>
                {/* <td className={tableStyles.tableData}>{item.educationType || '-'}</td> */}
                <td className={tableStyles.tableData}>
                    <span className={styles[`status-${item.completionStatus?.toLowerCase()}`]}>
                        {getCompletionStatusLabel(item.completionStatus)}
                    </span>
                </td>
                {/* <td className={tableStyles.tableData}>{item.grade || '-'}</td> */}
            </>
        );
    };

    return (
        <div className={styles.container}>
            {/* 교육 신청 모달 */}
            <CourseApplicationModal
                isOpen={isApplicationModalOpen}
                onClose={() => setIsApplicationModalOpen(false)}
                selectedCourses={selectedCourses}
                onSubmit={handleSubmitApplication}
            />

            {/* 그리드 레이아웃 */}
            <div className={styles.gridLayout}>
                {/* 왼쪽: 나의 교육 이수 현황 (70%) */}
                <div className={styles.trainingHistorySection}>
                    {/* 필터 섹션 */}
                    <FilterCard 
                        title="나의 교육 이수 현황" 
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
                            data={myTrainingData}
                            renderRow={renderTrainingRow}
                            emptyMessage="교육 신청/이수 데이터가 없습니다."
                        />
                    </div>
                </div>

                {/* 오른쪽: 신청 가능한 교육 과정 (30%) */}
                <div className={styles.coursesCard}>
                    <div className={styles.cardHeader}>
                        <h3>신청 가능한 교육 과정</h3>
                        <button 
                            className={styles.applyBtn} 
                            onClick={handleOpenApplicationModal}
                            disabled={selectedCourses.length === 0}
                        >
                            신청하기 ({selectedCourses.length})
                        </button>
                    </div>
                    
                    {loading ? (
                        <div className={styles.loadingState}>교육 과정을 불러오는 중...</div>
                    ) : approvedCourses.length === 0 ? (
                        <div className={styles.emptyState}>신청 가능한 교육 과정이 없습니다.</div>
                    ) : (
                        <div className={styles.coursesList}>
                            {approvedCourses.map((course) => (
                                <div 
                                    key={course.id} 
                                    className={`${styles.courseCard} ${selectedCourses.some(c => c.id === course.id) ? styles.selected : ''}`}
                                    onClick={() => handleCourseSelect(course.id)}
                                >
                                    <div className={styles.courseCheckbox}>
                                        <input 
                                            type="checkbox" 
                                            checked={selectedCourses.some(c => c.id === course.id)}
                                            onChange={() => handleCourseSelect(course.id)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                    <div className={styles.courseInfo}>
                                        <h4 className={styles.courseName}>{course.courseName}</h4>
                                        <p className={styles.coursePeriod}>
                                            {course.startDate} ~ {course.endDate}
                                        </p>
                                        <p className={styles.courseType}>{course.courseType}</p>
                                    </div>
                                    <div className={styles.courseCost}>
                                        {(course.cost || course.price) ? `${(course.cost || course.price).toLocaleString()}원` : '무료'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyTraining;
