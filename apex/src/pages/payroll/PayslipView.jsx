// src/pages/payroll/PayslipView.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import PayslipModal from '../../components/common/PayslipModal'; 
import { IoIosDownload } from "react-icons/io";
import { RiAttachmentLine } from "react-icons/ri"; 
import styles from './PayslipView.module.css';

// 🚨 API 함수 이름 수정: 가능한 exports 목록에서 적절한 함수를 가져옵니다.
import { fetchEmployeeSalaries, fetchSalaryById } from '../../api/salary'; 

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = [CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2]; 

export default function PayslipView() {
    const [payslips, setPayslips] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR); 
    const [selectedMonth, setSelectedMonth] = useState('전체'); 
    
    // 복리후생 신청 상태
    const [welfareItem, setWelfareItem] = useState('전체');
    const [welfareAmount, setWelfareAmount] = useState('');
    const [welfareFile, setWelfareFile] = useState('');
    const [welfareReason, setWelfareReason] = useState('');
    
    // 모달 상태
    const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);
    const [selectedPayslipData, setSelectedPayslipData] = useState(null);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ko-KR').format(amount || 0);
    };

    const handleSubmitWelfare = () => {
        if (!welfareItem || !welfareAmount) {
            toast.warning("항목과 금액을 입력해주세요.");
            return;
        }
        // 복리후생 신청 API 호출 로직 추가 필요
        toast.success(`복리후생 신청이 완료되었습니다.`);
        setWelfareItem('전체');
        setWelfareAmount('');
        setWelfareFile('');
        setWelfareReason('');
    };
    
    const loadPayslips = useCallback(async () => {
        setLoading(true);
        try {
            // 🚨 API 호출 함수 이름 수정 적용: fetchEmployeeSalaries
            const monthParam = selectedMonth === '전체' ? null : parseInt(selectedMonth);
            // API는 년도와 월을 문자열로 요구할 수 있으므로, 해당 형식에 맞게 전달해야 합니다.
            const yearMonth = monthParam ? `${selectedYear}-${String(monthParam).padStart(2, '0')}` : `${selectedYear}`;
            
            const response = await fetchEmployeeSalaries(yearMonth); 
            
            const payslipData = response.data || []; 
            
            setPayslips(payslipData);
        } catch (error) {
            console.error("급여 목록 조회 API 호출 실패:", error);
            toast.error('급여 명세서 목록을 불러오는데 실패했습니다.');
            setPayslips([]);
        } finally {
            setLoading(false);
        }
    }, [selectedYear, selectedMonth]); 

    useEffect(() => {
        loadPayslips();
    }, [loadPayslips]); 

    const handleSearch = () => {
        loadPayslips();
    };

    const handlePrintPayslip = async (payslip, e) => {
        e?.stopPropagation(); 
        
        try {
            // 🚨 API 호출 함수 이름 수정 적용: fetchSalaryById
            const detailResponse = await fetchSalaryById(payslip.id);
            const fullPayslipData = detailResponse.data;

            if (!fullPayslipData) {
                 toast.error("상세 급여 정보를 불러오지 못했습니다.");
                 return;
            }

            // API에서 받은 상세 데이터로 모달 열기
            setSelectedPayslipData(fullPayslipData);
            setIsPayslipModalOpen(true);
            
        } catch (error) {
            console.error("상세 급여 정보 API 호출 실패:", error);
            toast.error("급여 명세서 상세 내용을 불러오는데 실패했습니다.");
        }
    };

    return (
        <div className={styles.container}>
            
            <div className={styles.cardRow}>
                
                {/* 1. 복리후생 카드 (왼쪽) */}
                <div className={styles.welfareCard}>
                    
                    {/* 1-1. 복리후생 잔액 섹션 */}
                    <div className={styles.welfareSection}>
                        <h3 className={styles.cardTitle}>복리후생 잔액</h3>
                        <div className={styles.welfareBalance}>320,000 P</div>
                        <div className={styles.welfareUsageBar}>
                            <div className={styles.usageBarTrack}>
                                <div className={styles.usageBarFill} style={{ width: '55%' }}></div>
                            </div>
                            <div className={styles.usageText}>사용 내역 55%</div>
                        </div>
                    </div>
                    
                    {/* 1-2. 복리후생 신청 섹션 (푸른색 테두리) */}
                    <div className={styles.welfareApplySection}>
                        <h3 className={styles.cardTitle}>복리후생 신청</h3>
                        <div className={styles.welfareForm}>
                            <div className={styles.formGroup}>
                                <label>항목</label>
                                <select value={welfareItem} onChange={(e) => setWelfareItem(e.target.value)} className={styles.formSelect}>
                                    <option value="전체">전체</option>
                                    <option value="교육">교육</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>금액</label>
                                <input type="text" placeholder="입력" value={welfareAmount} onChange={(e) => setWelfareAmount(e.target.value)} className={styles.formInput} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>첨부파일</label>
                                <div className={styles.fileInputWrapper}>
                                    <input type="text" placeholder=".pdf, .jpg" value={welfareFile} readOnly className={styles.formInputFile} />
                                    <input type="file" id="fileInput" style={{ display: 'none' }} onChange={(e) => setWelfareFile(e.target.files[0]?.name || '.pdf, .jpg')} />
                                    <button className={styles.fileButton} onClick={() => document.getElementById('fileInput').click()}>
                                        <RiAttachmentLine className={styles.fileIcon} />
                                    </button>
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>신청사유</label>
                                <textarea placeholder="입력" value={welfareReason} onChange={(e) => setWelfareReason(e.target.value)} className={styles.formTextarea} />
                            </div>
                            <button onClick={handleSubmitWelfare} className={styles.submitBtn}>
                                신청
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. 급여명세서 조회 카드 (오른쪽) */}
                <div className={styles.payslipCard}>
                    <h3 className={styles.cardTitle}>급여명세서 조회</h3>
                    
                    {/* 검색 필터 */}
                    <div className={styles.payslipFilter}>
                        
                        <div className={styles.filterItem}>
                            <label>년도</label>
                            <div className={styles.selectWrapper}>
                                <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className={styles.filterSelect}>
                                    {YEARS.map(y => (
                                        <option key={y} value={y}>{y}년</option>
                                    ))}
                                </select>
                                <div className={styles.dropdownIcon}>▼</div>
                            </div>
                        </div>
                        
                        <div className={styles.filterItem}>
                            <label>월</label>
                            <div className={styles.selectWrapper}>
                                <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className={styles.filterSelect}>
                                    <option value="전체">전체</option>
                                    {[...Array(12).keys()].map(i => i + 1).map(m => (
                                        <option key={m} value={m}>{m}월</option>
                                    ))}
                                </select>
                                <div className={styles.dropdownIcon}>▼</div>
                            </div>
                        </div>
                        
                        <button onClick={handleSearch} className={styles.searchBtn}>
                            조회
                        </button>
                    </div>
                    
                    {/* 테이블 */}
                    <div className={styles.tableWrapper}>
                        {loading ? (
                            <div className={styles.loadingState}>데이터를 불러오는 중...</div>
                        ) : (
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>선택</th>
                                        <th>월</th>
                                        <th>지급합계</th>
                                        <th>공제합계</th>
                                        <th>파일</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payslips.map((payslip) => (
                                        <tr key={payslip.id} className={styles.tableRow}>
                                            <td>
                                                <input type="checkbox" className={styles.checkbox} />
                                            </td>
                                            {/* API 응답 구조에 따라 'date' 필드가 없으면 year/month 조합 사용 */}
                                            <td>{payslip.date || `${payslip.year}년 ${payslip.month}월`}</td>
                                            <td>{formatCurrency(payslip.totalSalary)}</td>
                                            <td>{formatCurrency(payslip.totalDeductions)}</td>
                                            <td>
                                                <button 
                                                    className={styles.downloadBtn}
                                                    onClick={(e) => handlePrintPayslip(payslip, e)}
                                                    title="급여명세서 인쇄/보기"
                                                >
                                                    <IoIosDownload />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                    
                    {/* 페이지네이션 */}
                    <div className={styles.pagination}>
                        <button className={styles.pageArrow}>◀</button>
                        <span className={styles.currentPage}>1</span>
                        <button className={styles.pageArrow}>▶</button>
                    </div>
                </div>
            </div>

            <PayslipModal
                isOpen={isPayslipModalOpen}
                onClose={() => {
                    setIsPayslipModalOpen(false);
                    setSelectedPayslipData(null);
                }}
                payslipData={selectedPayslipData}
            />
        </div>
    );
}