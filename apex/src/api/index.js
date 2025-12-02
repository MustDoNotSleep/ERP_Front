/**
 * API 모듈 통합 export
 * 백엔드 Spring Boot REST API와 연동
 */

// Authentication
export * from './auth';

// Employee Management
export * from './employee';

// Department Management
export * from './department';

// Position Management
export * from './position';

// Attendance Management
export * from './attendance';

// Leave Management
export * from './leave';

// Certificate Management
export * from './certificate';

// Appointment Management
export * from './appointment';

// Salary Management
export * from './salary';

// Severance Management
export * from './severance';

// Course Management
export * from './course';

// Document Management
export * from './document';

// Post Management
export * from './post';

// Welfare Management
export * from './welfare';

// Axios instance
export { default as api } from './axios';
