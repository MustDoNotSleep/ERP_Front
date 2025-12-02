import React, { useState } from 'react';
import { toast } from 'react-toastify';
import styles from './CourseApplicationModal.module.css';

/**
 * 교육 신청 모달
 * @param {boolean} isOpen - 모달 오픈 여부
 * @param {function} onClose - 모달 닫기 함수
 * @param {array} selectedCourses - 선택된 교육 과정 목록
 * @param {function} onSubmit - 신청 제출 함수
 */
export default function CourseApplicationModal({ isOpen, onClose, selectedCourses, onSubmit }) {
    const [signature, setSignature] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const totalAmount = selectedCourses.reduce((sum, course) => sum + (course.cost || course.price || 0), 0);

    const handleSubmit = async () => {
        if (!signature.trim()) {
            toast.warning('서명을 입력해주세요.');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(selectedCourses, signature);
            setSignature('');
            onClose();
        } catch (error) {
            console.error('교육 신청 실패:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ko-KR').format(amount || 0);
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>교육 신청</h2>
                    <button className={styles.closeBtn} onClick={onClose}>✕</button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.infoSection}>
                        <h3>신청 내역</h3>
                        <div className={styles.courseList}>
                            {selectedCourses.map((course, index) => (
                                <div key={course.id} className={styles.courseItem}>
                                    <span className={styles.courseNumber}>{index + 1}.</span>
                                    <span className={styles.courseName}>{course.courseName}</span>
                                    <span className={styles.courseCost}>{formatCurrency(course.cost || course.price)}원</span>
                                </div>
                            ))}
                        </div>
                        
                        <div className={styles.totalAmount}>
                            <span>총 비용</span>
                            <span className={styles.amount}>{formatCurrency(totalAmount)}원</span>
                        </div>
                    </div>

                    <div className={styles.confirmSection}>
                        <p className={styles.confirmText}>
                            위 교육 과정을 신청하시겠습니까?<br />
                            신청 시 복리후생 포인트가 차감됩니다.
                        </p>
                        
                        <div className={styles.signatureSection}>
                            <label htmlFor="signature">서명</label>
                            <input
                                id="signature"
                                type="text"
                                value={signature}
                                onChange={(e) => setSignature(e.target.value)}
                                placeholder="이름을 입력해주세요"
                                className={styles.signatureInput}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button 
                        className={styles.cancelBtn} 
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        취소
                    </button>
                    <button 
                        className={styles.submitBtn} 
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? '신청 중...' : '신청하기'}
                    </button>
                </div>
            </div>
        </div>
    );
}
