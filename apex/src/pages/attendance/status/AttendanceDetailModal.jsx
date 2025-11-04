import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/common';
import api from '../../../api/axios';
import styles from './AttendanceDetailModal.module.css';

export default function AttendanceDetailModal({ isOpen, onClose }) {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (isOpen) {
      loadMyAttendances();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, selectedMonth, selectedYear]);

  const loadMyAttendances = async () => {
    try {
      setLoading(true);
      
      // localStorage에서 사용자 정보 가져오기
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        console.error('로그인 정보가 없습니다.');
        return;
      }
      
      const user = JSON.parse(userStr);
      const employeeId = user.employeeId;
      
      if (!employeeId) {
        console.error('사원 ID를 찾을 수 없습니다.');
        return;
      }
      
      // 선택한 월의 첫날과 마지막날
      const startDate = new Date(selectedYear, selectedMonth - 1, 1);
      const endDate = new Date(selectedYear, selectedMonth, 0);

      // 개인 근태 조회 API 사용
      const response = await api.get(`/attendances/employee/${employeeId}/period`, {
        params: {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0]
        }
      });

      const data = response.data?.data || [];
      
      // 데이터 가공
      const processedData = data.map(item => ({
        id: item.id,
        date: item.checkIn ? new Date(item.checkIn).toLocaleDateString('ko-KR') : '-',
        checkIn: item.checkIn ? new Date(item.checkIn).toLocaleTimeString('ko-KR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }) : '-',
        checkOut: item.checkOut ? new Date(item.checkOut).toLocaleTimeString('ko-KR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }) : '-',
        attendanceType: item.attendanceType || '-',
        workHours: item.workHours != null ? `${item.workHours}시간` : '-',
        note: item.note || '-'
      }));

      setAttendances(processedData);
    } catch (err) {
      console.error('출퇴근 기록 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (delta) => {
    let newMonth = selectedMonth + delta;
    let newYear = selectedYear;

    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }

    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="내 출퇴근 기록" size="full">
      <div className={styles.modalContent}>
        {/* 월 선택기 */}
        <div className={styles.monthSelector}>
          <button 
            className={styles.monthButton}
            onClick={() => handleMonthChange(-1)}
          >
            ←
          </button>
          <span className={styles.monthDisplay}>
            {selectedYear}년 {selectedMonth}월
          </span>
          <button 
            className={styles.monthButton}
            onClick={() => handleMonthChange(1)}
          >
            →
          </button>
        </div>

        {/* 테이블 */}
        {loading ? (
          <div className={styles.loadingMessage}>
            데이터를 불러오는 중...
          </div>
        ) : attendances.length === 0 ? (
          <div className={styles.emptyMessage}>
            해당 월의 출퇴근 기록이 없습니다.
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>날짜</th>
                  <th>출근시간</th>
                  <th>퇴근시간</th>
                  <th>근태유형</th>
                  <th>근무시간</th>
                  <th>비고</th>
                </tr>
              </thead>
              <tbody>
                {attendances.map((record) => (
                  <tr key={record.id}>
                    <td>{record.date}</td>
                    <td>{record.checkIn}</td>
                    <td>{record.checkOut}</td>
                    <td>
                      <span className={`${styles.badge} ${styles[`badge${record.attendanceType}`]}`}>
                        {record.attendanceType}
                      </span>
                    </td>
                    <td>{record.workHours}</td>
                    <td className={styles.noteCell}>{record.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 닫기 버튼 */}
        <div className={styles.footer}>
          <button className={styles.closeButton} onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </Modal>
  );
}
