// src/components/common/PayslipModal.jsx

import React, { useRef } from 'react';
import styles from './PayslipModal.module.css';
import { IoCloseOutline } from "react-icons/io5";
import { useReactToPrint } from 'react-to-print';
import companyLogo from '../../img/logo.svg'; 

// 컴포넌트 내부에서 사용할 PayslipContent (forwardRef를 통해 Ref를 받음)
const PayslipContent = React.forwardRef(({ payslipData }, ref) => {
  if (!payslipData || !payslipData.id) {
    return <div className={styles.errorMessage}>급여명세서 데이터가 유효하지 않습니다.</div>;
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR').format(amount || 0);
  };

  // API에서 받은 실제 데이터 사용
  const employeeName = payslipData.employeeName || payslipData.employee?.name || "-";
  const departmentName = payslipData.departmentName || payslipData.employee?.department?.name || "-";
  const positionName = payslipData.positionName || payslipData.employee?.position?.name || "-";
  
  // 날짜 포맷팅 (YYYY-MM -> YYYY년 MM월)
  let paymentDate = "-";
  let attributionPeriod = "-";
  
  if (payslipData.paymentDate) {
    paymentDate = payslipData.paymentDate.replace(/^(\d{4})-(\d{2})$/, '$1년 $2월');
    attributionPeriod = payslipData.paymentDate.replace(/^(\d{4})-(\d{2})$/, '$1년 $2월');
  }
  
  // 급여 상세 정보 - API 응답 구조에 맞게 직접 접근
  // details 객체가 없고 payslipData에 직접 필드가 있음
  
  // 지급 항목
  const allPayments = [
    { item: '기본급', amount: payslipData.baseSalary || 0 },
    { item: '식대', amount: payslipData.mealAllowance || null },
    { item: '차량유지비', amount: payslipData.vehicleAllowance || null },
    { item: '직책수당', amount: payslipData.positionAllowance || null },
    { item: '근속수당', amount: payslipData.longevityAllowance || null },
    { item: '연장수당', amount: payslipData.overtimeAllowance || null },
    { item: '당직수당', amount: payslipData.nightAllowance || null },
    { item: '상여금', amount: payslipData.bonus || null },
    { item: '기타', amount: payslipData.otherPayments || null },
  ];
  
  // 공제 항목
  const allDeductions = [
    { item: '국민연금', amount: payslipData.nationalPension || null },
    { item: '건강보험', amount: payslipData.healthInsurance || null },
    { item: '노인장기요양보험', amount: payslipData.longTermCare || null },
    { item: '고용보험', amount: payslipData.employmentInsurance || null },
    { item: '소득세', amount: payslipData.incomeTax || null },
    { item: '지방소득세', amount: payslipData.localIncomeTax || null },
    { item: '상조회비', amount: payslipData.mutualAid || null },
    { item: '가불금', amount: payslipData.advancePayment || payslipData.otherDeductions || null },
  ];

  // 합계 금액
  const totalSalary = payslipData.totalSalary || 0;
  const totalDeductions = 
    (payslipData.nationalPension || 0) +
    (payslipData.healthInsurance || 0) +
    (payslipData.longTermCare || 0) +
    (payslipData.employmentInsurance || 0) +
    (payslipData.incomeTax || 0) +
    (payslipData.localIncomeTax || 0) +
    (payslipData.otherDeductions || 0);
  const netSalary = payslipData.netSalary || (totalSalary - totalDeductions) || 0;
  
  const issuer = { 
    company: 'APEX 금융보안', 
    ceo: '김원장' 
  };

  // 데이터 유효성 검사 및 길이 맞추기
  const paymentList = allPayments.filter(p => p.amount !== null && p.amount !== undefined);
  const deductionList = allDeductions.filter(d => d.amount !== null && d.amount !== undefined);
  
  const maxLength = Math.max(paymentList.length, deductionList.length, 1);
  
  const payments = [...paymentList, ...Array(maxLength - paymentList.length).fill({ item: '', amount: null })];
  const deductions = [...deductionList, ...Array(maxLength - deductionList.length).fill({ item: '', amount: null })];

  return (
    <div className={styles.payslipContainer} ref={ref}>
      <h2 className={styles.payslipTitle}>급여명세서</h2>
      
      {/* 기본 정보 */}
      <div className={styles.infoTable}>
        <div className={styles.infoRow}>
          <div className={styles.infoLabel}>사원 명</div>
          <div className={styles.infoValue}>{employeeName}</div>
          <div className={styles.infoLabel}>지급연월</div>
          <div className={styles.infoValue}>{paymentDate}</div>
        </div>
        <div className={styles.infoRow}>
          <div className={styles.infoLabel}>소속/직급</div>
          <div className={styles.infoValue}>{departmentName}/{positionName}</div>
          <div className={styles.infoLabel}>귀속연월</div>
          <div className={styles.infoValue}>{attributionPeriod}</div>
        </div>
      </div>
      
      {/* 지급 내역 & 공제 내역 */}
      <div className={styles.detailTables}>
        <div className={styles.paymentSection}>
          <h3 className={styles.sectionTitle}>지급내역</h3>
          <table className={styles.detailTable}>
            <tbody>
              {payments.map((p, index) => (
                <tr key={index}>
                  <td className={styles.detailItem}>{p.item}</td>
                  <td className={styles.detailAmount}>
                    {p.amount !== null && p.amount !== undefined ? formatCurrency(p.amount) : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.deductionSection}>
          <h3 className={styles.sectionTitle}>공제내역</h3>
          <table className={styles.detailTable}>
            <tbody>
              {deductions.map((d, index) => (
                <tr key={index}>
                  <td className={styles.detailItem}>{d.item}</td>
                  <td className={styles.detailAmount}>
                    {d.amount !== null && d.amount !== undefined ? formatCurrency(d.amount) : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* 합계 및 서명 */}
      <div className={styles.summarySection}>
        <div className={styles.signatureBox}>
            <img src={companyLogo} alt="회사 로고" className={styles.companyLogo} />
            <div className={styles.issuerInfo}>
                <div className={styles.issuerName}>{issuer.company}</div>
                <div className={styles.issuerCeo}>대표 {issuer.ceo}</div>
            </div>
        </div>
        <table className={styles.summaryTable}>
          <tbody>
            <tr>
              <td className={styles.summaryLabel}>지급합계</td>
              <td className={styles.summaryValue}>{formatCurrency(totalSalary)}</td>
            </tr>
            <tr>
              <td className={styles.summaryLabel}>공제합계</td>
              <td className={styles.summaryValue}>{formatCurrency(totalDeductions)}</td>
            </tr>
            <tr>
              <td className={styles.summaryLabel}>실지급액</td>
              <td className={`${styles.summaryValue} ${styles.netSalary}`}>{formatCurrency(netSalary)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
});


export default function PayslipModal({ isOpen, onClose, payslipData }) {
  const componentRef = useRef();

  // 1. useReactToPrint 훅 정의 (delay: 100ms 적용)
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `급여명세서_${payslipData?.employeeName}_${payslipData?.paymentDate}`,
    onBeforeGetContent: () => Promise.resolve(),
    delay: 100, // 👈 인쇄 지연 시간 추가
    pageStyle: `@page { size: A4; margin: 20mm; }`
  });
  
  if (!isOpen) return null;

  // 2. 인쇄 전에 Ref 유효성 검사
  const handlePrintClick = () => {
      if (!componentRef.current) {
          console.error("인쇄할 내용을 찾을 수 없습니다 (Ref is null).");
          alert("인쇄할 명세서가 준비되지 않았습니다. 잠시 후 다시 시도해주세요.");
          return;
      }
      handlePrint();
  };


  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        
        <div className={styles.modalHeader}>
          {/* 3. 버튼에 handlePrintClick 연결 */}
          <button onClick={handlePrintClick} className={styles.printBtn}>
            🖨️ 인쇄하기
          </button>
          <button className={styles.closeBtn} onClick={onClose}>
            <IoCloseOutline />
          </button>
        </div>
        
        <div className={styles.payslipWrapper}>
          {/* componentRef를 PayslipContent로 전달 */}
          <PayslipContent payslipData={payslipData} ref={componentRef} />
        </div>
        
      </div>
    </div>
  );
}