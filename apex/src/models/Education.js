export const INITIAL_EDUCATION_STATE = {
    educationId: null,       // INT (PK)
    employeeId: null,        // INT (FK)
    schoolName: '',          // VARCHAR(100)
    major: '',               // VARCHAR(100)
    admissionDate: '',       // DATE
    graduationDate: '',      // DATE
    degree: '',              // ENUM ('고등학교 졸업', '전문학사', '학사', '석사', '박사', '기타')
    graduationStatus: '',    // ENUM ('졸업', '수료', '재학', '중퇴')
};