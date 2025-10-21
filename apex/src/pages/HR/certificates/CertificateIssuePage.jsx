import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from "./CertificateIssuePage.module.css";
import tableStyles from "../../../components/common/DataTable.module.css"; 
import DataTable from '../../../components/common/DataTable';
import CertificateIssueFilter from '../../../components/HR/certificate/CertificateIssueFilter';

// ✨ 목 데이터 임포트
// import { CERTIFICATE_ISSUE_MOCK } from '../../../models/data/CertificateIssueMOCK';

// 1. 테이블 헤더 정의
const TABLE_HEADERS = [
    '선택', '신청일자', '사번', '이름', '증명서', '부수', '발급일자', '상태'
];

// ✨ API 기본 URL 설정 (스테이지 'dev' 포함)
const API_BASE_URL = 'https://xtjea0rsb6.execute-api.ap-northeast-2.amazonaws.com/dev';

const CertificateIssuePage = () => {
    
    const [requests, setRequests] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchParams, setSearchParams] = useState({
        employeeName: '', employeeId: '', certificateType: '', 
        applicationDate: '', issueStatus: '',
    });

    //api 호출 함수 (조회)
    const fetchRequests =  async () => {
        console.log('API로 증명서 조회 시작!', searchParams);
        try {
            //GET /documents 호출
            //params 옵션이 searchParams를 쿼리 스트링으로 자동 변환
            const response = await axios.get(`${API_BASE_URL}/documents`, {
                params : searchParams
            });

            //api 응답 데이터로 state 업데이트
            // [주의] response.data가 배열 형태인지 확인 필요
            // 만약 {"items": [...]} 같은 객체 형태라면 setRequests(response.data.items)로 수정
            setRequests(response.data);
        } catch (error) {
            console.error('증명서 조회 중 오류 발생 : ', error);
            alert('데이터를 불러오는 데 실패했습니다.');
        }
    };

    //컴포넌트가 처음 렌더링될 때 데이터 로드
    useEffect(() => {
        fetchRequests();
    }, []); // 빈 배열 '[]'은 마운트 시 1회 실행을 의미

    // --- 핸들러 함수 ---
    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    //검색 버튼 핸들러 : api 호출 함수 실행
    const handleSearch = () => {
        fetchRequests();
    }

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

        //'승인'이면 'approve', '반려'면 'reject' 엔드포인트 동적 선택
        const endpoint = action === '승인' ? 'approve' : 'reject';
        const url = `${API_BASE_URL}/documents/${endpoint}`;

        console.log(`Action: ${action}, URL : ${url}, Selected IDs:`, selectedRows);
        try {
            // PUT API 호출 (axios.put)
            //[중요] api가 본문으로 id 목록을 받는 방식을 가정
            //예 : {"requestsIds" : ["id1", "id2"]}
            //실제 Lambda가 기대하는 body 형식에 맞춰 수정해야 함
            const response = await axios.put(url, {
                requestId: selectedRows
            });
            alert(`선택된 ${selectedRows.length}건을 ${action} 처리합니다.`);
            
            //처리가 완료되면 목록을 새로고침
            fetchRequests();
            setSelectedRows([]);
        } catch (error) {
        console.error(`${action} 처리 중 오류 발생:`, error);
        alert(`${action} 처리 중 오류가 발생했습니다.`);
        }
    }


    // 3. 테이블 행 렌더링 로직
    // [주의] item.requestId가 api 응답의 고유 id(pk)와 일치해야 함
    //만약 api에서 'id' 또는 'document_id' 등으로 온다면 item.id 등으로 수정 필요
    const renderRequestRow = (item) => { 
        return (
            <>
                <td className={tableStyles.tableData}>
                    <input 
                        type="checkbox" 
                        checked={selectedRows.includes(item.requestId)}
                        onChange={() => handleRowSelect(item.requestId)}
                    />
                </td>
                <td className={tableStyles.tableData}>{item.applicationDate}</td>
                <td className={tableStyles.tableData}>{item.employeeId}</td>
                <td className={tableStyles.tableData}>{item.name}</td>
                <td className={tableStyles.tableData}>{item.type}</td>
                <td className={tableStyles.tableData}>{item.count}</td>
                <td className={tableStyles.tableData}>{item.issueDate}</td>
                <td className={tableStyles.tableData}>{item.status}</td>
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
                <button 
                    onClick={() => handleAction('반려')} 
                    className={styles.rejectButton} 
                >
                    반려
                </button>
                <button 
                    onClick={() => handleAction('승인')} 
                    className={styles.approveButton} 
                >
                    승인
                </button>
            </div>
        </div>
    );
};

export default CertificateIssuePage;