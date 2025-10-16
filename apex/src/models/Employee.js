export const INITIAL_EMPLOYEE_STATE = {
    employee_id: null,      // 사원번호 (int)
    name: '',               // 이름 (varchar)
    password: '',           // 패스워드 (varchar)
    rrn: '',                // 주민번호 (varchar)
    address: '',            // 주소 (varchar)
    phone_number: '',       // 연락처 (varchar)
    email: '',              // 이메일 (varchar)
    hire_date: '',          // 입사일 (date) - JS의 날짜 문자열 ('YYYY-MM-DD')
    quit_date: null,        // 퇴사일 (date) - 퇴사 전이므로 null
    bank_name: '',          // 은행명 (varchar)
    account: '',            // 계좌번호 (varchar)
    internal_number: null,  // 내선번호 (varchar) - 선택 사항이므로 null
    
    department_id: null,    // 부서 ID (int) - 드롭다운 등으로 선택 예정이므로 null
    position_id: null,      // 직급 ID (int) - 드롭다운 등으로 선택 예정이므로 null
};

