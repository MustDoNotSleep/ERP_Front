export const INITIAL_EMPLOYEE_STATE = {
    employeeId: null,      // 사원번호 (int)
    name: '',               // 이름 (varchar)
    password: '',           // 패스워드 (varchar)
    rrn: '',                // 주민번호 (varchar)
    address: '',            // 주소 (varchar)
    phoneNumber: '',       // 연락처 (varchar)
    email: '',              // 이메일 (varchar)
    hireDate: '',          // 입사일 (date) - JS의 날짜 문자열 ('YYYY-MM-DD')
    quitDate: null,        // 퇴사일 (date) - 퇴사 전이므로 null
    bankName: '',          // 은행명 (varchar)
    account: '',            // 계좌번호 (varchar)
    internalNumber: null,  // 내선번호 (varchar) - 선택 사항이므로 null
    
    departmentId: null,    // 부서 ID (int) - 드롭다운 등으로 선택 예정이므로 null
    positionId: null,      // 직급 ID (int) - 드롭다운 등으로 선택 예정이므로 null
};

/**
 * 💡 사원 목록 Mock Data (경력 관리 테이블 등에 사용)
 * 실제 API가 내려줄 데이터 구조를 모방합니다.
 */
export const EMPLOYEE_LIST_MOCK_DATA = [
   { 
        employeeId: 12345, 
        name: '김선수', 
        password: 'hashed_pass_1',
        rrn: '901234-1XXXXXX',
        address: '서울시 강남구 테헤란로 123',
        phoneNumber: '010-1234-5678',
        email: 'kim.sunsu@erp.com',
        hireDate: '2020-03-01',
        quitDate: null,
        bankName: '국민은행',
        account: '12345604789012',
        internalNumber: '5501',
        departmentId: 101,
        positionId: 10,
    },
    { 
        employeeId: 12346, 
        name: '최사원', 
        password: 'hashed_pass_2',
        rrn: '950505-2XXXXXX',
        address: '서울시 종로구 종로 456',
        phoneNumber: '010-9876-5432',
        email: 'choi.sawon@erp.com',
        hireDate: '2024-01-15',
        quitDate: null,
        bankName: '신한은행',
        account: '110-222-333444',
        internalNumber: '5502',
        departmentId: 102,
        positionId: 5,
    },
    { 
        employeeId: 12347, 
        name: '윤대리', 
        password: 'hashed_pass_3',
        rrn: '881122-1XXXXXX',
        address: '경기도 성남시 분당구 판교동',
        phoneNumber: '010-3333-4444',
        email: 'yun.daeri@erp.com',
        hireDate: '2022-06-20',
        quitDate: '2025-10-17', // 퇴사자 데이터 예시
        bankName: '우리은행',
        account: '1002-567-890123',
        internalNumber: null,
        departmentId: 101,
        positionId: 8,
    },
    { 
        employeeId: 12348, 
        name: '홍선임', 
        password: 'hashed_pass_4',
        rrn: '920801-2XXXXXX',
        address: '인천광역시 연수구 송도동',
        phoneNumber: '010-7777-8888',
        email: 'hong.sunim@erp.com',
        hireDate: '2021-09-10',
        quitDate: null,
        bankName: '하나은행',
        account: '345-678901-234',
        internalNumber: '5504',
        departmentId: 103,
        positionId: 7,
    },
];

