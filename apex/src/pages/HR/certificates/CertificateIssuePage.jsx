import React, { useState, useEffect } from 'react';
import styles from "./CertificateIssuePage.module.css";
import tableStyles from "../../../components/common/DataTable.module.css"; 
import DataTable from '../../../components/common/DataTable';
import CertificateIssueFilter from '../../../components/HR/certificate/CertificateIssueFilter';
import { Button } from '../../../components/common';
import {fetchDocumentApplications, approveDocumentApplication, rejectDocumentApplication } from '../../../api/document';

// --- 🚨 (수정) MOCK 파일 및 getCurrentUser 임포트 ---
// ✨ 목 데이터 임포트
import { CERTIFICATE_TYPE_LABELS, ISSUE_STATUS_OPTIONS } from '../../../models/data/CertificateIssueMOCK.js';

import { getCurrentUser } from '../../../api/auth'; 


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

    // --- 🚨 (추가) Enum 한글 매핑 함수 ---
    const getStatusLabel = (status) => {
        const found = ISSUE_STATUS_OPTIONS.find(opt => opt.value === status);
        return found ? found.label : status;
    };

    const getCertificateLabel = (type) => {
        return CERTIFICATE_TYPE_LABELS[type] || type;
    };


    const fetchRequests =  async () => {
        console.log('증명서 조회 시작!', searchParams);
        try {
            // fetchCertificates API 사용 (페이징 포함)
            const response = await fetchDocumentApplications(0, 100); 
            console.log('📦 백엔드 응답:', response);
            const data = response.data?.content || [];
            //const data = response.data?.data?.content || response.data?.data || [];
            let filteredData = Array.isArray(data) ? data : [];
            
            if (searchParams.employeeName) {
                filteredData = filteredData.filter(item => 
                    item.employee?.name?.includes(searchParams.employeeName)
                );
            }
            if (searchParams.employeeId) {
                filteredData = filteredData.filter(item => 
                    // (수정) 백엔드 DTO의 employeeId 타입(Long)에 맞춰 String 변환
                    String(item.employee?.employeeId).includes(searchParams.employeeId)
                );
            }

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
            // (추가) 데이터 조회 실패 시 빈 배열로 설정
            setRequests([]); 
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
            documentType: '',    
            applicationDate: '', 
            documentStatus: ''
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
        fetchRequests(); // 전체 목록 다시 로드
    };

    // const handleSearch = () => { // (기존 주석)
    // ...
    // };
    
    const handleRowSelect = (id) => {
        setSelectedRows(prev => 
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    // --- 🚨 (수정) 액션 핸들러 (반려, 승인) ---
    const handleAction = async (action) => {
        if (selectedRows.length === 0) {
            alert('선택된 항목이 없습니다.');
            return;
        }

        // (추가) 로그인한 관리자 ID 가져오기
        const currentUser = getCurrentUser();
        if (!currentUser || !currentUser.employeeId) {
            alert('관리자 로그인 정보가 없습니다. 다시 로그인해주세요.');
            return;
        }
        // (주의) 'currentUser.employeeId'는 auth.js에서 저장한 필드명 기준
        const currentAdminId = currentUser.employeeId; 

        console.log(`Action: ${action}, Selected IDs:`, selectedRows);
        
        try {
            // 선택된 각 증명서에 대해 승인/반려 처리
            const promises = selectedRows.map(documentId => {
                
                // (수정 전)
                // if (action === '승인') {
                //     return approveDocumentApplication(documentId);
                // } else {
                //     return rejectDocumentApplication(documentId, '반려 처리되었습니다.');
                // }

                // (수정 후) 백엔드 DTO(ApprovalRequest)에 맞춰 객체 전송
                if (action === '승인') {
                    const approvalData = {
                        processorId: currentAdminId,
                        approved: true,
                        // (참고) issuedFiles는 프론트가 보내는 게 맞다는 전제
                        issuedFiles: [`/generated/doc_${documentId}.pdf`] // (임시 경로)
                    };
                    // (주의) api/document.js의 approveDocumentApplication 함수가 
                    //       (id, data) 두 개의 인자를 받도록 수정되어 있어야 함
                    return approveDocumentApplication(documentId, approvalData); 
                } else {
                    const rejectionData = {
                        processorId: currentAdminId,
                        approved: false,
                        rejectionReason: '관리자에 의해 반려 처리되었습니다.'
                    };
                    // (주의) api/document.js의 rejectDocumentApplication 함수가 
                    //       (id, data) 두 개의 인자를 받도록 수정되어 있어야 함
                    return rejectDocumentApplication(documentId, rejectionData);
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
        // (추가) 날짜 포맷팅 (YYYY-MM-DD)
        const formattedApplicationDate = item.applicationDate 
            ? item.applicationDate.split('T')[0] 
            : '-';
        const formattedIssueDate = item.issueDate 
            ? item.issueDate.split('T')[0] 
            : '-';

        return (
            <>
                <td className={tableStyles.tableData}>
                    <input 
                        type="checkbox" 
                        checked={selectedRows.includes(item.documentId)}
                        onChange={() => handleRowSelect(item.documentId)}
                    />
                </td>
                
                <td className={tableStyles.tableData}>{formattedApplicationDate}</td>
                
                <td className={tableStyles.tableData}>{item.employee?.employeeId || '-'}</td>
                <td className={tableStyles.tableData}>{item.employee?.name || '-'}</td>
                
                {/* --- 🚨 (수정) 한글 변환 함수 적용 --- */}
                <td className={tableStyles.tableData}>{getCertificateLabel(item.documentType) || '-'}</td>

                <td className={tableStyles.tableData}>{item.copies || 1}</td>

                <td className={tableStyles.tableData}>{formattedIssueDate}</td>

                <td className={tableStyles.tableData}>{getStatusLabel(item.documentStatus) || '-'}</td>
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
                // (추가) 데이터가 없을 때 메시지
                emptyMessage="조회된 데이터가 없습니다."
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