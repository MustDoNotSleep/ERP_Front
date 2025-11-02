import React from 'react';
import { FilterCard, FilterGroup, Input, Select } from '../../../components/common';

const TrainingApprovalFilter = ({ 
    searchParams, 
    onSearchChange, 
    onSearchSubmit,
    onReset 
}) => {
    // 교육 기간 상태 옵션
    const dateStatusOptions = [
        { value: '', label: '전체' },
        { value: 'UPCOMING', label: '예정' },
        { value: 'ONGOING', label: '진행중' },
        { value: 'COMPLETED', label: '종료' }
    ];
    
    // 승인 상태 옵션
    const approvalStatusOptions = [
        { value: '', label: '전체' },
        { value: 'PENDING', label: '대기' },
        { value: 'APPROVED', label: '승인' },
        { value: 'REJECTED', label: '반려' }
    ];

    const handleReset = () => {
        onReset && onReset();
    };

    return (
        <FilterCard 
            title="교육과정 승인/조회" 
            onSearch={onSearchSubmit}
            onReset={handleReset}
        >
            <FilterGroup label="교육명">
                <Input 
                    type="text" 
                    name="courseName" 
                    value={searchParams.courseName} 
                    onChange={onSearchChange}
                    placeholder="교육명을 입력하세요"
                />
            </FilterGroup>

            <FilterGroup label="교육 기간">
                <Select 
                    name="dateStatus" 
                    value={searchParams.dateStatus} 
                    onChange={onSearchChange}
                    options={dateStatusOptions}
                    placeholder="전체"
                />
            </FilterGroup>
            
            <FilterGroup label="승인 상태">
                <Select 
                    name="approvalStatus" 
                    value={searchParams.approvalStatus} 
                    onChange={onSearchChange}
                    options={approvalStatusOptions}
                    placeholder="전체"
                />
            </FilterGroup>
        </FilterCard>
    );
};

export default TrainingApprovalFilter;