// src/components/evaluation/WorkEvaluationModal.jsx
import React, { useState, useEffect } from 'react';
import styles from './WorkEvaluationModal.module.css';
import { IoCloseOutline } from "react-icons/io5";
import EmployeeSearchModal from '../../../components/common/EmployeeSearchModal';

const EvaluationContent = ({ initialData, onSave, onClose }) => {
    // 원본 데이터를 복사하여 상태로 사용 (수정 가능하게)
    const [evaluationData, setEvaluationData] = useState(initialData);
    const [isEditing, setIsEditing] = useState(!initialData?.id); // 신규 모드면 자동으로 수정 모드
    const [initialLoading, setInitialLoading] = useState(true);
    const [isEmployeeSearchOpen, setIsEmployeeSearchOpen] = useState(false);
    
    const isNewMode = !initialData?.id; // 신규 생성 모드 확인

    useEffect(() => {
        // 모달이 열릴 때마다 초기 데이터로 설정
        setEvaluationData(initialData);
        setInitialLoading(false);
        // 신규 모드면 수정 모드로, 기존 데이터면 조회 모드로
        setIsEditing(!initialData?.id);
    }, [initialData]);

    if (initialLoading) {
        return <div className={styles.loadingMessage}>데이터를 불러오는 중입니다...</div>;
    }
    
    if (!evaluationData) {
        return <div className={styles.errorMessage}>근무 평가 데이터가 유효하지 않습니다.</div>;
    }

    const handleChange = (field, value) => {
        setEvaluationData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // 직원 검색 모달 열기
    const handleOpenEmployeeSearch = () => {
        setIsEmployeeSearchOpen(true);
    };

    // 직원 선택 시 정보 자동 입력
    const handleSelectEmployee = (employee) => {
        console.log('선택된 직원:', employee);
        setEvaluationData(prev => ({
            ...prev,
            employeeId: employee.id,
            name: employee.name,
            teamName: employee.departmentName || prev.teamName,
            positionName: employee.positionName || prev.positionName
        }));
        setIsEmployeeSearchOpen(false);
    };

    const handleSave = () => {
        // 유효성 검사
        const { employeeId, name, workAttitude, goalAchievement, collaboration } = evaluationData;
        
        // 신규 모드일 때 필수 필드 확인
        if (isNewMode) {
            if (!employeeId || !name) {
                alert("사번과 이름은 필수 입력 항목입니다.");
                return;
            }
        }
        
        // 점수 범위 확인 (1~5점)
        if (workAttitude < 1 || workAttitude > 5 || 
            goalAchievement < 1 || goalAchievement > 5 || 
            collaboration < 1 || collaboration > 5) {
            alert("점수는 1점에서 5점 사이로 입력해주세요.");
            return;
        }

        console.log("저장할 평가 데이터:", evaluationData);
        onSave(evaluationData); 
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
                {isNewMode ? '신규 근무평가 등록' : '근무평가 상세'} 
                <span className={styles.periodText}>{evaluationData.year}년 {evaluationData.quarter}</span>
            </h2>

            {/* 기본 정보 (이름/사번은 여기에 유지) */}
            <div className={styles.infoTable}>
                <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>사번</div>
                    <div className={styles.infoValue}>
                        {isNewMode && isEditing ? (
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <input
                                    type="text"
                                    value={evaluationData.employeeId}
                                    onChange={(e) => handleChange('employeeId', e.target.value)}
                                    className={styles.textInput}
                                    placeholder="사번 입력"
                                />
                                <button
                                    type="button"
                                    onClick={handleOpenEmployeeSearch}
                                    className={styles.searchButton}
                                >
                                    검색
                                </button>
                            </div>
                        ) : (
                            evaluationData.employeeId
                        )}
                    </div>
                    <div className={styles.infoLabel}>이름</div>
                    <div className={styles.infoValue}>
                        {isNewMode && isEditing ? (
                            <input
                                type="text"
                                value={evaluationData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className={styles.textInput}
                                placeholder="이름 입력"
                                readOnly
                            />
                        ) : (
                            evaluationData.name
                        )}
                    </div>
                </div>
                <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>부서/직급</div>
                    <div className={styles.infoValue}>
                        {isEditing ? (
                            <>
                                <input
                                    type="text"
                                    value={evaluationData.teamName}
                                    onChange={(e) => handleChange('teamName', e.target.value)}
                                    className={styles.textInput}
                                    placeholder="부서"
                                    style={{ width: '45%', marginRight: '5px' }}
                                />
                                /
                                <input
                                    type="text"
                                    value={evaluationData.positionName}
                                    onChange={(e) => handleChange('positionName', e.target.value)}
                                    className={styles.textInput}
                                    placeholder="직급"
                                    style={{ width: '45%', marginLeft: '5px' }}
                                />
                            </>
                        ) : (
                            `${evaluationData.teamName}/${evaluationData.positionName}`
                        )}
                    </div>
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

            {/* 평가자 (읽기 전용) */}
            <div className={styles.evaluatorSection}>
                <h3 className={styles.sectionTitle}>평가자</h3>
                <div className={styles.evaluatorInfo}>
                    {isNewMode ? '자동 입력됨' : (evaluationData.evaluatorInfo || '미입력')}
                </div>
            </div>

            {/* 액션 버튼 */}
            <div className={styles.actionButtons}>
                {!isNewMode && (
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
                        {isNewMode ? '등록' : '저장'}
                    </button>
                )}
            </div>

            {/* 직원 검색 모달 */}
            <EmployeeSearchModal
                isOpen={isEmployeeSearchOpen}
                onClose={() => setIsEmployeeSearchOpen(false)}
                onSelectEmployee={handleSelectEmployee}
            />
        </div>
    );
};


export default function WorkEvaluationModal({ isOpen, onClose, evaluationData, onSave }) {
    if (!isOpen) return null;

    const isNewMode = !evaluationData?.id;

    // 모달 닫기
    const handleClose = () => {
        onClose();
    };

    return (
        <div className={styles.modalOverlay} onClick={handleClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                
                <div className={styles.modalHeader}>
                    <h2 className={styles.headerTitle}>
                        {isNewMode ? '신규 평가 등록' : '근무 평가 상세/수정'}
                    </h2>
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