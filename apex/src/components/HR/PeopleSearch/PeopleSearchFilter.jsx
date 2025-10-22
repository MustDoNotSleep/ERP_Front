import React from 'react';
import styles from "./PeopleSearchFilter.module.css"; 

const PeopleSearchFilter = ({ 
        searchParams,
        onSearchChange,
        onSearchSubmit,
        positions = [], // 기본값 추가
        teams = []      // 기본값 추가
    }) => {
    
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

                {/* 3. 직급 (API 데이터) */}
                <div className={styles.inputGroup}>
                    <label htmlFor="positionName" className={styles.label}>직급</label>
                    <select
                        id="positionName"
                        name="positionName"
                        className={styles.select}
                        value={searchParams.positionName}
                        onChange={handleChange}
                    >
                        <option value="">전체</option>
                        {positions.map(pos => (
                            <option key={pos.positionId} value={pos.positionName}>
                                {pos.positionName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 4. 소속 (API 데이터) */}
                <div className={styles.inputGroup}>
                    <label htmlFor="teamName" className={styles.label}>소속</label>
                    <select
                        id="teamName"
                        name="teamName"
                        className={styles.select}
                        value={searchParams.teamName}
                        onChange={handleChange}
                    >
                        <option value="">전체</option>
                        {teams.map((team, index) => (
                            <option key={index} value={team}>
                                {team}
                            </option>
                        ))}
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