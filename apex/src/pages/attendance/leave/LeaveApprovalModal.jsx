import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/common';
import { Button } from '../../../components/common';
import api from '../../../api/axios';
import styles from './LeaveApprovalModal.module.css';

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

export default function LeaveApprovalModal({ isOpen, onClose, onApprovalComplete }) {
    const [pendingLeaves, setPendingLeaves] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasWarned, setHasWarned] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadPendingLeaves();
        }
    }, [isOpen]);

    const loadPendingLeaves = async () => {
        setLoading(true);
        try {
            const response = await api.get('/leaves/pending');
            
            let leaveList = [];
            if (response.data?.success && response.data?.data) {
                leaveList = response.data.data;
            } else if (response.data?.data) {
                leaveList = response.data.data;
            } else if (Array.isArray(response.data)) {
                leaveList = response.data;
            }
            
            console.log('📋 대기 중인 휴가 목록:', leaveList);
            setPendingLeaves(leaveList);
        } catch (error) {
            console.error('❌ 대기 중인 휴가 목록 조회 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRowSelect = (id) => {
        const selectedItem = pendingLeaves.find(item => item.id === id);
        const status = selectedItem?.status;
        
        // 이미 처리된 항목은 선택 불가
        if (status === 'APPROVED' || status === '승인' || 
            status === 'REJECTED' || status === '반려' || 
            status === 'CANCELLED' || status === '취소') {
            alert('이미 처리 완료된 항목은 선택할 수 없습니다.');
            return;
        }

        // 첫 선택 시 경고
        if (!hasWarned && selectedRows.length === 0) {
            const confirmed = window.confirm(
                '⚠️ 중요 안내\n\n' +
                '승인 또는 반려 처리 후에는 되돌릴 수 없습니다.\n' +
                '신중하게 선택해주세요.\n\n' +
                '계속 진행하시겠습니까?'
            );
            if (!confirmed) {
                return;
            }
            setHasWarned(true);
        }
        
        setSelectedRows(prev => 
            prev.includes(id) 
                ? prev.filter(rowId => rowId !== id) 
                : [...prev, id]
        );
    };

    const handleAction = async (action) => {
        if (selectedRows.length === 0) {
            alert(`먼저 ${action === 'approve' ? '승인' : '반려'}할 항목을 선택해주세요.`);
            return;
        }

        const actionText = action === 'approve' ? '승인' : '반려';
        const confirmed = window.confirm(`선택한 ${selectedRows.length}건의 휴가 신청을 ${actionText}하시겠습니까?`);
        
        if (!confirmed) return;

        setLoading(true);
        try {
            const promises = selectedRows.map(leaveId => {
                const requestData = {
                    approved: action === 'approve',
                    comment: action === 'approve' ? '승인되었습니다.' : '반려되었습니다.'
                };
                return api.put(`/leaves/${leaveId}/process`, requestData);
            });
            
            await Promise.all(promises);
            
            alert(`선택된 항목이 ${actionText} 처리되었습니다.`);
            setSelectedRows([]);
            loadPendingLeaves();
            
            // 부모 컴포넌트에 승인 완료 알림
            if (onApprovalComplete) {
                onApprovalComplete();
            }
        } catch (error) {
            console.error(`❌ ${actionText} 처리 실패:`, error);
            const errorMessage = error.response?.data?.error || 
                                error.response?.data?.message || 
                                '처리 중 오류가 발생했습니다.';
            alert(errorMessage);
        } finally {
            setLoading(false);
            setHasWarned(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="근태 승인 조회" size="full">
            <div className={styles.modalContent}>
                {loading ? (
                    <div className={styles.loadingMessage}>
                        데이터를 불러오는 중...
                    </div>
                ) : pendingLeaves.length === 0 ? (
                    <div className={styles.emptyMessage}>
                        승인 대기 중인 휴가 신청이 없습니다.
                    </div>
                ) : (
                    <>
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>선택</th>
                                        <th>요청일</th>
                                        <th>사번</th>
                                        <th>이름</th>
                                        <th>부서</th>
                                        <th>휴가 종류</th>
                                        <th>기간 구분</th>
                                        <th>시작일</th>
                                        <th>종료일</th>
                                        <th>사유</th>
                                        <th>상태</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingLeaves.map((item) => {
                                        const status = item.status;
                                        const isProcessed = status === 'APPROVED' || status === '승인' || 
                                                          status === 'REJECTED' || status === '반려' || 
                                                          status === 'CANCELLED' || status === '취소';
                                        
                                        let statusClass = '';
                                        if (status === 'PENDING' || status === '대기') {
                                            statusClass = styles.statusPending;
                                        } else if (status === 'APPROVED' || status === '승인') {
                                            statusClass = styles.statusApproved;
                                        } else if (status === 'REJECTED' || status === '반려') {
                                            statusClass = styles.statusRejected;
                                        }

                                        return (
                                            <tr 
                                                key={item.id}
                                                style={{
                                                    backgroundColor: isProcessed ? '#f5f5f5' : 'transparent',
                                                    opacity: isProcessed ? 0.7 : 1
                                                }}
                                            >
                                                <td>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={selectedRows.includes(item.id)}
                                                        onChange={() => handleRowSelect(item.id)}
                                                        disabled={isProcessed}
                                                        style={{ cursor: isProcessed ? 'not-allowed' : 'pointer' }}
                                                    />
                                                </td>
                                                <td>{item.createdAt || '-'}</td>
                                                <td>{item.employeeId || '-'}</td>
                                                <td>{item.employeeName || '-'}</td>
                                                <td>{item.departmentName || '-'}</td>
                                                <td>{getLeaveTypeLabel(item.type)}</td>
                                                <td>{getDurationLabel(item.duration)}</td>
                                                <td>{item.startDate || '-'}</td>
                                                <td>{item.endDate || '-'}</td>
                                                <td>{item.reason || '-'}</td>
                                                <td>
                                                    <span className={`${styles.badge} ${statusClass}`}>
                                                        {status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className={styles.buttonGroup}>
                            <Button 
                                variant="danger"
                                onClick={() => handleAction('reject')} 
                                disabled={loading}
                            >
                                반려
                            </Button>
                            <Button 
                                variant="primary"
                                onClick={() => handleAction('approve')} 
                                disabled={loading}
                            >
                                {loading ? "처리 중..." : "최종승인"}
                            </Button>
                        </div>
                    </>
                )}

                <div className={styles.footer}>
                    <button className={styles.closeButton} onClick={onClose}>
                        닫기
                    </button>
                </div>
            </div>
        </Modal>
    );
}
