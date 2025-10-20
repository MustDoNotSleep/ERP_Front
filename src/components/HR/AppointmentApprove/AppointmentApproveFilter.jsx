import React from 'react';
import styles from './AppointmentApproveFilter.module.css';

const AppointmentApproveFilter = ({ searchParams, onSearchChange, onSearchSubmit }) => {
    return (
        <div className={styles.filterContainer}>
            
            <h2 className={styles.title}>인사발령 관리</h2>
            
            {/* 1. 이름 */}
            <div className={styles.filterGroup}>
                <label htmlFor="employeeName" className={styles.filterLabel}>이름</label>
                <input
                    type="text"
                    id="employeeName"
                    name="employeeName"
                    value={searchParams.employeeName}
                    onChange={onSearchChange}
                    placeholder="00000"
                    className={styles.filterInput}
                />
            </div>

            {/* 2. 사원번호 */}
            <div className={styles.filterGroup}>
                <label htmlFor="employeeId" className={styles.filterLabel}>사원번호</label>
                <input
                    type="text"
                    id="employeeId"
                    name="employeeId"
                    value={searchParams.employeeId}
                    onChange={onSearchChange}
                    placeholder="00000"
                    className={styles.filterInput}
                />
            </div>

            {/* 3. 요청일 */}
            <div className={styles.filterGroup}>
                <label htmlFor="requestDate" className={styles.filterLabel}>요청일</label>
                <input
                    type="date"
                    id="requestDate"
                    name="requestDate"
                    value={searchParams.requestDate}
                    className={styles.filterInput}
                    placeholder="YYYY/MM/DD"
                />
            </div>

            {/* 4. 부서 (수정된 부분 ▼▼▼) */}
            <div className={styles.filterGroup}>
                <label htmlFor="departmentId" className={styles.filterLabel}>부서</label>
                <select
                    id="departmentId"
                    name="departmentId"
                    value={searchParams.departmentId}
                    onChange={onSearchChange}
                    className={styles.filterSelect}
                >
                    <option value="">전체</option>
                    <option value="1">경영기획본부</option>
                    <option value="2">침해사고대응본부</option>
                    <option value="3">자율보안본부</option>
                    <option value="4">보안연구본부</option>
                </select>
            </div>

            {/* 5. 조회 버튼 */}
            <button onClick={onSearchSubmit} className={styles.searchButton}>
                조회
            </button>
        </div>
    );
};

export default AppointmentApproveFilter;