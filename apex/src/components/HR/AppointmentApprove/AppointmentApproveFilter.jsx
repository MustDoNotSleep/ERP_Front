import React from 'react';
import { FilterCard, FilterGroup, Input } from '../../../components/common';

const AppointmentApproveFilter = ({ 
    searchParams, 
    onSearchChange, 
    onSearchSubmit,
    onReset,
    onOpenEmployeeSearch,  // 직원 검색 모달 열기
    statusFilter,          // 상태 필터 값
    onStatusFilterChange   // 상태 필터 변경 핸들러
}) => {
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
            <FilterGroup label="대상 직원">
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Input
                        type="text"
                        id="employeeName"
                        name="employeeName"
                        value={searchParams.employeeName}
                        onChange={onSearchChange}
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
                    type="text"
                    id="employeeId"
                    name="employeeId"
                    value={searchParams.employeeId}
                    onChange={onSearchChange}
                    placeholder="사원번호"
                    readOnly
                    style={{ backgroundColor: '#f5f5f5' }}
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

            <FilterGroup label="상태">
                <select 
                    value={statusFilter}
                    onChange={onStatusFilterChange}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '4px',
                        border: 'none',
                        fontSize: '14px',
                        cursor: 'pointer',
                        backgroundColor: 'white',
                        minWidth: '120px'
                    }}
                >
                    <option value="ALL">전체</option>
                    <option value="PENDING">대기</option>
                    <option value="APPROVED">최종승인</option>
                    <option value="REJECTED">반려</option>
                </select>
            </FilterGroup>
        </FilterCard>
    );
};

export default AppointmentApproveFilter;