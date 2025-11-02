import React from 'react';
import { FilterCard, FilterGroup, Input } from '../../../components/common';

const CareerSearchFilter = ({ 
    searchParams, 
    onSearchChange, 
    onSearchSubmit,
    onReset,
    onOpenEmployeeSearch  // 직원 검색 모달 열기
}) => {
    const handleChange = (e) => {
        onSearchChange(e.target.name, e.target.value);
    };

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
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Input 
                        type="text" 
                        name="name" 
                        value={searchParams.name} 
                        onChange={(e) => handleChange(e)}
                        placeholder="이름을 입력하세요"
                        readOnly
                        style={{ flex: 1, cursor: 'pointer' }}
                        onClick={onOpenEmployeeSearch}
                    />
                    <button
                        type="button"
                        onClick={onOpenEmployeeSearch}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        직원 검색
                    </button>
                </div>
            </FilterGroup>
            
            <FilterGroup label="사원번호">
                <Input 
                    name="employeeId" 
                    value={searchParams.employeeId} 
                    onChange={(e) => handleChange(e)}
                    placeholder="사원번호"
                    readOnly
                    style={{ backgroundColor: '#f5f5f5' }}
                />
            </FilterGroup>
            
            <FilterGroup label="부서">
                <Input 
                    name="department" 
                    value={searchParams.department} 
                    onChange={(e) => handleChange(e)}
                    placeholder="부서"
                    readOnly
                    style={{ backgroundColor: '#f5f5f5' }}
                />
            </FilterGroup>

            <FilterGroup label="팀">
                <Input 
                    name="team" 
                    value={searchParams.team} 
                    onChange={(e) => handleChange(e)}
                    placeholder="팀"
                    readOnly
                    style={{ backgroundColor: '#f5f5f5' }}
                />
            </FilterGroup>
        </FilterCard>
    );
};

export default CareerSearchFilter;