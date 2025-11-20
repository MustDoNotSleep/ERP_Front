import React, { useState, useEffect } from 'react';
import styles from "./CertificateRequestPage.module.css";
import tableStyles from "../../../components/common/DataTable.module.css"; 
import DataTable from '../../../components/common/DataTable';
import CertificateRequestFilter from '../../../components/HR/certificate/CertificateRequestFilter';
import CertificateRequestModal from '../../../components/HR/certificate/CertificateRequestModal';
import { Button } from '../../../components/common';
import { FaPrint } from 'react-icons/fa'; 

// 🔔 (복원) 실제 API 호출 함수 임포트
import { fetchDocumentApplications, createDocumentApplication } from '../../../api/document'; 
// 🔔 (복원) 실제 Auth 함수 임포트 (경로를 실제 파일 위치에 맞게 수정해주세요!)
import { getCurrentUser } from '../../../api/auth';
// 🔔 (복원) 실제 상수 임포트 (경로를 실제 파일 위치에 맞게 수정해주세요!)
import { CERTIFICATE_TYPE_LABELS, ISSUE_STATUS_OPTIONS } from '../../../models/data/CertificateIssueMOCK.js';


// 테이블 헤더 정의
const TABLE_HEADERS = [
    '선택', '신청일자', '사번', '이름', '증명서', '부수', '발급일자', '상태', '파일'
];

const CertificateRequestPage = () => {
    const [requests, setRequests] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchParams, setSearchParams] = useState({
        documentType: '', 
        applicationDate: '', 
        documentStatus: '',
    });
    // 선택된 요청 목록 상태
    const [selectedRequests, setSelectedRequests] = useState([]); 

    // 🔔 (복원) 실제 getCurrentUser 호출
    const currentUser = getCurrentUser();

    // 🧭 Enum 한글 매핑 함수
    const getStatusLabel = (status) => {
        // ISSUE_STATUS_OPTIONS는 이제 외부에서 임포트되어야 합니다.
        const found = ISSUE_STATUS_OPTIONS.find(opt => opt.value === status);
        return found ? found.label : status;
    };

    const getCertificateLabel = (type) => {
        // CERTIFICATE_TYPE_LABELS는 이제 외부에서 임포트되어야 합니다.
        return CERTIFICATE_TYPE_LABELS[type] || type; 
    };

    // 🔔 증명서 프린트 핸들러
    const handlePrintCertificate = (item) => {
        if (item.documentStatus === 'APPROVED' || item.documentStatus === '승인완료') {
            console.log(`✅ 증명서 프린트 요청: ID ${item.id} - ${getCertificateLabel(item.documentType)}`);
            
            // ⚠️ 실제 API 호출 및 프린트 로직을 여기에 구현해야 합니다.
            alert(`${item.employee?.name}님의 ${getCertificateLabel(item.documentType)}을(를) 프린트합니다. (API 연결 후 실제 프린트 창이 뜹니다)`);
        } else {
            alert('승인 완료된 증명서만 프린트할 수 있습니다.');
        }
    };

    // 체크박스 상태 변경 핸들러 (개별 선택)
    const handleCheckboxChange = (id) => {
        setSelectedRequests(prev => 
            prev.includes(id) 
            ? prev.filter(reqId => reqId !== id)
            : [...prev, id]
        );
    };

    // 🔔 (복원) 실제 API 호출을 사용하는 함수
    const fetchRequests = async () => {
        console.log('📡 증명서 신청 내역 조회 시작!', searchParams);
        try {
            // 🔔 (복원) 실제 API 호출
            const response = await fetchDocumentApplications(0, 100); 
            const data = response.data?.content || []; 
            
            let filteredData = Array.isArray(data) ? data : [];

            // 필터 로직
            if (searchParams.documentType) { 
                filteredData = filteredData.filter(item => item.documentType === searchParams.documentType);
            }
            if (searchParams.documentStatus) { 
                filteredData = filteredData.filter(item => item.documentStatus === searchParams.documentStatus);
            }

            setRequests(filteredData);
        } catch (error) {
            console.error('❌ 증명서 신청 내역 조회 중 오류 발생:', error);
            alert('데이터를 불러오는 데 실패했습니다.'); // 실제 에러 메시지
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

    const handleReset = () => {
        setSearchParams({
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

    // 🔔 (복원) 실제 API 호출을 포함하는 제출 핸들러
    const handleSubmitRequest = async (requestData) => {
        console.log('📨 증명서 신청 요청 (모달에서 받음):', requestData);
        
        try {
            const currentEmployeeId = currentUser?.employeeId; 

            if (!currentEmployeeId) {
                 alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
                 return;
            }
            
            const { documentSelection, copies, purpose, deliveryAddress } = requestData;

            if (!documentSelection) {
                alert("증명서를 선택해주세요.");
                return;
            }
            const { type: documentType, lang: language } = JSON.parse(documentSelection);

            const payload = {
                employeeId: currentEmployeeId,
                documentType,
                language,
                copies,
                purpose,
                deliveryAddress
            };
            
            console.log('📡 백엔드로 보낼 최종 데이터:', payload);

            // 🔔 (복원) 실제 API 호출
            await createDocumentApplication(payload); 
            
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

    // 테이블 행 렌더링 로직 (체크박스 및 파일 프린트 버튼 포함)
    const renderRequestRow = (item) => { 
        // documentStatus가 문자열인지 확인하거나, 백엔드에서 받은 실제 상태값으로 비교
        const status = item.documentStatus;
        const isApproved = status === 'APPROVED' || status === '승인완료';

        return (
            <>
                {/* 🔔 체크박스 열 */}
                <td className={tableStyles.tableData}>
                    <input 
                        type="checkbox"
                        checked={selectedRequests.includes(item.id)}
                        onChange={() => handleCheckboxChange(item.id)}
                    />
                </td>
                <td className={tableStyles.tableData}>{item.applicationDate || '-'}</td>
                <td className={tableStyles.tableData}>{item.employee?.employeeId || '-'}</td>
                <td className={tableStyles.tableData}>{item.employee?.name || '-'}</td>
                <td className={tableStyles.tableData}>{getCertificateLabel(item.documentType)}</td>
                <td className={tableStyles.tableData}>{item.copies || 1}</td>
                <td className={tableStyles.tableData}>{item.issueDate || '-'}</td>
                <td className={tableStyles.tableData}>
                    <span className={getStatusClass(item.documentStatus)}>
                        {getStatusLabel(item.documentStatus)}
                    </span>
                </td>
                {/* 🔔 프린트 버튼 열: 중앙 정렬 및 아이콘만 표시 */}
                <td className={tableStyles.tableData} style={{ textAlign: 'center' }}>
                    <button 
                        onClick={() => handlePrintCertificate(item)}
                        // 승인 완료 상태일 때만 버튼 활성화
                        disabled={!isApproved} 
                        className={isApproved ? styles.printButton : styles.printButtonDisabled}
                        title={isApproved ? "증명서 프린트" : "승인 완료 시 프린트 가능"}
                    >
                        <FaPrint /> 
                    </button>
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
                    variant="secondary"
                    onClick={() => {
                        if (selectedRequests.length > 0) {
                            alert(`총 ${selectedRequests.length}개의 항목을 일괄 프린트합니다.`);
                            console.log('일괄 프린트:', selectedRequests);
                            // ⚠️ 일괄 프린트 로직 구현 필요
                        } else {
                            alert('프린트할 항목을 선택해주세요.');
                        }
                    }}
                    disabled={selectedRequests.length === 0}
                >
                    선택 항목 일괄 프린트 ({selectedRequests.length})
                </Button>
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