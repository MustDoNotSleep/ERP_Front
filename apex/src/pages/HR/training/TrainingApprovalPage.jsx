import React, { useState, useEffect } from 'react'; 
import styles from "./TrainingApprovalPage.module.css"
import tableStyles from "../../../components/common/DataTable.module.css";
import DataTable from '../../../components/common/DataTable';
import TrainingApprovalFilter from '../../../components/HR/career&edu/TrainingApprovalFilter';
import CourseApplicantsModal from '../../../components/HR/career&edu/CourseApplicantsModal';
import { Button } from '../../../components/common';
import { 
    fetchCourses, 
    approveCourse,
    fetchApplicantsByCourseId,
    approveCourseApplication,
    rejectCourseApplication 
} from '../../../api/course';

const TABLE_HEADERS = [
    '선택', '교육명', '교육 기간', '교육 유형', '이수 기준', '비용', '상태', '신청자'
];

const TrainingApprovalPage = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // 모달 관련 state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [isLoadingApplicants, setIsLoadingApplicants] = useState(false);
    
    const [searchParams, setSearchParams] = useState({
        courseName: '',
        dateStatus: '',
        approvalStatus: ''
    });

    // 데이터 조회 함수
    const fetchData = async (params = {}) => {
        setIsLoading(true);
        
        try {
            const response = await fetchCourses(0, 100, params);
            const courseList = response.data?.content || response.content || response.data || [];
            
            console.log('📋 조회된 교육 과정 목록:', courseList);
            setCourses(courseList);
        } catch (error) {
            console.error("❌ 교육 과정 목록 조회 실패:", error);
            alert("데이터를 불러오는 데 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    // 페이지 초기 로드
    useEffect(() => {
        fetchData();
    }, []);

    // 검색 핸들러
    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        console.log('🔍 검색 시작:', searchParams);
        fetchData(searchParams);
    };

    const handleReset = () => {
        setSearchParams({
            courseName: '',
            dateStatus: '',
            approvalStatus: ''
        });
        fetchData();
    };

    // 교육 과정 선택 핸들러
    const handleCourseSelect = (id) => {
        setSelectedCourses(prev =>
            prev.includes(id)
                ? prev.filter(courseId => courseId !== id)
                : [...prev, id]
        );
    };

    // 교육 과정 승인/반려
    const handleCourseAction = async (action) => {
        if (selectedCourses.length === 0) {
            alert(`먼저 ${action}할 교육 과정을 선택해주세요.`);
            return;
        }

        const confirmed = window.confirm(
            `선택한 ${selectedCourses.length}개의 교육 과정을 ${action}하시겠습니까?`
        );
        if (!confirmed) return;

        setIsLoading(true);

        try {
            const approved = action === '승인';
            const promises = selectedCourses.map(courseId =>
                approveCourse(courseId, approved, `${action}되었습니다.`)
            );

            await Promise.all(promises);

            alert(`선택된 교육 과정이 ${action} 처리되었습니다.`);
            setSelectedCourses([]);
            fetchData(searchParams);

        } catch (error) {
            console.error(`❌ 교육 과정 ${action} 처리 실패:`, error);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || '처리 중 오류가 발생했습니다.';
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // 신청자 목록 조회
    const handleViewApplicants = async (course) => {
        setSelectedCourse(course);
        setIsModalOpen(true);
        setIsLoadingApplicants(true);

        try {
            const response = await fetchApplicantsByCourseId(course.id);
            const applicantList = response.data?.content || response.content || response.data || [];
            
            console.log('👥 신청자 목록:', applicantList);
            setApplicants(applicantList);
        } catch (error) {
            console.error('❌ 신청자 목록 조회 실패:', error);
            alert('신청자 목록을 불러오는 데 실패했습니다.');
            setApplicants([]);
        } finally {
            setIsLoadingApplicants(false);
        }
    };

    // 신청자 승인
    const handleApproveApplicants = async (applicationIds) => {
        setIsLoadingApplicants(true);

        try {
            const promises = applicationIds.map(id =>
                approveCourseApplication(id)
            );

            await Promise.all(promises);

            alert('선택된 신청자가 승인되었습니다.');
            // 신청자 목록 새로고침
            handleViewApplicants(selectedCourse);

        } catch (error) {
            console.error('❌ 신청자 승인 실패:', error);
            alert('승인 처리 중 오류가 발생했습니다.');
        } finally {
            setIsLoadingApplicants(false);
        }
    };

    // 신청자 반려
    const handleRejectApplicants = async (applicationIds) => {
        setIsLoadingApplicants(true);

        try {
            const promises = applicationIds.map(id =>
                rejectCourseApplication(id, '반려되었습니다.')
            );

            await Promise.all(promises);

            alert('선택된 신청자가 반려되었습니다.');
            // 신청자 목록 새로고침
            handleViewApplicants(selectedCourse);

        } catch (error) {
            console.error('❌ 신청자 반려 실패:', error);
            alert('반려 처리 중 오류가 발생했습니다.');
        } finally {
            setIsLoadingApplicants(false);
        }
    };

    // 테이블 행 렌더링
    const renderCourseRow = (course) => {
        const statusStyle = 
            course.status === 'APPROVED' ? styles.statusApproved :
            course.status === 'REJECTED' ? styles.statusRejected :
            styles.statusPending;

        const startDate = course.startDate || '-';
        const endDate = course.endDate || '-';
        const period = `${startDate} ~ ${endDate}`;

        // 비용 포맷팅
        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('ko-KR').format(amount || 0);
        };

        return (
            <>
                <td className={tableStyles.tableData}>
                    <input 
                        type="checkbox" 
                        checked={selectedCourses.includes(course.id)}
                        onChange={() => handleCourseSelect(course.id)}
                    />
                </td>
                <td className={tableStyles.tableData}>{course.courseName || '-'}</td>
                <td className={tableStyles.tableData}>{period}</td>
                <td className={tableStyles.tableData}>{course.courseType || '-'}</td>
                <td className={tableStyles.tableData}>{course.completionCriteria || '-'}</td>
                <td className={tableStyles.tableData}>{formatCurrency(course.cost || course.price)}원</td>
                <td className={`${tableStyles.tableData} ${statusStyle}`}>
                    {course.status === 'PENDING' ? '대기' : 
                     course.status === 'APPROVED' ? '승인' : 
                     course.status === 'REJECTED' ? '반려' : course.status}
                </td>
                <td className={tableStyles.tableData}>
                    <button
                        onClick={() => handleViewApplicants(course)}
                        className={styles.viewButton}
                    >
                        조회
                    </button>
                </td>
            </>
        );
    };

    return (
        <div className={styles.pageContainer}>
            
            {/* 신청자 목록 모달 */}
            <CourseApplicantsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                courseId={selectedCourse?.id}
                courseName={selectedCourse?.courseName}
                applicants={applicants}
                isLoading={isLoadingApplicants}
                onApprove={handleApproveApplicants}
                onReject={handleRejectApplicants}
            />

            {/* 검색 필터 */}
            <div className={styles.filterSection}>
                <TrainingApprovalFilter
                    searchParams={searchParams}
                    onSearchChange={handleSearchChange}
                    onSearchSubmit={handleSearch}
                    onReset={handleReset}
                />
            </div>

            {/* 로딩 UI */}
            {isLoading && <p>데이터를 불러오는 중입니다...</p>}

            {/* 데이터 테이블 */}
            {!isLoading && courses.length > 0 && (
                <DataTable
                    headers={TABLE_HEADERS}
                    data={courses}
                    renderRow={renderCourseRow}
                />
            )}

            {!isLoading && courses.length === 0 && (
                <div className={styles.noDataMessage}>조회된 데이터가 없습니다.</div>
            )}

            {/* 액션 버튼 */}
            <div className={styles.buttonGroup}>
                <Button 
                    variant="danger"
                    onClick={() => handleCourseAction('반려')} 
                    disabled={isLoading} 
                >
                    반려
                </Button>
                <Button 
                    variant="primary"
                    onClick={() => handleCourseAction('승인')} 
                    disabled={isLoading}
                >
                    {isLoading ? "처리 중..." : "승인"}
                </Button>
            </div>
        </div>
    );
};

export default TrainingApprovalPage;
