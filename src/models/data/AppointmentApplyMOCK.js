// src/data/AppointmentApplyMOCK.js

// 1. 승인/반려 상태 상수
export const APPROVAL_STATUS = {
    WAITING: '승인대기',
    APPROVED: '승인완료',
    REJECTED: '반려',
};

// 2. 인사발령 구분 상수 (UI 이미지 참고)
export const APPOINTMENT_TYPE = {
    TRANSFER: '전보',
    PROMOTION_SUGGESTION: '승진 제안',
    DISPATCH: '파견',
    REINSTATEMENT: '복귀',
    JOB_CHANGE: '직무 변경',
    POSITION_APPOINTMENT: '직책 임명',
    LEAVE_OF_ABSENCE: '휴직 요청',
};

// 3. 인사발령 신청/조회 테이블 Mock Data
export const APPOINTMENT_APPROVAL_LIST_MOCK = [
    {
        requestId: 'AA2024001', // Appointment Approval
        applicationDate: '2024-05-20',
        employeeId: 12374,
        employeeName: '박대리',
        department: 'CERT팀',
        position: '대리',
        appointmentType: APPOINTMENT_TYPE.TRANSFER,
        targetDepartment: '플랫폼개발팀', // 발령지
        appointmentDate: '2024-06-01', // 발령일자 (기간이 하루일 경우)
        status: APPROVAL_STATUS.APPROVED,
    },
    {
        requestId: 'AA2024002',
        applicationDate: '2024-05-21',
        employeeId: 12396,
        employeeName: '김선임',
        department: '침해사고대응팀',
        position: '선임',
        appointmentType: APPOINTMENT_TYPE.PROMOTION_SUGGESTION,
        targetPosition: '수석', // 승진 제안의 경우 목표 직급
        appointmentDate: '2024-07-01',
        status: APPROVAL_STATUS.WAITING,
    },
    {
        requestId: 'AA2024003',
        applicationDate: '2024-05-22',
        employeeId: 12348,
        employeeName: '홍선임',
        department: '플랫폼개발팀',
        position: '선임',
        appointmentType: APPOINTMENT_TYPE.DISPATCH,
        targetDepartment: '외부 파견 기관',
        startDate: '2024-06-10', // 파견 시작일
        endDate: '2025-06-09',   // 파견 종료일
        status: APPROVAL_STATUS.REJECTED,
    },
    {
        requestId: 'AA2024004',
        applicationDate: '2024-05-23',
        employeeId: 12354,
        employeeName: '안수석',
        department: '경영지원본부',
        position: '수석',
        appointmentType: APPOINTMENT_TYPE.JOB_CHANGE,
        targetJob: '정보보호 최고책임자(CISO)', // 변경될 직무
        appointmentDate: '2024-06-01',
        status: APPROVAL_STATUS.WAITING,
    },
];

// 4. 필터링을 위한 옵션 배열들
export const APPROVAL_STATUS_OPTIONS = [
    { value: '', label: '전체' },
    { value: APPROVAL_STATUS.WAITING, label: '승인대기' },
    { value: APPROVAL_STATUS.APPROVED, label: '승인완료' },
    { value: APPROVAL_STATUS.REJECTED, label: '반려' },
];

export const APPOINTMENT_TYPE_OPTIONS = [
    { value: '', label: '전체' },
    { value: APPOINTMENT_TYPE.TRANSFER, label: '전보' },
    { value: APPOINTMENT_TYPE.PROMOTION_SUGGESTION, label: '승진 제안' },
    { value: APPOINTMENT_TYPE.DISPATCH, label: '파견' },
    { value: APPOINTMENT_TYPE.REINSTATEMENT, label: '복귀' },
    { value: APPOINTMENT_TYPE.JOB_CHANGE, label: '직무 변경' },
    { value: APPOINTMENT_TYPE.POSITION_APPOINTMENT, label: '직책 임명' },
    { value: APPOINTMENT_TYPE.LEAVE_OF_ABSENCE, label: '휴직 요청' },
];
