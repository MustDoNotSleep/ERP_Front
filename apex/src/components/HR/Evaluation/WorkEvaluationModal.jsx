// src/components/evaluation/WorkEvaluationModal.jsx
import React, { useState, useEffect } from 'react';
import styles from './WorkEvaluationModal.module.css';
import { IoCloseOutline } from "react-icons/io5";

const EvaluationContent = ({ initialData, onSave, onClose }) => {
    // 원본 데이터를 복사하여 상태로 사용 (수정 가능하게)
    const [evaluationData, setEvaluationData] = useState(initialData);
    const [isEditing, setIsEditing] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        // 모달이 열릴 때마다 초기 데이터로 설정
        setEvaluationData(initialData);
        setInitialLoading(false);
        // isEditing 상태는 모달이 열릴 때마다 false로 초기화하는 것이 일반적이지만,
        // 필요에 따라 초기 모드를 설정할 수 있습니다. 여기서는 false(조회 모드)를 유지합니다.
        setIsEditing(false);
    }, [initialData]);

    if (initialLoading) {
        return <div className={styles.loadingMessage}>데이터를 불러오는 중입니다...</div>;
    }
    
    if (!evaluationData || !evaluationData.id) {
        return <div className={styles.errorMessage}>근무 평가 데이터가 유효하지 않습니다.</div>;
    }

    const handleChange = (field, value) => {
        setEvaluationData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        // 유효성 검사 (예: 1~5점 범위 확인)
        const { workAttitude, goalAchievement, collaboration } = evaluationData;
        if (workAttitude < 1 || workAttitude > 5 || 
            goalAchievement < 1 || goalAchievement > 5 || 
            collaboration < 1 || collaboration > 5) {
            alert("점수는 1점에서 5점 사이로 입력해주세요.");
            return;
        }

        console.log("저장할 평가 데이터:", evaluationData);
        onSave(evaluationData); 
        // setIsEditing(false); // 부모의 onSave가 성공적으로 처리되면 부모 컴포넌트에서 모달을 닫도록 하는 것이 더 안전함.
    };

    // 기여도 등급 옵션
    const contributionOptions = ['A', 'B', 'C', 'D', 'E'];

    // 점수 입력 필드 렌더링 함수 (1~5점)
    const renderScoreInput = (field, label) => (
        <div className={styles.detailRow}>
            <div className={styles.detailLabel}>{label}</div>
            <div className={styles.detailValue}>
                {isEditing ? (
                    <input
                        type="number"
                        min="1"
                        max="5"
                        value={evaluationData[field]}
                        onChange={(e) => handleChange(field, parseInt(e.target.value, 10) || 0)}
                        className={styles.scoreInput}
                    />
                ) : (
                    <span>{evaluationData[field]}점</span>
                )}
            </div>
        </div>
    );

    // 기여도 등급 입력 필드 렌더링 함수
    const renderContributionInput = (field, label) => (
        <div className={styles.detailRow}>
            <div className={styles.detailLabel}>{label}</div>
            <div className={styles.detailValue}>
                {isEditing ? (
                    <select
                        value={evaluationData[field]}
                        onChange={(e) => handleChange(field, e.target.value)}
                        className={styles.gradeSelect}
                    >
                        {contributionOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                ) : (
                    <span className={styles.contributionGrade}>{evaluationData[field]}</span>
                )}
            </div>
        </div>
    );

    return (
        <div className={styles.evaluationContainer}>
            <h2 className={styles.evaluationTitle}>
                {/* ✅ 큰 제목에서 이름/사번 제거 및 '근무평가 상세'로 변경 */}
                근무평가 상세 <span className={styles.periodText}>{evaluationData.year}년 {evaluationData.quarter}</span>
            </h2>

            {/* 기본 정보 (이름/사번은 여기에 유지) */}
            <div className={styles.infoTable}>
                <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>사번</div>
                    <div className={styles.infoValue}>{evaluationData.employeeId}</div>
                    <div className={styles.infoLabel}>이름</div>
                    <div className={styles.infoValue}>{evaluationData.name}</div>
                </div>
                <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>부서/직급</div>
                    <div className={styles.infoValue}>{evaluationData.teamName}/{evaluationData.positionName}</div>
                    <div className={styles.infoLabel}>평가연월</div>
                    <div className={styles.infoValue}>{evaluationData.year}년 {evaluationData.quarter}</div>
                </div>
            </div>

            {/* 평가 상세 항목 */}
            <div className={styles.detailSection}>
                <h3 className={styles.sectionTitle}>평가 항목</h3>
                <div className={styles.scoreGrid}>
                    {renderScoreInput('workAttitude', '근무 태도 (1~5점)')}
                    {renderScoreInput('goalAchievement', '목표 달성 (1~5점)')}
                    {renderScoreInput('collaboration', '협업 (1~5점)')}
                    {renderContributionInput('contribution', '기여도 등급 (A~E)')}
                </div>
            </div>

            {/* 총평/코멘트 */}
            <div className={styles.commentSection}>
                <h3 className={styles.sectionTitle}>총평 및 코멘트</h3>
                {isEditing ? (
                    <textarea
                        className={styles.commentTextarea}
                        value={evaluationData.comment || ''}
                        onChange={(e) => handleChange('comment', e.target.value)}
                        placeholder="평가 내용을 상세히 입력하세요."
                    />
                ) : (
                    <div className={styles.commentDisplay}>
                        {evaluationData.comment || '작성된 총평이 없습니다.'}
                    </div>
                )}
            </div>

            {/* 액션 버튼 */}
            <div className={styles.actionButtons}>
                <button 
                    className={styles.editToggleBtn} 
                    onClick={() => setIsEditing(prev => !prev)}
                >
                    {isEditing ? '🔍 조회 모드로 전환' : '✏️ 수정 모드로 전환'}
                </button>
                {isEditing && (
                    <button 
                        className={styles.saveBtn} 
                        onClick={handleSave}
                    >
                        저장
                    </button>
                )}
            </div>
        </div>
    );
};


export default function WorkEvaluationModal({ isOpen, onClose, evaluationData, onSave }) {
    if (!isOpen) return null;

    // 모달 닫기
    const handleClose = () => {
        // 저장 로직이 EvaluationContent에 있으므로, 여기서 confirm 메시지를 띄우는 것이 적절합니다.
        // 다만, 저장 전 변경 사항 유무를 확인하는 로직이 추가되면 더 좋습니다.
        onClose();
    };

    return (
        <div className={styles.modalOverlay} onClick={handleClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                
                <div className={styles.modalHeader}>
                    <h2 className={styles.headerTitle}>근무 평가 상세/수정</h2>
                    <button className={styles.closeBtn} onClick={handleClose}>
                        <IoCloseOutline />
                    </button>
                </div>
                
                <div className={styles.evaluationWrapper}>
                    <EvaluationContent 
                        initialData={evaluationData} 
                        onSave={onSave}
                        onClose={handleClose} 
                    />
                </div>
                
            </div>
        </div>
    );
}