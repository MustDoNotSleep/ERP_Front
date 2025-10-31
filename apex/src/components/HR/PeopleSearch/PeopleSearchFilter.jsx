import React from 'react';
import { FilterCard, FilterGroup, Input, Select } from '../../../components/common';

const PeopleSearchFilter = ({ 
    searchParams,
    onSearchChange,
    onSearchSubmit,
    onReset,
    positions = [],
    teams = []
}) => {
    const handleChange = (e) => {
        onSearchChange(e);
    };

    const handleResetClick = () => {
        if (onReset) {
            onReset();
        }
    };

    // positions 배열을 Select 옵션 형식으로 변환
    const positionOptions = positions.map(pos => ({
        value: pos.positionName,
        label: pos.positionName
    }));

    // teams 배열을 Select 옵션 형식으로 변환
    const teamOptions = teams.map((team, index) => ({
        value: team,
        label: team
    }));

    return (
        <FilterCard 
            title="직원 조회" 
            onSearch={onSearchSubmit}
            onReset={handleResetClick}
        >
            <FilterGroup label="이름">
                <Input
                    type="text"
                    id="name"
                    name="name"
                    value={searchParams.name}
                    onChange={handleChange}
                    placeholder="이름을 입력하세요"
                />
            </FilterGroup>

            <FilterGroup label="이메일">
                <Input
                    type="text"
                    id="email"
                    name="email"
                    value={searchParams.email}
                    onChange={handleChange}
                    placeholder="이메일을 입력하세요"
                />
            </FilterGroup>

            <FilterGroup label="사원번호">
                <Input
                    type="text"
                    id="employeeId"
                    name="employeeId"
                    value={searchParams.employeeId}
                    onChange={handleChange}
                    placeholder="사원번호를 입력하세요"
                />
            </FilterGroup>

            <FilterGroup label="직급">
                <Select
                    id="positionName"
                    name="positionName"
                    value={searchParams.positionName}
                    onChange={handleChange}
                    options={positionOptions}
                    placeholder="전체"
                />
            </FilterGroup>

            <FilterGroup label="소속">
                <Select
                    id="teamName"
                    name="teamName"
                    value={searchParams.teamName}
                    onChange={handleChange}
                    options={teamOptions}
                    placeholder="전체"
                />
            </FilterGroup>
        </FilterCard>
    );
};

export default PeopleSearchFilter;