import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "./PeopleNewPage.module.css";
import { createEmployee } from '../../../../api/employee';
import { fetchUniqueDepartmentNames } from '../../../../api/department';
import { fetchUniquePositionNames } from '../../../../api/position';
import { createEducation } from '../../../../api/education';
import { createMilitaryService } from '../../../../api/military';
import { createWorkExperience } from '../../../../api/workExperience';
import { createCertificateRecord } from '../../../../api/certificate';

// MOCK 데이터 임포트 (API 실패 시 fallback용)
import { DEPARTMENT_MOCK } from '../../../../models/data/DepartmentMOCK';
import { POSITIONS_MOCK } from '../../../../models/data/PositionsMOCK';

// ✨ "마법 스위치" - 개발 중에는 true로 설정
const USE_MOCK_DATA = false; // API 연결 시 false, MOCK 사용 시 true

// --- (A) 사용자님이 보내주신 '폼의 빈 상태' ---
// (※ educationList 등은 '추가' 버튼으로 추가할 것이므로 빈 배열로 초기화)
const emptyFormData = {
  basicInfo: {
    employeeId: '', name: '', nameeng: '', password: 'auto', // password 기본값을 'auto'로 설정
    rrn: '', address: '', addressDetails: '', phoneNumber: '', email: '',
    birthDate: '', hireDate: '', quitDate: null, internalNumber: '',
    departmentName: '', teamName: '', positionName: '', employmentType: '계약직',
    familyCertificate: '', username: '', nationality: '내국인',
  },
  militaryServiceInfo: {
    militaryInfoId: '', militaryStatus: '', militaryBranch: '',
    militaryRank: '', militarySpecialty: '', exemptionReason: '',
    serviceStartDate: '', serviceEndDate: '',
  },
  educationList: [], // 빈 배열로 초기화
  workExperienceList: [], // 빈 배열로 초기화
  certificateList: [], // 빈 배열로 초기화
  salaryInfo: {
    salaryInfoId: '', bankName: '', accountNumber: '', salary: '',
  },
  // UI 제어용 (관리자 비밀번호만 남김)
  uiInfo: {
    adminPassword: '', // 관리자가 입력하는 임시 비밀번호
  }
};

// 동적 리스트를 위한 빈 객체들 (addListItem에서 사용)
const emptyEducation = {
  schoolName: '', major: '', admissionDate: '',
  graduationDate: '', degree: '', graduationStatus: '',
};
const emptyCareer = {
  companyName: '', jobTitle: '', finalPosition: '',
  finalSalary: '', startDate: '', endDate: '',
};
const emptyCertification = {
  certificateName: '', issuingAuthority: '',
  score: '', acquisitionDate: '', expirationDate: '',
};


const PeopleNewPage = () => {
    const [formData, setFormData] = useState(emptyFormData);
    const [showPassword, setShowPassword] = useState(false);
    
    // API에서 가져온 데이터 (중복 제거된 이름 목록)
    const [departmentNames, setDepartmentNames] = useState([]); // [ "경영지원본부", "사이버관제본부", ... ]
    const [positionNames, setPositionNames] = useState([]);     // [ "사원", "대리", "과장", ... ]
    const [loading, setLoading] = useState(true);

    // 컴포넌트 마운트 시 API 호출
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                let deptNames, posNames;
                
                if (USE_MOCK_DATA) {
                    // MOCK 데이터 사용 - 중복 제거된 이름만 추출
                    console.log('🛠️ MOCK 데이터를 사용하여 부서/직급 목록 조회');
                    deptNames = [...new Set(DEPARTMENT_MOCK.map(d => d.departmentName))].sort();
                    posNames = [...new Set(POSITIONS_MOCK.map(p => p.positionName))].sort();
                } else {
                    // 실제 API 호출 - unique-names 엔드포인트 사용
                    try {
                        console.log('🚀 실제 API 호출 시도 (unique-names)');
                        
                        // 중복 제거된 부서명/직급명 목록 조회
                        const [deptData, posData] = await Promise.all([
                            fetchUniqueDepartmentNames(),
                            fetchUniquePositionNames()
                        ]);
                        
                        console.log('✅ 부서명 API 성공:', deptData);
                        console.log('✅ 직급명 API 성공:', posData);
                        
                        // API 응답에서 데이터 추출
                        deptNames = deptData.data || deptData;
                        posNames = posData.data || posData;
                        
                        console.log('📦 추출된 부서명 배열:', deptNames);
                        console.log('📦 추출된 직급명 배열:', posNames);
                    } catch (apiError) {
                        // API 실패 시 자동으로 MOCK 데이터 사용
                        console.warn('⚠️ API 조회 실패, MOCK 데이터로 전환:', apiError.message);
                        deptNames = [...new Set(DEPARTMENT_MOCK.map(d => d.departmentName))].sort();
                        posNames = [...new Set(POSITIONS_MOCK.map(p => p.positionName))].sort();
                    }
                }
                
                console.log('📋 최종 부서명 목록:', deptNames);
                console.log('📋 최종 직급명 목록:', posNames);
                
                // 배열인지 확인 후 저장
                setDepartmentNames(Array.isArray(deptNames) ? deptNames : []);
                setPositionNames(Array.isArray(posNames) ? posNames : []);
                
            } catch (error) {
                console.error('❌ 치명적 에러:', error);
                alert('부서/직급 정보를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    

    // --- (C) 수정된 핸들러 함수들 ---

    /** * 'basicInfo', 'militaryServiceInfo', 'salaryInfo' 등 
     * 1:1 중첩 객체의 값을 변경하는 핸들러
     */
    const handleInputChange = (e, section) => {
        const { name, value } = e.target;

        // '관리자가 등록' 선택 시, uiInfo.adminPassword에 값을 저장
        if (section === 'uiInfo' && name === 'adminPassword') {
        setFormData(prev => ({
            ...prev,
            uiInfo: { ...prev.uiInfo, adminPassword: value }
        }));
        return;
        }

        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [name]: value
            }
        }));
    };



    /**
     * 'educationList', 'workExperienceList' 등 
     * 1:N 배열(리스트)의 값을 변경하는 핸들러
     */
    const handleListChange = (e, listName, index) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newList = [...prev[listName]];
            newList[index] = {
                ...newList[index],
                [name]: value
            };
            return { ...prev, [listName]: newList };
        });
    };
    
    // 리스트 아이템 추가
    const addListItem = (listName) => {
        let newItem;
        if (listName === 'educationList') newItem = emptyEducation;
        else if (listName === 'workExperienceList') newItem = emptyCareer;
        else if (listName === 'certificateList') newItem = emptyCertification;
        else return;

        setFormData(prev => ({
            ...prev,
            [listName]: [...prev[listName], { ...newItem }]
        }));
    };
    
    // 리스트 아이템 삭제
    const removeListItem = (listName, index) => {
        setFormData(prev => ({
            ...prev,
            [listName]: prev[listName].filter((_, i) => i !== index)
        }));
    };
    
    // 파일 변경 핸들러 (basicInfo.familyCertificate에 파일 이름 저장)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                basicInfo: {
                    ...prev.basicInfo,
                    familyCertificate: file.name // 'familyFile' -> 'familyCertificate'로 수정
                }
            }));
        }
    };
    
    const toggleShowPassword = () => {
        setShowPassword(prev => !prev);
    };


    // --- (D) [UPDATED] handleSubmit - 직원 등록 후 학력/병역/경력/자격증 별도 POST ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. 비밀번호 정책 처리
        let finalPassword = formData.basicInfo.password;
        if (finalPassword === 'auto') {
            const base = formData.basicInfo.username || formData.basicInfo.email?.split('@')[0];
            if (!base) {
                alert('자동생성을 위해 이메일을 입력해주세요.');
                return;
            }
            finalPassword = `${base}123!`;
        } else if (finalPassword === 'admin') {
            if (!formData.uiInfo.adminPassword) {
                alert('관리자가 등록을 선택했습니다. 비밀번호를 입력해주세요.');
                return;
            }
            finalPassword = formData.uiInfo.adminPassword;
        }
        
        // 2. 필수 필드 검증 (✅ Name 기준으로 변경)
        if (!formData.basicInfo.name || !formData.basicInfo.email || !finalPassword || 
            !formData.basicInfo.hireDate || !formData.basicInfo.departmentName || 
            !formData.basicInfo.teamName || !formData.basicInfo.positionName) {
            console.error('❌ 필수 필드 누락!', {
              name: formData.basicInfo.name,
              email: formData.basicInfo.email,
              password: finalPassword,
              hireDate: formData.basicInfo.hireDate,
              departmentName: formData.basicInfo.departmentName,
              teamName: formData.basicInfo.teamName,
              positionName: formData.basicInfo.positionName
            });
            alert('필수 항목(이름, 이메일, 입사일, 소속부서, 소속팀, 직급)이 모두 입력되었는지 확인해주세요.');
            return;
        }

        // 3. 기본 직원 정보 payload (✅ Name 기준으로 전송)
        const employeePayload = {
            name: formData.basicInfo.name,
            nameeng: formData.basicInfo.nameeng,
            email: formData.basicInfo.email,
            password: finalPassword,
            rrn: formData.basicInfo.rrn,
            phoneNumber: formData.basicInfo.phoneNumber,
            address: formData.basicInfo.address,
            addressDetails: formData.basicInfo.addressDetails,
            birthDate: formData.basicInfo.birthDate,
            hireDate: formData.basicInfo.hireDate,
            quitDate: formData.basicInfo.quitDate || null,
            internalNumber: formData.basicInfo.internalNumber,
            departmentName: formData.basicInfo.departmentName,  // ✅ 변경
            teamName: formData.basicInfo.teamName,              // ✅ 추가
            positionName: formData.basicInfo.positionName,      // ✅ 변경
            familyCertificate: formData.basicInfo.familyCertificate,
            employmentType: formData.basicInfo.employmentType,
            nationality: formData.basicInfo.nationality,
            username: formData.basicInfo.username,
            salaryInfo: formData.salaryInfo, // 급여 정보 포함
        };

        try {
            // 4. 직원 기본 정보 등록
            console.log('🧑‍💻 신규 직원 등록 데이터:', employeePayload);
            const employeeData = await createEmployee(employeePayload);
            console.log('✅ 직원 등록 성공:', employeeData);
            
            // 생성된 직원 ID 추출
            const newEmployeeId = employeeData.data?.id || employeeData.data || employeeData.id;
            if (!newEmployeeId) {
                throw new Error('생성된 직원 ID를 찾을 수 없습니다.');
            }
            console.log('🆔 생성된 직원 ID:', newEmployeeId);

            // 5. 학력 정보 등록 (배열이 비어있지 않으면)
            if (formData.educationList && formData.educationList.length > 0) {
                console.log('🎓 학력 정보 등록 시작...');
                for (const education of formData.educationList) {
                    try {
                        await createEducation(newEmployeeId, education);
                        console.log('✅ 학력 등록 성공:', education.schoolName);
                    } catch (eduError) {
                        console.warn('⚠️ 학력 등록 실패:', education.schoolName, eduError);
                    }
                }
            }

            // 6. 병역 정보 등록 (값이 있으면)
            if (formData.militaryServiceInfo && formData.militaryServiceInfo.militaryStatus) {
                console.log('🪖 병역 정보 등록 시작...');
                try {
                    await createMilitaryService(newEmployeeId, formData.militaryServiceInfo);
                    console.log('✅ 병역 정보 등록 성공');
                } catch (militaryError) {
                    console.warn('⚠️ 병역 정보 등록 실패:', militaryError);
                }
            }

            // 7. 경력 정보 등록 (배열이 비어있지 않으면)
            if (formData.workExperienceList && formData.workExperienceList.length > 0) {
                console.log('💼 경력 정보 등록 시작...');
                for (const work of formData.workExperienceList) {
                    try {
                        await createWorkExperience(newEmployeeId, work);
                        console.log('✅ 경력 등록 성공:', work.companyName);
                    } catch (workError) {
                        console.warn('⚠️ 경력 등록 실패:', work.companyName, workError);
                    }
                }
            }

            // 8. 자격증 정보 등록 (배열이 비어있지 않으면)
            if (formData.certificateList && formData.certificateList.length > 0) {
                console.log('📜 자격증 정보 등록 시작...');
                for (const cert of formData.certificateList) {
                    try {
                        await createCertificateRecord(newEmployeeId, cert);
                        console.log('✅ 자격증 등록 성공:', cert.certificateName);
                    } catch (certError) {
                        console.warn('⚠️ 자격증 등록 실패:', cert.certificateName, certError);
                    }
                }
            }

            alert('신규 직원이 등록되었습니다.');
            setFormData(emptyFormData);
            
        } catch (err) {
            console.error('❌ 직원 등록 실패:', err);
            const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || '직원 등록 중 오류가 발생했습니다.';
            alert(errorMessage);
        }
    };

    const handleCancel = () => {
        console.log('등록 취소');
        setFormData(emptyFormData);
    };

    if (loading) {
        return <div className={styles.pageContainer}>데이터 로딩 중...</div>;
    }

    // --- (E) [FIXED] JSX 렌더링 수정 ---
    return (
        <div className={styles.pageContainer}>
            <div className={styles.titleBar}>
                <h1>신규 직원 등록</h1>
            </div>

            {/* <form> 태그는 버튼을 감싸는 div 밖에 있어야 'submit'이 작동합니다. */}
            <form className={styles.formContentArea} onSubmit={handleSubmit}>
                
                {/* 기본정보 (JSX는 이미 emptyFormData.basicInfo에 맞게 잘 수정하셨습니다) */}
                <section className={styles.formSection}>
                    <h2 className={styles.sectionTitle}>기본정보</h2>
                    <div className={styles.gridContainer}>
                        
                        <div className={styles.inputGroup}><label>성명(국문)</label><input type="text" name="name" value={formData.basicInfo.name} onChange={(e) => handleInputChange(e, 'basicInfo')} required /></div>
                        <div className={styles.inputGroup}><label>성명(영문)</label><input type="text" name="nameeng" value={formData.basicInfo.nameeng} onChange={(e) => handleInputChange(e, 'basicInfo')} /></div>
                        <div className={styles.inputGroup}><label>국적</label><select name="nationality" value={formData.basicInfo.nationality} onChange={(e) => handleInputChange(e, 'basicInfo')}><option value="내국인">내국인</option><option value="외국인">외국인</option></select></div>
                        {/* <div className={styles.inputGroup}><label>사원번호</label><input type="text" name="employeeId" value={formData.basicInfo.employeeId} onChange={(e) => handleInputChange(e, 'basicInfo')} required /></div> */}
                        <div className={styles.inputGroup}><label>연락처</label><input type="tel" name="phoneNumber" value={formData.basicInfo.phoneNumber} onChange={(e) => handleInputChange(e, 'basicInfo')} placeholder="010-1234-5678" /></div>
                        <div className={styles.inputGroup}><label>주민등록번호</label><input type="text" name="rrn" value={formData.basicInfo.rrn} onChange={(e) => handleInputChange(e, 'basicInfo')} placeholder="001010-xxxxxxx" /></div>
                        <div className={styles.inputGroup}><label>입사일자</label><input type="date" name="hireDate" value={formData.basicInfo.hireDate} onChange={(e) => handleInputChange(e, 'basicInfo')} required /></div> {/* required 추가 */}
                        <div className={styles.inputGroup}><label>이메일</label><input type="email" name="email" value={formData.basicInfo.email} onChange={(e) => handleInputChange(e, 'basicInfo')} required /></div> {/* required 추가 */}
                        <div className={styles.inputGroup}><label>주소</label><input type="text" name="address" value={formData.basicInfo.address} onChange={(e) => handleInputChange(e, 'basicInfo')} /></div>
                        {/* 'addressDetail' -> 'addressDetails'로 수정 */}
                        <div className={styles.inputGroup}><label>상세주소</label><input type="text" name="addressDetails" value={formData.basicInfo.addressDetails} onChange={(e) => handleInputChange(e, 'basicInfo')} /></div> 
                        {/* 'familyFile' -> 'familyCertificate'로 수정 */}
                        <div className={styles.inputGroup}><label>가족관계증명서</label><div className={styles.fileInputBox}><input type="text" readOnly value={formData.basicInfo.familyCertificate || ''} placeholder="파일을 선택하세요" /><label className={styles.fileUploadButton}>파일 찾기<input type="file" onChange={handleFileChange} style={{ display: 'none' }} /></label></div></div>
                    </div>
                </section>

                {/* 병역여부 (militaryServiceInfo로 접근) */}
                <section className={styles.formSection}>
                    <h2 className={styles.sectionTitle}>병역여부</h2>
                    <div className={styles.gridContainer}>
                        <div className={styles.inputGroup}>
                            <label>병역구분</label>
                            {/* name, value, onChange의 키가 모두 일치해야 합니다. */}
                            <select name="militaryStatus" value={formData.militaryServiceInfo.militaryStatus} onChange={(e) => handleInputChange(e, 'militaryServiceInfo')}>
                                <option value="">선택</option>
                                <option value="군필">군필</option>
                                <option value="미필">미필</option>
                                <option value="면제">면제</option>
                                <option value="해당 없음">해당 없음</option>
                            </select>
                        </div>
                        {/* ... 이하 병역정보 name, value, section을 모두 'militaryServiceInfo' 기준으로 맞춥니다 ... */}
                        <div className={styles.inputGroup}> <label>군별</label> <select name="militaryBranch" value={formData.militaryServiceInfo.militaryBranch} onChange={(e) => handleInputChange(e, 'militaryServiceInfo')}> <option value="">선택</option> <option value="육군">육군</option> <option value="해군">해군</option> <option value="공군">공군</option> <option value="해병대">해병대</option> <option value="기타">기타</option> </select> </div>
                        <div className={styles.inputGroup}> <label>계급</label> <select name="militaryRank" value={formData.militaryServiceInfo.militaryRank} onChange={(e) => handleInputChange(e, 'militaryServiceInfo')}> <option value="">선택</option> <option value="병장">병장</option> <option value="상병">상병</option> <option value="일병">일병</option> <option value="하사">하사</option> <option value="기타">기타</option> </select> </div>
                        <div className={styles.inputGroup}> <label>병과</label> <select name="militarySpecialty" value={formData.militaryServiceInfo.militarySpecialty} onChange={(e) => handleInputChange(e, 'militaryServiceInfo')}> <option value="">선택</option> <option value="보병">보병</option> <option value="포병">포병</option> <option value="통신">통신</option> <option value="공병">공병</option> <option value="기타">기타</option> </select> </div>
                        <div className={styles.inputGroup}> <label>면제사유</label> <select name="exemptionReason" value={formData.militaryServiceInfo.exemptionReason} onChange={(e) => handleInputChange(e, 'militaryServiceInfo')}> <option value="">선택</option> <option value="복무대기">복무대기</option> <option value="생계곤란">생계곤란</option> <option value="질병">질병</option> <option value="기타">기타</option> </select> </div>
                        <div className={styles.inputGroup}> <label>복무시작일</label> <input type="date" name="serviceStartDate" value={formData.militaryServiceInfo.serviceStartDate} onChange={(e) => handleInputChange(e, 'militaryServiceInfo')} /> </div>
                        <div className={styles.inputGroup}> <label>복무종료일</label> <input type="date" name="serviceEndDate" value={formData.militaryServiceInfo.serviceEndDate} onChange={(e) => handleInputChange(e, 'militaryServiceInfo')} /> </div>
                    </div>
                </section>

                {/* 학력 (educationList로 접근) */}
                <section className={styles.formSection}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>학력</h2>
                        <button type="button" className={styles.addButton} onClick={() => addListItem('educationList')}>추가</button>
                    </div>
                    {formData.educationList.map((edu, index) => (
                        <div key={index} className={styles.listGridContainer}>
                            <div className={styles.inputGroup}><label>학교명</label><input type="text" name="schoolName" value={edu.schoolName} onChange={(e) => handleListChange(e, 'educationList', index)} /></div>
                            <div className={styles.inputGroup}><label>학위</label><select name="degree" value={edu.degree} onChange={(e) => handleListChange(e, 'educationList', index)}><option value="">선택</option><option value="고등학교 졸업">고등학교 졸업</option><option value="전문학사">전문학사</option><option value="학사">학사</option><option value="석사">석사</option><option value="박사">박사</option><option value="기타">기타</option></select></div>
                            <div className={styles.inputGroup}><label>전공</label><input type="text" name="major" value={edu.major} onChange={(e) => handleListChange(e, 'educationList', index)} /></div> {/* [TYPO FIX] 'eeducationList' -> 'educationList' */}
                            <div className={styles.inputGroup}><label>입학일자</label><input type="date" name="admissionDate" value={edu.admissionDate} onChange={(e) => handleListChange(e, 'educationList', index)} /></div>
                            <div className={styles.inputGroup}><label>졸업일자</label><input type="date" name="graduationDate" value={edu.graduationDate} onChange={(e) => handleListChange(e, 'educationList', index)} /></div>
                            <div className={styles.inputGroup}><label>졸업여부</label><select name="graduationStatus" value={edu.graduationStatus} onChange={(e) => handleListChange(e, 'educationList', index)}><option value="">선택</option><option value="졸업">졸업</option><option value="수료">수료</option><option value="재학">재학</option><option value="중퇴">중퇴</option></select></div> {/* [TYPO FIX] 'gradulationStatus' -> 'graduationStatus' */}
                            <button type="button" className={styles.removeButton} onClick={() => removeListItem('educationList', index)}>삭제</button>
                        </div>
                    ))}
                </section>

                {/* 경력 (workExperienceList로 접근) */}
                <section className={styles.formSection}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>경력</h2>
                        <button type="button" className={styles.addButton} onClick={() => addListItem('workExperienceList')}>추가</button>
                    </div>
                    {formData.workExperienceList.map((career, index) => (
                        <div key={index} className={styles.listGridContainer}>
                            <div className={styles.inputGroup}><label>근무처</label><input type="text" name="companyName" value={career.companyName} onChange={(e) => handleListChange(e, 'workExperienceList', index)} /></div>
                            <div className={styles.inputGroup}><label>담당업무</label><input type="text" name="jobTitle" value={career.jobTitle} onChange={(e) => handleListChange(e, 'workExperienceList', index)} /></div>
                            <div className={styles.inputGroup}><label>최종직위</label><input type="text" name="finalPosition" value={career.finalPosition} onChange={(e) => handleListChange(e, 'workExperienceList', index)} /></div> {/* [TYPO FIX] name="finalposition" -> "finalPosition" */}
                            <div className={styles.inputGroup}><label>입사일</label><input type="date" name="startDate" value={career.startDate} onChange={(e) => handleListChange(e, 'workExperienceList', index)} /></div> {/* [TYPO FIX] value={career.startDateDate} -> value={career.startDate} */}
                            <div className={styles.inputGroup}><label>퇴직일</label><input type="date" name="endDate" value={career.endDate} onChange={(e) => handleListChange(e, 'workExperienceList', index)} /></div> {/* [TYPO FIX] name/value 수정 */}
                            <div className={styles.inputGroup}><label>최종연봉</label><input type="text" name="finalSalary" value={career.finalSalary} onChange={(e) => handleListChange(e, 'workExperienceList', index)} /></div>
                            <button type="button" className={styles.removeButton} onClick={() => removeListItem('workExperienceList', index)}>삭제</button>
                        </div>
                    ))}
                </section>

                {/* 자격면허 (certificateList로 접근) */}
                <section className={styles.formSection}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>자격면허</h2>
                        <button type="button" className={styles.addButton} onClick={() => addListItem('certificateList')}>추가</button>
                    </div>
                    {formData.certificateList.map((cert, index) => (
                        <div key={index} className={styles.listGridContainer}>
                            <div className={styles.inputGroup}><label>자격증명</label><input type="text" name="certificateName" value={cert.certificateName} onChange={(e) => handleListChange(e, 'certificateList', index)} /></div>
                            <div className={styles.inputGroup}><label>발급기관</label><input type="text" name="issuingAuthority" value={cert.issuingAuthority} onChange={(e) => handleListChange(e, 'certificateList', index)} /></div>
                            <div className={styles.inputGroup}><label>점수</label><input type="text" name="score" value={cert.score} onChange={(e) => handleListChange(e, 'certificateList', index)} /></div>
                            <div className={styles.inputGroup}><label>취득일</label><input type="date" name="acquisitionDate" value={cert.acquisitionDate} onChange={(e) => handleListChange(e, 'certificateList', index)} /></div>
                            <div className={styles.inputGroup}><label>유효일</label><input type="date" name="expirationDate" value={cert.expirationDate} onChange={(e) => handleListChange(e, 'certificateList', index)} /></div>
                            <div></div> 
                            <button type="button" className={styles.removeButton} onClick={() => removeListItem('certificateList', index)}>삭제</button>
                        </div>
                    ))}
                </section>

                {/* 급여정보 (salaryInfo로 접근) */}
                <section className={styles.formSection}>
                    <h2 className={styles.sectionTitle}>급여정보</h2>
                    <div className={styles.gridContainer}>
                        <div className={styles.inputGroup}><label>은행명</label><input type="text" name="bankName" value={formData.salaryInfo.bankName} onChange={(e) => handleInputChange(e, 'salaryInfo')} /></div>
                        <div className={styles.inputGroup}><label>계좌번호</label><input type="text" name="accountNumber" value={formData.salaryInfo.accountNumber} onChange={(e) => handleInputChange(e, 'salaryInfo')} /></div>
                        <div className={styles.inputGroup}><label>월기본급</label><input type="text" name="salary" value={formData.salaryInfo.salary} onChange={(e) => handleInputChange(e, 'salaryInfo')} /></div>
                    </div>
                </section>

                {/* [FIXED] 회사정보 - unique-names 기반 드롭다운 */}
                <section className={styles.formSection}>
                    <h2 className={styles.sectionTitle}>회사정보</h2>
                    <div className={styles.gridContainer}>
                        {/* ✅ 1. 부서 선택 (중복 제거된 부서명) */}
                        <div className={styles.inputGroup}>
                            <label>소속부서</label>
                            <select 
                                name="departmentName" 
                                value={formData.basicInfo.departmentName}
                                onChange={(e) => handleInputChange(e, 'basicInfo')}
                                required
                            >
                                <option value="">선택</option>
                                {departmentNames.map((deptName) => (
                                    <option key={deptName} value={deptName}>{deptName}</option>
                                ))}
                            </select>
                        </div>
                        {/* ✅ 2. 팀명 직접 입력 */}
                        <div className={styles.inputGroup}>
                            <label>소속팀</label>
                            <input
                                type="text"
                                name="teamName"
                                value={formData.basicInfo.teamName}
                                onChange={(e) => handleInputChange(e, 'basicInfo')}
                                placeholder="팀명을 입력하세요"
                                required
                            />
                        </div>
                        {/* ✅ 3. 직급 선택 (중복 제거된 직급명) */}
                        <div className={styles.inputGroup}>
                            <label>직급</label>
                            <select 
                                name="positionName"
                                value={formData.basicInfo.positionName}
                                onChange={(e) => handleInputChange(e, 'basicInfo')}
                                required
                            >
                                <option value="">선택</option>
                                {positionNames.map((posName) => (
                                    <option key={posName} value={posName}>
                                        {posName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* 4. 나머지 정보는 basicInfo를 기준으로 연결 */}
                        <div className={styles.inputGroup}>
                            <label>고용형태</label>
                            <select name="employmentType" value={formData.basicInfo.employmentType} onChange={(e) => handleInputChange(e, 'basicInfo')}>
                                <option value="정규직">정규직</option>
                                <option value="계약직">계약직</option>
                            </select>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Email</label>
                            <input type="text" name="username" value={formData.basicInfo.username} onChange={(e) => handleInputChange(e, 'basicInfo')} />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>내선번호</label>
                            <input type="text" name="internalNumber" value={formData.basicInfo.internalNumber} onChange={(e) => handleInputChange(e, 'basicInfo')} />
                        </div>
                        
                        <div className={`${styles.inputGroup} ${styles.spanThree}`}>
                            <label>비밀번호</label>
                            <div className={styles.passwordOptionsContainer}>
                                <div className={styles.radioGroupCustom}>
                                    <label>
                                        <input type="radio" name="password" value="auto" 
                                            checked={formData.basicInfo.password === 'auto'} 
                                            onChange={(e) => handleInputChange(e, 'basicInfo')} 
                                        /> 자동생성
                                    </label>
                                    <label>
                                        <input type="radio" name="password" value="admin" 
                                            checked={formData.basicInfo.password === 'admin'} 
                                            onChange={(e) => handleInputChange(e, 'basicInfo')} 
                                        /> 관리자가 등록
                                    </label>
                                </div>
                                
                                {formData.basicInfo.password === 'admin' && (
                                    <div className={styles.adminPasswordWrapper}>
                                        <div className={styles.passwordInputWrapper}>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="adminPassword" // basicInfo.password가 아닌 uiInfo.adminPassword에 연결
                                                placeholder="********"
                                                value={formData.uiInfo.adminPassword}
                                                onChange={(e) => handleInputChange(e, 'uiInfo')} // uiInfo 핸들러
                                            />
                                            <button type="button" onClick={toggleShowPassword} className={styles.passwordToggleButton}>
                                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                                            </button>
                                        </div>
                                        <p className={styles.passwordDescription}>
                                            구성원이 로그인할 때 비밀번호를 변경하도록 요청합니다.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            <div className={styles.actionBar}>
                <button type="button" className={styles.cancelButton} onClick={handleCancel}>
                    취소
                </button>
                {/* '저장' 버튼의 type="submit"으로 바꾸고, 
                  onClick={handleSubmit} 대신 <form>의 onSubmit={handleSubmit}을 이용합니다.
                  (지금은 onClick으로 두어도 handleSubmit이 실행되긴 합니다.)
                */}
                <button type="submit" className={styles.saveButton} onClick={handleSubmit}>
                    저장
                </button>
            </div>
                
            </form>


        </div>
    );
};

export default PeopleNewPage;