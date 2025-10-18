export const INITIAL_MILITARY_SERVICE_STATE = {
    militaryInfoId: null, // INT (PK)
    employeeId: null,        // INT (FK)
    militaryStatus: '',        // ENUM ('현역', '보충역', '면제', '미필')
    militaryBranch: '',        // ENUM ('육군', '해군', '공군', '해병대', '기타')
    militaryRank: '',          // ENUM ('병장', '상병', '일병', '이병', '하사', '기타')
    militarySpecialty: '',     // ENUM ('보병', '포병', '통신', '공병', '기타')
    exemptionReason: '',       // ENUM ('해당없음', '복무단축', '생계곤란', '질병', '기타')
    serviceStartDate: '',           // DATE
    serviceEndDate: '',             // DATE
};