import React, { useState, useEffect } from 'react';
import styles from './RewardManageModal.module.css';
import { IoCloseOutline } from "react-icons/io5";

// 주의: 백엔드에서 Enum이 영어(CONTRIBUTION 등)로 넘어온다면
// 화면에 보여줄 때 한글로 변환하는 로직이 추가로 필요할 수 있습니다.
const rewardType = ['선택','공로상', '우수사원상', '특별포상'];
const rewardItem = ['선택','상금', '포인트', '연차', '상패/감사장'];
const statusList = ['대기', '승인', '반려']; 
const rewardValue = ['선택','팀 기여 우수', '핵심 기술 개발', '장기 근속', '기타']; 

const RewardContent = ({ initialData, onSave, onClose }) => {
    const [rewardData, setRewardData] = useState(initialData);
    const [isEditing, setIsEditing] = useState(initialData.isNew || false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        setRewardData(initialData);
        setIsEditing(initialData.isNew || false);
        setInitialLoading(false);
    }, [initialData]);

    if (initialLoading) return <div className={styles.loadingMessage}>데이터를 불러오는 중입니다...</div>;
    if (!rewardData) return <div className={styles.errorMessage}>포상 데이터가 유효하지 않습니다.</div>;

    const handleChange = (field, value) => {
        setRewardData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        // 백엔드 DTO 필드명 확인
        const { rewardType, employeeName, employeeId, rewardDate } = rewardData;
        
        if (!rewardType || !employeeName || !employeeId || !rewardDate) {
            alert("필수 항목(포상 종류, 이름, 사번, 추천일)을 모두 입력해주세요.");
            return;
        }

        console.log("저장할 포상 데이터:", rewardData);
        onSave(rewardData); 
    };

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
                        readOnly={field === 'employeeId' && !rewardData.isNew} 
                    />
                ) : (
                    <span>{field === 'amount' && rewardData[field] ? rewardData[field].toLocaleString() : (rewardData[field] || '-')}</span>
                )}
            </div>
        </div>
    );
    
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
                <span className={styles.periodText}>{rewardData.employeeName} ({rewardData.employeeId})</span>
            </h2>

            {/* 기본 정보 테이블 */}
            <div className={styles.infoTable}>
                <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>사번</div>
                    <div className={styles.infoValue}>{rewardData.employeeId}</div>
                    <div className={styles.infoLabel}>이름</div>
                    <div className={styles.infoValue}>{rewardData.employeeName}</div>
                </div>
                <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>추천일</div>
                    <div className={styles.infoValue}>{rewardData.rewardDate || '-'}</div>
                    <div className={styles.infoLabel}>부서/직급</div>
                    <div className={styles.infoValue}>
                        {rewardData.departmentName}{rewardData.deptName}/{rewardData.positionName}
                    </div>
                </div>
            </div>

            {/* 포상 상세 항목 */}
            <div className={styles.detailSection}>
                <h3 className={styles.sectionTitle}>포상 정보</h3>
                <div className={styles.detailGrid}>
                    {renderSelectField('rewardType', '포상 종류', rewardType)}
                    {renderSelectField('rewardValue', '포상 사유', rewardValue)}
                    {renderSelectField('rewardItem', '포상 형태', rewardItem)}
                    
                    {renderInputField('amount', '지급액 (원)', 'number')}
                    
                    {!initialData.isNew && renderSelectField('status', '상태', statusList)}
                    
                    {/* ✅ [수정완료] 승인자는 드롭다운이 아니라 텍스트로 표시 */}
                    {!initialData.isNew && (
                        <div className={styles.detailRow}>
                            <div className={styles.detailLabel}>승인자</div>
                            <div className={styles.detailValue}>
                                <span>{rewardData.approverName || '-'}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 상세 내역 및 코멘트 */}
            <div className={styles.commentSection}>
                <h3 className={styles.sectionTitle}>상세 내역</h3>
                {isEditing ? (
                    <textarea
                        className={styles.commentTextarea}
                        value={rewardData.reason || ''}
                        onChange={(e) => handleChange('reason', e.target.value)}
                        placeholder="포상 상세 내역을 입력하세요."
                    />
                ) : (
                    <div className={styles.commentDisplay}>
                        {rewardData.reason || '작성된 상세 내역이 없습니다.'}
                    </div>
                )}
            </div>

            {/* 액션 버튼 */}
            <div className={styles.actionButtons}>
                {!initialData.isNew && (
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
    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.headerTitle}>포상 {rewardData.isNew ? '등록' : '상세/수정'}</h2>
                    <button className={styles.closeBtn} onClick={onClose}><IoCloseOutline /></button>
                </div>
                <div className={styles.rewardWrapper}>
                    <RewardContent initialData={rewardData} onSave={onSave} onClose={onClose} />
                </div>
            </div>
        </div>
    );
}