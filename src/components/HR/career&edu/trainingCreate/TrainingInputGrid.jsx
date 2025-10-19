import React from 'react';
import styles from './TrainingInputGrid.module.css'; // 스타일 재사용

const TrainingCourseInputGrid = ({ formData, handleChange }) => {
    return (
        <div className={styles.gridContainer}>
            <h2 className={styles.title}>교육과정 등록</h2>
            <div className={styles.inputGrid}>
                {/* 교육명 */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>교육명</label>
                    <input type="text" name="courseName" value={formData.courseName} onChange={handleChange} className={styles.input} placeholder="00000" required />
                </div>
                
                {/* 이수기준 */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>이수기준</label>
                    <input type="text" name="completionCriteria" value={formData.completionCriteria} onChange={handleChange} className={styles.input} placeholder="00000" />
                </div>
                
                {/* 교육정원 */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>교육정원</label>
                    <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} className={styles.input} placeholder="XXX" />
                </div>

                {/* 교육유형 (드롭다운) */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>교육유형</label>
                    <select name="courseType" value={formData.courseType} onChange={handleChange} className={`${styles.input} ${styles.select}`} required>
                        <option value="">선택</option>
                        <option value="required">필수이수</option>
                        <option value="optional">선택이수</option>
                    </select>
                </div>

                {/* 교육기간 (시작일) */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>교육기간</label>
                        <div className={styles.dateRangeContainer}>
                        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className={styles.input} placeholder="YYYY-MM-DD" required />
                        {/* ✨ 물결표 기호 추가 */}
                        <span className={styles.dateSeparator}>~</span> 
                        <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className={styles.input} placeholder="YYYY-MM-DD" required />
                    </div>
                </div>

                <div className={styles.dateSeparator}>
                    {/* <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className={styles.input} placeholder="YYYY/MM/DD" required /> */}
                </div>
            </div>
        </div>
    );
};

export default TrainingCourseInputGrid;