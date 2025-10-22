// src/data/trainingData.js

// 승인/반려 상태 상수
export const APPROVAL_STATUS = {
    WAITING: '승인대기',
    APPROVED: '승인완료',
    REJECTED: '반려',
};

// 교육 승인/조회 테이블 Mock Data
// (실제 API는 Department/Position ID를 받아와 JOIN해서 한글 이름으로 내려준다고 가정)
export const TRAINING_APPROVAL_LIST_MOCK = [
    {
        requestId: 'TA2024001',
        applicationDate: '2024-05-20',
        employeeId: 12374, // 박대리 (가상의 사번)
        employeeName: '박대리',
        departmentName: 'CERT팀',
        positionName: '대리',
        courseName: '법적 의무 준수 교육',
        status: APPROVAL_STATUS.APPROVED,
    },
    {
        requestId: 'TA2024002',
        applicationDate: '2024-05-21',
        employeeId: 12396, // 김선임 (가상의 사번)
        employeeName: '김선임',
        departmentName: '침해사고대응팀',
        positionName: '선임',
        courseName: 'CISSP',
        status: APPROVAL_STATUS.WAITING,
    },
    {
        requestId: 'TA2024003',
        applicationDate: '2024-05-22',
        employeeId: 12348, // 홍선임
        employeeName: '홍선임',
        departmentName: '플랫폼개발팀',
        positionName: '선임',
        courseName: '고급 회계 관리',
        status: APPROVAL_STATUS.REJECTED,
    },
    {
        requestId: 'TA2024004',
        applicationDate: '2024-05-23',
        employeeId: 12354, // 안수석 (가상의 사번)
        employeeName: '안수석',
        departmentName: '경영지원본부',
        positionName: '수석',
        courseName: 'CISA',
        status: APPROVAL_STATUS.WAITING,
    },
];

export const APPROVAL_STATUS_OPTIONS = [
    { value: '', label: '전체' },
    { value: APPROVAL_STATUS.WAITING, label: '승인대기' },
    { value: APPROVAL_STATUS.APPROVED, label: '승인완료' },
    { value: APPROVAL_STATUS.REJECTED, label: '반려' },
];