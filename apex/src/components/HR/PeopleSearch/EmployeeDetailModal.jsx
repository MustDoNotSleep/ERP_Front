import React, { useState, useEffect } from 'react';
import { Modal } from '../../common';
import DataTable from '../../common/DataTable';
import tableStyles from '../../common/DataTable.module.css';
import styles from './EmployeeDetailModal.module.css';
import { fetchEmployeeProfile } from '../../../api/employee';
import { fetchEducationsByEmployeeId } from '../../../api/education';
import { fetchMilitaryServiceByEmployeeId } from '../../../api/military';
import { fetchWorkExperiencesByEmployeeId } from '../../../api/workExperience';
import { fetchCertificatesByEmployeeId } from '../../../api/certificate';
import { fetchCoursesByEmployeeId } from '../../../api/course';

/**
 * 직원 상세 정보 모달
 * HrCard와 동일한 정보를 모달로 표시
 */
const EmployeeDetailModal = ({ isOpen, onClose, employeeId }) => {
    const [employeeData, setEmployeeData] = useState(null);
    const [educationsData, setEducationsData] = useState([]);
    const [militaryData, setMilitaryData] = useState(null);
    const [workExperiencesData, setWorkExperiencesData] = useState([]);
    const [certificatesData, setCertificatesData] = useState([]);
    const [coursesData, setCoursesData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('basic'); // basic, education, military, career, certificate, training

    useEffect(() => {
        if (isOpen && employeeId) {
            loadEmployeeData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, employeeId]);

    const loadEmployeeData = async () => {
        setIsLoading(true);
        try {
            const response = await fetchEmployeeProfile(employeeId);
            const profileData = response.data || response;
            
            setEmployeeData(profileData);

            // 추가 정보들을 병렬로 로드
            const [educations, military, workExperiences, certificates, courses] = await Promise.allSettled([
                fetchEducationsByEmployeeId(employeeId).catch(() => []),
                fetchMilitaryServiceByEmployeeId(employeeId).catch(() => null),
                fetchWorkExperiencesByEmployeeId(employeeId).catch(() => []),
                fetchCertificatesByEmployeeId(employeeId).catch(() => []),
                fetchCoursesByEmployeeId(employeeId).catch(() => [])
            ]);

            setEducationsData(educations.status === 'fulfilled' ? (educations.value?.data || educations.value || []) : []);
            setMilitaryData(military.status === 'fulfilled' ? (military.value?.data || military.value) : null);
            setWorkExperiencesData(workExperiences.status === 'fulfilled' ? (workExperiences.value?.data || workExperiences.value || []) : []);
            setCertificatesData(certificates.status === 'fulfilled' ? (certificates.value?.data || certificates.value || []) : []);
            setCoursesData(courses.status === 'fulfilled' ? (courses.value?.data || courses.value || []) : []);

        } catch (error) {
            console.error('직원 상세 정보 로드 실패:', error);
            alert('직원 정보를 불러오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="직원 상세 정보" size="xl">
            {isLoading ? (
                <div className={styles.loading}>로딩 중...</div>
            ) : (
                <div className={styles.modalContent}>
                    {/* 탭 메뉴 */}
                    <div className={styles.tabMenu}>
                        <button 
                            className={activeTab === 'basic' ? styles.activeTab : styles.tab}
                            onClick={() => setActiveTab('basic')}
                        >
                            기본 정보
                        </button>
                        <button 
                            className={activeTab === 'education' ? styles.activeTab : styles.tab}
                            onClick={() => setActiveTab('education')}
                        >
                            학력
                        </button>
                        <button 
                            className={activeTab === 'military' ? styles.activeTab : styles.tab}
                            onClick={() => setActiveTab('military')}
                        >
                            병역
                        </button>
                        <button 
                            className={activeTab === 'career' ? styles.activeTab : styles.tab}
                            onClick={() => setActiveTab('career')}
                        >
                            경력
                        </button>
                        <button 
                            className={activeTab === 'certificate' ? styles.activeTab : styles.tab}
                            onClick={() => setActiveTab('certificate')}
                        >
                            자격증
                        </button>
                        <button 
                            className={activeTab === 'training' ? styles.activeTab : styles.tab}
                            onClick={() => setActiveTab('training')}
                        >
                            교육훈련
                        </button>
                    </div>

                    {/* 탭 컨텐츠 */}
                    <div className={styles.tabContent}>
                        {activeTab === 'basic' && employeeData && (
                            <div className={styles.basicInfo}>
                                <div className={styles.infoGrid}>
                                    <div className={styles.infoField}>
                                        <label>이름</label>
                                        <span>{employeeData.name}</span>
                                    </div>
                                    <div className={styles.infoField}>
                                        <label>사원번호</label>
                                        <span>{employeeData.id || employeeData.employeeId}</span>
                                    </div>
                                    <div className={styles.infoField}>
                                        <label>부서</label>
                                        <span>{employeeData.departmentName || '-'}</span>
                                    </div>
                                    <div className={styles.infoField}>
                                        <label>팀</label>
                                        <span>{employeeData.teamName || '-'}</span>
                                    </div>
                                    <div className={styles.infoField}>
                                        <label>직급</label>
                                        <span>{employeeData.positionName || '-'}</span>
                                    </div>
                                    <div className={styles.infoField}>
                                        <label>생년월일</label>
                                        <span>{employeeData.birthDate ? employeeData.birthDate.split('T')[0] : '-'}</span>
                                    </div>
                                    <div className={styles.infoField}>
                                        <label>이메일</label>
                                        <span>{employeeData.email || '-'}</span>
                                    </div>
                                    <div className={styles.infoField}>
                                        <label>전화번호</label>
                                        <span>{employeeData.phoneNumber || '-'}</span>
                                    </div>
                                    <div className={styles.infoField}>
                                        <label>내선번호</label>
                                        <span>{employeeData.internalNumber || '-'}</span>
                                    </div>
                                    <div className={styles.infoField}>
                                        <label>주소</label>
                                        <span>{employeeData.address || '-'}</span>
                                    </div>
                                    <div className={styles.infoField}>
                                        <label>은행명</label>
                                        <span>{employeeData.bankName || '-'}</span>
                                    </div>
                                    <div className={styles.infoField}>
                                        <label>계좌번호</label>
                                        <span>{employeeData.accountNumber || '-'}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'education' && (
                            <DataTable
                                headers={['학교명', '학위', '전공', '입학일', '졸업일', '졸업구분']}
                                data={educationsData}
                                emptyMessage="학력 정보가 없습니다."
                                renderRow={(edu) => (
                                    <>
                                        <td className={tableStyles.tableData}>{edu.schoolName || '-'}</td>
                                        <td className={tableStyles.tableData}>{edu.degree || '-'}</td>
                                        <td className={tableStyles.tableData}>{edu.major || '-'}</td>
                                        <td className={tableStyles.tableData}>{edu.admissionDate ? edu.admissionDate.split('T')[0] : '-'}</td>
                                        <td className={tableStyles.tableData}>{edu.graduationDate ? edu.graduationDate.split('T')[0] : '-'}</td>
                                        <td className={tableStyles.tableData}>{edu.graduationStatus || '-'}</td>
                                    </>
                                )}
                            />
                        )}

                        {activeTab === 'military' && (
                            <DataTable
                                headers={['병역 구분', '군별', '복무 시작일', '복무 종료일', '계급', '병과', '미필사유']}
                                data={militaryData ? [militaryData] : []}
                                emptyMessage="병역 정보가 없습니다."
                                renderRow={(military) => (
                                    <>
                                        <td className={tableStyles.tableData}>{military.serviceType || '-'}</td>
                                        <td className={tableStyles.tableData}>{military.branch || '-'}</td>
                                        <td className={tableStyles.tableData}>{military.serviceStartDate ? military.serviceStartDate.split('T')[0] : '-'}</td>
                                        <td className={tableStyles.tableData}>{military.serviceEndDate ? military.serviceEndDate.split('T')[0] : '-'}</td>
                                        <td className={tableStyles.tableData}>{military.rank || '-'}</td>
                                        <td className={tableStyles.tableData}>{military.specialty || '-'}</td>
                                        <td className={tableStyles.tableData}>{military.exemptionReason || '-'}</td>
                                    </>
                                )}
                            />
                        )}

                        {activeTab === 'career' && (
                            <DataTable
                                headers={['근무처', '입사일', '퇴직일', '담당업무', '최종직위', '최종연봉']}
                                data={workExperiencesData}
                                emptyMessage="경력 정보가 없습니다."
                                renderRow={(work) => (
                                    <>
                                        <td className={tableStyles.tableData}>{work.companyName || '-'}</td>
                                        <td className={tableStyles.tableData}>{work.startDate ? work.startDate.split('T')[0] : '-'}</td>
                                        <td className={tableStyles.tableData}>{work.endDate ? work.endDate.split('T')[0] : '-'}</td>
                                        <td className={tableStyles.tableData}>{work.responsibilities || '-'}</td>
                                        <td className={tableStyles.tableData}>{work.finalPosition || '-'}</td>
                                        <td className={tableStyles.tableData}>{work.finalSalary ? `${work.finalSalary.toLocaleString()}원` : '-'}</td>
                                    </>
                                )}
                            />
                        )}

                        {activeTab === 'certificate' && (
                            <DataTable
                                headers={['자격증명', '발급기관', '취득일', '유효일', '점수']}
                                data={certificatesData}
                                emptyMessage="자격증 정보가 없습니다."
                                renderRow={(cert) => (
                                    <>
                                        <td className={tableStyles.tableData}>{cert.certificateName || '-'}</td>
                                        <td className={tableStyles.tableData}>{cert.issuingOrganization || '-'}</td>
                                        <td className={tableStyles.tableData}>{cert.acquisitionDate ? cert.acquisitionDate.split('T')[0] : '-'}</td>
                                        <td className={tableStyles.tableData}>{cert.expirationDate ? cert.expirationDate.split('T')[0] : '-'}</td>
                                        <td className={tableStyles.tableData}>{cert.score || '-'}</td>
                                    </>
                                )}
                            />
                        )}

                        {activeTab === 'training' && (
                            <DataTable
                                headers={['교육기간', '교육명', '교육기관', '교육구분', '이수 여부']}
                                data={coursesData}
                                emptyMessage="교육훈련 정보가 없습니다."
                                renderRow={(course) => (
                                    <>
                                        <td className={tableStyles.tableData}>
                                            {course.startDate && course.endDate 
                                                ? `${course.startDate.split('T')[0]} ~ ${course.endDate.split('T')[0]}` 
                                                : '-'}
                                        </td>
                                        <td className={tableStyles.tableData}>{course.courseName || '-'}</td>
                                        <td className={tableStyles.tableData}>{course.institution || '-'}</td>
                                        <td className={tableStyles.tableData}>{course.courseType || '-'}</td>
                                        <td className={tableStyles.tableData}>{course.completionStatus || '-'}</td>
                                    </>
                                )}
                            />
                        )}
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default EmployeeDetailModal;
