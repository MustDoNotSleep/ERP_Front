import React from 'react';
import { FilterCard, FilterGroup, Input } from '../../common';

const LeaveManageFilter = ({ 
    searchParams, 
    onSearchChange, 
    onSearchSubmit,
    onReset,
    onOpenEmployeeSearch,
    statusFilter,
    onStatusFilterChange,
    leaveTypeFilter,
    onLeaveTypeFilterChange
}) => {
    const handleResetClick = () => {
        if (onReset) {
            onReset();
        }
    };


    // 상단 행 스타일: 타이틀 왼쪽, 상태 드롭다운 오른쪽
    const headerRowStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem'
    };

    return (
        <FilterCard 
            onSearch={onSearchSubmit}
            onReset={handleResetClick}
        >
            <div style={headerRowStyle}>
                <span style={{ fontSize: '1.5rem', fontWeight: 600, color: '#333' }}>근태 승인 조회</span>
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
                    <option value="APPROVED">승인</option>
                    <option value="REJECTED">반려</option>
                    <option value="CANCELLED">취소</option>
                </select>
            </div>
            <FilterGroup label="이름">
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

            <FilterGroup label="근태구분">
                <select 
                    value={leaveTypeFilter}
                    onChange={onLeaveTypeFilterChange}
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
                    <option value="ANNUAL">연차</option>
                    <option value="SICK">병가</option>
                    <option value="SICK_PAID">유급병가</option>
                    <option value="MATERNITY">출산휴가</option>
                    <option value="PATERNITY">배우자출산휴가</option>
                    <option value="CHILDCARE">육아휴직</option>
                    <option value="MARRIAGE">결혼휴가</option>
                    <option value="FAMILY_MARRIAGE">가족결혼휴가</option>
                    <option value="BEREAVEMENT">경조사</option>
                    <option value="OFFICIAL">공가</option>
                    <option value="UNPAID">무급휴가</option>
                </select>
            </FilterGroup>
        </FilterCard>
    );
};

export default LeaveManageFilter;
