/**
 * 공통 컴포넌트 사용 예시
 * 기존 컴포넌트를 새로운 디자인 시스템으로 마이그레이션하는 방법
 */

import React, { useState } from 'react';
import {
  Button,
  Input,
  Select,
  FilterCard,
  FilterGroup,
  DataTable,
  Modal,
  FormGroup,
  Badge,
  Card,
  CardTitle
} from '@/components/common';

/**
 * 예시 1: 검색 필터 + 테이블
 * PeopleSearchFilter 같은 기존 컴포넌트를 새 스타일로 변환
 */
export function EmployeeSearchExample() {
  const [filters, setFilters] = useState({
    name: '',
    department: '',
    position: ''
  });

  const departmentOptions = [
    { value: '1', label: '개발팀' },
    { value: '2', label: '인사팀' },
    { value: '3', label: '경영지원팀' }
  ];

  const positionOptions = [
    { value: '1', label: '사원' },
    { value: '2', label: '대리' },
    { value: '3', label: '과장' }
  ];

  const employees = [
    { id: 'E001', name: '홍길동', department: '개발팀', position: '과장', status: '재직' },
    { id: 'E002', name: '김철수', department: '인사팀', position: '대리', status: '재직' }
  ];

  const handleSearch = () => {
    console.log('검색:', filters);
  };

  const handleReset = () => {
    setFilters({ name: '', department: '', position: '' });
  };

  return (
    <div className="p-xl">
      {/* 새로운 FilterCard 사용 */}
      <FilterCard title="직원 검색" onSearch={handleSearch} onReset={handleReset}>
        <FilterGroup label="이름">
          <Input
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            placeholder="이름을 입력하세요"
          />
        </FilterGroup>

        <FilterGroup label="부서">
          <Select
            value={filters.department}
            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
            options={departmentOptions}
            placeholder="부서를 선택하세요"
          />
        </FilterGroup>

        <FilterGroup label="직급">
          <Select
            value={filters.position}
            onChange={(e) => setFilters({ ...filters, position: e.target.value })}
            options={positionOptions}
            placeholder="직급을 선택하세요"
          />
        </FilterGroup>
      </FilterCard>

      {/* DataTable 사용 */}
      <DataTable
        headers={['사번', '이름', '부서', '직급', '상태']}
        data={employees}
        renderRow={(employee) => (
          <>
            <td className="tableData">{employee.id}</td>
            <td className="tableData">{employee.name}</td>
            <td className="tableData">{employee.department}</td>
            <td className="tableData">{employee.position}</td>
            <td className="tableData">
              <Badge variant="success">{employee.status}</Badge>
            </td>
          </>
        )}
      />
    </div>
  );
}

/**
 * 예시 2: 등록/수정 폼 모달
 */
export function EmployeeFormModalExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    note: ''
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    // 유효성 검사
    const newErrors = {};
    if (!formData.name) newErrors.name = '이름은 필수입니다.';
    if (!formData.email) newErrors.email = '이메일은 필수입니다.';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 저장 로직
    console.log('저장:', formData);
    setIsOpen(false);
  };

  return (
    <div>
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        직원 등록
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="직원 등록"
        size="lg"
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
        <FormGroup label="이름" required error={errors.name}>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="이름을 입력하세요"
          />
        </FormGroup>

        <FormGroup label="이메일" required error={errors.email}>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="이메일을 입력하세요"
          />
        </FormGroup>

        <FormGroup label="부서" required>
          <Select
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            options={[
              { value: '1', label: '개발팀' },
              { value: '2', label: '인사팀' }
            ]}
          />
        </FormGroup>

        <FormGroup label="직급" required>
          <Select
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            options={[
              { value: '1', label: '사원' },
              { value: '2', label: '대리' }
            ]}
          />
        </FormGroup>

        <FormGroup label="비고" helpText="특이사항이 있으면 입력하세요">
          <Input
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            placeholder="비고"
          />
        </FormGroup>
      </Modal>
    </div>
  );
}

/**
 * 예시 3: 다양한 버튼 스타일
 */
export function ButtonStylesExample() {
  return (
    <div className="p-xl">
      <Card header={<CardTitle>버튼 스타일</CardTitle>}>
        <div className="flex flex-col gap-lg">
          {/* 색상 변형 */}
          <div className="flex gap-md items-center">
            <span className="text-sm font-semibold" style={{ width: '100px' }}>
              색상:
            </span>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="light">Light</Button>
            <Button variant="success">Success</Button>
            <Button variant="danger">Danger</Button>
          </div>

          {/* 크기 변형 */}
          <div className="flex gap-md items-center">
            <span className="text-sm font-semibold" style={{ width: '100px' }}>
              크기:
            </span>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>

          {/* 상태 */}
          <div className="flex gap-md items-center">
            <span className="text-sm font-semibold" style={{ width: '100px' }}>
              상태:
            </span>
            <Button>Normal</Button>
            <Button disabled>Disabled</Button>
            <Button loading>Loading...</Button>
          </div>

          {/* 전체 너비 */}
          <div>
            <span className="text-sm font-semibold mb-sm" style={{ display: 'block' }}>
              전체 너비:
            </span>
            <Button variant="primary" block>
              전체 너비 버튼
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

/**
 * 예시 4: HTML 클래스로 직접 사용 (CSS 모듈 없이)
 */
export function GlobalClassExample() {
  return (
    <div className="p-xl">
      <div className="filter-card">
        <h3 className="page-title">전역 클래스 사용 예시</h3>
        
        <div className="flex gap-md items-center mb-lg">
          <button className="btn btn-primary btn-md">Primary Button</button>
          <button className="btn btn-light btn-md">Light Button</button>
        </div>

        <div className="form-group">
          <label className="form-label">이름</label>
          <input type="text" className="input input-md" placeholder="이름 입력" />
        </div>

        <div className="form-group">
          <label className="form-label">부서</label>
          <select className="select select-md">
            <option>개발팀</option>
            <option>인사팀</option>
          </select>
        </div>

        <div className="flex gap-md">
          <span className="badge badge-success">승인</span>
          <span className="badge badge-warning">대기</span>
          <span className="badge badge-danger">거부</span>
        </div>
      </div>
    </div>
  );
}

/**
 * 예시 5: 기존 코드와 비교
 */
export function MigrationComparison() {
  // ===== BEFORE (기존 방식) =====
  // const OldStyle = () => (
  //   <div className={styles.filterContainer}>
  //     <div className={styles.inputGrid}>
  //       <div className={styles.inputGroup}>
  //         <label className={styles.label}>이름</label>
  //         <input className={styles.input} />
  //       </div>
  //       <button className={styles.searchButton}>검색</button>
  //     </div>
  //   </div>
  // );

  // ===== AFTER (새로운 방식) =====
  const NewStyle = () => (
    <FilterCard title="검색 조건">
      <FilterGroup label="이름">
        <Input placeholder="이름 입력" />
      </FilterGroup>
    </FilterCard>
  );

  return <NewStyle />;
}
