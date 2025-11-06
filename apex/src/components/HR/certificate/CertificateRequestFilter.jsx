import React from 'react';
import { FilterCard, FilterGroup, Select } from '../../../components/common';
// 👈 (수정) CERTIFICATE_TYPES -> CERTIFICATE_TYPE_LABELS 로 변경
// import { ISSUE_STATUS_OPTIONS, CERTIFICATE_TYPES } from '../../../models/data/CertificateIssueMOCK.js';
import { ISSUE_STATUS_OPTIONS, CERTIFICATE_TYPE_LABELS } from '../../../models/data/CertificateIssueMOCK.js';


const CertificateRequestFilter = ({ 
    searchParams, 
    onSearchChange, 
    onSearchSubmit,
    onReset 
}) => {
    // 증명서 타입 옵션 준비
    // 👈 (수정) MOCK에서 가져온 새 객체(CERTIFICATE_TYPE_LABELS)를 사용합니다.
    const certificateOptions = [
        { value: '', label: '전체' },
        // ...Object.entries(CERTIFICATE_TYPES).map(([key, value]) => ({ // 👈 (수정 전)
        ...Object.entries(CERTIFICATE_TYPE_LABELS).map(([key, value]) => ({ // 👈 (수정 후)
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
                    // name="certificateType"                 // (DB와 맞도록 이전에 수정함)
                    name="documentType"                    
                    // value={searchParams.certificateType}  // (DB와 맞도록 이전에 수정함)
                    value={searchParams.documentType}     
                    onChange={onSearchChange}
                    options={certificateOptions} // 👈 수정된 'certificateOptions' 사용
                    placeholder="전체"
                />
            </FilterGroup>
            
            <FilterGroup label="처리상태">
                <Select 
                    // name="issueStatus"                   // (DB와 맞도록 이전에 수정함)
                    name="documentStatus"                 
                    // value={searchParams.issueStatus}    // (DB와 맞도록 이전에 수정함)
                    value={searchParams.documentStatus}  
                    onChange={onSearchChange}
                    options={statusOptions}
                    placeholder="전체"
                />
            </FilterGroup>
        </FilterCard>
    );
};

export default CertificateRequestFilter;