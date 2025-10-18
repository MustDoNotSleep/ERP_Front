export const INITIAL_APPOINTMENT_REQUESTS_STATE = {
    appointmentRecId: null,      // INT (PK, Auto Increment)
    targetEmployeeId: null,      // INT (FK: 발령 대상 사원)
    requestingEmployeeId: null,  // INT (FK: 신청자 사원)
    appointmentType: '',         // ENUM ('전보', '겸직', '파견', '복직', '직급 변경', '직책 해임', '승진 제한', '휴직 요청')
    newDepartmentId: null,       // INT (FK: 신규 부서 ID)
    effectiveStartDate: '',      // DATE (발령 시작일)
    effectiveEndDate: null,      // DATE (발령 종료일)
    reason: '',                  // TEXT (발령 사유)
    status: '',                  // ENUM ('대기중', '승인', '반려')
    approverId: null,            // INT (FK: 승인자 사원 ID, null 허용)
    requestDate: null,           // DATETIME (신청일시)
    processedDate: null,         // DATETIME (처리일시, null 허용)
};