import React from 'react';
import styles from './CertificateIssueFilter.module.css'; 

// ✨ 목 데이터 임포트
import { ISSUE_STATUS_OPTIONS, CERTIFICATE_TYPES } from '../../../models/data/CertificateIssueMOCK.js';

const certificateOptions = [
    { value: '', label: '00증명서' },
    ...Object.entries(CERTIFICATE_TYPES).map(([key, value]) => ({ value: key, label: value }))
];

const CertificateIssueFilter = ({ searchParams, onSearchChange, onSearchSubmit }) => {
    
    const handleChange = (e) => {
        onSearchChange(e);
    };

    return (
        <div className={styles.filterContainer}> 
            <h2 className={styles.title}>증명서 발급 관리</h2>
            <div className={styles.filterContent}>
                
                {/* 1. 사원명 입력 */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>사원명</label>
                    <input type="text" name="employeeName" value={searchParams.employeeName} onChange={handleChange} className={styles.input} placeholder="000" />
                </div>
                
                {/* 2. 사원번호 입력 */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>사원번호</label>
                    <input type="text" name="employeeId" value={searchParams.employeeId} onChange={handleChange} className={styles.input} placeholder="00000" />
                </div>
                
                {/* 3. 증명서 종류 드롭다운 */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>증명서</label>
                    <select name="certificateType" value={searchParams.certificateType} onChange={handleChange} className={`${styles.input} ${styles.select}`}>
                        {certificateOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </div>

                {/* 4. 신청일자 입력 */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>신청일자</label>
                    <input type="date" name="applicationDate" value={searchParams.applicationDate} onChange={handleChange} className={styles.input} placeholder="YYYY/MM/DD" />
                </div>
                
                {/* 5. 처리상태 드롭다운 */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>처리상태</label>
                    <select name="issueStatus" value={searchParams.issueStatus} onChange={handleChange} className={`${styles.input} ${styles.select}`}>
                        {ISSUE_STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
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

export default CertificateIssueFilter;