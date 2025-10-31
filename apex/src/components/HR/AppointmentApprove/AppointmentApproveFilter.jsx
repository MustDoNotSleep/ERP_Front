import React from 'react';
import { FilterCard, FilterGroup, Input, Select } from '../../../components/common';

const AppointmentApproveFilter = ({ 
    searchParams, 
    onSearchChange, 
    onSearchSubmit,
    onReset 
}) => {
    const departmentOptions = [
        { value: '1', label: '경영기획본부' },
        { value: '2', label: '침해사고대응본부' },
        { value: '3', label: '자율보안본부' },
        { value: '4', label: '보안연구본부' }
    ];

    const handleResetClick = () => {
        if (onReset) {
            onReset();
        }
    };

    return (
        <FilterCard 
            title="인사발령 관리" 
            onSearch={onSearchSubmit}
            onReset={handleResetClick}
        >
            <FilterGroup label="이름">
                <Input
                    type="text"
                    id="employeeName"
                    name="employeeName"
                    value={searchParams.employeeName}
                    onChange={onSearchChange}
                    placeholder="이름을 입력하세요"
                />
            </FilterGroup>

            <FilterGroup label="사원번호">
                <Input
                    type="text"
                    id="employeeId"
                    name="employeeId"
                    value={searchParams.employeeId}
                    onChange={onSearchChange}
                    placeholder="사원번호를 입력하세요"
                />
            </FilterGroup>

            <FilterGroup label="요청일">
                <Input
                    type="date"
                    id="requestDate"
                    name="requestDate"
                    value={searchParams.requestDate}
                    onChange={onSearchChange}
                />
            </FilterGroup>

            <FilterGroup label="부서">
                <Select
                    id="departmentId"
                    name="departmentId"
                    value={searchParams.departmentId}
                    onChange={onSearchChange}
                    options={departmentOptions}
                    placeholder="전체"
                />
            </FilterGroup>
        </FilterCard>
    );
};

export default AppointmentApproveFilter;