// src/pages/payroll/PayslipView.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import PayslipModal from '../../components/payroll/PayslipModal'; 
import { IoIosDownload } from "react-icons/io";
import styles from './PayslipView.module.css';

import { fetchEmployeesalary, fetchSalaryById } from '../../api/salary';
import { fetchEmployeeCourseApplications } from '../../api/course';
import { getCurrentUser } from '../../api/auth'; 

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = [CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2]; 

export default function PayslipView() {
    const [payslips, setPayslips] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR); 
    const [selectedMonth, setSelectedMonth] = useState('전체'); 
    
    // 복리후생 신청 기록
    const [welfareApplications, setWelfareApplications] = useState([]);
    const [welfareLoading, setWelfareLoading] = useState(false);
    const [welfareFilter, setWelfareFilter] = useState('전체'); // EDUCATION, BOOK, OTHER, 전체
    
    // 모달 상태
    const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);
    const [selectedPayslipData, setSelectedPayslipData] = useState(null);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ko-KR').format(amount || 0);
    };

    // 복리후생 신청 기록 조회
    const loadWelfareApplications = useCallback(async () => {
        setWelfareLoading(true);
        try {
            const currentUser = getCurrentUser();
            if (!currentUser || !currentUser.employeeId) {
                toast.error('로그인 정보를 찾을 수 없습니다.');
                setWelfareApplications([]);
                setWelfareLoading(false);
                return;
            }

            const employeeId = currentUser.employeeId;
            
            // 교육 신청 내역 조회 (EDUCATION 타입)
            const response = await fetchEmployeeCourseApplications(employeeId, 0, 100);
            console.log('복리후생 신청 기록 응답:', response);
            
            let applications = [];
            if (response.data?.content) {
                applications = response.data.content;
            } else if (response.content) {
                applications = response.content;
            } else if (Array.isArray(response.data)) {
                applications = response.data;
            } else if (Array.isArray(response)) {
                applications = response;
            }
            
            // 타입별 필터링 (실제 데이터에 welfareType 필드가 있다고 가정)
            // 교육 신청은 EDUCATION 타입으로 간주
            const formattedApplications = applications.map(app => ({
                ...app,
                welfareType: 'EDUCATION', // 교육 신청은 EDUCATION
                // applicationDate를 YYYY-MM-DD 형식으로 포맷 (2025-11-19T01:43:39 -> 2025년 11월 19일)
                applicationDate: app.applicationDate ? 
                    new Date(app.applicationDate).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }) : '-',
                amount: app.cost || 0,
                status: app.status || 'PENDING'
            }));
            
            setWelfareApplications(formattedApplications);
        } catch (error) {
            console.error('복리후생 신청 기록 조회 실패:', error);
            // Mock 데이터로 대체 (개발 중)
            setWelfareApplications([]);
        } finally {
            setWelfareLoading(false);
        }
    }, []);

    useEffect(() => {
        loadWelfareApplications();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    
    const loadPayslips = useCallback(async () => {
        setLoading(true);
        try {
            // 현재 로그인한 사용자 정보 가져오기
            const currentUser = getCurrentUser();
            if (!currentUser || !currentUser.employeeId) {
                toast.error('로그인 정보를 찾을 수 없습니다.');
                setPayslips([]);
                setLoading(false);
                return;
            }

            const employeeId = currentUser.employeeId;
            
            // 페이지와 사이즈 설정
            const page = 0;
            const size = 100; // 충분히 큰 사이즈로 설정
            
            // 년도 파라미터 (월이 '전체'가 아니면 null)
            const yearParam = selectedMonth === '전체' ? selectedYear : null;
            
            console.log('급여 조회 파라미터:', { employeeId, page, size, year: yearParam });
            
            // API 호출: fetchEmployeesalary(employeeId, page, size, year)
            const response = await fetchEmployeesalary(employeeId, page, size, yearParam);
            
            console.log('급여 목록 조회 응답:', response);
            
            // 응답 데이터 파싱
            let payslipData = [];
            if (response.data) {
                // 응답이 { data: { content: [...] } } 형식일 수 있음
                if (Array.isArray(response.data.content)) {
                    payslipData = response.data.content;
                } else if (Array.isArray(response.data)) {
                    payslipData = response.data;
                } else {
                    payslipData = [response.data];
                }
            } else if (response.content) {
                payslipData = response.content;
            } else if (Array.isArray(response)) {
                payslipData = response;
            }
            
            // 월 필터링 (선택된 월이 있을 경우)
            if (selectedMonth !== '전체') {
                const targetMonth = parseInt(selectedMonth);
                payslipData = payslipData.filter(item => {
                    // paymentDate가 "YYYY-MM" 형식이라고 가정
                    if (item.paymentDate) {
                        const [year, month] = item.paymentDate.split('-');
                        return parseInt(year) === selectedYear && parseInt(month) === targetMonth;
                    }
                    // 또는 month 필드가 있을 경우
                    if (item.month !== undefined) {
                        return item.month === targetMonth && (item.year === selectedYear || !item.year);
                    }
                    return true;
                });
            }
            
            // 날짜 포맷팅 (YYYY-MM -> YYYY년 MM월) 및 공제합계 계산
            const formattedPayslipData = payslipData.map(item => {
                // 공제합계 계산
                const totalDeductions = (item.employmentInsurance || 0) + 
                                       (item.healthInsurance || 0) + 
                                       (item.incomeTax || 0) + 
                                       (item.nationalPension || 0) + 
                                       (item.otherDeductions || 0);
                
                return {
                    ...item,
                    paymentDate: item.paymentDate ? 
                        item.paymentDate.replace(/^(\d{4})-(\d{2})$/, '$1년 $2월') : 
                        '-',
                    totalDeductions: totalDeductions // 계산된 공제합계 추가
                };
            });
            
            console.log('파싱 및 필터링된 급여 데이터:', formattedPayslipData);
            setPayslips(formattedPayslipData);
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
            console.log('급여 상세 조회 요청:', payslip.id);
            
            // API 호출: fetchSalaryById(salaryId)
            const response = await fetchSalaryById(payslip.id);
            
            console.log('급여 상세 조회 응답:', response);
            
            // 응답 데이터 파싱
            let fullPayslipData = null;
            if (response.data) {
                fullPayslipData = response.data;
            } else {
                fullPayslipData = response;
            }

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
                    
                    {/* 1-2. 복리후생 신청 기록 섹션 */}
                    <div className={styles.welfareHistorySection}>
                        <div className={styles.historyHeader}>
                            <h3 className={styles.cardTitle}>복리후생 신청 기록</h3>
                            <div className={styles.filterGroup}>
                                <label>구분</label>
                                <select 
                                    value={welfareFilter} 
                                    onChange={(e) => setWelfareFilter(e.target.value)} 
                                    className={styles.filterSelect}
                                >
                                    <option value="전체">전체</option>
                                    <option value="EDUCATION">교육</option>
                                    <option value="BOOK">도서</option>
                                    <option value="OTHER">기타</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className={styles.historyTableWrapper}>
                            {welfareLoading ? (
                                <div className={styles.loadingState}>데이터를 불러오는 중...</div>
                            ) : (
                                <table className={styles.historyTable}>
                                    <thead>
                                        <tr>
                                            <th>신청일</th>
                                            <th>구분</th>
                                            <th>항목명</th>
                                            <th>금액</th>
                                            <th>상태</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {welfareApplications.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                                                    신청 내역이 없습니다.
                                                </td>
                                            </tr>
                                        ) : (
                                            welfareApplications
                                                .filter(app => welfareFilter === '전체' || app.welfareType === welfareFilter)
                                                .map((app, index) => (
                                                    <tr key={app.id || index}>
                                                        <td>{app.applicationDate}</td>
                                                        <td>
                                                            <span className={styles[`type-${app.welfareType?.toLowerCase()}`]}>
                                                                {app.welfareType === 'EDUCATION' ? '교육' : 
                                                                 app.welfareType === 'BOOK' ? '도서' : '기타'}
                                                            </span>
                                                        </td>
                                                        <td>{app.courseName || app.itemName || '-'}</td>
                                                        <td>{formatCurrency(app.amount || app.cost)}</td>
                                                        <td>
                                                            <span className={styles[`status-${app.status?.toLowerCase()}`]}>
                                                                {app.status === 'PENDING' ? '대기' :
                                                                 app.status === 'APPROVED' ? '승인' :
                                                                 app.status === 'REJECTED' ? '반려' : app.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                        )}
                                    </tbody>
                                </table>
                            )}
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
                                    {payslips.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                                                조회된 급여 명세서가 없습니다.
                                            </td>
                                        </tr>
                                    ) : (
                                        payslips.map((payslip) => (
                                            <tr key={payslip.id} className={styles.tableRow}>
                                                <td>
                                                    <input type="checkbox" className={styles.checkbox} />
                                                </td>
                                                {/* paymentDate (YYYY-MM) 형식 표시 */}
                                                <td>{payslip.paymentDate || '-'}</td>
                                                <td>{formatCurrency(payslip.totalSalary)}</td>
                                                <td>{formatCurrency(payslip.totalDeductions || 0)}</td>
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
                                        ))
                                    )}
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