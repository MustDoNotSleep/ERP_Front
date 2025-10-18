import React from 'react';
import styles from './TrainingApprovalFilter.module.css'

// ✨ 목 데이터 임포트
import { APPROVAL_STATUS_OPTIONS } from '../../../../models/data/TrainingMOCK';
import { DEPARTMENT_MOCK } from '../../../../models/data/DepartmentMOCK';
import { POSITIONS_MOCK } from '../../../../models/data/PositionsMOCK';

const TrainingApprovalFilter = ({ searchParams, onSearchChange, onSearchSubmit }) => {
    
    // 부서/직급 드롭다운 옵션 데이터 준비 (전체 옵션 추가)
    const departmentOptions = [{ departmentId: '', departmentName: '전체' }, ...DEPARTMENT_MOCK];
    const positionOptions = [{ positionId: '', positionName: '전체' }, ...POSITIONS_MOCK];
    
    // 일반 핸들러 (부모로 전달)
    const handleChange = (e) => {
        onSearchChange(e);
    };

    return (
        <div className={styles.filterContainer}> 
            <h2 className={styles.title}>교육과정 승인/조회</h2>    
            <div className={styles.filterContent}>
                
                {/* 1. 부서 드롭다운 */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>부서</label>
                    <select name="departmentId" value={searchParams.departmentId} onChange={handleChange} className={`${styles.input} ${styles.select}`}>
                        {departmentOptions.map(opt => <option key={opt.departmentId || ''} value={opt.departmentId}>{opt.departmentName}</option>)}
                    </select>
                </div>

                {/* 2. 직급 드롭다운 */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>직급</label>
                    <select name="positionId" value={searchParams.positionId} onChange={handleChange} className={`${styles.input} ${styles.select}`}>
                        {positionOptions.map(opt => <option key={opt.positionId || ''} value={opt.positionId}>{opt.positionName}</option>)}
                    </select>
                </div>
                
                {/* 3. 교육명 입력 */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>교육명</label>
                    <input type="text" name="courseName" value={searchParams.courseName} onChange={handleChange} className={styles.input} placeholder="XXX" />
                </div>

                {/* 4. 신청일자 입력 */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>신청일자</label>
                    <input type="date" name="applicationDate" value={searchParams.applicationDate} onChange={handleChange} className={styles.input} placeholder="YYYY/MM/DD" />
                </div>
                
                {/* 5. 처리상태 드롭다운 */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>처리상태</label>
                    <select name="approvalStatus" value={searchParams.approvalStatus} onChange={handleChange} className={`${styles.input} ${styles.select}`}>
                        {APPROVAL_STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </div>

                {/* 6. 조회 버튼 */}
                <div className={styles.inputGroup}>
                    <button onClick={onSearchSubmit} className={styles.searchButton} style={{ marginTop: '0.8rem' }}>
                        조회
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrainingApprovalFilter;