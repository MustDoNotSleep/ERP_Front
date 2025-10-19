import React from 'react';
import styles from "./PeopleSearchFilter.module.css"; 

const POSITION_OPTIONS = ['전체', '인턴', '사원', '대리', '책임', '수석', '과장', '부장'];
const DEPT_OPTIONS = ['전체', '인사팀', '보안관제팀', 'CERT팀', '보안컨설팅팀', '연구기획팀'];

const PeopleSearchFilter = ({ searchParams, onSearchChange, onSearchSubmit }) => {
    
    const handleChange = (e) => {
        onSearchChange(e);
    };

    return (
        <div className={styles.filterContainer}> 
            
            <h2 className={styles.title}>직원 조회</h2>

            <div className={styles.inputGrid}>
                {/* 1. 이름 */}
                <div className={styles.inputGroup}>
                    <label htmlFor="name" className={styles.label}>이름</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className={styles.input}
                        value={searchParams.name}
                        onChange={handleChange}
                    />
                </div>

                {/* 2. 사원번호 */}
                <div className={styles.inputGroup}>
                    <label htmlFor="employeeId" className={styles.label}>사원번호</label>
                    <input
                        type="text"
                        id="employeeId"
                        name="employeeId"
                        className={styles.input}
                        value={searchParams.employeeId}
                        onChange={handleChange}
                    />
                </div>

                {/* 3. 직급 */}
                <div className={styles.inputGroup}>
                    <label htmlFor="position" className={styles.label}>직급</label>
                    <select
                        id="position"
                        name="position"
                        className={styles.select}
                        value={searchParams.position}
                        onChange={handleChange}
                    >
                        {POSITION_OPTIONS.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                    </select>
                </div>

                {/* 4. 소속 */}
                <div className={styles.inputGroup}>
                    <label htmlFor="department" className={styles.label}>소속</label>
                    <select
                        id="department"
                        name="department"
                        className={styles.select}
                        value={searchParams.department}
                        onChange={handleChange}
                    >
                        {DEPT_OPTIONS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                    </select>
                </div>
                
                {/* 5. 조회 버튼 */}
                <div className={styles.buttonContainer}>
                    <button 
                        className={styles.searchButton}
                        onClick={onSearchSubmit}
                    >
                        조회
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PeopleSearchFilter;