import React from 'react';
import styles from './EvaluationProgress.module.css'; 

const EvaluationProgress = ({ 
    searchParams,
    onChange,
    onSearch,
    onReset, // ⭐ 초기화 핸들러 추가
    departments,
    positions,
    progressData,
    seasonList   // ⭐ [수정 1] 부모에게서 받은 시즌 목록(props) 추가!
}) => {

    // 진행률을 props로 받아서 계산
    const totalCount = progressData?.totalCount || 0;
    const completedCount = progressData?.completedCount || 0;
    const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

    return (
        <div className={styles.progressSection}>
            <h3 className={styles.sectionTitle}>평가 진행 현황</h3>
            <div className={styles.filterContent}>
                
                {/* ⭐ 1. 평가 시즌 (수정된 부분) */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>평가시즌</label>
                    <select
                        name="seasonName" 
                        value={searchParams.seasonName || ""} 
                        onChange={onChange} 
                        className={`${styles.input} ${styles.select}`}
                    >
                        <option value="">선택</option>
                        
                        {/* ⭐ [수정 3] 받아온 seasonList를 반복해서 옵션 생성 */}
                        {seasonList && seasonList.map((season) => (
                            <option key={season.policyId} value={season.seasonName}>
                                {season.seasonName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* ⭐ 2. 부서 드롭다운 */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>부서</label>
                    <select 
                        name="departmentId" 
                        value={searchParams.departmentId || ""} 
                        onChange={onChange} 
                        className={`${styles.input} ${styles.select}`}
                    >
                        <option value="">전체</option>
                        {departments && departments.map((dept) => (
                            <option key={dept.departmentId} value={dept.departmentId}>
                                {dept.teamName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* ⭐ 3. 직급 드롭다운 */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>직급</label>
                    <select 
                        name="positionId" 
                        value={searchParams.positionId || ""} 
                        onChange={onChange} 
                        className={`${styles.input} ${styles.select}`}
                    >
                        <option value="">전체</option>
                        {positions && positions.map((pos) => (
                            <option key={pos.positionId} value={pos.positionId}>
                                {pos.positionName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.searchButtonContainer}>
                    <button onClick={onSearch} className={styles.searchButton} style={{ height: '2.5rem' }}>
                        조회
                    </button>
                    <button onClick={onReset} className={styles.searchButton} style={{ height: '2.5rem', marginLeft: '8px' }}>
                        초기화
                    </button>
                </div>
            </div>

            {/* ⭐ 4. 원형 진행률 그래프 */}
            <div className={styles.progressDisplay}>
                <div className={styles.circleContainer}>
                    <div 
                        className={styles.circleProgress} 
                        style={{ 
                            background: `conic-gradient(#9CA089 ${progressPercent}%, #E3E3E1 ${progressPercent}%)` 
                        }}
                    >
                        <span className={styles.circleText}>{progressPercent}%</span>
                    </div>
                </div>
                <p className={styles.totalCount}>
                    전체 {totalCount}명 중 {completedCount}명
                </p>
            </div>
        </div>
    );
};

export default EvaluationProgress;