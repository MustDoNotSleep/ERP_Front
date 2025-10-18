import React from 'react';
import styles from './EvaluationHistory.module.css';

const EvaluationHistory = ({ data, onChange }) => {
    const handleSelectChange = (e) => {
        onChange(e);
    };

    return (
        <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>평가 이력 설정</h3>
            <div className={styles.contentGrid}> 
                {/* 세션명 */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>세션명</label>
                    <input type="text" name="sessionName" value={data.sessionName} onChange={onChange} className={styles.input} placeholder="2025 1분기 업무평가" />
                </div>

                {/* 평가일 */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>평가일</label>
                    <input type="date" name="evaluationDate" value={data.evaluationDate} onChange={onChange} className={styles.input} placeholder="YYYY/MM/DD - YYYY/MM/DD" />
                </div>

                {/* 평가 유형 */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>평가유형</label>
                    <select name="evaluationType" value={data.evaluationType} onChange={handleSelectChange} className={`${styles.input} ${styles.select}`}>
                        <option>KPI평가</option>
                        <option>역량평가</option>
                    </select>
                </div>
                
                {/* 평가 구분 */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>평가구분</label>
                    <select name="evaluationScope" value={data.evaluationScope} onChange={handleSelectChange} className={`${styles.input} ${styles.select}`}>
                        <option>부서별</option>
                        <option>직급별</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default EvaluationHistory;