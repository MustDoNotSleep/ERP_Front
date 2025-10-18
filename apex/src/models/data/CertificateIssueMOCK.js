// 💡 증명서 종류 ENUM (Dropdown용)
export const CERTIFICATE_TYPES = {
    EMPLOYMENT_KR: '재직증명서(한글)',
    EMPLOYMENT_EN: '재직증명서(영문)',
    CAREER_KR: '경력증명서(한글)',
    // ... 기타 필요한 증명서
};

// 💡 처리 상태 상수 (ENUM)
export const ISSUE_STATUS = {
    WAITING: '대기',
    APPROVED: '승인',
    REJECTED: '반려',
};

export const ISSUE_STATUS_OPTIONS = [
    { value: '', label: '선택' },
    { value: ISSUE_STATUS.WAITING, label: '대기' },
    { value: ISSUE_STATUS.APPROVED, label: '승인완료' },
    { value: ISSUE_STATUS.REJECTED, label: '승인반려' },
];

/**
 * 💡 증명서 발급 요청 목록 Mock Data
 */
export const CERTIFICATE_ISSUE_MOCK = [
    { requestId: 'C24001', applicationDate: '2024/10/10', employeeId: 12311, name: '김사원', type: CERTIFICATE_TYPES.EMPLOYMENT_KR, count: 1, issueDate: 'YYYY/MM/DD', status: ISSUE_STATUS.WAITING },
    { requestId: 'C24002', applicationDate: '2024/10/11', employeeId: 12322, name: '이대리', type: CERTIFICATE_TYPES.EMPLOYMENT_EN, count: 1, issueDate: 'YYYY/MM/DD', status: ISSUE_STATUS.WAITING },
    { requestId: 'C24003', applicationDate: '2024/10/12', employeeId: 12333, name: '정대리', type: CERTIFICATE_TYPES.CAREER_KR, count: 1, issueDate: 'YYYY/MM/DD', status: ISSUE_STATUS.APPROVED },
    { requestId: 'C24004', applicationDate: '2024/10/13', employeeId: 12344, name: '임선임', type: CERTIFICATE_TYPES.EMPLOYMENT_KR, count: 1, issueDate: 'YYYY/MM/DD', status: ISSUE_STATUS.WAITING },
];