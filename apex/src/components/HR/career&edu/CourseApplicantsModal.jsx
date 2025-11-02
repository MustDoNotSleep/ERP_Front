import React, { useState, useEffect } from 'react';
import styles from './CourseApplicantsModal.module.css';
import tableStyles from '../../common/DataTable.module.css';
import DataTable from '../../common/DataTable';
import { Button } from '../../common';

const CourseApplicantsModal = ({ 
    isOpen, 
    onClose, 
    courseId,
    courseName,
    onApprove,
    onReject,
    applicants = [],
    isLoading = false
}) => {
    const [selectedApplicants, setSelectedApplicants] = useState([]);

    useEffect(() => {
        if (!isOpen) {
            setSelectedApplicants([]);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleRowSelect = (id) => {
        setSelectedApplicants(prev => 
            prev.includes(id) 
                ? prev.filter(rowId => rowId !== id) 
                : [...prev, id]
        );
    };

    const handleApprove = () => {
        if (selectedApplicants.length === 0) {
            alert('승인할 신청자를 선택해주세요.');
            return;
        }
        onApprove(selectedApplicants);
        setSelectedApplicants([]);
    };

    const handleReject = () => {
        if (selectedApplicants.length === 0) {
            alert('반려할 신청자를 선택해주세요.');
            return;
        }
        onReject(selectedApplicants);
        setSelectedApplicants([]);
    };

    const TABLE_HEADERS = ['선택', '사번', '이름', '부서', '신청일', '상태'];

    const renderApplicantRow = (applicant) => {
        const isProcessed = applicant.status === 'APPROVED' || applicant.status === 'REJECTED';
        
        // applicationDate 포맷팅 (YYYY-MM-DDTHH:mm:ss -> YYYY-MM-DD)
        const formatDate = (dateString) => {
            if (!dateString) return '-';
            return dateString.split('T')[0];
        };
        
        return (
            <>
                <td className={tableStyles.tableData}>
                    <input 
                        type="checkbox" 
                        checked={selectedApplicants.includes(applicant.id)}
                        onChange={() => handleRowSelect(applicant.id)}
                        disabled={isProcessed}
                        style={{ cursor: isProcessed ? 'not-allowed' : 'pointer' }}
                    />
                </td>
                <td className={tableStyles.tableData}>{applicant.id || '-'}</td>
                <td className={tableStyles.tableData}>{applicant.employeeName || '-'}</td>
                <td className={tableStyles.tableData}>{applicant.departmentName || '-'}</td>
                <td className={tableStyles.tableData}>{formatDate(applicant.applicationDate)}</td>
                <td className={tableStyles.tableData}>
                    <span className={styles[`status${applicant.status}`]}>
                        {applicant.status === 'PENDING' ? '대기' : 
                         applicant.status === 'APPROVED' ? '승인' : 
                         applicant.status === 'REJECTED' ? '반려' : applicant.status}
                    </span>
                </td>
            </>
        );
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>{courseName} - 신청자 목록</h2>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>

                <div className={styles.modalBody}>
                    {isLoading ? (
                        <p>데이터를 불러오는 중입니다...</p>
                    ) : applicants.length > 0 ? (
                        <DataTable
                            headers={TABLE_HEADERS}
                            data={applicants}
                            renderRow={renderApplicantRow}
                        />
                    ) : (
                        <p className={styles.noData}>신청자가 없습니다.</p>
                    )}
                </div>

                <div className={styles.modalFooter}>
                    <Button variant="secondary" onClick={onClose}>
                        닫기
                    </Button>
                    <Button variant="danger" onClick={handleReject} disabled={isLoading}>
                        반려
                    </Button>
                    <Button variant="primary" onClick={handleApprove} disabled={isLoading}>
                        승인
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CourseApplicantsModal;
