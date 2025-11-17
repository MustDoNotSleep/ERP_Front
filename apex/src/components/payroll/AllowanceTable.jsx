import React, { useState } from 'react';
import { toast } from 'react-toastify';
import styles from './AllowanceTable.module.css';

/**
 * 급여 내역 테이블 컴포넌트
 */
export default function AllowanceTable({ allowances, loading, onDelete, onView }) {
  const [selectedIds, setSelectedIds] = useState([]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(allowances.map(a => a.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(sid => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) {
      return;
    }
    await onDelete(id);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      toast.warning('삭제할 급여를 선택해주세요.');
      return;
    }

    if (!window.confirm(`${selectedIds.length}건의 급여를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await Promise.all(selectedIds.map(id => onDelete(id)));
      setSelectedIds([]);
      toast.success(`${selectedIds.length}건의 급여가 삭제되었습니다.`);
    } catch (error) {
      console.error('일괄 삭제 실패:', error);
      toast.error('급여 삭제에 실패했습니다.');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR').format(amount || 0);
  };

  if (loading) {
    return <div className={styles.loadingState}>데이터를 불러오는 중...</div>;
  }

  if (allowances.length === 0) {
    return (
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  disabled
                />
              </th>
              <th>지급월</th>
              <th>대상</th>
              <th>대상명</th>
              <th>인원</th>
              <th>금액</th>
              <th>등록일시</th>
              <th>작업</th>
            </tr>
          </thead>
        </table>
        <div className={styles.emptyState}>조회된 수당 내역이 없습니다.</div>
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.bulkActions}>
        <button 
          onClick={handleBulkDelete} 
          className={styles.bulkDeleteBtn}
          disabled={selectedIds.length === 0}
        >
          선택 삭제 ({selectedIds.length})
        </button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={selectedIds.length === allowances.length && allowances.length > 0}
                onChange={handleSelectAll}
              />
            </th>
            <th>지급월</th>
            <th>대상</th>
            <th>대상명</th>
            <th>인원</th>
            <th>금액</th>
            <th>등록일시</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {allowances.map((modification) => {
            const formattedDate = modification.createdAt 
              ? new Date(modification.createdAt).toLocaleString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : '-';
            
            return (
              <tr key={modification.id}>
                <td>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={selectedIds.includes(modification.id)}
                    onChange={() => handleSelectOne(modification.id)}
                  />
                </td>
                <td>{modification.paymentDate}</td>
                <td>{modification.type}</td>
                <td>{modification.targetName || '-'}</td>
                <td>{modification.employeeCount}명</td>
                <td>{formatCurrency(modification.amount)}</td>
                <td>{formattedDate}</td>
                <td>
                  <button
                    onClick={() => onView(modification)}
                    className={`${styles.actionBtn} ${styles.viewBtn}`}
                    title="상세 보기"
                  >
                    👁️
                  </button>
                  <button
                    onClick={() => handleDelete(modification.id)}
                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
