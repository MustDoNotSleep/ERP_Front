import React, {useState, useRef, useEffect} from 'react';
import './HrCard.css';
import User from '../../img/user.png'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { fetchEmployeeProfile, fetchEmployeeSalaryInfo, updateEmployee } from '../../api/employee.js';
import DataTable from '../common/DataTable.jsx';
import tableStyles from '../common/DataTable.module.css';
import { fetchEducationsByEmployeeId, createEducation, updateEducation, deleteEducation } from '../../api/education.js';
import { fetchMilitaryServiceByEmployeeId, createMilitaryService, updateMilitaryService, deleteMilitaryService } from '../../api/military.js';
import { fetchWorkExperiencesByEmployeeId, createWorkExperience, updateWorkExperience, deleteWorkExperience } from '../../api/workExperience.js';
import { fetchCertificatesByEmployeeId, createCertificateRecord, updateCertificateRecord, deleteCertificateRecord } from '../../api/certificate.js';
import { fetchCoursesByEmployeeId, updateCourse, deleteCourse } from '../../api/course.js';
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

  // 3. 주소/전화번호 편집 모드 상태
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedAddress, setEditedAddress] = useState('');
  const [editedAddressDetail, setEditedAddressDetail] = useState('');
  const [editedPhoneNumber, setEditedPhoneNumber] = useState('');

  // 4. 각 섹션 편집 모드 상태
  const [isEditingEducation, setIsEditingEducation] = useState(false);
  const [editedEducations, setEditedEducations] = useState([]);
  const [isEditingMilitary, setIsEditingMilitary] = useState(false);
  const [editedMilitary, setEditedMilitary] = useState(null);
  const [isEditingWorkExp, setIsEditingWorkExp] = useState(false);
  const [editedWorkExps, setEditedWorkExps] = useState([]);
  const [isEditingCertificate, setIsEditingCertificate] = useState(false);
  const [editedCertificates, setEditedCertificates] = useState([]);
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [editedCourses, setEditedCourses] = useState([]);

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

  /**
   * 4. 주소/전화번호 편집 모드 활성화
   */
  const handleEditClick = () => {
    setIsEditMode(true);
  };

  /**
   * 5. 편집 취소
   */
  const handleCancelEdit = () => {
    setIsEditMode(false);
    // 원래 값으로 복원
    setEditedAddress(hrCardData.address || '');
    setEditedAddressDetail(hrCardData.addressDetail || '');
    setEditedPhoneNumber(hrCardData.phoneNumber || '');
  };

  /**
   * 6. 편집 내용 저장
   */
  const handleSaveEdit = async () => {
    const employeeId = getEmployeeId();
    if (!employeeId) {
      alert('로그인 정보를 찾을 수 없습니다.');
      return;
    }

    try {
      // 주소, 상세주소, 전화번호 업데이트
      const updateData = {
        address: editedAddress,
        addressDetail: editedAddressDetail,
        phone: editedPhoneNumber,
      };

      await updateEmployee(employeeId, updateData);
      
      // 상태 업데이트
      setHrCardData(prev => ({
        ...prev,
        address: editedAddress,
        addressDetail: editedAddressDetail,
        phoneNumber: editedPhoneNumber,
      }));

      setIsEditMode(false);
      alert('주소와 전화번호가 성공적으로 수정되었습니다.');

    } catch (error) {
      console.error('주소/전화번호 수정 실패:', error);
      const errorMessage = error.response?.data?.message || '수정 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  /**
   * 7. 학력 정보 편집 관련 함수
   */
  const handleEducationEditStart = () => {
    setEditedEducations(JSON.parse(JSON.stringify(educationsData))); // 깊은 복사
    setIsEditingEducation(true);
  };

  const handleEducationCancel = () => {
    setIsEditingEducation(false);
    setEditedEducations([]);
  };

  const handleEducationFieldChange = (index, field, value) => {
    const updated = [...editedEducations];
    updated[index] = { ...updated[index], [field]: value };
    setEditedEducations(updated);
  };

  const handleEducationAdd = () => {
    setEditedEducations([...editedEducations, {
      schoolName: '',
      degree: '',
      major: '',
      admissionDate: '',
      graduationDate: '',
      graduationStatus: '졸업'
    }]);
  };

  const handleEducationDelete = async (index) => {
    const education = editedEducations[index];
    
    if (education.id) {
      // 기존 데이터 삭제
      if (window.confirm('정말 삭제하시겠습니까?')) {
        try {
          await deleteEducation(education.id);
          const updated = editedEducations.filter((_, i) => i !== index);
          setEditedEducations(updated);
          alert('삭제되었습니다.');
        } catch (error) {
          console.error('삭제 실패:', error);
          alert('삭제 중 오류가 발생했습니다.');
        }
      }
    } else {
      // 새로 추가한 항목 제거
      const updated = editedEducations.filter((_, i) => i !== index);
      setEditedEducations(updated);
    }
  };

  const handleEducationSave = async () => {
    const employeeId = getEmployeeId();
    if (!employeeId) {
      alert('로그인 정보를 찾을 수 없습니다.');
      return;
    }

    try {
      // 각 항목을 생성 또는 업데이트
      for (const edu of editedEducations) {
        console.log('📝 처리 중인 학력:', edu);
        
        if (edu.id) {
          // 기존 데이터 업데이트
          console.log(`✏️ 학력 수정 요청: ID=${edu.id}`, edu);
          const result = await updateEducation(edu.id, edu);
          console.log('✅ 학력 수정 성공:', result);
        } else {
          // 새 데이터 생성
          console.log(`➕ 학력 생성 요청: employeeId=${employeeId}`, edu);
          const result = await createEducation(employeeId, edu);
          console.log('✅ 학력 생성 성공:', result);
        }
      }

      // 데이터 새로고침
      const response = await fetchEducationsByEmployeeId(employeeId);
      setEducationsData(response.data || response || []);
      
      setIsEditingEducation(false);
      setEditedEducations([]);
      alert('학력 정보가 저장되었습니다.');

    } catch (error) {
      console.error('❌ 학력 정보 저장 실패:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || error.response?.data?.error || '저장 중 오류가 발생했습니다.';
      alert(`저장 실패: ${errorMessage}`);
    }
  };
  
  /**
   * 8. 병역 정보 편집 관련 함수
   */
  const handleMilitaryEditStart = () => {
    setEditedMilitary(militaryData ? JSON.parse(JSON.stringify(militaryData)) : {
      serviceType: '',
      branch: '',
      serviceStartDate: '',
      serviceEndDate: '',
      rank: '',
      specialty: '',
      exemptionReason: ''
    });
    setIsEditingMilitary(true);
  };

  const handleMilitaryCancel = () => {
    setIsEditingMilitary(false);
    setEditedMilitary(null);
  };

  const handleMilitaryFieldChange = (field, value) => {
    setEditedMilitary(prev => ({ ...prev, [field]: value }));
  };

  const handleMilitarySave = async () => {
    const employeeId = getEmployeeId();
    if (!employeeId) {
      alert('로그인 정보를 찾을 수 없습니다.');
      return;
    }

    try {
      if (militaryData?.id || editedMilitary?.id) {
        // 수정
        await updateMilitaryService(militaryData.id || editedMilitary.id, editedMilitary, employeeId);
      } else {
        // 생성
        await createMilitaryService(employeeId, editedMilitary);
      }

      // 데이터 새로고침
      const response = await fetchMilitaryServiceByEmployeeId(employeeId);
      setMilitaryData(response.data || response || null);
      
      setIsEditingMilitary(false);
      setEditedMilitary(null);
      alert('병역 정보가 저장되었습니다.');

    } catch (error) {
      console.error('병역 정보 저장 실패:', error);
      const errorMessage = error.response?.data?.message || '저장 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  const handleMilitaryDelete = async () => {
    if (!militaryData?.id && !editedMilitary?.id) return;

    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        const employeeId = getEmployeeId();
        await deleteMilitaryService(militaryData.id || editedMilitary.id, employeeId);
        setMilitaryData(null);
        setIsEditingMilitary(false);
        setEditedMilitary(null);
        alert('삭제되었습니다.');
      } catch (error) {
        console.error('삭제 실패:', error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  /**
   * 9. 경력 정보 편집 관련 함수
   */
  const handleWorkExpEditStart = () => {
    setEditedWorkExps(JSON.parse(JSON.stringify(workExperiencesData)));
    setIsEditingWorkExp(true);
  };

  const handleWorkExpCancel = () => {
    setIsEditingWorkExp(false);
    setEditedWorkExps([]);
  };

  const handleWorkExpFieldChange = (index, field, value) => {
    const updated = [...editedWorkExps];
    updated[index] = { ...updated[index], [field]: value };
    setEditedWorkExps(updated);
  };

  const handleWorkExpAdd = () => {
    setEditedWorkExps([...editedWorkExps, {
      companyName: '',
      startDate: '',
      endDate: '',
      responsibilities: '',
      finalPosition: '',
      finalSalary: ''
    }]);
  };

  const handleWorkExpDelete = async (index) => {
    const workExp = editedWorkExps[index];
    
    if (workExp.id) {
      if (window.confirm('정말 삭제하시겠습니까?')) {
        try {
          const employeeId = getEmployeeId();
          await deleteWorkExperience(workExp.id, employeeId);
          const updated = editedWorkExps.filter((_, i) => i !== index);
          setEditedWorkExps(updated);
          alert('삭제되었습니다.');
        } catch (error) {
          console.error('삭제 실패:', error);
          alert('삭제 중 오류가 발생했습니다.');
        }
      }
    } else {
      const updated = editedWorkExps.filter((_, i) => i !== index);
      setEditedWorkExps(updated);
    }
  };

  const handleWorkExpSave = async () => {
    const employeeId = getEmployeeId();
    if (!employeeId) {
      alert('로그인 정보를 찾을 수 없습니다.');
      return;
    }

    try {
      for (const work of editedWorkExps) {
        if (work.id) {
          await updateWorkExperience(work.id, work, employeeId);
        } else {
          await createWorkExperience(employeeId, work);
        }
      }

      const response = await fetchWorkExperiencesByEmployeeId(employeeId);
      setWorkExperiencesData(response.data || response || []);
      
      setIsEditingWorkExp(false);
      setEditedWorkExps([]);
      alert('경력 정보가 저장되었습니다.');

    } catch (error) {
      console.error('경력 정보 저장 실패:', error);
      alert(error.response?.data?.message || '저장 중 오류가 발생했습니다.');
    }
  };

  /**
   * 10. 자격증 정보 편집 관련 함수
   */
  const handleCertificateEditStart = () => {
    setEditedCertificates(JSON.parse(JSON.stringify(certificatesData)));
    setIsEditingCertificate(true);
  };

  const handleCertificateCancel = () => {
    setIsEditingCertificate(false);
    setEditedCertificates([]);
  };

  const handleCertificateFieldChange = (index, field, value) => {
    const updated = [...editedCertificates];
    updated[index] = { ...updated[index], [field]: value };
    setEditedCertificates(updated);
  };

  const handleCertificateAdd = () => {
    setEditedCertificates([...editedCertificates, {
      certificateName: '',
      issuingOrganization: '',
      acquisitionDate: '',
      expirationDate: '',
      score: ''
    }]);
  };

  const handleCertificateDelete = async (index) => {
    const cert = editedCertificates[index];
    
    if (cert.id) {
      if (window.confirm('정말 삭제하시겠습니까?')) {
        try {
          await deleteCertificateRecord(cert.id);
          const updated = editedCertificates.filter((_, i) => i !== index);
          setEditedCertificates(updated);
          alert('삭제되었습니다.');
        } catch (error) {
          console.error('삭제 실패:', error);
          alert('삭제 중 오류가 발생했습니다.');
        }
      }
    } else {
      const updated = editedCertificates.filter((_, i) => i !== index);
      setEditedCertificates(updated);
    }
  };

  const handleCertificateSave = async () => {
    const employeeId = getEmployeeId();
    if (!employeeId) {
      alert('로그인 정보를 찾을 수 없습니다.');
      return;
    }

    try {
      for (const cert of editedCertificates) {
        if (cert.id) {
          await updateCertificateRecord(cert.id, cert);
        } else {
          await createCertificateRecord(employeeId, cert);
        }
      }

      const response = await fetchCertificatesByEmployeeId(employeeId);
      setCertificatesData(response.data || response || []);
      
      setIsEditingCertificate(false);
      setEditedCertificates([]);
      alert('자격증 정보가 저장되었습니다.');

    } catch (error) {
      console.error('자격증 정보 저장 실패:', error);
      alert(error.response?.data?.message || '저장 중 오류가 발생했습니다.');
    }
  };

  /**
   * 11. 교육훈련 정보 편집 관련 함수
   */
  const handleCourseEditStart = () => {
    setEditedCourses(JSON.parse(JSON.stringify(coursesData)));
    setIsEditingCourse(true);
  };

  const handleCourseCancel = () => {
    setIsEditingCourse(false);
    setEditedCourses([]);
  };

  const handleCourseFieldChange = (index, field, value) => {
    const updated = [...editedCourses];
    updated[index] = { ...updated[index], [field]: value };
    setEditedCourses(updated);
  };

  const handleCourseDelete = async (index) => {
    const course = editedCourses[index];
    
    if (course.id) {
      if (window.confirm('정말 삭제하시겠습니까?')) {
        try {
          await deleteCourse(course.id);
          const updated = editedCourses.filter((_, i) => i !== index);
          setEditedCourses(updated);
          alert('삭제되었습니다.');
        } catch (error) {
          console.error('삭제 실패:', error);
          alert('삭제 중 오류가 발생했습니다.');
        }
      }
    } else {
      const updated = editedCourses.filter((_, i) => i !== index);
      setEditedCourses(updated);
    }
  };

  const handleCourseSave = async () => {
    try {
      for (const course of editedCourses) {
        if (course.id) {
          await updateCourse(course.id, course);
        }
      }

      const employeeId = getEmployeeId();
      const response = await fetchCoursesByEmployeeId(employeeId);
      setCoursesData(response.data || response || []);
      
      setIsEditingCourse(false);
      setEditedCourses([]);
      alert('교육훈련 정보가 저장되었습니다.');

    } catch (error) {
      console.error('교육훈련 정보 저장 실패:', error);
      alert(error.response?.data?.message || '저장 중 오류가 발생했습니다.');
    }
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
            address: profileData.address || '',
            addressDetail: profileData.addressDetail || '',
            
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

          // 편집 가능한 필드 초기화
          setEditedAddress(profileData.address || '');
          setEditedAddressDetail(profileData.addressDetail || '');
          setEditedPhoneNumber(profileData.phone || profileData.phoneNumber || '');

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
                {isEditMode ? (
                  <input 
                    type="text" 
                    value={editedPhoneNumber} 
                    onChange={(e) => setEditedPhoneNumber(e.target.value)}
                  />
                ) : (
                  <input type="text" value={hrCardData.phoneNumber} readOnly />
                )}
              </div>
              {/* --- 5행 --- */}
              <div className="hr-field">
                <label>주소</label>
                {isEditMode ? (
                  <input 
                    type="text" 
                    value={editedAddress} 
                    onChange={(e) => setEditedAddress(e.target.value)}
                    placeholder="기본 주소"
                  />
                ) : (
                  <input 
                    type="text" 
                    value={hrCardData.address || '주소 정보 없음'} 
                    readOnly 
                  />
                )}
              </div>
              <div className="hr-field">
                <label>상세주소</label>
                {isEditMode ? (
                  <input 
                    type="text" 
                    value={editedAddressDetail} 
                    onChange={(e) => setEditedAddressDetail(e.target.value)}
                    placeholder="상세 주소"
                  />
                ) : (
                  <input 
                    type="text" 
                    value={hrCardData.addressDetail || '상세주소 정보 없음'} 
                    readOnly 
                  />
                )}
              </div>
              {/* --- 6행 --- */}
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
              {isEditMode ? (
                <>
                  <button className="hr-btn" onClick={handleSaveEdit} style={{ backgroundColor: '#4CAF50' }}>저장</button>
                  <button className="hr-btn" onClick={handleCancelEdit} style={{ backgroundColor: '#f44336' }}>취소</button>
                </>
              ) : (
                <>
                  <button className="hr-btn" onClick={handleEditClick}>주소/전화번호 수정</button>
                  <button className="hr-btn" onClick={handlePrint}>프린트</button>
                  <button className="hr-btn" onClick={handleExportPDF}>파일 내보내기</button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =================================
          2. 학력
      ================================= */}
      <section className="hr-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>학력</h3>
          <div>
            {isEditingEducation ? (
              <>
                <button className="hr-btn" onClick={handleEducationAdd} style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem', marginRight: '0.5rem', backgroundColor: '#4CAF50' }}>
                  + 행 추가
                </button>
                <button className="hr-btn" onClick={handleEducationSave} style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem', marginRight: '0.5rem', backgroundColor: '#4CAF50' }}>
                  저장
                </button>
                <button className="hr-btn" onClick={handleEducationCancel} style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem', backgroundColor: '#f44336' }}>
                  취소
                </button>
              </>
            ) : (
              <button className="hr-btn" onClick={handleEducationEditStart} style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem' }}>
                수정
              </button>
            )}
          </div>
        </div>
        
        {isEditingEducation ? (
          <table className={tableStyles.genericTable}>
            <thead>
              <tr>
                {['학교명', '학위', '전공', '입학일', '졸업일', '졸업구분', ''].map((header, idx) => (
                  <th key={idx} className={tableStyles.tableHeader}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {editedEducations.length === 0 ? (
                <tr>
                  <td colSpan={7} className={tableStyles.emptyMessage}>학력 정보가 없습니다.</td>
                </tr>
              ) : (
                editedEducations.map((edu, index) => (
                  <tr key={index}>
                    <td className={tableStyles.tableData}>
                      <input
                        type="text"
                        value={edu.schoolName || ''}
                        onChange={(e) => handleEducationFieldChange(index, 'schoolName', e.target.value)}
                        style={{ width: '100%', padding: '0.3rem', border: '1px solid #ccc' }}
                      />
                    </td>
                    <td className={tableStyles.tableData}>
                      <select
                        value={edu.degree || ''}
                        onChange={(e) => handleEducationFieldChange(index, 'degree', e.target.value)}
                        style={{ width: '100%', padding: '0.3rem', border: '1px solid #ccc' }}
                      >
                        <option value="">선택</option>
                        <option value="고졸">고졸</option>
                        <option value="전문학사">전문학사</option>
                        <option value="학사">학사</option>
                        <option value="석사">석사</option>
                        <option value="박사">박사</option>
                      </select>
                    </td>
                    <td className={tableStyles.tableData}>
                      <input
                        type="text"
                        value={edu.major || ''}
                        onChange={(e) => handleEducationFieldChange(index, 'major', e.target.value)}
                        style={{ width: '100%', padding: '0.3rem', border: '1px solid #ccc' }}
                      />
                    </td>
                    <td className={tableStyles.tableData}>
                      <input
                        type="date"
                        value={edu.admissionDate ? edu.admissionDate.split('T')[0] : ''}
                        onChange={(e) => handleEducationFieldChange(index, 'admissionDate', e.target.value)}
                        style={{ width: '100%', padding: '0.3rem', border: '1px solid #ccc' }}
                      />
                    </td>
                    <td className={tableStyles.tableData}>
                      <input
                        type="date"
                        value={edu.graduationDate ? edu.graduationDate.split('T')[0] : ''}
                        onChange={(e) => handleEducationFieldChange(index, 'graduationDate', e.target.value)}
                        style={{ width: '100%', padding: '0.3rem', border: '1px solid #ccc' }}
                      />
                    </td>
                    <td className={tableStyles.tableData}>
                      <select
                        value={edu.graduationStatus || '졸업'}
                        onChange={(e) => handleEducationFieldChange(index, 'graduationStatus', e.target.value)}
                        style={{ width: '100%', padding: '0.3rem', border: '1px solid #ccc' }}
                      >
                        <option value="졸업">졸업</option>
                        <option value="재학">재학</option>
                        <option value="휴학">휴학</option>
                        <option value="중퇴">중퇴</option>
                      </select>
                    </td>
                    <td className={tableStyles.tableData} style={{ textAlign: 'center' }}>
                      <button 
                        onClick={() => handleEducationDelete(index)}
                        style={{ backgroundColor: '#f44336', color: 'white', padding: '0.3rem 0.6rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
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
        )}
      </section>

      {/* =================================
          3. 병역여부
      ================================= */}
      <section className="hr-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>병역여부</h3>
          <div>
            {isEditingMilitary ? (
              <>
                {editedMilitary?.id && (
                  <button className="hr-btn" onClick={handleMilitaryDelete} style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem', marginRight: '0.5rem', backgroundColor: '#f44336' }}>
                    삭제
                  </button>
                )}
                <button className="hr-btn" onClick={handleMilitarySave} style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem', marginRight: '0.5rem', backgroundColor: '#4CAF50' }}>
                  저장
                </button>
                <button className="hr-btn" onClick={handleMilitaryCancel} style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem', backgroundColor: '#f44336' }}>
                  취소
                </button>
              </>
            ) : (
              <button className="hr-btn" onClick={handleMilitaryEditStart} style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem' }}>
                수정
              </button>
            )}
          </div>
        </div>
        
        {isEditingMilitary ? (
          <table className={tableStyles.genericTable}>
            <thead>
              <tr>
                {['병역 구분', '군별', '복무 시작일', '복무 종료일', '계급', '병과', '미필사유'].map((header, idx) => (
                  <th key={idx} className={tableStyles.tableHeader}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={tableStyles.tableData}>
                  <select
                    value={editedMilitary?.serviceType || ''}
                    onChange={(e) => handleMilitaryFieldChange('serviceType', e.target.value)}
                    style={{ width: '100%', padding: '0.3rem', border: '1px solid #ccc' }}
                  >
                    <option value="">선택</option>
                    <option value="군필">군필</option>
                    <option value="미필">미필</option>
                    <option value="면제">면제</option>
                    <option value="해당없음">해당없음</option>
                  </select>
                </td>
                <td className={tableStyles.tableData}>
                  <input
                    type="text"
                    value={editedMilitary?.branch || ''}
                    onChange={(e) => handleMilitaryFieldChange('branch', e.target.value)}
                    style={{ width: '100%', padding: '0.3rem', border: '1px solid #ccc' }}
                  />
                </td>
                <td className={tableStyles.tableData}>
                  <input
                    type="date"
                    value={editedMilitary?.serviceStartDate ? editedMilitary.serviceStartDate.split('T')[0] : ''}
                    onChange={(e) => handleMilitaryFieldChange('serviceStartDate', e.target.value)}
                    style={{ width: '100%', padding: '0.3rem', border: '1px solid #ccc' }}
                  />
                </td>
                <td className={tableStyles.tableData}>
                  <input
                    type="date"
                    value={editedMilitary?.serviceEndDate ? editedMilitary.serviceEndDate.split('T')[0] : ''}
                    onChange={(e) => handleMilitaryFieldChange('serviceEndDate', e.target.value)}
                    style={{ width: '100%', padding: '0.3rem', border: '1px solid #ccc' }}
                  />
                </td>
                <td className={tableStyles.tableData}>
                  <input
                    type="text"
                    value={editedMilitary?.rank || ''}
                    onChange={(e) => handleMilitaryFieldChange('rank', e.target.value)}
                    style={{ width: '100%', padding: '0.3rem', border: '1px solid #ccc' }}
                  />
                </td>
                <td className={tableStyles.tableData}>
                  <input
                    type="text"
                    value={editedMilitary?.specialty || ''}
                    onChange={(e) => handleMilitaryFieldChange('specialty', e.target.value)}
                    style={{ width: '100%', padding: '0.3rem', border: '1px solid #ccc' }}
                  />
                </td>
                <td className={tableStyles.tableData}>
                  <input
                    type="text"
                    value={editedMilitary?.exemptionReason || ''}
                    onChange={(e) => handleMilitaryFieldChange('exemptionReason', e.target.value)}
                    style={{ width: '100%', padding: '0.3rem', border: '1px solid #ccc' }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
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
        )}
      </section>

      {/* =================================
          4. 경력
      ================================= */}
      <section className="hr-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>경력</h3>
          <div>
            {isEditingWorkExp ? (
              <>
                <button className="hr-btn" onClick={handleWorkExpAdd} style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem', marginRight: '0.5rem', backgroundColor: '#4CAF50' }}>
                  + 행 추가
                </button>
                <button className="hr-btn" onClick={handleWorkExpSave} style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem', marginRight: '0.5rem', backgroundColor: '#4CAF50' }}>
                  저장
                </button>
                <button className="hr-btn" onClick={handleWorkExpCancel} style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem', backgroundColor: '#f44336' }}>
                  취소
                </button>
              </>
            ) : (
              <button className="hr-btn" onClick={handleWorkExpEditStart} style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem' }}>
                수정
              </button>
            )}
          </div>
        </div>
        
        {isEditingWorkExp ? (
          <table className={tableStyles.genericTable}>
            <thead>
              <tr>
                {['근무처', '입사일', '퇴직일', '담당업무', '최종직위', '최종연봉', ''].map((header, idx) => (
                  <th key={idx} className={tableStyles.tableHeader}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {editedWorkExps.length === 0 ? (
                <tr>
                  <td colSpan={7} className={tableStyles.emptyMessage}>경력 정보가 없습니다.</td>
                </tr>
              ) : (
                editedWorkExps.map((work, index) => (
                  <tr key={index}>
                    <td className={tableStyles.tableData}>
                      <input
                        type="text"
                        value={work.companyName || ''}
                        onChange={(e) => handleWorkExpFieldChange(index, 'companyName', e.target.value)}
                        style={{ width: '100%', padding: '0.3rem', border: '1px solid #ccc' }}
                      />
                    </td>
                    <td className={tableStyles.tableData}>
                      <input
                        type="date"
                        value={work.startDate ? work.startDate.split('T')[0] : ''}
                        onChange={(e) => handleWorkExpFieldChange(index, 'startDate', e.target.value)}
                        style={{ width: '100%', padding: '0.3rem', border: '1px solid #ccc' }}
                      />
                    </td>
                    <td className={tableStyles.tableData}>
                      <input
                        type="date"
                        value={work.endDate ? work.endDate.split('T')[0] : ''}
                        onChange={(e) => handleWorkExpFieldChange(index, 'endDate', e.target.value)}
                        style={{ width: '100%', padding: '0.3rem', border: '1px solid #ccc' }}
                      />
                    </td>
                    <td className={tableStyles.tableData}>
                      <input
                        type="text"
                        value={work.responsibilities || ''}
                        onChange={(e) => handleWorkExpFieldChange(index, 'responsibilities', e.target.value)}
                        style={{ width: '100%', padding: '0.3rem', border: '1px solid #ccc' }}
                      />
                    </td>
                    <td className={tableStyles.tableData}>
                      <input
                        type="text"
                        value={work.finalPosition || ''}
                        onChange={(e) => handleWorkExpFieldChange(index, 'finalPosition', e.target.value)}
                        style={{ width: '100%', padding: '0.3rem', border: '1px solid #ccc' }}
                      />
                    </td>
                    <td className={tableStyles.tableData}>
                      <input
                        type="number"
                        value={work.finalSalary || ''}
                        onChange={(e) => handleWorkExpFieldChange(index, 'finalSalary', e.target.value)}
                        style={{ width: '100%', padding: '0.3rem', border: '1px solid #ccc' }}
                      />
                    </td>
                    <td className={tableStyles.tableData} style={{ textAlign: 'center' }}>
                      <button 
                        onClick={() => handleWorkExpDelete(index)}
                        style={{ backgroundColor: '#f44336', color: 'white', padding: '0.3rem 0.6rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
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
        )}
      </section>

      {/* =================================
          5. 자격면허
      ================================= */}
      <section className="hr-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>자격면허</h3>
          <div>
            {isEditingCertificate ? (
              <>
                <button className="hr-btn" onClick={handleCertificateAdd} style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem', marginRight: '0.5rem', backgroundColor: '#4CAF50' }}>
                  + 행 추가
                </button>
                <button className="hr-btn" onClick={handleCertificateSave} style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem', marginRight: '0.5rem', backgroundColor: '#4CAF50' }}>
                  저장
                </button>
                <button className="hr-btn" onClick={handleCertificateCancel} style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem', backgroundColor: '#f44336' }}>
                  취소
                </button>
              </>
            ) : (
              <button className="hr-btn" onClick={handleCertificateEditStart} style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem' }}>
                수정
              </button>
            )}
          </div>
        </div>
        
        {isEditingCertificate ? (
          <table className={tableStyles.genericTable}>
            <thead>
              <tr>
                {['자격증명', '발급기관', '취득일', '유효일', '점수', ''].map((header, idx) => (
                  <th key={idx} className={tableStyles.tableHeader}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {editedCertificates.length === 0 ? (
                <tr>
                  <td colSpan={6} className={tableStyles.emptyMessage}>자격증 정보가 없습니다.</td>
                </tr>
              ) : (
                editedCertificates.map((cert, index) => (
                  <tr key={index}>
                    <td className={tableStyles.tableData}>
                      <input
                        type="text"
                        value={cert.certificateName || ''}
                        onChange={(e) => handleCertificateFieldChange(index, 'certificateName', e.target.value)}
                        style={{ width: '100%', padding: '0.3rem', border: '1px solid #ccc' }}
                      />
                    </td>
                    <td className={tableStyles.tableData}>
                      <input
                        type="text"
                        value={cert.issuingOrganization || ''}
                        onChange={(e) => handleCertificateFieldChange(index, 'issuingOrganization', e.target.value)}
                        style={{ width: '100%', padding: '0.3rem', border: '1px solid #ccc' }}
                      />
                    </td>
                    <td className={tableStyles.tableData}>
                      <input
                        type="date"
                        value={cert.acquisitionDate ? cert.acquisitionDate.split('T')[0] : ''}
                        onChange={(e) => handleCertificateFieldChange(index, 'acquisitionDate', e.target.value)}
                        style={{ width: '100%', padding: '0.3rem', border: '1px solid #ccc' }}
                      />
                    </td>
                    <td className={tableStyles.tableData}>
                      <input
                        type="date"
                        value={cert.expirationDate ? cert.expirationDate.split('T')[0] : ''}
                        onChange={(e) => handleCertificateFieldChange(index, 'expirationDate', e.target.value)}
                        style={{ width: '100%', padding: '0.3rem', border: '1px solid #ccc' }}
                      />
                    </td>
                    <td className={tableStyles.tableData}>
                      <input
                        type="text"
                        value={cert.score || ''}
                        onChange={(e) => handleCertificateFieldChange(index, 'score', e.target.value)}
                        style={{ width: '100%', padding: '0.3rem', border: '1px solid #ccc' }}
                      />
                    </td>
                    <td className={tableStyles.tableData} style={{ textAlign: 'center' }}>
                      <button 
                        onClick={() => handleCertificateDelete(index)}
                        style={{ backgroundColor: '#f44336', color: 'white', padding: '0.3rem 0.6rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
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
        )}
      </section>

      {/* =================================
          6. 교육 훈련
      ================================= */}
      <section className="hr-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>교육 훈련</h3>
          <div>
            {isEditingCourse ? (
              <>
                <button className="hr-btn" onClick={handleCourseSave} style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem', marginRight: '0.5rem', backgroundColor: '#4CAF50' }}>
                  저장
                </button>
                <button className="hr-btn" onClick={handleCourseCancel} style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem', backgroundColor: '#f44336' }}>
                  취소
                </button>
              </>
            ) : (
              <button className="hr-btn" onClick={handleCourseEditStart} style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem' }}>
                수정
              </button>
            )}
          </div>
        </div>
        
        {isEditingCourse ? (
          <table className={tableStyles.genericTable}>
            <thead>
              <tr>
                {['교육기간', '교육명', '교육기관', '교육구분', '이수 여부', ''].map((header, idx) => (
                  <th key={idx} className={tableStyles.tableHeader}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {editedCourses.length === 0 ? (
                <tr>
                  <td colSpan={6} className={tableStyles.emptyMessage}>교육훈련 정보가 없습니다.</td>
                </tr>
              ) : (
                editedCourses.map((course, index) => (
                  <tr key={index}>
                    <td className={tableStyles.tableData}>
                      <div style={{ display: 'flex', gap: '0.2rem', alignItems: 'center' }}>
                        <input
                          type="date"
                          value={course.startDate ? course.startDate.split('T')[0] : ''}
                          onChange={(e) => handleCourseFieldChange(index, 'startDate', e.target.value)}
                          style={{ width: '48%', padding: '0.3rem', border: '1px solid #ccc' }}
                        />
                        <span>~</span>
                        <input
                          type="date"
                          value={course.endDate ? course.endDate.split('T')[0] : ''}
                          onChange={(e) => handleCourseFieldChange(index, 'endDate', e.target.value)}
                          style={{ width: '48%', padding: '0.3rem', border: '1px solid #ccc' }}
                        />
                      </div>
                    </td>
                    <td className={tableStyles.tableData}>
                      <input
                        type="text"
                        value={course.courseName || ''}
                        onChange={(e) => handleCourseFieldChange(index, 'courseName', e.target.value)}
                        style={{ width: '100%', padding: '0.3rem', border: '1px solid #ccc' }}
                      />
                    </td>
                    <td className={tableStyles.tableData}>
                      <input
                        type="text"
                        value={course.institution || ''}
                        onChange={(e) => handleCourseFieldChange(index, 'institution', e.target.value)}
                        style={{ width: '100%', padding: '0.3rem', border: '1px solid #ccc' }}
                      />
                    </td>
                    <td className={tableStyles.tableData}>
                      <input
                        type="text"
                        value={course.courseType || ''}
                        onChange={(e) => handleCourseFieldChange(index, 'courseType', e.target.value)}
                        style={{ width: '100%', padding: '0.3rem', border: '1px solid #ccc' }}
                      />
                    </td>
                    <td className={tableStyles.tableData}>
                      <select
                        value={course.completionStatus || ''}
                        onChange={(e) => handleCourseFieldChange(index, 'completionStatus', e.target.value)}
                        style={{ width: '100%', padding: '0.3rem', border: '1px solid #ccc' }}
                      >
                        <option value="">선택</option>
                        <option value="이수">이수</option>
                        <option value="미이수">미이수</option>
                        <option value="진행중">진행중</option>
                      </select>
                    </td>
                    <td className={tableStyles.tableData} style={{ textAlign: 'center' }}>
                      <button 
                        onClick={() => handleCourseDelete(index)}
                        style={{ backgroundColor: '#f44336', color: 'white', padding: '0.3rem 0.6rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
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
        )}
      </section>
    </div>
  );
}

export default HrCard;