export const INITIAL_SALARY_INFO_STATE = {
    salaryInfoId: null,        // INT (PK, Auto Increment)
    employeeId: null,          // INT (FK)
    bankName: '',              // ENUM ('하나은행', '신한은행', '국민은행', '우리은행', '농협은행', '기업은행', '카카오뱅크', '토스뱅크', '기타')
    accountNumber: '',         // VARCHAR(50)
    salary: null,              // INT (월 기본 급여 또는 연봉 기준 금액)
};