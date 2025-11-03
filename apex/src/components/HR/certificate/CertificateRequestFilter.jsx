import React from 'react';
import { FilterCard, FilterGroup, Select } from '../../../components/common';
import { ISSUE_STATUS_OPTIONS, CERTIFICATE_TYPES } from '../../../models/data/CertificateIssueMOCK.js';

const CertificateRequestFilter = ({ 
    searchParams, 
    onSearchChange, 
    onSearchSubmit,
    onReset 
}) => {
    // 증명서 타입 옵션 준비
    const certificateOptions = [
        { value: '', label: '전체' },
        ...Object.entries(CERTIFICATE_TYPES).map(([key, value]) => ({
            value: key,
            label: value
        }))
    ];

    // 처리상태 옵션 준비
    const statusOptions = [
        { value: '', label: '전체' },
        ...ISSUE_STATUS_OPTIONS.map(opt => ({
            value: opt.value,
            label: opt.label
        }))
    ];

    const handleReset = () => {
        onReset && onReset();
    };

    return (
        <FilterCard 
            title="증명서 신청 조회" 
            onSearch={onSearchSubmit}
            onReset={handleReset}
        >
            <FilterGroup label="증명서">
                <Select 
                    name="certificateType" 
                    value={searchParams.certificateType} 
                    onChange={onSearchChange}
                    options={certificateOptions}
                    placeholder="전체"
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

export default CertificateRequestFilter;
