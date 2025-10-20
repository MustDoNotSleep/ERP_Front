import React from 'react';
import styles from './ApplyInputGrid.module.css';

const ApplyInputGrid = ({ formData, handleChange, appointmentTypes }) => {
    return (
        // ✅ 테두리와 회색 배경을 담당하는 div가 최상위가 됩니다.
        <div className={styles.gridWrapper}>
            {/* ✅ "인사 발령 관리" 제목을 박스 안으로 이동시켰습니다. */}
            <h2 className={styles.title}>인사 발령 관리</h2>
            
            <div className={styles.inputGrid}>

                {/* 사번 */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>사번</label>
                    <input type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} className={styles.input} placeholder="00000" required />
                </div>

                {/* 발령지 */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>발령지</label>
                    <input type="text" name="department" value={formData.department} onChange={handleChange} className={styles.input} placeholder="0000000" required />
                </div>

                {/* 이름 */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>이름</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className={styles.input} placeholder="XXX" required />
                </div>

                {/* 발령 구분 */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>발령 구분</label>
                    <select name="appointmentType" value={formData.appointmentType} onChange={handleChange} className={styles.select} required >
                        <option value="">선택</option>
                        {appointmentTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                {/* 기간 */}
                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                    <label className={styles.label}>기간</label>
                    <div className={styles.dateRangeContainer}>
                        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className={styles.input} required />
                        <span className={styles.dateSeparator}>~</span>
                        <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className={styles.input} required />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ApplyInputGrid;

