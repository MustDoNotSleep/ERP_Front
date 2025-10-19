import React from 'react';
import styles from './AppointmentApproveFilter.module.css'; // (4)번 파일

const AppointmentApprovalFilter = ({ searchParams, onSearchChange, onSearchSubmit }) => {
    return (
        <div className={styles.filterContainer}>
            <div className={styles.filterRow}>
                <div className={styles.filterItem}>
                    <label htmlFor="employeeName">이름</label>
                    <input
                        type="text"
                        id="employeeName"
                        name="employeeName"
                        value={searchParams.employeeName}
                        onChange={onSearchChange}
                        placeholder="00000"
                    />
                </div>
                <div className={styles.filterItem}>
                    <label htmlFor="employeeId">사원번호</label>
                    <select
                        id="employeeId"
                        name="employeeId"
                        value={searchParams.employeeId}
                        onChange={onSearchChange}
                    >
                        <option value="">00000</option>
                        {/* TODO: 사원번호 목록 DB에서 불러오기 */}
                        <option value="12345">12345 (김수석)</option>
                        <option value="12346">12346 (최사원)</option>
                    </select>
                </div>
            </div>
            
            <div className={styles.filterRow}>
                <div className={styles.filterItem}>
                    <label htmlFor="applicationDate">요청일</label>
                    <input
                        type="date"
                        id="applicationDate"
                        name="applicationDate"
                        value={searchParams.applicationDate}
                        onChange={onSearchChange}
                    />
                </div>
                <div className={styles.filterItem}>
                    <label htmlFor="departmentId">부서</label>
                    <select
                        id="departmentId"
                        name="departmentId"
                        value={searchParams.departmentId}
                        onChange={onSearchChange}
                    >
                        <option value="">00000</option>
                        {/* TODO: 부서 목록 DB에서 불러오기 */}
                        <option value="1">인사팀</option>
                        <option value="2">개발팀</option>
                    </select>
                </div>
            </div>

            <button 
                className={`${styles.button} ${styles.searchButton}`}
                onClick={onSearchSubmit}
            >
                조회
            </button>
        </div>
    );
};

export default AppointmentApprovalFilter;