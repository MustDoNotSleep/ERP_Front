import React, { useState, useEffect } from 'react';
import styles from "./PerformanceManagementPage.module.css";

// 하위 컴포넌트
import EvaluationHistory from '../../../components/HR/performance/EvaluationHistory';
import EvaluationProgress from '../../../components/HR/performance/EvaluationProgress';
import EvaluationSettings from '../../../components/HR/performance/EvaluationSettings';

// API
import { fetchDepartments } from "../../../api/department";
import { fetchPositions } from "../../../api/position";
import { 
    fetchEvaluationProgress,
    createEvaluationPolicy,
    fetchSeasonList
} from "../../../api/evaluation";

const PerformanceManagementPage = () => {
    // 조회 버튼 옆 초기화 버튼 클릭 시 진행률 0%로 초기화
    const handleProgressReset = () => {
        setProgressData({ totalCount: 0, completedCount: 0 });
    };

    // 1. 입력 데이터 State
    const [evaluationData, setEvaluationData] = useState({
        seasonName: "",
        startDate: "",
        endDate: "",
        evaluationType: "",
        targetDepartmentId: "",
        targetPositionId: "",
        mappingMethod: "자동지정",
        createdById: "" 
    });

    const [excelFile, setExcelFile] = useState(null);

    // 2. 목록 데이터 State
    const [departments, setDepartments] = useState([]);
    const [positions, setPositions] = useState([]);
    // 시즌만 Mock 데이터로 고정
    const MockSeasonList = [
        { policyId: 1, seasonName: "2025년 1분기" },
        { policyId: 2, seasonName: "2025년 2분기" },
        { policyId: 3, seasonName: "2025년 3분기" },
        { policyId: 4, seasonName: "2025년 4분기" }
    ];
    const [seasonList] = useState(MockSeasonList);

    // 3. 진행 현황 State
    const [progressSearch, setProgressSearch] = useState({
        seasonName: "",
        departmentId: "",
        positionId: ""
    });

    // 첫 화면에서는 0%, 조회 버튼 클릭 시 100%
    const [progressData, setProgressData] = useState({
        totalCount: 0,
        completedCount: 0
    });



    const extractList = (res) => {
        if (!res) return [];
        if (res.data && Array.isArray(res.data.content)) {
            return res.data.content;
        }
        if (res.data && Array.isArray(res.data)) {
            return res.data;
        }

        if (Array.isArray(res)) {
            return res;
        }

        return [];
    };

    const loadDepartments = async () => {
        try {
            const res = await fetchDepartments(0, 100);
            console.log("🔥 부서 데이터:", res); // 콘솔에서 확인해보세요!
            setDepartments(extractList(res));
        } catch (err) {
            console.error("부서 목록 조회 실패:", err);
        }
    };

    const loadPositions = async () => {
        try {
            const res = await fetchPositions(0, 100);
            console.log("🔥 직급 데이터:", res); // 콘솔에서 확인해보세요!
            setPositions(extractList(res));
        } catch (err) {
            console.error("직급 목록 조회 실패:", err);
        }
    };
    
    // const loadSeasonList = async () => {
    //     try {
    //         const res = await fetchSeasonList();
    //         console.log("🔥 시즌 데이터:", res);
    //         setSeasonList(extractList(res));
    //     } catch (err) {
    //         console.error("시즌 목록 조회 실패:", err);
    //     }
    // };

    useEffect(() => {
        loadDepartments();
        loadPositions();
        // 시즌은 Mock 데이터 사용
    }, []);

    // ------------------------------------------
    // 핸들러 함수들 (기존 동일)
    // ------------------------------------------
    const handleDataChange = (e) => {
        const { name, value } = e.target;
        setEvaluationData(prev => ({ ...prev, [name]: value }));
    };

    const handleProgressChange = (e) => {
        const { name, value } = e.target;
        setProgressSearch(prev => ({ ...prev, [name]: value }));
    };

    const handleProgressSearch = () => {
        // 조회 버튼 클릭 시 100%로 고정
        setProgressData({ totalCount: 5, completedCount: 5 });
    };

    const convertDto = () => ({
        seasonName: evaluationData.seasonName,
        startDate: evaluationData.startDate,
        endDate: evaluationData.endDate,
        evaluationType: evaluationData.evaluationType,
        targetDepartmentId: Number(evaluationData.targetDepartmentId),
        targetPositionId: Number(evaluationData.targetPositionId),
        createdById: evaluationData.createdById
    });

    const handleSave = async () => {
        if (!evaluationData.seasonName || !evaluationData.startDate || !evaluationData.evaluationType) {
            alert("필수 정보를 입력해주세요."); return;
        }
        if (!evaluationData.targetDepartmentId || !evaluationData.targetPositionId) {
            alert("부서 및 직급을 선택해주세요."); return;
        }
        if (!excelFile) {
            alert("엑셀 파일을 업로드해주세요!"); return;
        }
        try {
            const dto = convertDto();
            await createEvaluationPolicy(dto, excelFile);
            alert("저장 완료!");
            handleProgressSearch();
        } catch (err) {
            console.error("저장 오류:", err);
            alert("오류 발생");
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.evaluationLayout}>
                <div className={styles.leftColumn}>
                    <EvaluationHistory
                        data={evaluationData}
                        onChange={handleDataChange}
                    />
                    <EvaluationSettings
                        data={evaluationData}
                        onChange={handleDataChange}
                        onFileSelect={setExcelFile}
                        departments={departments} 
                        positions={positions}    
                    />
                </div>
                <div className={styles.rightColumn}>
                    <EvaluationProgress
                        searchParams={progressSearch}
                        onChange={handleProgressChange}
                        onSearch={handleProgressSearch}
                        onReset={handleProgressReset}
                        departments={departments}
                        positions={positions}
                        progressData={progressData}
                        seasonList={seasonList}  // ⭐ 시즌 목록 전달
                    />
                </div>
            </div>
            <div className={styles.saveButtonContainer}>
                <button onClick={handleSave} className={styles.saveButton}>저장</button>
            </div>
        </div>
    );
};

export default PerformanceManagementPage;