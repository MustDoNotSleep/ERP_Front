import React, { useState, useEffect } from 'react';
import styles from "./CertificateIssuePage.module.css";
import tableStyles from "../../../components/common/DataTable.module.css"; 
import DataTable from '../../../components/common/DataTable';
import CertificateIssueFilter from '../../../components/HR/certificate/CertificateIssueFilter';
import { Button } from '../../../components/common';
//import { fetchCertificates, approveCertificate, rejectCertificate } from '../../../api/certificate';
// ✅ 변경: certificate → document
import {fetchDocumentApplications, approveDocumentApplication, rejectDocumentApplication } from '../../../api/document';
// ✨ 목 데이터 임포트
// import { CERTIFICATE_ISSUE_MOCK } from '../../../models/data/CertificateIssueMOCK';

// 1. 테이블 헤더 정의
const TABLE_HEADERS = [
    '선택', '신청일자', '사번', '이름', '증명서', '부수', '발급일자', '상태'
];

const CertificateIssuePage = () => {
    
    const [requests, setRequests] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchParams, setSearchParams] = useState({
        employeeName: '', employeeId: '', documentType: '', 
        applicationDate: '', documentStatus: '',
    });

    //api 호출 함수 (조회)
    const fetchRequests =  async () => {
        console.log('증명서 조회 시작!', searchParams);
        try {
            // fetchCertificates API 사용 (페이징 포함)
            const response = await fetchDocumentApplications(0, 100); // 페이지 0, 사이즈 100
            
            // 검색 조건에 따라 클라이언트 사이드 필터링
           // let filteredData = data.content || data;
            const data = response.data?.data?.content || response.data?.data || [];
            //const data = response.data?.content || response.data || response; 
            let filteredData = Array.isArray(data) ? data : [];
            
            if (searchParams.employeeName) {
                filteredData = filteredData.filter(item => 
                    item.employee?.name?.includes(searchParams.employeeName)
                );
            }
            if (searchParams.employeeId) {
                filteredData = filteredData.filter(item => 
                    String(item.employee?.employeeId).includes(searchParams.employeeId)
                );
            }
            // if (searchParams.certificateType) {
            //     filteredData = filteredData.filter(item => 
            //         item.certificateType === searchParams.certificateType
            //     );
            // } 
            // if (searchParams.issueStatus) {
            //     filteredData = filteredData.filter(item => 
            //         item.status === searchParams.issueStatus
            //     );
            // }
            if(searchParams.documentType){
                filteredData = filteredData.filter
                (item => item.documentType === searchParams.documentType);
            }
            if(searchParams.documentStatus){
                filteredData = filteredData.filter
                (item => item.documentStatus === searchParams.documentStatus);
            }
            
            
            setRequests(filteredData);
        } catch (error) {
            console.error('증명서 조회 중 오류 발생 : ', error);
            alert('데이터를 불러오는 데 실패했습니다.');
        }
    };

    //컴포넌트가 처음 렌더링될 때 데이터 로드
    useEffect(() => {
        fetchRequests();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // 빈 배열 '[]'은 마운트 시 1회 실행을 의미

    // --- 핸들러 함수 ---
    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    //검색 버튼 핸들러 : api 호출 함수 실행
    const handleSearch = () => {
        fetchRequests();
    };

    // 리셋 핸들러 추가
    const handleReset = () => {
        setSearchParams({
            employeeName: '', 
            employeeId: '', 
            documentTypeType: '', 
            applicationDate: '', 
            documentStatus: ''
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
        fetchRequests(); // 전체 목록 다시 로드
    };

    // const handleSearch = () => {
    //     console.log('🐥 증명서 조회 시작!', searchParams);
    //     // TODO: API 호출 로직
    // };
    
    const handleRowSelect = (id) => {
        setSelectedRows(prev => 
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    // 액션 핸들러 (반려, 승인)
    const handleAction = async (action) => {
        if (selectedRows.length === 0) {
            alert('선택된 항목이 없습니다.');
            return;
        }

        console.log(`Action: ${action}, Selected IDs:`, selectedRows);
        
        try {
            // 선택된 각 증명서에 대해 승인/반려 처리
            const promises = selectedRows.map(documentId => {
                if (action === '승인') {
                    return approveDocumentApplication(documentId);
                } else {
                    return rejectDocumentApplication(documentId, '반려 처리되었습니다.');
                }
            });
            
            await Promise.all(promises);
            
            alert(`선택된 ${selectedRows.length}건을 ${action} 처리했습니다.`);
            
            // 처리가 완료되면 목록을 새로고침
            fetchRequests();
            setSelectedRows([]);
        } catch (error) {
            console.error(`${action} 처리 중 오류 발생:`, error);
            alert(`${action} 처리 중 오류가 발생했습니다.`);
        }
    };


    // 3. 테이블 행 렌더링 로직
    const renderRequestRow = (item) => { 
        return (
            <>
                <td className={tableStyles.tableData}>
                    <input 
                        type="checkbox" 
                        checked={selectedRows.includes(item.documentId)}
                        onChange={() => handleRowSelect(item.documentId)}
                    />
                </td>
                <td className={tableStyles.tableData}>{item.applicationDate || '-'}</td>
                <td className={tableStyles.tableData}>{item.employee?.employeeId || '-'}</td>
                <td className={tableStyles.tableData}>{item.employee?.name || '-'}</td>
                <td className={tableStyles.tableData}>{item.documentType|| '-'}</td>
                <td className={tableStyles.tableData}>{item.copies || 1}</td>
                <td className={tableStyles.tableData}>{item.issueDate || '-'}</td>
                <td className={tableStyles.tableData}>{item.documentStatus|| '-'}</td>
            </>
        );
    };


    return (
        <div className={styles.pageContainer}>            
            {/* --- A. 검색 필터 영역 --- */}
            <div className={styles.filterSection}>
                <CertificateIssueFilter
                    searchParams={searchParams}
                    onSearchChange={handleSearchChange}
                    onSearchSubmit={handleSearch}
                    onReset={handleReset}
                />
            </div>

            {/* --- B. 데이터 테이블 영역 --- */}
            <DataTable
                headers={TABLE_HEADERS}
                data={requests}
                renderRow={renderRequestRow}
            />

            {/* --- C. 액션 버튼 영역 --- */}
            <div className={styles.buttonGroup}>
                <Button 
                    variant="danger"
                    onClick={() => handleAction('반려')} 
                >
                    반려
                </Button>
                <Button 
                    variant="primary"
                    onClick={() => handleAction('승인')} 
                >
                    승인
                </Button>
            </div>
        </div>
    );
};

export default CertificateIssuePage;