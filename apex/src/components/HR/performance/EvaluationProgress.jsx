import React from 'react';
import styles from './EvaluationProgress.module.css'; 

// 💡 더미 데이터
const TOTAL_COUNT = 150;
const COMPLETED_COUNT = 150;
const PROGRESS_PERCENT = Math.round((COMPLETED_COUNT / TOTAL_COUNT) * 100);

const EvaluationProgress = ({ searchParams, onChange, onSearch }) => {
    return (
        <div className={styles.progressSection}>
            <h3 className={styles.sectionTitle}>평가 진행 현황</h3>
            <div className={styles.filterContent}>
                {/* 평가 세션 드롭다운 */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>평가시즌</label>
                    <select name="session" value={searchParams.session} onChange={onChange} className={`${styles.input} ${styles.select}`}>
                        <option>2025-1</option>
                        <option>2024-4</option>
                    </select>
                </div>

                {/* 부서 드롭다운 */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>부서</label>
                    <select name="department" value={searchParams.department} onChange={onChange} className={`${styles.input} ${styles.select}`}>
                        <option>전체</option>
                        <option>인사팀</option>
                    </select>
                </div>

                {/* 직급 드롭다운 */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>직급</label>
                    <select name="position" value={searchParams.position} onChange={onChange} className={`${styles.input} ${styles.select}`}>
                        <option>사원</option>
                        <option>대리</option>
                    </select>
                </div>
                <div className={styles.searchButtonContainer}>
                    <button onClick={onSearch} className={styles.searchButton} style={{ height: '2.5rem' }}>
                        조회
                    </button>
                </div>
            </div>

            {/* 원형 진행률 그래프 영역 */}
            <div className={styles.progressDisplay}>
                <div className={styles.circleContainer}>
                    {/* 실제로는 SVG나 라이브러리를 사용 */}
                    <div className={styles.circleProgress} style={{ background: `conic-gradient(#9CA089 ${PROGRESS_PERCENT}%, #E3E3E1 ${PROGRESS_PERCENT}%)` }}>
                        <span className={styles.circleText}>{PROGRESS_PERCENT}%</span>
                    </div>
                </div>
                <p className={styles.totalCount}>전체 {TOTAL_COUNT}명 중 {COMPLETED_COUNT}명</p>
            </div>
        </div>
    );
};

export default EvaluationProgress;