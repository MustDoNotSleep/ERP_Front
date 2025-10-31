import React from 'react';
import { FilterCard, FilterGroup, Input, Select } from '../../../components/common';

// ✨ 목 데이터 임포트
import { APPROVAL_STATUS_OPTIONS } from '../../../models/data/TrainingMOCK';
import { DEPARTMENT_MOCK } from '../../../models/data/DepartmentMOCK';
import { POSITIONS_MOCK } from '../../../models/data/PositionsMOCK';

const TrainingApprovalFilter = ({ 
    searchParams, 
    onSearchChange, 
    onSearchSubmit,
    onReset 
}) => {
    // 부서/직급 드롭다운 옵션 데이터 준비
    const departmentOptions = DEPARTMENT_MOCK.map(dept => ({
        value: dept.departmentId,
        label: dept.departmentName
    }));
    
    const positionOptions = POSITIONS_MOCK.map(pos => ({
        value: pos.positionId,
        label: pos.positionName
    }));
    
    // 처리상태 드롭다운 옵션 데이터 준비
    const statusOptions = APPROVAL_STATUS_OPTIONS.map(status => ({
        value: status.value,
        label: status.label
    }));

    const handleReset = () => {
        onReset && onReset();
    };

    return (
        <FilterCard 
            title="교육과정 승인/조회" 
            onSearch={onSearchSubmit}
            onReset={handleReset}
        >
            <FilterGroup label="부서">
                <Select 
                    name="departmentId" 
                    value={searchParams.departmentId} 
                    onChange={onSearchChange}
                    options={departmentOptions}
                    placeholder="전체"
                />
            </FilterGroup>

            <FilterGroup label="직급">
                <Select 
                    name="positionId" 
                    value={searchParams.positionId} 
                    onChange={onSearchChange}
                    options={positionOptions}
                    placeholder="전체"
                />
            </FilterGroup>
            
            <FilterGroup label="교육명">
                <Input 
                    type="text" 
                    name="courseName" 
                    value={searchParams.courseName} 
                    onChange={onSearchChange}
                    placeholder="교육명을 입력하세요"
                />
            </FilterGroup>

            <FilterGroup label="신청일자">
                <Input 
                    type="date" 
                    name="applicationDate" 
                    value={searchParams.applicationDate} 
                    onChange={onSearchChange}
                />
            </FilterGroup>
            
            <FilterGroup label="처리상태">
                <Select 
                    name="approvalStatus" 
                    value={searchParams.approvalStatus} 
                    onChange={onSearchChange}
                    options={statusOptions}
                    placeholder="전체"
                />
            </FilterGroup>
        </FilterCard>
    );
};

export default TrainingApprovalFilter;