import React from 'react';
import styles from './CareerSearchFilter.module.css';

// 부서, 팀, 사원번호 등에 사용될 드롭다운 옵션 (백엔드에서 가져와야 함)
const dummyOptions = [
    { value: '00000', label: '전체' },
    { value: '100', label: '개발팀' },
    { value: '200', label: '영업팀' },
];

const CareerSearchFilter = ({ searchParams, onSearchChange, onSearchSubmit }) => {
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
                            placeholder="00000"
                        />
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>사원번호</label>
                        <select 
                            name="employeeId" 
                            value={searchParams.employeeId} 
                            onChange={handleSelectChange}
                            className={`${styles.input} ${styles.select}`}
                        >
                            {dummyOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>부서</label>
                        <select 
                            name="department" 
                            value={searchParams.department} 
                            onChange={handleSelectChange}
                            className={`${styles.input} ${styles.select}`}
                        >
                            {dummyOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
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
                            {dummyOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
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