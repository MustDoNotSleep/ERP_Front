export const INITIAL_EMPLOYEE_STATE = {
    employeeId: null,      // 사원번호 (int)
    name: '',               // 이름 (varchar)
    nameeng: '',            // 영문이름(varchar)
    password: '',           // 패스워드 (varchar)
    rrn: '',                // 주민번호 (varchar)
    address: '',            // 주소 (varchar)
    addressDetails: '',     // 주소 상세정보 (varchar)
    phoneNumber: '',       // 연락처 (varchar)
    email: '',              // 이메일 (varchar)
    birthDate: '',           // DATE (YYYY-MM-DD)
    hireDate: '',          // 입사일 (date) - JS의 날짜 문자열 ('YYYY-MM-DD')
    quitDate: null,        // 퇴사일 (date) - 퇴사 전이므로 null
    internalNumber: null,  // 내선번호 (varchar) - 선택 사항이므로 null
    departmentId: null,     // 부서 ID
    positionId: null,       // 직급 ID
    employmentType: '',      // ENUM ('정규직', '계약직', '인턴', '파견직')
    familyCertificate: '',   // VARCHAR(250) - 가족 관계 증명서 (새로 추가)
    username: '',            // VARCHAR(100) - 사용자 이름/로그인 ID (새로 추가)  
};
