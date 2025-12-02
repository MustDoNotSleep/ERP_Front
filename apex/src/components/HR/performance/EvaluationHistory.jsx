import React from 'react';
import styles from './EvaluationHistory.module.css';

const EvaluationHistory = ({ data, onChange }) => {

    return (
        <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>평가 이력 설정</h3>

            <div className={styles.contentGrid}>

                {/* 1. 시즌명 */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>시즌명</label>
                    <input 
                        type="text" 
                        name="seasonName" 
                        value={data.seasonName || ""} 
                        onChange={onChange}
                        className={styles.input} 
                        placeholder='2025년 4분기'
                    />
                </div>

                {/* 2. 평가 기간 (Flex 적용을 위해 구조 유지) */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>평가 기간</label>

                    {/* CSS에서 display: flex를 줄 컨테이너 */}
                    <div className={styles.dateRangeWrapper}>
                        <input
                            type="date"
                            name="startDate"
                            value={data.startDate || ""}
                            onChange={onChange}
                            className={`${styles.input} ${styles.dateInput}`} // dateInput 클래스 추가
                        />

                        <span className={styles.tilde}> ~ </span>

                        <input
                            type="date"
                            name="endDate"
                            value={data.endDate || ""}
                            onChange={onChange}
                            className={`${styles.input} ${styles.dateInput}`} // dateInput 클래스 추가
                        />
                    </div>
                </div>

                {/* 3. 평가유형 (텍스트 수정됨) */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>평가유형</label>
                    <select 
                        name="evaluationType" 
                        value={data.evaluationType || ""} 
                        onChange={onChange} 
                        className={`${styles.input} ${styles.select}`}
                    >
                        <option value="">선택</option>
                        <option value="KPI">KPI 평가</option>
                        <option value="LEADERSHIP">리더십 평가</option>
                    </select>
                </div>

                {/* 4. 평가구분 (고정값) */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>평가구분</label>
                    <input
                        type="text"
                        value="부서별"
                        readOnly
                        className={styles.input}
                        style={{ backgroundColor: "#f4f4f4", color: "#666" }}
                    />
                </div>

            </div>
        </div>
    );
};

export default EvaluationHistory;