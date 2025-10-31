import React from 'react';
import { FilterCard, FilterGroup, Input, Select } from '../../../components/common';

// ✨ 목 데이터 임포트
import { ISSUE_STATUS_OPTIONS, CERTIFICATE_TYPES } from '../../../models/data/CertificateIssueMOCK.js';

const CertificateIssueFilter = ({ 
    searchParams, 
    onSearchChange, 
    onSearchSubmit,
    onReset 
}) => {
    // 증명서 타입 옵션 준비
    const certificateOptions = Object.entries(CERTIFICATE_TYPES).map(([key, value]) => ({
        value: key,
        label: value
    }));

    // 처리상태 옵션 준비
    const statusOptions = ISSUE_STATUS_OPTIONS.map(opt => ({
        value: opt.value,
        label: opt.label
    }));

    const handleReset = () => {
        onReset && onReset();
    };

    return (
        <FilterCard 
            title="증명서 발급 관리" 
            onSearch={onSearchSubmit}
            onReset={handleReset}
        >
            <FilterGroup label="사원명">
                <Input 
                    type="text" 
                    name="employeeName" 
                    value={searchParams.employeeName} 
                    onChange={onSearchChange}
                    placeholder="사원명을 입력하세요"
                />
            </FilterGroup>
            
            <FilterGroup label="사원번호">
                <Input 
                    type="text" 
                    name="employeeId" 
                    value={searchParams.employeeId} 
                    onChange={onSearchChange}
                    placeholder="사원번호를 입력하세요"
                />
            </FilterGroup>
            
            <FilterGroup label="증명서">
                <Select 
                    name="certificateType" 
                    value={searchParams.certificateType} 
                    onChange={onSearchChange}
                    options={certificateOptions}
                    placeholder="증명서 종류를 선택하세요"
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
                    name="issueStatus" 
                    value={searchParams.issueStatus} 
                    onChange={onSearchChange}
                    options={statusOptions}
                    placeholder="전체"
                />
            </FilterGroup>
        </FilterCard>
    );
};

export default CertificateIssueFilter;