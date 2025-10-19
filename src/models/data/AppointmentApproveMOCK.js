// models/data/AppointmentMOCK.js
// 이미지에 보이는 데이터를 기반으로 생성

export const APPOINTMENT_APPROVAL_LIST_MOCK = [
    { 
        requestId: 1, 
        applicationDate: '2025/10/18', 
        employeeId: '12345', 
        employeeName: '김수석', 
        appointmentType: '파견', 
        requesterName: '김원장', 
        status: '최종승인', 
        approverName: '인사팀' 
    },
    { 
        requestId: 2, 
        applicationDate: '2025/10/18', 
        employeeId: '12346', 
        employeeName: '최사원', 
        appointmentType: '전보', 
        requesterName: '김원장', 
        status: '대기', 
        approverName: '-' 
    },
    { 
        requestId: 3, 
        applicationDate: '2025/10/17', 
        employeeId: '12347', 
        employeeName: '윤대리', 
        appointmentType: '직무 변경', 
        requesterName: '김원장', 
        status: '대기', 
        approverName: '-' 
    },
    { 
        requestId: 4, 
        applicationDate: '2025/10/17', 
        employeeId: '12348', 
        employeeName: '홍선임', 
        appointmentType: '파견', 
        requesterName: '김원장', 
        status: '반려', 
        approverName: '인사팀' 
    },
];