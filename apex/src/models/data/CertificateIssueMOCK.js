// 👈 (수정 후) 'label' (보여줄 값)과 'type', 'lang' (보낼 값)을 모두 가집니다.
export const CERTIFICATE_OPTIONS = [
    { 
        label: "재직증명서 (국문)", 
        value: JSON.stringify({ type: "CERTIFICATE_OF_EMPLOYMENT", lang: "KOREAN" }) 
    },
    { 
        label: "재직증명서 (영문)", 
        value: JSON.stringify({ type: "CERTIFICATE_OF_EMPLOYMENT", lang: "ENGLISH" }) 
    },
    { 
        label: "경력증명서 (국문)", 
        value: JSON.stringify({ type: "CERTIFICATE_OF_CAREER", lang: "KOREAN" }) 
    },
    { 
        label: "경력증명서 (영문)", 
        value: JSON.stringify({ type: "CERTIFICATE_OF_CAREER", lang: "ENGLISH" }) 
    },
    { 
        label: "소득증명서 (국문)", 
        value: JSON.stringify({ type: "CERTIFICATE_OF_INCOME", lang: "KOREAN" }) 
    },
    {
        label: "소득증명서 (영문)", 
        value: JSON.stringify({ type: "CERTIFICATE_OF_INCOME", lang: "ENGLISH" }) 
    }

];

// 👈 (추가) 테이블 표시에 사용할 label 변환 맵 (기존 CERTIFICATE_TYPES 역할)
// CertificateRequestPage의 getCertificateLabel 함수가 이 객체를 사용하도록 수정해야 합니다.
export const CERTIFICATE_TYPE_LABELS = {
    "CERTIFICATE_OF_EMPLOYMENT": "재직증명서",
    "CERTIFICATE_OF_CAREER": "경력증명서",
    "CERTIFICATE_OF_INCOME": "소득증명서"
};
// 💡 처리 상태 상수 (ENUM)
export const ISSUE_STATUS = {
    PENDING: '승인대기',
    APPROVED: '승인완료',
    REJECTED: '승인반려',
};

export const ISSUE_STATUS_OPTIONS = [
    { value: ISSUE_STATUS.PENDING, label: '승인대기' },
    { value: ISSUE_STATUS.APPROVED, label: '승인완료' },
    { value: ISSUE_STATUS.REJECTED, label: '승인반려' },
];

export const CERTIFICATE_ISSUE_MOCK = [
    {   documentId: 'C24001', 
        applicationDate: '2024/10/10', 
        employee: { employeeId: 12311, name: '김사원' }, 
        documentType: 'CERTIFICATE_OF_EMPLOYMENT', 
        copies: 1, 
        issueDate: 'YYYY/MM/DD', 
        documentStatus: 'PENDING' 
    },
{ 
        documentId: 'C24002', 
        applicationDate: '2024/10/11', 
        employee: { employeeId: 12322, name: '이대리' }, 
        documentType: 'CERTIFICATE_OF_EMPLOYMENT', // (영문 신청이어도 타입은 동일)
        copies: 1, 
        issueDate: 'YYYY/MM/DD', 
        documentStatus: 'PENDING' 
    },
   { 
        documentId: 'C24003', 
        applicationDate: '2024/10/12', 
        employee: { employeeId: 12333, name: '정대리' }, 
        documentType: 'CERTIFICATE_OF_CAREER', 
        copies: 1, 
        issueDate: 'YYYY/MM/DD', 
        documentStatus: 'APPROVED' 
    },
{ 
        documentId: 'C24004', 
        applicationDate: '2024/10/13', 
        employee: { employeeId: 12344, name: '임선임' }, 
        documentType: 'CERTIFICATE_OF_EMPLOYMENT', 
        copies: 1, 
        issueDate: 'YYYY/MM/DD', 
        documentStatus: 'PENDING' 
    },
]