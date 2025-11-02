import React, { useState, useEffect } from 'react';
import styles from './CareerDetailModal.module.css';
import { fetchWorkExperiencesByEmployeeId } from '../../../api/workExperience';
import { fetchCertificatesByEmployeeId } from '../../../api/certificate';

const CareerDetailModal = ({ isOpen, onClose, employeeId, employeeName }) => {
    const [workExperiences, setWorkExperiences] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('career'); // 'career' or 'certificate'

    useEffect(() => {
        const fetchData = async () => {
            if (!isOpen || !employeeId) return;
            
            setLoading(true);
            try {
                // 경력 정보 조회
                const workExpResponse = await fetchWorkExperiencesByEmployeeId(employeeId);
                const workExpData = workExpResponse.data || workExpResponse || [];
                setWorkExperiences(Array.isArray(workExpData) ? workExpData : []);

                // 자격증 정보 조회
                const certResponse = await fetchCertificatesByEmployeeId(employeeId);
                const certData = certResponse.data || certResponse || [];
                setCertificates(Array.isArray(certData) ? certData : []);

            } catch (error) {
                console.error('❌ 경력/자격증 조회 실패:', error);
                alert('데이터를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isOpen, employeeId]);

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>{employeeName}님의 경력 정보</h2>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>

                <div className={styles.tabContainer}>
                    <button
                        className={`${styles.tab} ${activeTab === 'career' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('career')}
                    >
                        경력 사항 ({workExperiences.length})
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'certificate' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('certificate')}
                    >
                        자격증 ({certificates.length})
                    </button>
                </div>

                <div className={styles.contentSection}>
                    {loading ? (
                        <div className={styles.loadingMessage}>데이터를 불러오는 중...</div>
                    ) : (
                        <>
                            {activeTab === 'career' && (
                                <div className={styles.careerSection}>
                                    {workExperiences.length > 0 ? (
                                        <table className={styles.detailTable}>
                                            <thead>
                                                <tr>
                                                    <th>회사명</th>
                                                    <th>직위</th>
                                                    <th>입사일</th>
                                                    <th>퇴사일</th>
                                                    <th>담당업무</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {workExperiences.map((exp, index) => (
                                                    <tr key={exp.id || index}>
                                                        <td>{exp.companyName || '-'}</td>
                                                        <td>{exp.position || '-'}</td>
                                                        <td>{exp.startDate || '-'}</td>
                                                        <td>{exp.endDate || '-'}</td>
                                                        <td>{exp.responsibilities || '-'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className={styles.emptyMessage}>등록된 경력 사항이 없습니다.</div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'certificate' && (
                                <div className={styles.certificateSection}>
                                    {certificates.length > 0 ? (
                                        <table className={styles.detailTable}>
                                            <thead>
                                                <tr>
                                                    <th>자격증명</th>
                                                    <th>발급기관</th>
                                                    <th>취득일</th>
                                                    <th>만료일</th>
                                                    <th>등급/점수</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {certificates.map((cert, index) => (
                                                    <tr key={cert.id || index}>
                                                        <td>{cert.certificateName || '-'}</td>
                                                        <td>{cert.issuingAuthority || '-'}</td>
                                                        <td>{cert.issueDate || '-'}</td>
                                                        <td>{cert.expiryDate || '-'}</td>
                                                        <td>{cert.grade || cert.score || '-'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className={styles.emptyMessage}>등록된 자격증이 없습니다.</div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.closeBtn} onClick={onClose}>
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CareerDetailModal;
