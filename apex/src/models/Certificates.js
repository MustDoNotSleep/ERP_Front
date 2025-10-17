export const INITIAL_CERTIFICATE_STATE = {
    certificateId: null,     // INT (PK)
    employeeId: null,        // INT (FK)
    certificateName: '',     // VARCHAR(150)
    issuingAuthority: '',    // VARCHAR(150)
    score: '',               // VARCHAR(50)
    acquisitionDate: '',     // DATE
    expirationDate: null,    // DATE
};