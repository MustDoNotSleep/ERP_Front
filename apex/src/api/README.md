# ERP Frontend API 모듈

백엔드 Spring Boot REST API와 연동하는 프론트엔드 API 모듈입니다.

## 📁 파일 구조

```
src/api/
├── axios.js              # Axios 인스턴스 설정
├── auth.js              # 인증 API
├── employee.js          # 직원 관리 API
├── department.js        # 부서 관리 API
├── position.js          # 직급/직책 관리 API
├── attendance.js        # 근태 관리 API
├── leave.js             # 휴가 관리 API
├── certificate.js       # 증명서 관리 API
├── appointment.js       # 인사발령 API
├── salary.js            # 급여 관리 API
├── course.js            # 교육 과정 API
├── document.js          # 문서 신청 API
├── post.js              # 게시판 API
├── utils.js             # API 유틸리티
└── index.js             # 통합 export
```

## 🚀 사용 방법

### 1. 개별 모듈 임포트

```javascript
import { login, logout } from '@/api/auth';
import { fetchEmployees, fetchEmployeeProfile } from '@/api/employee';
import { fetchDepartments } from '@/api/department';
```

### 2. 통합 임포트

```javascript
import { 
  login, 
  fetchEmployees, 
  fetchDepartments,
  createLeave 
} from '@/api';
```

### 3. Axios 인스턴스 직접 사용

```javascript
import api from '@/api/axios';

const response = await api.get('/custom-endpoint');
```

## 📝 주요 API 예시

### 인증 (Authentication)

```javascript
import { login, logout, getCurrentUser, isAuthenticated } from '@/api/auth';

// 로그인
const data = await login('user@example.com', 'password');

// 로그아웃
logout();

// 현재 사용자 정보
const user = getCurrentUser();

// 로그인 여부 확인
if (isAuthenticated()) {
  // ...
}
```

### 직원 관리 (Employee)

```javascript
import { 
  fetchEmployees, 
  fetchEmployeeProfile,
  createEmployee,
  updateEmployee,
  updateEmployeePassword 
} from '@/api/employee';

// 직원 목록 조회 (페이징)
const employees = await fetchEmployees(0, 20, 'name,asc');

// 직원 상세 정보
const employee = await fetchEmployeeProfile(employeeId);

// 직원 생성
const newEmployee = await createEmployee({
  name: '홍길동',
  email: 'hong@example.com',
  departmentId: 1,
  positionId: 2,
  // ...
});

// 비밀번호 변경
await updateEmployeePassword(employeeId, 'oldPass', 'newPass');
```

### 부서 관리 (Department)

```javascript
import { 
  fetchDepartments, 
  fetchDepartmentById,
  createDepartment 
} from '@/api/department';

// 부서 목록
const departments = await fetchDepartments();

// 부서 상세
const department = await fetchDepartmentById(1);
```

### 근태 관리 (Attendance)

```javascript
import { 
  checkIn, 
  checkOut, 
  fetchEmployeeAttendances,
  fetchTodayAttendance 
} from '@/api/attendance';

// 출근
await checkIn(employeeId);

// 퇴근
await checkOut(employeeId);

// 직원 근태 목록
const attendances = await fetchEmployeeAttendances(
  employeeId, 
  0, 
  20, 
  '2024-01-01', 
  '2024-01-31'
);

// 오늘 근태 현황
const today = await fetchTodayAttendance();
```

### 휴가 관리 (Leave)

```javascript
import { 
  createLeave, 
  fetchEmployeeLeaves,
  approveLeave,
  rejectLeave,
  fetchLeaveBalance 
} from '@/api/leave';

// 휴가 신청
const leave = await createLeave({
  employeeId: 1,
  leaveType: 'ANNUAL',
  startDate: '2024-06-01',
  endDate: '2024-06-05',
  reason: '개인 사유'
});

// 휴가 승인
await approveLeave(leaveId, '승인합니다');

// 휴가 잔여일 조회
const balance = await fetchLeaveBalance(employeeId);
```

### 급여 관리 (Salary)

```javascript
import { 
  fetchEmployeeSalaries,
  fetchSalaryById,
  downloadPayslip 
} from '@/api/salary';

// 직원 급여 목록
const salaries = await fetchEmployeeSalaries(employeeId, 0, 12, 2024);

// 급여명세서 다운로드
const blob = await downloadPayslip(salaryId);
// 파일 다운로드 처리
const url = window.URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = 'payslip.pdf';
link.click();
```

## 🛠 유틸리티 함수

```javascript
import { 
  extractData, 
  extractPageData, 
  extractErrorMessage,
  formatDate,
  formatDateTime 
} from '@/api/utils';

// API 응답 데이터 추출
const data = extractData(response);

// 페이징 데이터 추출
const pageData = extractPageData(response);
// { content, totalElements, totalPages, currentPage, ... }

// 에러 메시지 추출
try {
  await someApiCall();
} catch (error) {
  const message = extractErrorMessage(error);
  alert(message);
}

// 날짜 포맷
const dateStr = formatDate(new Date()); // "2024-01-15"
const datetimeStr = formatDateTime(new Date()); // "2024-01-15 14:30:00"
```

## ⚙️ 설정

### Axios 기본 설정 (axios.js)

```javascript
const API_BASE_URL = 'http://15.164.75.26:8080/api/v1';
```

- 백엔드 서버 URL이 변경되면 `axios.js` 파일의 `API_BASE_URL`을 수정하세요.
- JWT 토큰은 자동으로 요청 헤더에 포함됩니다.

### 인터셉터

요청 인터셉터:
- 모든 요청에 `Authorization: Bearer {token}` 헤더 자동 추가

응답 인터셉터 (필요시 추가):
- 401 에러 시 자동 로그아웃
- 토큰 갱신 로직

## 📋 API 엔드포인트 매핑

| 프론트엔드 모듈 | 백엔드 컨트롤러 | 기본 경로 |
|--------------|--------------|----------|
| auth.js | AuthenticationController | `/auth` |
| employee.js | EmployeeController | `/employees` |
| department.js | DepartmentController | `/departments` |
| leave.js | LeaveController | `/leaves` |
| attendance.js | AttendanceController | `/attendances` |
| certificate.js | CertificateController | `/certificates` |
| appointment.js | AppointmentRequestController | `/appointment-requests` |
| salary.js | SalaryController | `/salaries` |
| course.js | CourseController | `/courses` |
| position.js | PositionController | `/positions` |
| document.js | DocumentApplicationController | `/document-applications` |
| post.js | PostController | `/posts` |

## 🔐 인증 흐름

1. 로그인 시 `accessToken`, `refreshToken` 저장
2. 모든 API 요청에 자동으로 토큰 포함
3. 토큰 만료 시 갱신 또는 재로그인

```javascript
// 로그인
const data = await login(email, password);
// localStorage에 token, refreshToken, user 정보 저장

// 이후 모든 API 호출에 자동으로 토큰 포함
const employees = await fetchEmployees(); // Authorization 헤더 자동 추가
```

## 🐛 에러 처리

모든 API 함수는 에러 발생 시 예외를 던집니다. 호출하는 쪽에서 try-catch로 처리하세요.

```javascript
try {
  const employee = await fetchEmployeeProfile(id);
  // 성공 처리
} catch (error) {
  const message = extractErrorMessage(error);
  console.error('Error:', message);
  // 사용자에게 에러 표시
}
```

## 📦 응답 구조

### 단일 객체 응답
```json
{
  "success": true,
  "message": "성공",
  "data": { ... }
}
```

### 페이징 응답 (Spring Data Page)
```json
{
  "content": [...],
  "totalElements": 100,
  "totalPages": 5,
  "number": 0,
  "size": 20,
  "first": true,
  "last": false
}
```

## 🔄 업데이트 로그

- 2024-01-15: 초기 생성, 백엔드 API 구조에 맞춰 모든 엔드포인트 구현
- 로그인 API는 기존 연결 상태 유지
