import React from 'react';
import styles from './CareerSearchFilter.module.css';


const CareerSearchFilter = ({ 
    searchParams, 
    onSearchChange, 
    onSearchSubmit,
    // 1. ✨ 부서와 팀 목록을 props로 받습니다.
    departments = [], 
    teams = [] 
}) => {
    const handleSelectChange = (e) => {
        onSearchChange(e.target.name, e.target.value);
    };

    const handleInputChange = (e) => {
        onSearchChange(e.target.name, e.target.value);
    };

    return (
        <div className={styles.filterContainer}>
            <h2 className={styles.title}>경력 관리</h2>
            <div className={styles.formLayout}> 
                <div className={styles.filterContent}> 
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>이름</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={searchParams.name} 
                            onChange={handleInputChange} 
                            className={styles.input}
                            placeholder="이름"
                        />
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>사원번호</label>
                        <input 
                            name="employeeId" 
                            value={searchParams.employeeId} 
                            onChange={handleInputChange}
                            className={styles.input}
                            placeholder="00000"
                        >
                        </input>
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>부서</label>
                        <select 
                            name="department" 
                            value={searchParams.department} 
                            onChange={handleSelectChange}
                            className={`${styles.input} ${styles.select}`}
                        >
                            <option value="">전체</option>
                            {/* 부서 목록을 props로 받아서 렌더링합니다. */}
                            {departments.map((dept, index) => (
                                // value는 ID(또는 name), label은 name을 사용
                                <option key={dept.id || index} value={dept.value || dept.name}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>팀</label>
                        <select 
                            name="team" 
                            value={searchParams.team} 
                            onChange={handleSelectChange}
                            className={`${styles.input} ${styles.select}`}
                        >
                            <option value="">전체</option>
                            {/* 팀 목록을 props로 받아서 렌더링합니다. */}
                            {teams.map((team, index) => (
                                // value는 ID(또는 name), label은 name을 사용
                                <option key={team.id || index} value={team.value || team.name}>
                                    {team.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className={styles.buttonGroup}>
                    <button onClick={onSearchSubmit} className={styles.searchButton}>
                        조회
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CareerSearchFilter;