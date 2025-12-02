// /src/api/evaluation.js

import api from "./axios";

/**
 * ⭐ 시즌 목록 조회
 * GET /hr/policy/seasons
 */
export const fetchSeasonList = async () => {
    try {
        const response = await api.get("/hr/policy/seasons");
        return response.data || [];
    } catch (err) {
        console.error("시즌 목록 조회 오류:", err);
        throw err;
    }
};


/**
 * ⭐ 평가 진행 현황 조회
 * GET /hr/policy/progress
 * @param {object} filters - { seasonName, departmentId, positionId }
 */
export const fetchEvaluationProgress = async (filters) => {
    try {
        const response = await api.get("/hr/policy/progress", { params: filters });
        return response.data || { totalCount: 0, completedCount: 0 };
    } catch (err) {
        console.error("평가 진행 현황 조회 오류:", err);
        throw err;
    }
};


/**
 * ⭐ 평가 정책 생성 (엑셀 파일 업로드 포함)
 * POST /hr/policy/setup  (multipart/form-data)
 * 
 * @param {object} dto - JSON DTO (seasonName, startDate, endDate, evaluationType ...)
 * @param {File} excelFile - 업로드 엑셀 파일
 */
export const createEvaluationPolicy = async (dto, excelFile) => {
    try {
        const formData = new FormData();

        // DTO는 JSON blob으로 보내야 컨트롤러에서 @RequestPart("data")로 인식됨
        formData.append(
            "data",
            new Blob([JSON.stringify(dto)], { type: "application/json" })
        );

        // 실제 파일
        formData.append("file", excelFile);

        const response = await api.post("/hr/policy/setup", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        return response.data || [];

    } catch (err) {
        console.error("평가 정책 생성 오류:", err);
        throw err;
    }
};
