import React, { useState } from 'react';
import styles from './AllowanceFilter.module.css';

/**
 * 수당 선정 내역 필터 컴포넌트
 */
export default function AllowanceFilter({ onSearch, onReset }) {
  const [filterTargetName, setFilterTargetName] = useState('');
  const [filterType, setFilterType] = useState('전체');

  const handleSearch = () => {
    onSearch({
      targetName: filterTargetName,
      type: filterType
    });
  };

  const handleReset = () => {
    setFilterTargetName('');
    setFilterType('전체');
    onReset();
  };

  return (
    <div className={styles.filterSection}>
      <h3 className={styles.filterTitle}>선정 내역</h3>
      <div className={styles.filterRow}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>대상명</label>
          <input
            type="text"
            value={filterTargetName}
            onChange={(e) => setFilterTargetName(e.target.value)}
            placeholder="대상명 검색"
            className={styles.filterInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>대상 유형</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="전체">전체</option>
            <option value="부서별">부서별</option>
            <option value="직급별">직급별</option>
            <option value="개인별">개인별</option>
          </select>
        </div>

        <div className={styles.filterActions}>
          <button onClick={handleReset} className={styles.btnSecondary}>
            초기화
          </button>
          <button onClick={handleSearch} className={styles.btnPrimary}>
            조회
          </button>
        </div>
      </div>
    </div>
  );
}
