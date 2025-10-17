export const INITIAL_MILITARY_SERVICE_STATE = {
    militaryServiceId: null, // INT (PK)
    employeeId: null,        // INT (FK)
    serviceTypeId: null,     // INT (FK)
    branchId: null,          // INT (FK)
    rankId: null,            // INT (FK)
    specialtyId: null,       // INT (FK)
    startDate: '',           // DATE
    endDate: '',             // DATE
    exemptionStatus: '',    // VARCHAR(10)
};