import React, { useState, useEffect } from 'react';
import styles from "./CertificateRequestPage.module.css";
import tableStyles from "../../../components/common/DataTable.module.css"; 
import DataTable from '../../../components/common/DataTable';
import CertificateRequestFilter from '../../../components/HR/certificate/CertificateRequestFilter';
import CertificateRequestModal from '../../../components/HR/certificate/CertificateRequestModal';
import { Button } from '../../../components/common';
import { fetchCertificates } from '../../../api/certificate';

// 테이블 헤더 정의
const TABLE_HEADERS = [
    '신청일자', '사번', '이름', '증명서', '부수', '발급일자', '상태'
];

const CertificateRequestPage = () => {
    const [requests, setRequests] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchParams, setSearchParams] = useState({
        certificateType: '', 
        applicationDate: '', 
        issueStatus: '',
    });

    // API 호출 함수 (조회)
    const fetchRequests = async () => {
        console.log('증명서 신청 내역 조회 시작!', searchParams);
        try {
            const data = await fetchCertificates(0, 100);
            let filteredData = data.content || data;
            
            // 본인의 신청 내역만 필터링 (실제로는 로그인한 사용자 ID로 필터링)
            // filteredData = filteredData.filter(item => item.employee?.employeeId === currentUserId);
            
            if (searchParams.certificateType) {
                filteredData = filteredData.filter(item => 
                    item.certificateType === searchParams.certificateType
                );
            }
            if (searchParams.issueStatus) {
                filteredData = filteredData.filter(item => 
                    item.status === searchParams.issueStatus
                );
            }
            
            setRequests(filteredData);
        } catch (error) {
            console.error('증명서 신청 내역 조회 중 오류 발생:', error);
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

    const handleReset = () => {
        setSearchParams({
            certificateType: '', 
            applicationDate: '', 
            issueStatus: ''
        });
        fetchRequests();
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmitRequest = async (requestData) => {
        console.log('증명서 신청:', requestData);
        try {
            // TODO: API 호출 - 증명서 신청
            // await createCertificateRequest(requestData);
            
            alert('증명서 신청이 완료되었습니다.');
            handleCloseModal();
            fetchRequests(); // 목록 새로고침
        } catch (error) {
            console.error('증명서 신청 중 오류 발생:', error);
            alert('증명서 신청 중 오류가 발생했습니다.');
        }
    };

    // 상태에 따른 색상 스타일
    const getStatusClass = (status) => {
        switch (status) {
            case 'APPROVED':
            case '승인':
                return styles.statusApproved;
            case 'PENDING':
            case '대기':
                return styles.statusPending;
            case 'REJECTED':
            case '반려':
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
                <td className={tableStyles.tableData}>{item.certificateType || '-'}</td>
                <td className={tableStyles.tableData}>{item.copies || 1}</td>
                <td className={tableStyles.tableData}>{item.issueDate || '-'}</td>
                <td className={tableStyles.tableData}>
                    <span className={getStatusClass(item.status)}>
                        {item.status || '-'}
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
