import React, { useState, useEffect } from 'react';
import styles from './LeaveManage.module.css';
import tableStyles from '../../../components/common/DataTable.module.css';
import DataTable from '../../../components/common/DataTable';
import LeaveManageFilter from '../../../components/attendance/LeaveManage/LeaveManageFilter';
import LeaveApprovalModal from './LeaveApprovalModal';
import EmployeeSearchModal from '../../../components/common/EmployeeSearchModal';
import { Button } from '../../../components/common';
import api from '../../../api/axios';

const TABLE_HEADERS = [
    '요청일', '사번', '이름', '부서', '휴가 종류', '기간 구분', '시작일', '종료일', '사유', '상태', '승인자'
];

// 휴가 종류 한글 변환
const getLeaveTypeLabel = (type) => {
    const labels = {
        'ANNUAL': '연차',
        'SICK': '병가',
        'SICK_PAID': '유급병가',
        'MATERNITY': '출산휴가',
        'PATERNITY': '배우자출산휴가',
        'CHILDCARE': '육아휴직',
        'MARRIAGE': '결혼휴가',
        'FAMILY_MARRIAGE': '가족결혼휴가',
        'BEREAVEMENT': '경조사',
        'OFFICIAL': '공가',
        'UNPAID': '무급휴가'
    };
    return labels[type] || type;
};

// 기간 구분 한글 변환
const getDurationLabel = (duration) => {
    const labels = {
        'FULL_DAY': '종일',
        'HALF_DAY_AM': '오전 반차',
        'HALF_DAY_PM': '오후 반차',
        'QUARTER_DAY_AM': '오전 반반차',
        'QUARTER_DAY_PM': '오후 반반차'
    };
    return labels[duration] || duration;
};

export default function LeaveManage() {
    const [leaves, setLeaves] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState('ALL'); // 전체로 변경
    const [leaveTypeFilter, setLeaveTypeFilter] = useState('ALL');
    const [isEmployeeSearchOpen, setIsEmployeeSearchOpen] = useState(false);
    const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false); // 승인 모달
    
    const [searchParams, setSearchParams] = useState({
        employeeName: '',
        employeeId: '',
        requestDate: ''
    });

    // 데이터 조회 함수 - 모든 휴가 기록 조회 (상태별 필터링 지원)
    const fetchData = async () => {
        setIsLoading(true);
        try {
            let response;
            
            // 상태별로 다른 API 엔드포인트 호출
            if (statusFilter === 'PENDING' || statusFilter === '대기') {
                response = await api.get('/leaves/pending');
            } else if (statusFilter === 'APPROVED' || statusFilter === '승인') {
                response = await api.get('/leaves/status/APPROVED');
            } else if (statusFilter === 'REJECTED' || statusFilter === '반려') {
                response = await api.get('/leaves/status/REJECTED');
            } else if (statusFilter === 'CANCELLED' || statusFilter === '취소') {
                response = await api.get('/leaves/status/CANCELLED');
            } else {
                // 전체 조회는 pending + approved + rejected + cancelled 합치기
                const [pendingRes, approvedRes, rejectedRes, cancelledRes] = await Promise.all([
                    api.get('/leaves/pending').catch(() => ({ data: { data: [] } })),
                    api.get('/leaves/status/APPROVED').catch(() => ({ data: { data: [] } })),
                    api.get('/leaves/status/REJECTED').catch(() => ({ data: { data: [] } })),
                    api.get('/leaves/status/CANCELLED').catch(() => ({ data: { data: [] } }))
                ]);
                
                const allLeaves = [
                    ...(pendingRes.data?.data || []),
                    ...(approvedRes.data?.data || []),
                    ...(rejectedRes.data?.data || []),
                    ...(cancelledRes.data?.data || [])
                ];
                
                console.log('📋 조회된 전체 휴가 목록:', allLeaves);
                setLeaves(allLeaves);
                setIsLoading(false);
                return;
            }
            
            let leaveList = [];
            if (response.data?.success && response.data?.data) {
                leaveList = response.data.data;
            } else if (response.data?.data) {
                leaveList = response.data.data;
            } else if (Array.isArray(response.data)) {
                leaveList = response.data;
            }
            
            console.log('📋 조회된 휴가 목록:', leaveList);
            setLeaves(leaveList);
        } catch (error) {
            console.error('❌ 휴가 목록 조회 실패:', error);
            alert('데이터를 불러오는 데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    // 페이지 로드 시 데이터 조회
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter]); // statusFilter 변경 시 재조회

    // 검색 핸들러
    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        console.log('🔍 휴가 검색:', searchParams);
        fetchData();
    };

    const handleReset = () => {
        setSearchParams({
            employeeName: '',
            employeeId: '',
            requestDate: ''
        });
        setStatusFilter('ALL');
        setLeaveTypeFilter('ALL');
        fetchData();
    };

    // 직원 검색 모달
    const handleOpenEmployeeSearch = () => {
        setIsEmployeeSearchOpen(true);
    };

    const handleSelectEmployee = (employee) => {
        setSearchParams(prev => ({
            ...prev,
            employeeName: employee.name,
            employeeId: employee.id ? String(employee.id) : ''
        }));
        setIsEmployeeSearchOpen(false);
    };

    // 승인 조회 모달 열기
    const handleOpenApprovalModal = () => {
        setIsApprovalModalOpen(true);
    };

    // 승인 완료 후 데이터 새로고침
    const handleApprovalComplete = () => {
        fetchData();
    };

    // 테이블 행 렌더링
    const renderLeaveRow = (item) => {
        let statusStyle = '';
        const status = item.status;
        
        // 한글/영어 둘 다 지원
        if (status === 'REJECTED' || status === '반려') {
            statusStyle = styles.statusRejected;
        } else if (status === 'PENDING' || status === '대기') {
            statusStyle = styles.statusPending;
        } else if (status === 'APPROVED' || status === '승인') {
            statusStyle = styles.statusApproved;
        } else if (status === 'CANCELLED' || status === '취소') {
            statusStyle = styles.statusCancelled;
        }

        return (
            <>
                <td className={tableStyles.tableData}>{item.createdAt || '-'}</td>
                <td className={tableStyles.tableData}>{item.employeeId || '-'}</td>
                <td className={tableStyles.tableData}>{item.employeeName || '-'}</td>
                <td className={tableStyles.tableData}>{item.departmentName || '-'}</td>
                <td className={tableStyles.tableData}>{getLeaveTypeLabel(item.type)}</td>
                <td className={tableStyles.tableData}>{getDurationLabel(item.duration)}</td>
                <td className={tableStyles.tableData}>{item.startDate || '-'}</td>
                <td className={tableStyles.tableData}>{item.endDate || '-'}</td>
                <td className={tableStyles.tableData}>{item.reason || '-'}</td>
                <td className={`${tableStyles.tableData} ${statusStyle}`}>
                    {status}
                </td>
                <td className={tableStyles.tableData}>{item.approvedByName || '-'}</td>
            </>
        );
    };

    // 필터링 적용
    const filteredLeaves = leaves.filter(item => {
        // 이름 필터
        if (searchParams.employeeName && !item.employeeName?.includes(searchParams.employeeName)) {
            return false;
        }
        
        // 사원번호 필터
        if (searchParams.employeeId && String(item.employeeId) !== searchParams.employeeId) {
            return false;
        }
        
        // 요청일 필터
        if (searchParams.requestDate && item.createdAt !== searchParams.requestDate) {
            return false;
        }
        
        // 상태 필터 (한글/영어 둘 다 지원)
        if (statusFilter !== 'ALL') {
            const statusMap = {
                'PENDING': '대기',
                'APPROVED': '승인',
                'REJECTED': '반려',
                'CANCELLED': '취소'
            };
            const koreanStatus = statusMap[statusFilter];
            if (item.status !== statusFilter && item.status !== koreanStatus) {
                return false;
            }
        }
        
        // 휴가 종류 필터 (한글/영어 둘 다 지원)
        if (leaveTypeFilter !== 'ALL') {
            const typeMap = {
                'ANNUAL': '연차',
                'SICK': '병가',
                'SICK_PAID': '유급병가',
                'MATERNITY': '출산휴가',
                'PATERNITY': '배우자출산휴가',
                'CHILDCARE': '육아휴직',
                'MARRIAGE': '결혼휴가',
                'FAMILY_MARRIAGE': '가족결혼휴가',
                'BEREAVEMENT': '경조사',
                'OFFICIAL': '공가',
                'UNPAID': '무급휴가'
            };
            const koreanType = typeMap[leaveTypeFilter];
            if (item.type !== leaveTypeFilter && item.type !== koreanType) {
                return false;
            }
        }
        
        return true;
    });

    return (
        <div className={styles.pageContainer}>
            {/* 직원 검색 모달 */}
            <EmployeeSearchModal
                isOpen={isEmployeeSearchOpen}
                onClose={() => setIsEmployeeSearchOpen(false)}
                onSelectEmployee={handleSelectEmployee}
            />

            {/* 승인 조회 모달 */}
            <LeaveApprovalModal
                isOpen={isApprovalModalOpen}
                onClose={() => setIsApprovalModalOpen(false)}
                onApprovalComplete={handleApprovalComplete}
            />

            <div className={styles.filterSection}>
                <LeaveManageFilter
                    searchParams={searchParams}
                    onSearchChange={handleSearchChange}
                    onSearchSubmit={handleSearch}
                    onReset={handleReset}
                    onOpenEmployeeSearch={handleOpenEmployeeSearch}
                    statusFilter={statusFilter}
                    onStatusFilterChange={(e) => setStatusFilter(e.target.value)}
                    leaveTypeFilter={leaveTypeFilter}
                    onLeaveTypeFilterChange={(e) => setLeaveTypeFilter(e.target.value)}
                />
            </div>

            {/* 승인 조회 버튼 */}
            <div className={styles.approvalButtonSection}>
                <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={styles.statusSelect}
                >
                    <option value="ALL">전체</option>
                    <option value="PENDING">대기</option>
                    <option value="APPROVED">승인</option>
                    <option value="REJECTED">반려</option>
                    <option value="CANCELLED">취소</option>
                </select>
                <Button 
                    variant="primary"
                    onClick={handleOpenApprovalModal}
                >
                    미결재 항목
                </Button>
            </div>

            {isLoading && <p>데이터를 불러오는 중입니다...</p>}

            {!isLoading && filteredLeaves.length > 0 && (
                <DataTable
                    headers={TABLE_HEADERS}
                    data={filteredLeaves}
                    renderRow={renderLeaveRow}
                />
            )}
            
            {!isLoading && filteredLeaves.length === 0 && (
                <div className={styles.noDataMessage}>조회된 데이터가 없습니다.</div>
            )}
        </div>
    );
}

