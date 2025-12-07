import React, { useState, useEffect } from 'react';
// ⚠️ [중요] Page 파일 맨 위에 있는 import api 경로와 똑같이 맞춰주세요!
// 예: import api from '../../../api/axios'; 또는 import api from '../../../utils/api';
import api from '../../../api/axios'; 
import styles from './RewardManageModal.module.css';
import { IoCloseOutline } from "react-icons/io5";

// =================================================================================
// 1. 내부 컴포넌트: 실제 내용을 다루는 부분 (RewardContent)
// =================================================================================
const RewardContent = ({ initialData, onSave, onClose }) => {
    const [rewardData, setRewardData] = useState(initialData);
    const [isEditing, setIsEditing] = useState(initialData.isNew || false);

    // 백엔드 Enum 옵션 상태 관리
    const [options, setOptions] = useState({
        rewardTypes: [],
        rewardItems: [],
        rewardValues: [],
        statusList: [
            { value: 'PENDING', label: '대기' },
            { value: 'APPROVED', label: '승인' },
            { value: 'REJECTED', label: '반려' }
        ]
    });

    // ✅ [수정] Page 컴포넌트의 로직을 그대로 적용 (api 사용 + 매핑)
    useEffect(() => {
        const loadEnums = async () => {
            try {
                // 1. axios 대신 설정된 api 객체 사용 (baseURL 자동 적용)
                const response = await api.get('/hr/rewards/enums');
                console.log("🔥 [디버깅] 백엔드 Enum 응답 데이터:", response.data);

                const { rewardTypes, rewardItems, rewardValues } = response.data;

                // 2. 안전한 매핑 함수 (key, name, code 중 있는 걸 사용)
                const formatOptions = (list) => {
                    if (!list) return [];
                    return list.map(t => ({
                        // 백엔드가 주는 필드명에 따라 유연하게 대처
                        value: t.key || t.name || t.code || t.value, 
                        label: t.label || t.description || t.name
                    }));
                };

                // 3. 상태 업데이트
                setOptions(prev => ({
                    ...prev,
                    rewardTypes: formatOptions(rewardTypes),
                    rewardItems: formatOptions(rewardItems),
                    rewardValues: formatOptions(rewardValues),
                    // statusList는 위에서 고정값으로 정의했으므로 유지
                }));

            } catch (error) {
                console.error('❌ Enum 데이터 로드 실패:', error);
                // 에러 발생 시 로그를 명확히 찍어줌
            }
        };

        loadEnums();
    }, []);

    // 초기 데이터 세팅
    useEffect(() => {
        setRewardData(initialData);
        setIsEditing(initialData.isNew || false);
    }, [initialData]);

    if (!rewardData) return <div className={styles.errorMessage}>데이터 오류</div>;

    const handleChange = (field, value) => {
        setRewardData(prev => ({ ...prev, [field]: value }));
    };

    // 저장 핸들러
    const handleSave = () => {
        const { rewardType, employeeName, employeeId, rewardDate } = rewardData;
        
        // 유효성 검사 (빈 값이나 '선택'이 그대로일 경우 차단)
        if (!rewardType || rewardType === '선택' || !employeeName || !employeeId || !rewardDate) {
            alert("필수 항목(포상 종류, 이름, 사번, 날짜)을 모두 입력해주세요.");
            return;
        }

        console.log("💾 백엔드로 보낼 데이터:", rewardData);
        onSave(rewardData); 
    };

    // 입력 필드 렌더링 헬퍼
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
                    <span>{field === 'amount' && rewardData[field] ? Number(rewardData[field]).toLocaleString() : (rewardData[field] || '-')}</span>
                )}
            </div>
        </div>
    );

    // 셀렉트 박스 렌더링 헬퍼
    const renderSelectField = (field, label, optionList = []) => (
        <div className={styles.detailRow}>
            <div className={styles.detailLabel}>{label}</div>
            <div className={styles.detailValue}>
                {isEditing ? (
                    <select
                        value={rewardData[field] || ''}
                        onChange={(e) => handleChange(field, e.target.value)}
                        className={styles.inputField}
                    >
                        <option value="">선택</option>
                        {optionList.map(opt => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    // 조회 모드: value(영어)를 가지고 label(한글)을 찾아서 보여줌
                    <span>
                        {optionList.find(opt => opt.value === rewardData[field])?.label || rewardData[field] || '-'}
                    </span>
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
                        {rewardData.departmentName || rewardData.deptName}/{rewardData.positionName}
                    </div>
                </div>
            </div>

            {/* 포상 상세 항목 */}
            <div className={styles.detailSection}>
                <h3 className={styles.sectionTitle}>포상 정보</h3>
                <div className={styles.detailGrid}>
                    {renderSelectField('rewardType', '포상 종류', options.rewardTypes)}
                    {renderSelectField('rewardValue', '포상 사유', options.rewardValues)}
                    {renderSelectField('rewardItem', '포상 형태', options.rewardItems)}
                    
                    {renderInputField('amount', '지급액 (원)', 'number')}
                    
                    {!initialData.isNew && renderSelectField('status', '상태', options.statusList)}
                    
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

// =================================================================================
// 2. 메인 컴포넌트: 모달 껍데기 (RewardManageModal)
// =================================================================================
const RewardManageModal = ({ isOpen, onClose, rewardData, onSave }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.headerTitle}>포상 {rewardData.isNew ? '등록' : '상세/수정'}</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <IoCloseOutline />
                    </button>
                </div>
                <div className={styles.rewardWrapper}>
                    <RewardContent initialData={rewardData} onSave={onSave} onClose={onClose} />
                </div>
            </div>
        </div>
    );
};

export default RewardManageModal;