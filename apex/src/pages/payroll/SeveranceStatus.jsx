import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getCurrentUser } from '../../api/auth';
import { fetchSeveranceByEmployee } from '../../api/severance';
import styles from './PayrollSettlement.module.css';

/**
 * 퇴직금 정산 현황 페이지 (개인용)
 * 로그인한 직원 본인의 예상 퇴직금 확인
 * 근속 1년 미만이면 안내 메시지 표시
 */
export default function SeveranceStatus() {
  const [loading, setLoading] = useState(false);
  const [employeeData, setEmployeeData] = useState(null);
  const [severanceData, setSeveranceData] = useState(null);
  const [isEligible, setIsEligible] = useState(false); // 근속 1년 이상 여부

  useEffect(() => {
    loadSeveranceStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSeveranceStatus = async () => {
    setLoading(true);
    try {
      // 현재 로그인한 사용자 정보 가져오기
      const currentUser = getCurrentUser();
      const employeeId = currentUser?.employeeId;

      if (!employeeId) {
        console.error('로그인한 사용자 정보를 찾을 수 없습니다.');
        toast.error('로그인 정보를 찾을 수 없습니다.');
        return;
      }

      // 퇴직금 정보 조회 (백엔드에서 모든 계산 처리)
      const severanceResponse = await fetchSeveranceByEmployee(employeeId);
      console.log('퇴직금 정보:', severanceResponse);

      const yearsOfService = severanceResponse.workYears || 0;
      
      // 근속 1년 미만이면 안내 메시지만 표시
      if (yearsOfService < 1) {
        setEmployeeData({
          employeeId: severanceResponse.employeeId,
          employeeName: severanceResponse.employeeName,
          departmentName: severanceResponse.departmentName || '-',
          positionName: severanceResponse.positionName || '-',
          hireDate: severanceResponse.hireDate,
          yearsOfService: yearsOfService
        });
        setIsEligible(false);
        setSeveranceData(null);
        return;
      }

      // 근속 1년 이상이면 퇴직금 상세 정보 표시
      setEmployeeData({
        employeeId: severanceResponse.employeeId,
        employeeName: severanceResponse.employeeName,
        departmentName: severanceResponse.departmentName || '-',
        positionName: severanceResponse.positionName || '-',
        hireDate: severanceResponse.hireDate,
        yearsOfService: yearsOfService
      });

      setIsEligible(true);
      setSeveranceData({
        yearsOfService: yearsOfService,
        averageSalary: Math.floor(severanceResponse.last3MonthsAverage || 0),
        averageDailyWage: Math.floor(severanceResponse.averageDailyWage || 0),
        expectedSeveranceAmount: Math.floor(severanceResponse.severancePay || 0),
        totalWorkDays: severanceResponse.totalWorkDays || 0
      });

    } catch (error) {
      console.error('퇴직금 현황 조회 실패:', error);
      toast.error('퇴직금 현황 조회에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR').format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  return (
    <div className={styles.container}>
      <div className={styles.filterSection}>
        <div className={styles.filterTitle}>나의 예상 퇴직금</div>
      </div>

      {loading ? (
        <div className={styles.loadingState}>데이터를 불러오는 중...</div>
      ) : !employeeData ? (
        <div className={styles.emptyState}>직원 정보를 불러올 수 없습니다.</div>
      ) : !isEligible ? (
        /* 근속 1년 미만 메시지 */
        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '8px',
          padding: '2rem',
          textAlign: 'center',
          margin: '2rem 0'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <h3 style={{ color: '#856404', marginBottom: '0.5rem' }}>퇴직금 정보를 확인할 수 없습니다</h3>
          <p style={{ color: '#856404', margin: 0 }}>
            근속 기간이 1년 이상이어야 퇴직금 정보를 확인할 수 있습니다.<br />
            현재 근속 기간: <strong>{employeeData.yearsOfService.toFixed(1)}년</strong>
          </p>
        </div>
      ) : (
        /* 근속 1년 이상 - 퇴직금 정보 표시 */
        <>
          {/* 직원 기본 정보 */}
          <div style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1rem'
            }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>사번</div>
                <div style={{ fontSize: '1rem', fontWeight: '600' }}>{employeeData.employeeId}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>이름</div>
                <div style={{ fontSize: '1rem', fontWeight: '600' }}>{employeeData.employeeName}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>부서</div>
                <div style={{ fontSize: '1rem', fontWeight: '600' }}>{employeeData.departmentName}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>직급</div>
                <div style={{ fontSize: '1rem', fontWeight: '600' }}>{employeeData.positionName}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>입사일</div>
                <div style={{ fontSize: '1rem', fontWeight: '600' }}>{formatDate(employeeData.hireDate)}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>근속년수</div>
                <div style={{ fontSize: '1rem', fontWeight: '600' }}>{severanceData.yearsOfService.toFixed(1)}년</div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>평균급여 (최근 3개월)</div>
                <div style={{ fontSize: '1rem', fontWeight: '600' }}>₩{formatCurrency(severanceData.averageSalary)}</div>
              </div>
            </div>
          </div>

          {/* 예상 퇴직금 카드 */}
          <div style={{
            backgroundColor: '#e3f2fd',
            border: '2px solid #2196f3',
            borderRadius: '12px',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#1976d2', marginBottom: '0.5rem', fontWeight: '500' }}>
              예상 퇴직금
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#0d47a1', marginBottom: '1rem' }}>
              ₩{formatCurrency(severanceData.expectedSeveranceAmount)}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#1565c0' }}>
              * 예상 퇴직금은 평균급여 기준으로 계산된 추정치입니다.
            </div>
          </div>

          {/* 퇴직금 계산 정보 */}
          <div style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            padding: '1.5rem',
            marginTop: '2rem'
          }}>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>
              📋 퇴직금 계산 방법
            </h4>
            <div style={{ fontSize: '0.875rem', color: '#495057', lineHeight: '1.6' }}>
              <p style={{ margin: '0.5rem 0' }}>
                • <strong>계산식:</strong> 1일 평균임금 × 30일 × (재직일수 / 365)
              </p>
              <p style={{ margin: '0.5rem 0' }}>
                • <strong>평균임금:</strong> 퇴직일 이전 3개월간 받은 임금의 총액 ÷ 그 기간의 총 일수
              </p>
              <p style={{ margin: '0.5rem 0' }}>
                • <strong>지급 요건:</strong> 계속 근로기간이 1년 이상일 것
              </p>
              <p style={{ margin: '0.5rem 0', color: '#dc3545' }}>
                ⚠️ 실제 퇴직금은 퇴직 시점의 정확한 급여 및 재직일수에 따라 달라질 수 있습니다.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}