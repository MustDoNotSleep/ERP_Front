import React from 'react';
import { FilterCard, FilterGroup, Input, Select } from '../../../components/common';

const CareerSearchFilter = ({ 
    searchParams, 
    onSearchChange, 
    onSearchSubmit,
    onReset,
    departments = [], 
    teams = [] 
}) => {
    const handleChange = (e) => {
        onSearchChange(e.target.name, e.target.value);
    };

    // departments 배열을 Select 옵션 형식으로 변환
    const departmentOptions = departments.map((dept, index) => ({
        value: dept.value || dept.name,
        label: dept.name
    }));

    // teams 배열을 Select 옵션 형식으로 변환
    const teamOptions = teams.map((team, index) => ({
        value: team.value || team.name,
        label: team.name
    }));

    const handleReset = () => {
        onReset && onReset();
    };

    return (
        <FilterCard 
            title="경력 관리" 
            onSearch={onSearchSubmit}
            onReset={handleReset}
        >
            <FilterGroup label="이름">
                <Input 
                    type="text" 
                    name="name" 
                    value={searchParams.name} 
                    onChange={(e) => handleChange(e)}
                    placeholder="이름을 입력하세요"
                />
            </FilterGroup>
            
            <FilterGroup label="사원번호">
                <Input 
                    name="employeeId" 
                    value={searchParams.employeeId} 
                    onChange={(e) => handleChange(e)}
                    placeholder="사원번호를 입력하세요"
                />
            </FilterGroup>
            
            <FilterGroup label="부서">
                <Select 
                    name="department" 
                    value={searchParams.department} 
                    onChange={(e) => handleChange(e)}
                    options={departmentOptions}
                    placeholder="전체"
                />
            </FilterGroup>

            <FilterGroup label="팀">
                <Select 
                    name="team" 
                    value={searchParams.team} 
                    onChange={(e) => handleChange(e)}
                    options={teamOptions}
                    placeholder="전체"
                />
            </FilterGroup>
        </FilterCard>
    );
};

export default CareerSearchFilter;