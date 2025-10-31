# 공통 컴포넌트 사용 가이드

ERP 프로젝트의 통일된 디자인 시스템과 공통 컴포넌트 사용 가이드입니다.

## 📁 구조

```
src/
├── styles/
│   └── variables.css          # 전역 CSS 변수 (색상, 간격, 폰트 등)
└── components/
    └── common/
        ├── Button.jsx          # 버튼 컴포넌트
        ├── Input.jsx           # Input, Select, Textarea, FormGroup
        ├── Card.jsx            # Card, FilterCard, FilterGroup
        ├── Modal.jsx           # Modal 컴포넌트
        ├── Badge.jsx           # Badge, Tag, Status
        ├── DataTable.jsx       # 테이블 컴포넌트 (기존)
        └── index.js            # 통합 export
```

## 🎨 전역 CSS 변수 사용

먼저 `index.css` 또는 `App.css`에 전역 변수를 import하세요:

```css
@import './styles/variables.css';
```

### 사용 가능한 CSS 변수

```css
/* 색상 */
var(--color-primary)           /* #663D2B */
var(--color-primary-dark)      /* #503021 */
var(--color-secondary)         /* #9CA089 */
var(--color-bg-filter)         /* #E3E3E1 */
var(--color-text-primary)      /* #333 */

/* 간격 */
var(--spacing-sm)              /* 8px */
var(--spacing-md)              /* 12px */
var(--spacing-lg)              /* 16px */
var(--spacing-xl)              /* 24px */

/* 폰트 크기 */
var(--font-size-sm)            /* 14px */
var(--font-size-base)          /* 16px */
var(--font-size-lg)            /* 20px */

/* 테두리 반경 */
var(--radius-sm)               /* 4px */
var(--radius-md)               /* 6px */

/* 그림자 */
var(--shadow-sm)
var(--shadow-md)
```

## 🧩 컴포넌트 사용법

### 1. Button

```jsx
import { Button } from '@/components/common';

// 기본 사용
<Button variant="primary" onClick={handleClick}>
  확인
</Button>

// 다양한 변형
<Button variant="primary">주요 액션</Button>
<Button variant="secondary">보조 액션</Button>
<Button variant="outline">외곽선</Button>
<Button variant="light">취소</Button>
<Button variant="success">승인</Button>
<Button variant="danger">삭제</Button>

// 크기
<Button size="sm">작은 버튼</Button>
<Button size="md">중간 버튼</Button>
<Button size="lg">큰 버튼</Button>

// 상태
<Button disabled>비활성화</Button>
<Button loading>로딩 중...</Button>

// 전체 너비
<Button block>전체 너비 버튼</Button>

// 아이콘 버튼
<Button icon variant="ghost">🔍</Button>
```

### 2. Input & Form

```jsx
import { Input, Select, Textarea, FormGroup } from '@/components/common';

// 기본 Input
<Input 
  type="text"
  placeholder="이름을 입력하세요"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

// FormGroup (Label + Input)
<FormGroup 
  label="이메일" 
  required
  error={errors.email}
  helpText="회사 이메일을 입력하세요"
>
  <Input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
</FormGroup>

// Select
<Select
  value={department}
  onChange={(e) => setDepartment(e.target.value)}
  options={[
    { value: '1', label: '개발팀' },
    { value: '2', label: '인사팀' }
  ]}
  placeholder="부서를 선택하세요"
/>

// Textarea
<Textarea
  value={content}
  onChange={(e) => setContent(e.target.value)}
  rows={5}
  placeholder="내용을 입력하세요"
/>

// 크기 변형
<Input size="sm" />
<Input size="md" />  {/* 기본 */}
<Input size="lg" />

// 상태
<Input error />       {/* 에러 상태 */}
<Input disabled />    {/* 비활성화 */}
```

### 3. Card & Filter

```jsx
import { Card, CardTitle, FilterCard, FilterGroup } from '@/components/common';
import { Input, Select, Button } from '@/components/common';

// 기본 Card
<Card>
  <CardTitle>직원 정보</CardTitle>
  <p>내용...</p>
</Card>

// Header와 Footer가 있는 Card
<Card
  header={<CardTitle>제목</CardTitle>}
  footer={
    <>
      <Button variant="light">취소</Button>
      <Button variant="primary">저장</Button>
    </>
  }
>
  <p>카드 내용</p>
</Card>

// FilterCard (검색 필터용)
<FilterCard 
  title="검색 조건"
  onSearch={handleSearch}
  onReset={handleReset}
>
  <FilterGroup label="이름">
    <Input placeholder="이름 입력" />
  </FilterGroup>
  
  <FilterGroup label="부서">
    <Select options={departments} />
  </FilterGroup>
  
  <FilterGroup label="기간">
    <Input type="date" />
  </FilterGroup>
</FilterCard>
```

### 4. Modal

```jsx
import { Modal, Button } from '@/components/common';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        모달 열기
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="직원 등록"
        size="md"
        footer={
          <>
            <Button variant="light" onClick={() => setIsOpen(false)}>
              취소
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              저장
            </Button>
          </>
        }
      >
        <p>모달 내용...</p>
      </Modal>
    </>
  );
}

// 모달 크기
<Modal size="sm">작은 모달</Modal>
<Modal size="md">중간 모달</Modal>  {/* 기본 */}
<Modal size="lg">큰 모달</Modal>
<Modal size="xl">아주 큰 모달</Modal>
<Modal size="full">전체 화면</Modal>
```

### 5. Badge & Status

```jsx
import { Badge, Tag, Status } from '@/components/common';

// Badge
<Badge variant="primary">새 글</Badge>
<Badge variant="success">승인</Badge>
<Badge variant="warning">대기</Badge>
<Badge variant="error">거부</Badge>

// Badge 크기
<Badge size="sm">작음</Badge>
<Badge size="md">중간</Badge>
<Badge size="lg">큼</Badge>

// Tag (제거 가능)
<Tag onRemove={() => handleRemove(id)}>
  JavaScript
</Tag>

// Status (상태 표시)
<Status status="active">활성</Status>
<Status status="pending">대기 중</Status>
<Status status="inactive">비활성</Status>
<Status status="error">오류</Status>
```

### 6. DataTable (기존)

```jsx
import { DataTable } from '@/components/common';

<DataTable
  headers={[
    '사번',
    '이름',
    '부서',
    '직급',
    '상태'
  ]}
  data={employees}
  renderRow={(employee) => (
    <>
      <td className={styles.tableData}>{employee.id}</td>
      <td className={styles.tableData}>{employee.name}</td>
      <td className={styles.tableData}>{employee.department}</td>
      <td className={styles.tableData}>{employee.position}</td>
      <td className={styles.tableData}>
        <Badge variant="success">재직</Badge>
      </td>
    </>
  )}
  onRowClick={(employee) => handleRowClick(employee)}
/>
```

## 🎯 실전 예시

### 검색 필터 + 테이블 페이지

```jsx
import { 
  FilterCard, 
  FilterGroup, 
  Input, 
  Select, 
  Button,
  DataTable,
  Badge 
} from '@/components/common';

function EmployeeList() {
  const [filters, setFilters] = useState({
    name: '',
    department: '',
    position: ''
  });

  return (
    <div>
      {/* 검색 필터 */}
      <FilterCard 
        title="직원 검색"
        onSearch={handleSearch}
        onReset={handleReset}
      >
        <FilterGroup label="이름">
          <Input
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            placeholder="이름 입력"
          />
        </FilterGroup>

        <FilterGroup label="부서">
          <Select
            value={filters.department}
            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
            options={departments}
          />
        </FilterGroup>

        <FilterGroup label="직급">
          <Select
            value={filters.position}
            onChange={(e) => setFilters({ ...filters, position: e.target.value })}
            options={positions}
          />
        </FilterGroup>
      </FilterCard>

      {/* 테이블 */}
      <DataTable
        headers={['사번', '이름', '부서', '직급', '상태']}
        data={employees}
        renderRow={(employee) => (
          <>
            <td>{employee.id}</td>
            <td>{employee.name}</td>
            <td>{employee.department}</td>
            <td>{employee.position}</td>
            <td>
              <Badge variant="success">재직</Badge>
            </td>
          </>
        )}
        onRowClick={handleRowClick}
      />
    </div>
  );
}
```

### 모달 폼

```jsx
import {
  Modal,
  FormGroup,
  Input,
  Select,
  Textarea,
  Button
} from '@/components/common';

function EmployeeModal({ isOpen, onClose, employee }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={employee ? '직원 수정' : '직원 등록'}
      size="lg"
      footer={
        <div className="flex gap-md">
          <Button variant="light" onClick={onClose}>
            취소
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            저장
          </Button>
        </div>
      }
    >
      <FormGroup label="이름" required error={errors.name}>
        <Input value={formData.name} onChange={handleChange} />
      </FormGroup>

      <FormGroup label="부서" required>
        <Select
          value={formData.department}
          onChange={handleChange}
          options={departments}
        />
      </FormGroup>

      <FormGroup label="비고">
        <Textarea
          value={formData.note}
          onChange={handleChange}
          rows={4}
        />
      </FormGroup>
    </Modal>
  );
}
```

## 💡 유틸리티 클래스

CSS에서 직접 사용 가능한 유틸리티 클래스:

```jsx
// 간격
<div className="mt-lg mb-xl">...</div>
<div className="p-xl">...</div>

// Flex
<div className="flex items-center gap-md">...</div>
<div className="flex justify-between">...</div>

// 텍스트
<p className="text-lg font-bold text-primary">...</p>

// 기타
<div className="w-full rounded-md shadow-sm">...</div>
```

## 🔄 기존 컴포넌트 마이그레이션

기존 컴포넌트를 공통 컴포넌트로 전환:

**Before:**
```jsx
<button 
  className={styles.searchButton}
  onClick={handleSearch}
>
  검색
</button>
```

**After:**
```jsx
<Button 
  variant="primary"
  onClick={handleSearch}
>
  검색
</Button>
```

## 📚 더 알아보기

- `variables.css`: 모든 CSS 변수 정의
- 각 컴포넌트 파일: PropTypes로 사용 가능한 props 확인
- `index.js`: 모든 컴포넌트 import 경로

## 🎨 색상 팔레트

- **Primary (주요)**: `#663D2B` - 갈색 (주요 버튼, 강조)
- **Secondary (보조)**: `#9CA089` - 올리브 그린 (헤더, 보조 요소)
- **Success (성공)**: `#4CAF50` - 녹색 (승인, 완료)
- **Warning (경고)**: `#FF9800` - 주황색 (대기, 주의)
- **Error (오류)**: `#F44336` - 빨강색 (거부, 삭제)
- **Background Filter**: `#E3E3E1` - 연한 회색 (필터 카드 배경)
