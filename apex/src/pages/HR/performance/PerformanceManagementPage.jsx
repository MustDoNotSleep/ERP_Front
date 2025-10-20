import React, { useState } from 'react';
import styles from "./PerformanceManagementPage.module.css";
import tableStyles from "../../../components/common/DataTable.module.css"; // 필터/버튼 스타일 재활용

// ✨ 하위 컴포넌트 임포트 (아래에서 만들 예정)
import EvaluationHistory from '../../../components/HR/performance/EvaluationHistory'; 
import EvaluationProgress from '../../../components/HR/performance/EvaluationProgress';
import EvaluationSettings from '../../../components/HR/performance/EvaluationSettings';

const PerformanceManagementPage = () => {
    // 💡 평가 설정 상태 (왼쪽 폼 전체)
    const [evaluationData, setEvaluationData] = useState({
        // 이력 설정 (History)
        sessionName: '2025년 1분기 업무평가',
        evaluationDate: '2025-10-13 ~ 2025-10-19',
        evaluationType: 'KPI평가',
        evaluationScope: '부서별',
        // 대상 설정 (Settings)
        scoreType: '역량평가(30%)',
        template: '2025 KPI 기본양식',
        leadershipTemplate: '리더십 역량 표준양식',
        targetDept: '전체',
        targetPosition: '사원',
        mappingType: '자동지정',
    });

    // 💡 평가 현황 검색 상태 (오른쪽 폼)
    const [progressSearch, setProgressSearch] = useState({
        session: '2025-1',
        department: '',
        position: '사원',
    });

    const handleDataChange = (e) => {
        const { name, value } = e.target;
        setEvaluationData(prev => ({ ...prev, [name]: value }));
    };

    const handleProgressChange = (e) => {
        const { name, value } = e.target;
        setProgressSearch(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        console.log('🐥 평가 설정 저장:', evaluationData);
        alert('평가 설정이 저장되었습니다!');
    };
    
    const handleProgressSearch = () => {
        console.log('🐥 평가 현황 조회:', progressSearch);
        // TODO: 현황 조회 API 호출
    };

    return (
        <div className={styles.pageContainer}>            
            {/* 💡 메인 레이아웃: 좌우 2열 배치 */}
            <div className={styles.evaluationLayout}>
                {/* --- A. 왼쪽 열 (설정) --- */}
                <div className={styles.leftColumn}>
                    {/* 평가 이력 설정 (왼쪽 상단) */}
                    <EvaluationHistory data={evaluationData} onChange={handleDataChange} />
                    
                    {/* 평가 항목 및 대상 설정 (왼쪽 하단) */}
                    <EvaluationSettings data={evaluationData} onChange={handleDataChange} />
                    
                </div>
                {/* --- B. 오른쪽 열 (현황) --- */}
                <div className={styles.rightColumn}>
                    {/* 평가 진행 현황 */}
                    <EvaluationProgress 
                        searchParams={progressSearch}
                        onChange={handleProgressChange}
                        onSearch={handleProgressSearch}
                    />
                </div>
            </div>
            {/* 저장 버튼 */}
            <div className={styles.saveButtonContainer}>
                <button onClick={handleSave} className={styles.saveButton}>
                    저장
                </button>
            </div>
        </div>
    );
};

export default PerformanceManagementPage;