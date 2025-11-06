// 👈 (수정) 1. useContext 임포트 제거
// import React, { useState, useEffect, useContext } from 'react';
import React, { useState, useEffect } from 'react';
import styles from "./CertificateRequestPage.module.css";
import tableStyles from "../../../components/common/DataTable.module.css"; 
import DataTable from '../../../components/common/DataTable';
import CertificateRequestFilter from '../../../components/HR/certificate/CertificateRequestFilter';
import CertificateRequestModal from '../../../components/HR/certificate/CertificateRequestModal';
import { Button } from '../../../components/common';
import { fetchDocumentApplications, createDocumentApplication } from '../../../api/document';

// 👈 (수정) 2. MOCK 데이터 임포트 변경
// import { CERTIFICATE_TYPES, ISSUE_STATUS_OPTIONS } from '../../../models/data/CertificateIssueMOCK.js';
import { CERTIFICATE_TYPE_LABELS, ISSUE_STATUS_OPTIONS } from '../../../models/data/CertificateIssueMOCK.js';

// 👈 (수정) 3. AuthContext 임포트 -> getCurrentUser 임포트로 변경
// import { AuthContext } from '../../../contexts/AuthContext';
// (참고: './api/auth' 경로는 실제 auth.js 파일 위치에 맞게 수정해주세요!)
import { getCurrentUser } from '../../../api/auth';


// 테이블 헤더 정의
const TABLE_HEADERS = [
    '신청일자', '사번', '이름', '증명서', '부수', '발급일자', '상태'
];

const CertificateRequestPage = () => {
    const [requests, setRequests] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 👈 (수정) 4. searchParams 필드명 변경 (DB와 일치)
    const [searchParams, setSearchParams] = useState({
        // certificateType: '', // (수정 전)
        // issueStatus: '',     // (수정 전)
        documentType: '', 
        applicationDate: '', 
        documentStatus: '',
    });

    // 👈 (수정) 5. AuthContext -> getCurrentUser() 호출로 변경
    // const { currentUser } = useContext(AuthContext);
    const currentUser = getCurrentUser();

    // 🧭 Enum 한글 매핑 함수
    const getStatusLabel = (status) => {
        const found = ISSUE_STATUS_OPTIONS.find(opt => opt.value === status);
        return found ? found.label : status;
    };

    // 👈 (수정) 6. MOCK 변경에 따라 함수 수정
    const getCertificateLabel = (type) => {
        // return CERTIFICATE_TYPES[type] || type; // (수정 전)
        return CERTIFICATE_TYPE_LABELS[type] || type; // (수정 후)
    };

    // API 호출 함수 (조회)
    const fetchRequests = async () => {
        console.log('📡 증명서 신청 내역 조회 시작!', searchParams);
        try {
            const response = await fetchDocumentApplications(0, 100);
            console.log("📦 백엔드 응답:", response);
            const data = response.data?.content || [];
            //const data = response.data?.data?.content || response.data?.data || response.data || [];
            let filteredData = Array.isArray(data) ? data : [];

            // 👈 (수정) 7. 필터 로직 수정 (searchParams.documentType)
            // if (searchParams.certificateType) { // (수정 전)
            if (searchParams.documentType) { // (수정 후)
                filteredData = filteredData.filter(item => 
                    // item.documentType === searchParams.certificateType // (수정 전)
                    item.documentType === searchParams.documentType // (수정 후)
                );
            }
            // 👈 (수정) 7. 필터 로직 수정 (searchParams.documentStatus)
            // if (searchParams.issueStatus) { // (수정 전)
            if (searchParams.documentStatus) { // (수정 후)
                filteredData = filteredData.filter(item => 
                    // item.documentStatus === searchParams.issueStatus // (수정 전)
                    item.documentStatus === searchParams.documentStatus // (수정 후)
                );
            }

            setRequests(filteredData);
        } catch (error) {
            console.error('❌ 증명서 신청 내역 조회 중 오류 발생:', error);
            alert('데이터를 불러오는 데 실패했습니다.');
        }
    };

    useEffect(() => {
        fetchRequests();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        fetchRequests();
    };

    // 👈 (수정) 8. reset 로직 수정
    const handleReset = () => {
        setSearchParams({
            // certificateType: '', // (수정 전)
            // issueStatus: ''      // (수정 전)
            documentType: '', 
            applicationDate: '', 
            documentStatus: ''
        });
        fetchRequests();
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // 👈 (수정) 9. HTTP 500 오류 해결 (ID/Language 전송)
    const handleSubmitRequest = async (requestData) => {
        // requestData = { documentSelection: '{"type":..., "lang":...}', copies: 1, ... }
        console.log('📨 증명서 신청 요청 (모달에서 받음):', requestData);
        
        try {
            // 1. 로그인한 사용자 ID 확인 (localStorage에서 가져온 정보 사용)
            // 👈 (수정) 10. ID 필드명을 'employeeId'로 변경
            // if (!currentUser || !currentUser.id) { // (수정 전)
            if (!currentUser || !currentUser.employeeId) { // (수정 후)
                alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
                return;
            }
            // const currentEmployeeId = currentUser.id; // 👈 (수정 전)
            const currentEmployeeId = currentUser.employeeId; // 👈 (수정 후) 실제 ID 사용

            // 2. 모달에서 받은 JSON 문자열을 파싱하여 type과 lang 분리
            const { documentSelection, copies, purpose, deliveryAddress } = requestData;
            // (만약 documentSelection이 없으면 오류가 날 수 있으니 방어 코드 추가)
            if (!documentSelection) {
                alert("증명서를 선택해주세요.");
                return;
            }
            const { type: documentType, lang: language } = JSON.parse(documentSelection);

            // 3. 백엔드로 보낼 최종 payload 조립
            const payload = {
                employeeId: currentEmployeeId,
                documentType, // "CERTIFICATE_OF_EMPLOYMENT"
                language,     // "KOREAN"
                copies,
                purpose,
                deliveryAddress
            };
            
            console.log('📡 백엔드로 보낼 최종 데이터:', payload);

            // const result = await createDocumentApplication(requestData); // (수정 전)
            const result = await createDocumentApplication(payload); // (수정 후)
            
            console.log('✅ 신청 완료:', result);
            alert('증명서 신청이 완료되었습니다.');
            handleCloseModal();
            fetchRequests(); // 목록 새로고침

        } catch (error) {
            console.error('❌ 증명서 신청 중 오류 발생:', error);
            alert('증명서 신청 중 오류가 발생했습니다.');
        }
    };

    // 상태에 따른 색상 스타일
    const getStatusClass = (status) => {
        switch (status) {
            case 'APPROVED':
            case '승인완료':
                return styles.statusApproved;
            case 'PENDING':
            case '승인대기':
                return styles.statusPending;
            case 'REJECTED':
            case '승인반려':
                return styles.statusRejected;
            default:
                return '';
        }
    };

    // 테이블 행 렌더링 로직
    const renderRequestRow = (item) => { 
        return (
            <>
                <td className={tableStyles.tableData}>{item.applicationDate || '-'}</td>
                <td className={tableStyles.tableData}>{item.employee?.employeeId || '-'}</td>
                <td className={tableStyles.tableData}>{item.employee?.name || '-'}</td>
                {/* 👈 (수정) 11. MOCK 변경에 따라 getCertificateLabel 함수도 수정되었음 */}
                <td className={tableStyles.tableData}>{getCertificateLabel(item.documentType)}</td>
                <td className={tableStyles.tableData}>{item.copies || 1}</td>
                <td className={tableStyles.tableData}>{item.issueDate || '-'}</td>
                <td className={tableStyles.tableData}>
                    <span className={getStatusClass(item.documentStatus)}>
                        {getStatusLabel(item.documentStatus)}
                    </span>
                </td>
            </>
        );
    };

    return (
        <div className={styles.pageContainer}> 
            {/* 검색 필터 영역 */}
            <div className={styles.filterSection}>
                <CertificateRequestFilter
                    searchParams={searchParams}
                    onSearchChange={handleSearchChange}
                    onSearchSubmit={handleSearch}
                    onReset={handleReset}
                />
            </div>

            {/* 데이터 테이블 영역 */}
            <DataTable
                headers={TABLE_HEADERS}
                data={requests}
                renderRow={renderRequestRow}
                emptyMessage="신청한 증명서가 없습니다."
            />

            {/* 신청 버튼 */}
            <div className={styles.buttonGroup}>
                <Button 
                    variant="primary"
                    onClick={handleOpenModal}
                >
                    증명서 신청
                </Button>
            </div>

            {/* 증명서 신청 모달 */}
            {isModalOpen && (
                <CertificateRequestModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSubmit={handleSubmitRequest}
                />
            )}
        </div>
    );
};

export default CertificateRequestPage;