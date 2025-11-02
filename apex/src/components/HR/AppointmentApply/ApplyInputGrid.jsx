import React, { useState } from 'react';
import styles from './ApplyInputGrid.module.css';
import EmployeeSearchModal from './EmployeeSearchModal';

const ApplyInputGrid = ({ formData, handleChange, appointmentTypes, departmentNames, positionNames }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // 직원 선택 핸들러
    const handleSelectEmployee = (employee) => {
        setSelectedEmployee(employee);
        // targetEmployeeId 필드에 선택된 직원 ID 설정
        handleChange({
            target: {
                name: 'targetEmployeeId',
                value: employee.id
            }
        });
    };

    return (
        // ✅ 테두리와 회색 배경을 담당하는 div가 최상위가 됩니다.
        <div className={styles.gridWrapper}>
            <h2 className={styles.title}>인사 발령 신청</h2>
            
            <div className={styles.inputGrid}>

                {/* 대상 직원 검색 */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>대상 직원</label>
                    <div className={styles.employeeSearchContainer}>
                        <input 
                            type="text" 
                            value={selectedEmployee ? `${selectedEmployee.name} (${selectedEmployee.employeeId})` : ''} 
                            placeholder="직원 검색 버튼을 클릭하세요"
                            className={styles.input}
                            readOnly
                        />
                        <button 
                            type="button"
                            onClick={() => setIsModalOpen(true)}
                            className={styles.searchButton}
                        >
                            검색
                        </button>
                    </div>
                    {selectedEmployee && (
                        <div className={styles.employeeInfo}>
                            {selectedEmployee.departmentName} - {selectedEmployee.teamName} | {selectedEmployee.positionName}
                        </div>
                    )}
                </div>

                {/* 발령 유형 */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>발령 유형</label>
                    <select 
                        name="appointmentType" 
                        value={formData.appointmentType} 
                        onChange={handleChange} 
                        className={styles.select} 
                        required 
                    >
                        <option value="">선택</option>
                        {appointmentTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                {/* 발령 일자 */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>발령 일자</label>
                    <input 
                        type="date" 
                        name="effectiveDate" 
                        value={formData.effectiveDate} 
                        onChange={handleChange} 
                        className={styles.input} 
                        required 
                    />
                </div>

                {/* 새 부서명 (선택사항) */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>새 부서 (선택)</label>
                    <select 
                        name="newDepartmentName" 
                        value={formData.newDepartmentName} 
                        onChange={handleChange} 
                        className={styles.select}
                    >
                        <option value="">선택 안함</option>
                        {departmentNames.map(deptName => (
                            <option key={deptName} value={deptName}>
                                {deptName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 새 직급명 (선택사항) */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>새 직급 (선택)</label>
                    <select 
                        name="newPositionName" 
                        value={formData.newPositionName} 
                        onChange={handleChange} 
                        className={styles.select}
                    >
                        <option value="">선택 안함</option>
                        {positionNames.map(posName => (
                            <option key={posName} value={posName}>
                                {posName}
                            </option>
                        ))}
                    </select>
                </div>

            </div>

            {/* 직원 검색 모달 */}
            <EmployeeSearchModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelectEmployee={handleSelectEmployee}
            />
        </div>
    );
};

export default ApplyInputGrid;

