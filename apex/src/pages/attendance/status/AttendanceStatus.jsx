import React, { useState, useEffect } from 'react';
import { updateAttendance } from '../../../api/attendance';
import { FilterCard, FilterGroup, Input, Select, DataTable, Card } from '../../../components/common';
import EmployeeSearchModal from '../../../components/common/EmployeeSearchModal';
import AttendanceEditModal from '../../../components/attendance/AttendanceEditModal';
import api from '../../../api/axios';
import styles from './AttendanceStatus.module.css';
import tableStyles from '../../../components/common/DataTable.module.css';

export default function AttendanceStatusRisk() {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 직원 검색 모달
  const [isEmployeeSearchOpen, setIsEmployeeSearchOpen] = useState(false);
  
  // 수정 모달 관련
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editForm, setEditForm] = useState({
    checkInTime: '',
    checkOutTime: '',
    status: '',
    remarks: ''
  });
  
  // 필터 상태
  const [filters, setFilters] = useState({
    employeeName: '',
    employeeId: '',
    department: '',
    startDate: '',
    endDate: '',
    status: ''
  });

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  // 데이터 로드
  const loadAttendances = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      
      // 날짜 범위가 설정되어 있으면 해당 범위로 조회, 없으면 최근 30일
      if (filters.startDate && filters.endDate) {
        response = await api.get('/attendances/period', {
          params: {
            startDate: filters.startDate,
            endDate: filters.endDate
          }
        });
      } else {
        // 기본적으로 최근 30일 데이터 조회
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        
        response = await api.get('/attendances/period', {
          params: {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
          }
        });
      }
      
      // API 응답 구조에 맞게 데이터 설정 및 필드 매핑
      const attendancesData = response.data?.data || [];
      const mappedData = attendancesData.map(item => ({
        id: item.id,
        employeeId: item.employeeId,
        employeeName: item.employeeName,
        departmentName: item.departmentName,
        // 날짜/시간 필드 매핑
        attendanceDate: item.checkIn ? item.checkIn.split('T')[0] : null,
        checkInTime: item.checkIn ? item.checkIn.split('T')[1]?.substring(0, 5) : null,
        checkOutTime: item.checkOut ? item.checkOut.split('T')[1]?.substring(0, 5) : null,
        // 근태 타입 및 기타 필드 매핑
        attendanceStatus: item.attendanceType,
        attendanceType: item.attendanceType,
        workingHours: item.workHours,
        workHours: item.workHours,
        overtimeHours: item.overtimeHours,
        remarks: item.note,
        note: item.note,
        createdAt: item.createdAt
      }));
      
      setAttendances(mappedData);
      
      // 페이지네이션 처리 (백엔드가 배열만 반환하므로 클라이언트에서 처리)
      const totalItems = mappedData.length;
      setTotalPages(Math.ceil(totalItems / pageSize));
      
    } catch (err) {
      console.error('근태 데이터 조회 실패:', err);
      setError('근태 데이터를 불러오는데 실패했습니다.');
      setAttendances([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters.startDate, filters.endDate]);

  // 직원 선택 핸들러
  const handleEmployeeSelect = (employee) => {
    setFilters(prev => ({
      ...prev,
      employeeName: employee.name || '',
      employeeId: employee.id?.toString() || '',
      department: employee.departmentName || ''
    }));
  };

  // 빠른 날짜 선택
  const handleQuickDateSelect = (days) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    setFilters(prev => ({
      ...prev,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    }));
  };

  // 필터 변경
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  // 검색
  const handleSearch = () => {
    setCurrentPage(0);
    loadAttendances();
  };

  // 초기화
  const handleReset = () => {
    setFilters({
      employeeName: '',
      employeeId: '',
      department: '',
      startDate: '',
      endDate: '',
      status: ''
    });
    setCurrentPage(0);
  };

  // 행 클릭 - 수정 모달 열기
  const handleRowClick = (record) => {
    setSelectedRecord(record);
    setEditForm({
      checkInTime: record.checkInTime || '',
      checkOutTime: record.checkOutTime || '',
      status: record.attendanceType || '',
      remarks: record.note || ''
    });
    setIsEditModalOpen(true);
  };

  // 수정 폼 변경
  const handleEditFormChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  // 수정 저장
  const handleEditSave = async () => {
    try {
      if (!selectedRecord?.id) {
        alert('근태 기록 ID가 없습니다.');
        return;
      }

      // API 요청 데이터 구조 맞추기
      const updateData = {
        checkInTime: editForm.checkInTime,
        checkOutTime: editForm.checkOutTime,
        status: editForm.status,
        remarks: editForm.remarks
      };

      await updateAttendance(selectedRecord.id, updateData);
      alert('근태 기록이 수정되었습니다.');
      setIsEditModalOpen(false);
      loadAttendances(); // 목록 새로고침
    } catch (err) {
      console.error('근태 수정 실패:', err);
      const errorMessage = err.response?.data?.message || '근태 기록 수정에 실패했습니다.';
      alert(errorMessage);
    }
  };

  // 필터링된 데이터 (클라이언트 측 필터링 + 페이지네이션)
  const filteredAttendances = attendances.filter(record => {
    if (filters.employeeName && !record.employeeName?.includes(filters.employeeName)) return false;
    if (filters.employeeId && !record.employeeId?.toString().includes(filters.employeeId)) return false;
    if (filters.department && !record.departmentName?.includes(filters.department)) return false;
    if (filters.status && record.attendanceType !== filters.status) return false;
    return true;
  });

  // 페이지네이션 적용
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedAttendances = filteredAttendances.slice(startIndex, endIndex);

  // 실제 페이지 수 업데이트
  useEffect(() => {
    setTotalPages(Math.ceil(filteredAttendances.length / pageSize));
  }, [filteredAttendances.length]);

  // 테이블 헤더 정의
  const tableHeaders = [
    { label: '선택' },
    { label: '근태일자' },
    { label: '근태일시' },
    { label: '사번' },
    { label: '이름' },
    { label: '소속' },
    { label: '결과' },
    { label: '총 근무시간' }
  ];

  // 테이블 행 렌더링
  const renderTableRow = (record) => {
    // 날짜 포맷팅 (YYYY-MM-DD를 YYYY/MM/DD로)
    const formattedDate = record.attendanceDate 
      ? record.attendanceDate.replace(/-/g, '/')
      : 'YYYY/MM/DD';
    
    return (
      <>
        <td className={tableStyles.tableData}>
          <input type="checkbox" />
        </td>
        <td className={tableStyles.tableData}>{formattedDate}</td>
        <td className={tableStyles.tableData}>
          {record.checkInTime && record.checkOutTime 
            ? `${record.checkInTime} - ${record.checkOutTime}` 
            : record.checkInTime 
              ? `${record.checkInTime} - 미퇴근`
              : '-'}
        </td>
        <td className={tableStyles.tableData}>{record.employeeId || '-'}</td>
        <td className={tableStyles.tableData}>{record.employeeName || '-'}</td>
        <td className={tableStyles.tableData}>{record.departmentName || '-'}</td>
        <td className={tableStyles.tableData}>{record.attendanceType || '-'}</td>
        <td className={tableStyles.tableData}>{record.workHours ? `${record.workHours}시간` : '-'}</td>
      </>
    );
  };

  // 근태 구분 옵션
  const statusOptions = [
    { value: '', label: '전체' },
    { value: '정상출근', label: '정상출근' },
    { value: '지각', label: '지각' },
    { value: '조퇴', label: '조퇴' },
    { value: '결근', label: '결근' },
    { value: '재택근무', label: '재택근무' },
    { value: '야근', label: '야근' },
    { value: '주말근무', label: '주말근무' }
  ];

  return (
    <div className={styles.container}>
      {/* 필터 카드 */}
      <FilterCard 
        title="근태 현황 및 리스크 관리"
        description="직원들의 출퇴근 현황을 조회하고 근태 리스크를 관리합니다."
        onSearch={handleSearch}
        onReset={handleReset}
      >
        {/* 첫 번째 줄: 직원 정보 필터 */}
        <FilterGroup label="사번">
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Input
              type="text"
              name="employeeId"
              value={filters.employeeId}
              onChange={(e) => handleFilterChange('employeeId', e.target.value)}
              placeholder="사번 입력"
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={() => setIsEmployeeSearchOpen(true)}
              className={styles.searchButton}
            >
              직원 검색
            </button>
          </div>
        </FilterGroup>

        <FilterGroup label="이름">
          <Input
            type="text"
            name="employeeName"
            value={filters.employeeName}
            onChange={(e) => handleFilterChange('employeeName', e.target.value)}
            placeholder="이름 입력"
          />
        </FilterGroup>

        <FilterGroup label="부서">
          <Input
            type="text"
            name="department"
            value={filters.department}
            onChange={(e) => handleFilterChange('department', e.target.value)}
            placeholder="부서 입력"
          />
        </FilterGroup>

        <FilterGroup label="근태 구분">
          <Select
            name="status"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            options={statusOptions}
          />
        </FilterGroup>

        {/* 두 번째 줄: 기간 선택 */}
        <div className={styles.dateRangeWrapper}>
          <label className={styles.dateLabel}>기간 선택</label>
          <div className={styles.dateRangeContainer}>
            <div className={styles.quickButtons}>
              <button
                type="button"
                onClick={() => handleQuickDateSelect(30)}
                className={styles.quickButton}
              >
                1개월
              </button>
              <button
                type="button"
                onClick={() => handleQuickDateSelect(90)}
                className={styles.quickButton}
              >
                3개월
              </button>
              <button
                type="button"
                onClick={() => handleQuickDateSelect(180)}
                className={styles.quickButton}
              >
                6개월
              </button>
              <button
                type="button"
                onClick={() => handleQuickDateSelect(365)}
                className={styles.quickButton}
              >
                1년
              </button>
            </div>
            <div className={styles.dateInputs}>
              <Input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
              <span className={styles.dateSeparator}>~</span>
              <Input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </div>
          </div>
        </div>
      </FilterCard>

      {/* 에러 메시지 */}
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      {/* 테이블 */}
      {loading ? (
        <Card>
          <div className={styles.loadingMessage}>
            데이터를 불러오는 중...
          </div>
        </Card>
      ) : (
        <DataTable
          headers={tableHeaders}
          data={paginatedAttendances}
          renderRow={renderTableRow}
          onRowClick={handleRowClick}
          emptyMessage="조회된 근태 기록이 없습니다."
        />
      )}

      {/* 페이지네이션 */}
      {totalPages > 0 && (
        <div className={styles.pagination}>
          <button
            className="btn btn-light btn-sm"
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
          >
            ◀
          </button>
          <span className={styles.pageInfo}>
            {currentPage + 1} / {totalPages}
          </span>
          <button
            className="btn btn-light btn-sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage >= totalPages - 1}
          >
            ▶
          </button>
        </div>
      )}

      {/* 근태 기록 수정 모달 */}
      <AttendanceEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        selectedRecord={selectedRecord}
        editForm={editForm}
        onFormChange={handleEditFormChange}
        onSave={handleEditSave}
        statusOptions={statusOptions}
      />

      {/* 직원 검색 모달 */}
      <EmployeeSearchModal
        isOpen={isEmployeeSearchOpen}
        onClose={() => setIsEmployeeSearchOpen(false)}
        onSelectEmployee={handleEmployeeSelect}
      />
    </div>
  );
}
