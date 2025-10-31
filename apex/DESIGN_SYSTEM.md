# ERP 프로젝트 - 통일된 디자인 시스템 완성 ✨

백엔드 API 연동과 함께 **통일된 디자인 시스템**이 완성되었습니다!

## 📦 완성된 항목

### 1. 백엔드 API 모듈 (/src/api)
- ✅ `auth.js` - 인증 (로그인 API 연결됨)
- ✅ `employee.js` - 직원 관리
- ✅ `department.js` - 부서 관리
- ✅ `attendance.js` - 근태 관리
- ✅ `leave.js` - 휴가 관리
- ✅ `certificate.js` - 증명서 관리
- ✅ `appointment.js` - 인사발령
- ✅ `salary.js` - 급여 관리
- ✅ `course.js` - 교육 과정
- ✅ `position.js` - 직급/직책
- ✅ `document.js` - 문서 신청
- ✅ `post.js` - 게시판
- ✅ `utils.js` - API 유틸리티 (에러 처리, 날짜 포맷 등)
- ✅ `index.js` - 통합 export
- ✅ `README.md` - API 사용 가이드

### 2. 디자인 시스템 (/src/styles)
- ✅ `variables.css` - 전역 CSS 변수
  - 색상 팔레트 (Primary: #663D2B, Secondary: #9CA089 등)
  - 간격 시스템 (xs, sm, md, lg, xl 등)
  - 폰트 크기 및 굵기
  - 그림자, 테두리 반경, 전환 효과
  - 유틸리티 클래스 (flex, gap, margin, padding 등)
- ✅ `common.css` - 전역 공통 스타일 (버튼, 입력, 카드 등)

### 3. 공통 컴포넌트 (/src/components/common)
- ✅ `Button.jsx` - 통일된 버튼 컴포넌트
  - 7가지 색상 변형 (primary, secondary, outline, light, success, warning, danger)
  - 3가지 크기 (sm, md, lg)
  - 로딩 상태, 비활성화, 전체 너비 등
  
- ✅ `Input.jsx` - Form 컴포넌트 모음
  - Input, Select, Textarea
  - FormGroup (Label + Input 조합)
  - 크기 변형, 에러 상태 지원
  
- ✅ `Card.jsx` - 카드 컴포넌트
  - Card, CardTitle
  - FilterCard (검색 필터용)
  - FilterGroup (필터 레이블 + 입력)
  
- ✅ `Modal.jsx` - 모달 컴포넌트
  - 5가지 크기 (sm, md, lg, xl, full)
  - ESC 키로 닫기, Portal 사용
  
- ✅ `Badge.jsx` - Badge, Tag, Status
  - Badge (상태 표시)
  - Tag (제거 가능한 태그)
  - Status (점 + 텍스트)
  - Divider (구분선)
  
- ✅ `DataTable.jsx` - 테이블 컴포넌트 (기존 유지)

- ✅ `index.js` - 통합 export
- ✅ `README.md` - 컴포넌트 사용 가이드
- ✅ `Examples.jsx` - 실전 사용 예시

## 🎨 색상 팔레트

```css
Primary (주요)    #663D2B  /* 갈색 - 주요 버튼, 강조 */
Primary Dark      #503021  /* 진한 갈색 - hover */
Secondary         #9CA089  /* 올리브 그린 - 헤더 */
Secondary Dark    #323B2A  /* 진한 그린 */
Background Filter #E3E3E1  /* 연한 회색 - 필터 배경 */
Success           #4CAF50  /* 녹색 - 승인, 완료 */
Warning           #FF9800  /* 주황 - 대기, 경고 */
Error             #F44336  /* 빨강 - 거부, 삭제 */
```

## 🚀 빠른 시작

### 1단계: 전역 스타일 적용 확인

`src/index.css`가 다음을 포함하는지 확인:
```css
@import './styles/variables.css';
@import './styles/common.css';
```

### 2단계: 공통 컴포넌트 import

```jsx
import {
  Button,
  Input,
  Select,
  FilterCard,
  FilterGroup,
  Modal,
  Badge,
  Card,
  DataTable
} from '@/components/common';
```

### 3단계: 사용 예시

#### 검색 필터
```jsx
<FilterCard title="직원 검색" onSearch={handleSearch} onReset={handleReset}>
  <FilterGroup label="이름">
    <Input placeholder="이름 입력" />
  </FilterGroup>
  
  <FilterGroup label="부서">
    <Select options={departments} />
  </FilterGroup>
</FilterCard>
```

#### 버튼
```jsx
<Button variant="primary" onClick={handleSubmit}>저장</Button>
<Button variant="light" onClick={handleCancel}>취소</Button>
<Button variant="success">승인</Button>
<Button variant="danger">삭제</Button>
```

#### 테이블
```jsx
<DataTable
  headers={['사번', '이름', '부서', '상태']}
  data={employees}
  renderRow={(emp) => (
    <>
      <td>{emp.id}</td>
      <td>{emp.name}</td>
      <td>{emp.department}</td>
      <td><Badge variant="success">재직</Badge></td>
    </>
  )}
/>
```

#### 모달
```jsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="직원 등록"
  footer={
    <>
      <Button variant="light" onClick={onClose}>취소</Button>
      <Button variant="primary" onClick={onSave}>저장</Button>
    </>
  }
>
  <FormGroup label="이름" required>
    <Input value={name} onChange={e => setName(e.target.value)} />
  </FormGroup>
</Modal>
```

## 🔄 기존 컴포넌트 마이그레이션

### Before (기존)
```jsx
import styles from './Filter.module.css';

<div className={styles.filterContainer}>
  <div className={styles.inputGroup}>
    <label className={styles.label}>이름</label>
    <input className={styles.input} />
  </div>
  <button className={styles.searchButton}>검색</button>
</div>
```

### After (새로운)
```jsx
import { FilterCard, FilterGroup, Input } from '@/components/common';

<FilterCard title="검색 조건" onSearch={handleSearch}>
  <FilterGroup label="이름">
    <Input placeholder="이름 입력" />
  </FilterGroup>
</FilterCard>
```

## 💡 유틸리티 클래스 활용

CSS 모듈 없이도 전역 클래스 사용 가능:

```jsx
// Flex 레이아웃
<div className="flex items-center gap-md">
  <button className="btn btn-primary btn-md">버튼</button>
</div>

// 간격
<div className="mt-lg mb-xl p-lg">
  내용
</div>

// 텍스트
<h1 className="text-xl font-bold text-primary">제목</h1>

// 카드
<div className="filter-card">
  <input className="input input-md" />
  <select className="select select-md" />
</div>
```

## 📚 문서 위치

1. **API 가이드**: `src/api/README.md`
2. **컴포넌트 가이드**: `src/components/common/README.md`
3. **사용 예시**: `src/components/common/Examples.jsx`
4. **CSS 변수**: `src/styles/variables.css`

## ✅ 작업 완료 체크리스트

- [x] 백엔드 API 엔드포인트 분석
- [x] 12개 API 모듈 생성 (auth, employee, department 등)
- [x] API 유틸리티 함수 (에러 처리, 페이징, 날짜 포맷)
- [x] 전역 CSS 변수 시스템 구축
- [x] 색상 팔레트 정의
- [x] 간격, 폰트, 그림자 시스템
- [x] Button 컴포넌트 (7가지 변형)
- [x] Input/Form 컴포넌트
- [x] Card/Filter 컴포넌트
- [x] Modal 컴포넌트
- [x] Badge/Tag/Status 컴포넌트
- [x] 유틸리티 클래스 시스템
- [x] 전역 공통 스타일
- [x] 사용 가이드 문서
- [x] 실전 예시 코드

## 🎯 다음 단계 (선택사항)

1. **기존 페이지 리팩토링**
   - `PeopleSearchFilter` → `FilterCard` 사용
   - 각종 버튼 → `Button` 컴포넌트 사용
   - 입력 필드 → `Input`, `Select` 사용

2. **추가 컴포넌트** (필요시)
   - Pagination
   - Tabs
   - Dropdown
   - Toast/Notification
   - Loading Spinner

3. **테마 확장**
   - 다크 모드 지원
   - 커스텀 색상 테마

## 💬 사용 팁

1. **컴포넌트 우선**: 가능하면 공통 컴포넌트 사용
2. **CSS 변수 활용**: 커스텀 스타일 필요시 `var(--color-primary)` 등 사용
3. **유틸리티 클래스**: 간단한 레이아웃은 유틸리티 클래스로 해결
4. **일관성 유지**: 같은 기능은 같은 색상/스타일 사용
   - 저장/확인: `primary`
   - 취소/닫기: `light`
   - 승인/완료: `success`
   - 삭제/거부: `danger`

---

**모든 준비가 완료되었습니다! 🎉**

이제 프로젝트 전체에서 통일된 디자인으로 개발할 수 있습니다.
