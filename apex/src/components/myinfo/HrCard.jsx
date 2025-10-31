import React, {useState, useRef, useEffect} from 'react';
import './HrCard.css';
import User from '../../img/user.png'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { fetchEmployeeProfile, fetchEmployeeSalaryInfo } from '../../api/employee.js';
import DataTable from '../common/DataTable.jsx';
import tableStyles from '../common/DataTable.module.css';
import { fetchEducationsByEmployeeId } from '../../api/education.js';
import { fetchMilitaryServiceByEmployeeId } from '../../api/military.js';
import { fetchWorkExperiencesByEmployeeId } from '../../api/workExperience.js';
import { fetchCertificatesByEmployeeId } from '../../api/certificate.js';
import { fetchCoursesByEmployeeId } from '../../api/course.js';
import { InitialEmployeeData } from '../../models/Employee.js';

function HrCard() {
  const [hrCardData, setHrCardData] = useState(InitialEmployeeData());
  const [educationsData, setEducationsData] = useState([]);
  const [militaryData, setMilitaryData] = useState(null);
  const [workExperiencesData, setWorkExperiencesData] = useState([]);
  const [certificatesData, setCertificatesData] = useState([]);
  const [coursesData, setCoursesData] = useState([]);
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
          const response = await fetchEmployeeProfile(employeeId);
          
          // API 응답 구조: { success, message, data: { id, name, email, ... } }
          const profileData = response.data || response;
          
          console.log('📋 HrCard 프로필 데이터:', profileData);

          // 급여 정보 조회
          let salaryData = null;
          try {
            const salaryResponse = await fetchEmployeeSalaryInfo(employeeId);
            salaryData = salaryResponse.data || salaryResponse;
            console.log('💰 급여 정보:', salaryData);
          } catch (salaryError) {
            console.warn('급여 정보 조회 실패:', salaryError);
          }

          // 학력 정보 조회
          let educations = [];
          try {
            const educationResponse = await fetchEducationsByEmployeeId(employeeId);
            educations = educationResponse.data || educationResponse || [];
            console.log('🎓 학력 정보:', educations);
            setEducationsData(educations);
          } catch (educationError) {
            console.warn('학력 정보 조회 실패:', educationError);
          }

          // 병역 정보 조회
          let military = null;
          try {
            const militaryResponse = await fetchMilitaryServiceByEmployeeId(employeeId);
            military = militaryResponse.data || militaryResponse || null;
            console.log('🪖 병역 정보:', military);
            setMilitaryData(military);
          } catch (militaryError) {
            console.warn('병역 정보 조회 실패:', militaryError);
          }

          // 경력 정보 조회
          let workExperiences = [];
          try {
            const workExperienceResponse = await fetchWorkExperiencesByEmployeeId(employeeId);
            workExperiences = workExperienceResponse.data || workExperienceResponse || [];
            console.log('💼 경력 정보:', workExperiences);
            setWorkExperiencesData(workExperiences);
          } catch (workExperienceError) {
            console.warn('경력 정보 조회 실패:', workExperienceError);
          }

          // 자격증 정보 조회
          let certificates = [];
          try {
            const certificateResponse = await fetchCertificatesByEmployeeId(employeeId);
            certificates = certificateResponse.data || certificateResponse || [];
            console.log('📜 자격증 정보:', certificates);
            setCertificatesData(certificates);
          } catch (certificateError) {
            console.warn('자격증 정보 조회 실패:', certificateError);
          }

          // 교육훈련 정보 조회
          let courses = [];
          try {
            const courseResponse = await fetchCoursesByEmployeeId(employeeId);
            courses = courseResponse.data || courseResponse || [];
            console.log('🎓 교육훈련 정보:', courses);
            setCoursesData(courses);
          } catch (courseError) {
            console.warn('교육훈련 정보 조회 실패:', courseError);
          }
          
          // API 응답 구조를 모델 초기화 함수로 생성한 기본 객체에 덮어쓰기 방식으로 매핑
          setHrCardData({
            ...InitialEmployeeData(), // 기본 모델 구조 유지
            
            // 기본 정보
            name: profileData.name || '',
            employeeId: profileData.id || profileData.employeeId || '',
            positionName: profileData.positionName || '',
            teamName: profileData.teamName || profileData.departmentName || '',
            departmentName: profileData.departmentName || '',
            birthDate: profileData.birthDate || '',
            internalNumber: profileData.internalNumber || '',
            email: profileData.email || '',
            phoneNumber: profileData.phone || profileData.phoneNumber || '',
            
            // 중첩 정보 (테이블에 바인딩)
            // educations: data.educations || [],
            militaryInfo: profileData.militaryInfo,
            workExperiences: profileData.workExperiences || [],
            certificates: profileData.certificates || [],
            trainings: profileData.trainings || [],

            // 급여 정보 (별도 API)
            bankName: salaryData?.bankName || '',
            accountNumber: salaryData?.accountNumber || '',
          });

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
                <input type="text" value={hrCardData.birthDate ? hrCardData.birthDate.split('T')[0] : ''} readOnly />
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
          headers={['학교명', '학위', '전공', '입학일', '졸업일', '졸업구분']}
          data={educationsData}
          emptyMessage="학력 정보가 없습니다."
          renderRow={(edu) => (
            <>
              <td className={tableStyles.tableData}>{edu.schoolName || '-'}</td>
              <td className={tableStyles.tableData}>{edu.degree || '-'}</td>
              <td className={tableStyles.tableData}>{edu.major || '-'}</td>
              <td className={tableStyles.tableData}>{edu.admissionDate ? edu.admissionDate.split('T')[0] : '-'}</td>
              <td className={tableStyles.tableData}>{edu.graduationDate ? edu.graduationDate.split('T')[0] : '-'}</td>
              <td className={tableStyles.tableData}>{edu.graduationStatus || '-'}</td>
            </>
          )}
        />
      </section>

      {/* =================================
          3. 병역여부
      ================================= */}
      <section className="hr-section">
        <h3>병역여부</h3>
        <DataTable
          headers={['병역 구분', '군별', '복무 시작일', '복무 종료일', '계급', '병과', '미필사유']}
          data={militaryData ? [militaryData] : []}
          emptyMessage="병역 정보가 없습니다."
          renderRow={(military) => (
            <>
              <td className={tableStyles.tableData}>{military.serviceType || '-'}</td>
              <td className={tableStyles.tableData}>{military.branch || '-'}</td>
              <td className={tableStyles.tableData}>{military.serviceStartDate ? military.serviceStartDate.split('T')[0] : '-'}</td>
              <td className={tableStyles.tableData}>{military.serviceEndDate ? military.serviceEndDate.split('T')[0] : '-'}</td>
              <td className={tableStyles.tableData}>{military.rank || '-'}</td>
              <td className={tableStyles.tableData}>{military.specialty || '-'}</td>
              <td className={tableStyles.tableData}>{military.exemptionReason || '-'}</td>
            </>
          )}
        />
      </section>

      {/* =================================
          4. 경력
      ================================= */}
      <section className="hr-section">
        <h3>경력</h3>
        <DataTable
          headers={['근무처', '입사일', '퇴직일', '담당업무', '최종직위', '최종연봉']}
          data={workExperiencesData}
          emptyMessage="경력 정보가 없습니다."
          renderRow={(work) => (
            <>
              <td className={tableStyles.tableData}>{work.companyName || '-'}</td>
              <td className={tableStyles.tableData}>{work.startDate ? work.startDate.split('T')[0] : '-'}</td>
              <td className={tableStyles.tableData}>{work.endDate ? work.endDate.split('T')[0] : '-'}</td>
              <td className={tableStyles.tableData}>{work.responsibilities || '-'}</td>
              <td className={tableStyles.tableData}>{work.finalPosition || '-'}</td>
              <td className={tableStyles.tableData}>{work.finalSalary ? `${work.finalSalary.toLocaleString()}원` : '-'}</td>
            </>
          )}
        />
      </section>

      {/* =================================
          5. 자격면허
      ================================= */}
      <section className="hr-section">
        <h3>자격면허</h3>
        <DataTable
          headers={['자격증명', '발급기관', '취득일', '유효일', '점수']}
          data={certificatesData}
          emptyMessage="자격증 정보가 없습니다."
          renderRow={(cert) => (
            <>
              <td className={tableStyles.tableData}>{cert.certificateName || '-'}</td>
              <td className={tableStyles.tableData}>{cert.issuingOrganization || '-'}</td>
              <td className={tableStyles.tableData}>{cert.acquisitionDate ? cert.acquisitionDate.split('T')[0] : '-'}</td>
              <td className={tableStyles.tableData}>{cert.expirationDate ? cert.expirationDate.split('T')[0] : '-'}</td>
              <td className={tableStyles.tableData}>{cert.score || '-'}</td>
            </>
          )}
        />
      </section>

      {/* =================================
          6. 교육 훈련
      ================================= */}
      <section className="hr-section">
        <h3>교육 훈련</h3>
        <DataTable
          headers={['교육기간', '교육명', '교육기관', '교육구분', '이수 여부']}
          data={coursesData}
          emptyMessage="교육훈련 정보가 없습니다."
          renderRow={(course) => (
            <>
              <td className={tableStyles.tableData}>
                {course.startDate && course.endDate 
                  ? `${course.startDate.split('T')[0]} ~ ${course.endDate.split('T')[0]}` 
                  : '-'}
              </td>
              <td className={tableStyles.tableData}>{course.courseName || '-'}</td>
              <td className={tableStyles.tableData}>{course.institution || '-'}</td>
              <td className={tableStyles.tableData}>{course.courseType || '-'}</td>
              <td className={tableStyles.tableData}>{course.completionStatus || '-'}</td>
            </>
          )}
        />
      </section>
    </div>
  );
}

export default HrCard;