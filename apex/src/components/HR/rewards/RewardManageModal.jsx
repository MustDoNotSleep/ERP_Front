import React, { useState, useEffect } from 'react';
import styles from './RewardManageModal.module.css';
import { IoCloseOutline } from "react-icons/io5";

// 포상 옵션 정의 (RewardManage.jsx와 동일)
const rewardTypes = ['공로상', '우수사원상', '특별포상'];
const rewardForms = ['상금', '포인트', '연차', '상패/감사장'];
const statusOptions = ['대기', '승인', '반려', '지급 완료'];
const approvers = ['이부장', '박이사', '김대표'];

const RewardContent = ({ initialData, onSave, onClose }) => {
    // 원본 데이터를 복사하여 상태로 사용 (수정 가능하게)
    const [rewardData, setRewardData] = useState(initialData);
    const [isEditing, setIsEditing] = useState(initialData.isNew || false); // 새로 등록하는 경우 true로 시작
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        setRewardData(initialData);
        setIsEditing(initialData.isNew || false);
        setInitialLoading(false);
    }, [initialData]);

    if (initialLoading) {
        return <div className={styles.loadingMessage}>데이터를 불러오는 중입니다...</div>;
    }
    
    if (!rewardData || !rewardData.id) {
        return <div className={styles.errorMessage}>포상 데이터가 유효하지 않습니다.</div>;
    }

    const handleChange = (field, value) => {
        setRewardData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        // 유효성 검사 (예: 필수 필드 확인)
        const { rewardType, amount, name, employeeId, recommendDate } = rewardData;
        if (!rewardType || !amount || !name || !employeeId || !recommendDate) {
            alert("필수 항목(포상 종류, 지급액, 이름, 사번, 추천일)을 모두 입력해주세요.");
            return;
        }

        console.log("저장할 포상 데이터:", rewardData);
        onSave(rewardData); 
    };

    // 텍스트/숫자 입력 필드 렌더링 함수
    const renderInputField = (field, label, type = 'text') => (
        <div className={styles.detailRow}>
            <div className={styles.detailLabel}>{label}</div>
            <div className={styles.detailValue}>
                {isEditing ? (
                    <input
                        type={type}
                        value={rewardData[field] || ''}
                        onChange={(e) => handleChange(field, e.target.value)}
                        className={styles.inputField}
                        readOnly={field === 'employeeId' && !rewardData.isNew} // 사번은 등록 시에만 입력 가능
                    />
                ) : (
                    <span>{rewardData[field] || '-'}</span>
                )}
            </div>
        </div>
    );
    
    // 드롭다운 필드 렌더링 함수
    const renderSelectField = (field, label, options) => (
        <div className={styles.detailRow}>
            <div className={styles.detailLabel}>{label}</div>
            <div className={styles.detailValue}>
                {isEditing ? (
                    <select
                        value={rewardData[field] || options[0]}
                        onChange={(e) => handleChange(field, e.target.value)}
                        className={styles.inputField}
                    >
                        {options.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                ) : (
                    <span>{rewardData[field] || '-'}</span>
                )}
            </div>
        </div>
    );

    return (
        <div className={styles.rewardContainer}>
            <h2 className={styles.rewardTitle}>
                포상 {initialData.isNew ? '등록' : '상세'}
                <span className={styles.periodText}>{rewardData.name} ({rewardData.employeeId})</span>
            </h2>

            {/* 기본 정보 테이블 */}
            <div className={styles.infoTable}>
                <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>사번</div>
                    <div className={styles.infoValue}>{rewardData.employeeId}</div>
                    <div className={styles.infoLabel}>이름</div>
                    <div className={styles.infoValue}>{rewardData.name}</div>
                </div>
                <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>추천일</div>
                    <div className={styles.infoValue}>
                        {isEditing ? (
                            <input 
                                type="text" 
                                className={styles.dateInput}
                                value={rewardData.recommendDate || ''}
                                onChange={(e) => handleChange('recommendDate', e.target.value)}
                                placeholder="YYYY/MM/DD"
                            />
                        ) : (
                            rewardData.recommendDate
                        )}
                    </div>
                    <div className={styles.infoLabel}>부서/직급</div>
                    <div className={styles.infoValue}>{rewardData.teamName || 'N/A'}/{rewardData.positionName || 'N/A'}</div>
                </div>
            </div>

            {/* 포상 상세 항목 (조회/수정) */}
            <div className={styles.detailSection}>
                <h3 className={styles.sectionTitle}>포상 정보</h3>
                <div className={styles.detailGrid}>
                    {renderSelectField('rewardType', '포상 종류', rewardTypes)}
                    {renderSelectField('rewardForm', '포상 형태', rewardForms)}
                    
                    {renderInputField('amount', '지급액 (원)', 'number')}
                    {renderInputField('rewardReason', '포상 사유 (텍스트)', 'text')}
                    
                    {/* 승인 정보는 조회 모드에서만 보이도록 조정 (isNew가 아닐 때) */}
                    {!initialData.isNew && renderSelectField('status', '상태', statusOptions)}
                    {!initialData.isNew && renderSelectField('approver', '승인자', approvers)}
                </div>
            </div>

            {/* 상세 내역 및 코멘트 */}
            <div className={styles.commentSection}>
                <h3 className={styles.sectionTitle}>상세 내역</h3>
                {isEditing ? (
                    <textarea
                        className={styles.commentTextarea}
                        value={rewardData.comment || ''}
                        onChange={(e) => handleChange('comment', e.target.value)}
                        placeholder="포상 상세 내역을 입력하세요."
                    />
                ) : (
                    <div className={styles.commentDisplay}>
                        {rewardData.comment || '작성된 상세 내역이 없습니다.'}
                    </div>
                )}
            </div>

            {/* 액션 버튼 */}
            <div className={styles.actionButtons}>
                {!initialData.isNew && ( // 등록 모드가 아닐 때만 수정/조회 토글
                    <button 
                        className={styles.editToggleBtn} 
                        onClick={() => setIsEditing(prev => !prev)}
                    >
                        {isEditing ? '🔍 조회 모드로 전환' : '✏️ 수정 모드로 전환'}
                    </button>
                )}
                
                {isEditing && (
                    <button 
                        className={styles.saveBtn} 
                        onClick={handleSave}
                    >
                        {initialData.isNew ? '등록' : '저장'}
                    </button>
                )}
            </div>
        </div>
    );
};


export default function RewardManageModal({ isOpen, onClose, rewardData, onSave }) {
    if (!isOpen) return null;

    const handleClose = () => {
        onClose();
    };

    return (
        <div className={styles.modalOverlay} onClick={handleClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                
                <div className={styles.modalHeader}>
                    <h2 className={styles.headerTitle}>포상 {rewardData.isNew ? '등록' : '상세/수정'}</h2>
                    <button className={styles.closeBtn} onClick={handleClose}>
                        <IoCloseOutline />
                    </button>
                </div>
                
                <div className={styles.rewardWrapper}>
                    <RewardContent 
                        initialData={rewardData} 
                        onSave={onSave}
                        onClose={handleClose} 
                    />
                </div>
                
            </div>
        </div>
    );
}