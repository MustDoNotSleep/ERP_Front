import React, {useState, useRef, useEffect} from 'react';
import './HrCard.css';
import User from '../../img/user.png'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { fetchEmployeeProfile, fetchEmployeeEducation } from '../../api/employee.js';
import { InitialEmployeeData } from '../../models/Employee.js'; 
import DataTable from '../common/DataTable.jsx';

function HrCard() {
  const [hrCardData, setHrCardData] = useState(InitialEmployeeData());
  const [educationsData, setEducationsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataError, setDataError] = useState(null);
  // 1. 사진 변경을 위한 상태 및 참조
  const [imagePreview, setImagePreview] = useState(User); // 이미지 미리보기 URL
  const fileInputRef = useRef(null); // 숨겨진 file input에 대한 참조

  // 2. PDF 저장을 위한 참조
  const cardRef = useRef(null); // PDF로 변환할 전체 컴포넌트 영역

  /**
   * 2. '프린트' 버튼 클릭 시
   */
  const handlePrint = () => {
      // CSS로 인쇄 영역을 제어한 후, 브라우저 인쇄 기능 호출
      window.print();
  };

  /**
   * 3. '파일 내보내기' (PDF) 버튼 클릭 시
   */
  const handleExportPDF = () => {
    // 1. PDF로 만들 영역(cardRef.current)을 canvas로 캡처
    html2canvas(cardRef.current).then((canvas) => {
    // 2. 캡처한 canvas 이미지 데이터(URL)를 가져옴
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
        orientation: 'p', // p: portrait (세로), l: landscape (가로)
        unit: 'mm',       // 단위
        format: 'a4',     // 용지 크기
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // 이미지의 가로/세로 비율
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 0; // 맨 위에 붙임

    // 3. PDF에 이미지를 추가
    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    
    // 4. PDF 파일 저장
    pdf.save('인사카드-정관리.pdf');
    });
  };
  
  const getEmployeeId = () => {
    try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            return JSON.parse(storedUser).employeeId; 
        }
    } catch (e) {
        console.error("Employee ID 로드 실패:", e);
    }
    return null;
  };

  useEffect(() => {
    const employeeId = getEmployeeId();
    if (!employeeId) {
        setDataError('로그인된 사용자 정보를 찾을 수 없습니다.');
        setIsLoading(false);
        return;
    }

    const loadData = async () => {
        try {
          const profileData = await fetchEmployeeProfile(employeeId);

          // const educations = await fetchEmployeeEducation(employeeId);
          
          // API 응답 구조를 모델 초기화 함수로 생성한 기본 객체에 덮어쓰기 방식으로 매핑
          setHrCardData({
            ...InitialEmployeeData(), // 기본 모델 구조 유지
            
            // 기본 정보
            name: profileData.name || '',
            employeeId: profileData.employeeId || '',
            positionName: profileData.positionName || '',
            teamName: profileData.teamName || '',
            departmentName: profileData.departmentName || '',
            birthDate: profileData.birthDate || '',
            internalNumber: profileData.internalNumber || '',
            email: profileData.email || '',
            phoneNumber: profileData.phoneNumber || '',
            bankName: profileData.salaryInfo?.bankName || '',
            accountNumber: profileData.salaryInfo?.accountNumber || '',
            
            // 중첩 정보 (테이블에 바인딩)
            // educations: data.educations || [],
            militaryInfo: profileData.militaryInfo,
            workExperiences: profileData.workExperiences || [],
            certificates: profileData.certificates || [],
            trainings: profileData.trainings || [],
          });

          // setEducationsData(educations);
          setDataError(null);

        } catch (error) {
          console.error("HrCard 데이터 로드 실패:", error);
          setDataError('데이터 로드 실패: API 서버 응답 오류');
        } finally {
          setIsLoading(false);
        }
      };

      loadData();
  }, []);

  return (
    <div className="hr-card-container">

      {/* =================================
          1. 인사 카드 (기본 정보)
      ================================= */}
      <section className="hr-section">
        <h2>인사 카드</h2>
        
        <div className="hr-basic-info-content">
          {/* 1-1. 왼쪽: 프로필 사진 */}
          <div className="hr-photo-area">
            <div className="hr-photo-placeholder">
                {/* [수정] 이미지를 상태(imagePreview)에서 불러옴 */}
                <img src={imagePreview} alt="user" />
            </div>
          </div>

          {/* 1-2. 오른쪽: 정보 그리드 + 프린트 버튼 */}
          <div className="hr-info-right-area">
            {/* 정보 그리드 */}
            <div className="hr-info-grid">
              {/* --- 1행 --- */}
              <div className="hr-field">
                <label>이름</label>
                <input type="text" value={hrCardData.name} readOnly />
              </div>
              <div className="hr-field">
                <label>생년월일</label>
                <input type="text" value={hrCardData.birthDate} readOnly />
              </div>
              {/* --- 2행 --- */}
                <div className="hr-field">
                    <label>부서</label>
                    <input type="text" value={hrCardData.departmentName} readOnly />
              </div>
              <div className="hr-field">
                <label>사원번호</label>
                <input type="text" value={hrCardData.employeeId} readOnly />
              </div>
              {/* --- 3행 --- */}
              <div className="hr-field">
                <label>소속</label>
                <input type="text" value={hrCardData.teamName} readOnly />
              </div>
              <div className="hr-field">
                <label>내선번호</label>
                <input type="text" value={hrCardData.internalNumber} readOnly />
              </div>
              {/* --- 4행 --- */}
              <div className="hr-field">
                <label>이메일</label>
                <input type="text" value={hrCardData.email} readOnly />
              </div>
              <div className="hr-field">
                <label>전화번호</label>
                <input type="text" value={hrCardData.phoneNumber} readOnly />
              </div>
              {/* --- 5행 --- */}
              <div className="hr-field">
                <label>은행명</label>
                <input type="text" value={hrCardData.bankName} readOnly />
              </div>
              <div className="hr-field">
                <label>계좌번호</label>
                <input type="text" value={hrCardData.accountNumber} readOnly />
              </div>
            </div>

            {/* 프린트 버튼 영역 */}
            <div className="hr-print-area">
              <button className="hr-btn" onClick={handlePrint}>프린트</button>
              <button className="hr-btn" onClick={handleExportPDF}>파일 내보내기</button>
            </div>
          </div>
        </div>
      </section>

      {/* =================================
          2. 학력
      ================================= */}
      <section className="hr-section">
        <h3>학력</h3>
        <DataTable
          headers={['학교명', '학위', '전공', '입학일', '졸업일', '졸업 구분']}
          data={hrCardData.educations}
          emptyMessage="학력 정보가 없습니다."
          renderRow={(edu) => (
              <>
                  <td>{edu.schoolName || '-'}</td>
                  <td>{edu.degree || '-'}</td>
                  <td>{edu.major || '-'}</td>
                  <td>{edu.admissionDate || '-'}</td>
                  <td>{edu.graduationDate || '-'}</td>
                  <td>{edu.graduationStatus || '-'}</td>
              </>
          )}
        />
      </section>

      {/* =================================
          3. 병역여부
      ================================= */}
      <section className="hr-section">
        <h3>병역여부</h3>
        <table className="hr-table">
          <thead>
            <tr>
              <th>병역 구분</th>
              <th>군별</th>
              <th>복무 시작일</th>
              <th>복무 종료일</th>
              <th>계급</th>
              <th>병과</th>
              <th>미필사유</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>해당사항없음</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* =================================
          4. 경력
      ================================= */}
      <section className="hr-section">
        <h3>경력</h3>
        <table className="hr-table">
          <thead>
            <tr>
              <th>근무처</th>
              <th>입사일</th>
              <th>퇴직일</th>
              <th>담당업무</th>
              <th>최종직위</th>
              <th>최종연봉</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>넥스트보안테크(주)</td>
              <td>2000.3.20</td>
              <td>2005.03.19</td>
              <td>백엔드 개발</td>
              <td>대리</td>
              <td>1,500만원</td>
            </tr>
            <tr>
              <td>에이펙스금융보안(주)</td>
              <td>2005.3.20</td>
              <td>-</td>
              <td>CERT</td>
              <td>부장</td>
              <td>1억원</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* =================================
          5. 자격면허
      ================================= */}
      <section className="hr-section">
        <h3>자격면허</h3>
        <table className="hr-table">
          <thead>
            <tr>
              <th>자격증명</th>
              <th>발급기관</th>
              <th>취득일</th>
              <th>유효일</th>
              <th>점수</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>정보보안기사</td>
              <td>한국인터넷진흥원</td>
              <td>2005/09/20</td>
              <td>갱신</td>
              <td>-</td>
            </tr>
            <tr>
              <td>정보처리기사</td>
              <td>한국산업인력공단</td>
              <td>2005/01/18</td>
              <td>갱신</td>
              <td>-</td>
            </tr>
            <tr>
              <td>TOEIC</td>
              <td>한국 TOEIC 위원회</td>
              <td>2009/01/20</td>
              <td>2011/01/20</td>
              <td>900</td>
            </tr>
            <tr>
              <td>HSK 3급</td>
              <td>한국산업인력공단</td>
              <td>2010/06/30</td>
              <td>2013/06/30</td>
              <td>270</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* =================================
          6. 교육 훈련
      ================================= */}
      <section className="hr-section">
        <h3>교육 훈련</h3>
        <table className="hr-table">
          <thead>
            <tr>
              <th>교육기간</th>
              <th>교육명</th>
              <th>교육기관</th>
              <th>교육구분</th>
              <th>이수 여부</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>YYYY/MM/DD~YYYY/MM/DD</td>
              <td>보안사고대응실무</td>
              <td>Apex</td>
              <td>내부교육</td>
              <td>이수 완료</td>
            </tr>
            <tr>
              <td>YYYY/MM/DD~YYYY/MM/DD</td>
              <td>보안사고대응실무</td>
              <td>Apex</td>
              <td>내부교육</td>
              <td>이수 완료 (B+)</td>
            </tr>
            <tr>
              <td>YYYY/MM/DD~YYYY/MM/DD</td>
              <td>ISMS-P</td>
              <td>KISA</td>
              <td>외부교육</td>
              <td>이수 완료 (A)</td>
            </tr>
            <tr>
              <td>YYYY/MM/DD~YYYY/MM/DD</td>
              <td>ISMS-P</td>
              <td>KISA</td>
              <td>외부교육</td>
              <td>미이수</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default HrCard;