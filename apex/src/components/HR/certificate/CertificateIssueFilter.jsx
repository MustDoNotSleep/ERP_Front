import React from 'react';
import { FilterCard, FilterGroup, Input, Select } from '../../../components/common';

// ✨ 목 데이터 임포트
// 👈 (수정) CERTIFICATE_TYPES -> CERTIFICATE_TYPE_LABELS 로 변경
// import { ISSUE_STATUS_OPTIONS, CERTIFICATE_TYPES } from '../../../models/data/CertificateIssueMOCK.js';
import { ISSUE_STATUS_OPTIONS, CERTIFICATE_TYPE_LABELS } from '../../../models/data/CertificateIssueMOCK.js';


const CertificateIssueFilter = ({ 
    searchParams, 
    onSearchChange, 
    onSearchSubmit,
    onReset 
}) => {
    // 증명서 타입 옵션 준비
    // 👈 (수정) MOCK에서 가져온 새 객체(CERTIFICATE_TYPE_LABELS)를 사용하고, '전체' 옵션을 추가합니다.
    const certificateOptions = [
        { value: '', label: '전체' }, // 👈 (추가) '전체' 옵션
        // ...Object.entries(CERTIFICATE_TYPES).map(([key, value]) => ({ // 👈 (수정 전)
        ...Object.entries(CERTIFICATE_TYPE_LABELS).map(([key, value]) => ({ // 👈 (수정 후)
            value: key,
            label: value
        }))
    ];

    // 처리상태 옵션 준비
    // 👈 (수정) '전체' 옵션을 추가합니다.
    const statusOptions = [
        { value: '', label: '전체' }, // 👈 (추가) '전체' 옵션
        ...ISSUE_STATUS_OPTIONS.map(opt => ({
            value: opt.value,
            label: opt.label
        }))
    ];
    /* (수정 전)
    const statusOptions = ISSUE_STATUS_OPTIONS.map(opt => ({
        value: opt.value,
        label: opt.label
    }));
    */

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
                    // name="certificateType"                 // (DB와 맞도록 이전에 수정함)
                    name="documentType"                    
                    // value={searchParams.certificateType}  // (DB와 맞도록 이전에 수정함)
                    value={searchParams.documentType}     
                    onChange={onSearchChange}
                    options={certificateOptions} // 👈 수정된 'certificateOptions' 사용
                    placeholder="증명서 종류를 선택하세요" // 👈 '전체' 옵션을 추가했으므로 placeholder 대신 '전체'가 기본 표시됨
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
                    // name="issueStatus"                   // (DB와 맞도록 이전에 수정함)
                    name="documentStatus"                 
                    // value={searchParams.issueStatus}    // (DB와 맞도록 이전에 수정함)
                    value={searchParams.documentStatus}  
                    onChange={onSearchChange}
                    options={statusOptions} // 👈 수정된 'statusOptions' 사용
                    placeholder="전체" // 👈 '전체' 옵션을 추가했으므로 placeholder 대신 '전체'가 기본 표시됨
                />
            </FilterGroup>
        </FilterCard>
    );
};

export default CertificateIssueFilter;