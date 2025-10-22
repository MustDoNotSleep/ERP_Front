import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "./PeopleNewPage.module.css";
import axios from 'axios';

// API 엔드포인트
const API_BASE_URL = 'https://xtjea0rsb6.execute-api.ap-northeast-2.amazonaws.com/dev';

// --- (A) 사용자님이 보내주신 '폼의 빈 상태' ---
// (※ educationList 등은 '추가' 버튼으로 추가할 것이므로 빈 배열로 초기화)
const emptyFormData = {
  basicInfo: {
    employeeId: '', name: '', nameeng: '', password: 'auto', // password 기본값을 'auto'로 설정
    rrn: '', address: '', addressDetails: '', phoneNumber: '', email: '',
    birthDate: '', hireDate: '', quitDate: null, internalNumber: '',
    departmentId: '', positionId: '', employmentType: '계약직',
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
  
  // --- (B) UI 제어를 위한 추가 상태 ---
  // (※ 백엔드로 보내지 않음. 드롭다운 선택용)
  uiInfo: {
    departmentName: '', // '경영지원본부' 등 부서명
    teamName: '',       // '인사팀' 등 팀명
    positionName: '',   // '사원' 등 직급명
    adminPassword: '',  // 관리자가 입력하는 임시 비밀번호
  }
};

// 동적 리스트를 위한 빈 객체들 (addListItem에서 사용)
const emptyEducation = {
  educationId: '', schoolName: '', major: '', admissionDate: '',
  graduationDate: '', degree: '', graduationStatus: '',
};
const emptyCareer = {
  experienceId: '', companyName: '', jobTitle: '', finalPosition: '',
  finalSalary: '', startDate: '', endDate: '',
};
const emptyCertification = {
  certificateId: '', certificateName: '', issuingAuthority: '',
  score: '', acquisitionDate: '', expirationDate: '',
};


const PeopleNewPage = () => {
    const [formData, setFormData] = useState(emptyFormData);
    const [showPassword, setShowPassword] = useState(false);
    
    // API에서 가져온 데이터
    const [departments, setDepartments] = useState([]); // [ { departmentId, departmentName, teamName }, ... ]
    const [positions, setPositions] = useState([]);     // [ { positionId, positionName }, ... ]
    const [loading, setLoading] = useState(true);

    // 부서별로 그룹화된 데이터
    const [departmentGroups, setDepartmentGroups] = useState({}); // { "경영지원본부": [ { id, teamName }, ... ] }
    const [availableTeams, setAvailableTeams] = useState([]);

    // 컴포넌트 마운트 시 API 호출
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // 부서/팀 목록 조회
                const deptResponse = await axios.get(`${API_BASE_URL}/get?type=departments`);
                const deptData = deptResponse.data.data;
                
                // 직급 목록 조회
                const posResponse = await axios.get(`${API_BASE_URL}/get?type=positions`);
                const posData = posResponse.data.data;
                
                setDepartments(deptData); // 전체 부서/팀 목록 저장
                setPositions(posData);
                
                // 부서명으로 그룹화
                const grouped = deptData.reduce((acc, item) => {
                    if (!acc[item.departmentName]) {
                        acc[item.departmentName] = [];
                    }
                    if (item.teamName) {
                        acc[item.departmentName].push({
                            id: item.departmentId, // 팀의 고유 ID (이것이 departmentId가 됨)
                            teamName: item.teamName
                        });
                    }
                    return acc;
                }, {});
                
                setDepartmentGroups(grouped);
                
            } catch (error) {
                console.error('❌ API 조회 실패:', error);
                alert('부서/직급 정보를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // 부서 선택 시 팀 필터링
    useEffect(() => {
        // formData.uiInfo.departmentName이 변경될 때
        if (formData.uiInfo.departmentName) {
            const teams = departmentGroups[formData.uiInfo.departmentName] || [];
            setAvailableTeams(teams);
            
            // 부서 변경 시 팀/ID 초기화
            setFormData(prev => ({
                ...prev,
                basicInfo: {
                ...prev.basicInfo,
                departmentId: ''
                },
                uiInfo: {
                    ...prev.uiInfo,
                    teamName: '', // 팀 이름 초기화
                }
            }));
        }
    }, [formData.uiInfo.departmentName, departmentGroups]); // uiInfo.departmentName 기준으로 변경
    

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

    // 부서 선택 핸들러 (UI용 departmentName 변경)
    const handleDepartmentChange = (e) => {
        const departmentName = e.target.value;
        setFormData(prev => ({
            ...prev,
            uiInfo: {
                ...prev.uiInfo,
                departmentName: departmentName
            }
        }));
    };

    // [FIXED] 팀 선택 핸들러 (basicInfo.departmentId 변경)
    const handleTeamChange = (e) => {
        const selectedTeamId = parseInt(e.target.value); // "1", "2" ...
        if (isNaN(selectedTeamId)) {
          // "선택" (value="")을 누른 경우
          setFormData(prev => ({
            ...prev,
            basicInfo: { ...prev.basicInfo, departmentId: '' },
            uiInfo: { ...prev.uiInfo, teamName: '' }
          }));
          return;
        }
        
        const selectedTeam = availableTeams.find(t => t.id === selectedTeamId);
        
        setFormData(prev => ({
            ...prev,
            basicInfo: {
                ...prev.basicInfo,
                departmentId: selectedTeamId // ★ 백엔드로 보낼 ID 저장
            },
            uiInfo: {
                ...prev.uiInfo,
                teamName: selectedTeam ? selectedTeam.teamName : '' // UI 표시용 이름 저장
            }
        }));
    };

    // [FIXED] 직급 선택 핸들러 (basicInfo.positionId 변경)
    const handlePositionChange = (e) => {
        const selectedPositionId = parseInt(e.target.value);
        if (isNaN(selectedPositionId)) {
          // "선택" (value="")을 누른 경우
          setFormData(prev => ({
            ...prev,
            basicInfo: { ...prev.basicInfo, positionId: '' },
            uiInfo: { ...prev.uiInfo, positionName: '' }
          }));
          return;
        }

        const selectedPosition = positions.find(p => p.positionId === selectedPositionId);
        
        setFormData(prev => ({
            ...prev,
            basicInfo: {
                ...prev.basicInfo,
                positionId: selectedPositionId // ★ 백엔드로 보낼 ID 저장
            },
            uiInfo: {
                ...prev.uiInfo,
                positionName: selectedPosition ? selectedPosition.positionName : '' // UI 표시용 이름 저장
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


    // --- (D) [CRITICAL FIX] handleSubmit 수정 ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. 'basicInfo'를 풀어서 백엔드가 원하는 '평평한' 구조로 재조립합니다.
        const payload = {
            // ...basicInfo의 모든 값을 최상위로 복사
            ...formData.basicInfo,
            
            // ... 나머지 객체/배열들의 '키 이름'을 백엔드에 맞게 수정
            militaryInfo: formData.militaryServiceInfo,
            educations: formData.educationList,
            workExperiences: formData.workExperienceList,
            certificates: formData.certificateList,
            salaryInfo: formData.salaryInfo,
        };

        // 2. 비밀번호 정책 처리
        if (payload.password === 'auto') {
            // 'auto'일 때, username이나 email 기반으로 임시 비밀번호 생성
            const base = payload.username || payload.email?.split('@')[0];
            if (!base) {
                alert('자동생성을 위해 Username 또는 이메일을 입력해주세요.');
                return;
            }
            payload.password = `${base}123!`; // 예: testuser123!
        } else if (payload.password === 'admin') {
            // 'admin'일 때, uiInfo.adminPassword 값을 사용
            if (!formData.uiInfo.adminPassword) {
                alert('관리자가 등록을 선택했습니다. 비밀번호를 입력해주세요.');
                return;
            }
            payload.password = formData.uiInfo.adminPassword;
        }
        
        // 3. (중요) 백엔드 필수 필드 6개 값이 비어있는지 마지막으로 확인
        if (!payload.name || !payload.email || !payload.password || !payload.hireDate || !payload.departmentId || !payload.positionId) {
            console.error('❌ 필수 필드 누락!', {
              name: payload.name,
              email: payload.email,
              password: payload.password,
              hireDate: payload.hireDate,
              departmentId: payload.departmentId,
              positionId: payload.positionId
            });
            alert('필수 항목(이름, 이메일, 입사일, 소속팀, 직급)이 모두 입력되었는지 확인해주세요.');
            return;
        }

        try {
            // 4. 재조립된 'payload'를 서버로 전송
            console.log('🧑‍💻 신규 직원 등록 데이터 (최종 전송 Payload):', payload);
            
            const response = await axios.post(
                `${API_BASE_URL}/register`,
                payload, // ★★★ formData 대신 재조립한 payload 전송
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            
            console.log('✅ 서버 응답:', response.data);
            alert('신규 직원이 등록되었습니다.');
            setFormData(emptyFormData);
        } catch (err) {
            console.error('❌ 직원 등록 실패:', err);
            // 백엔드가 { error: "메시지" } 형식으로 응답
            const errorMessage = err.response?.data?.error || err.message || '직원 등록 중 오류가 발생했습니다.';
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
                        <div className={styles.inputGroup}><label>사원번호</label><input type="text" name="employeeId" value={formData.basicInfo.employeeId} onChange={(e) => handleInputChange(e, 'basicInfo')} required /></div>
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
                                <option value="면제">면제</option>
                                <option value="미필">미필</option>
                                <option value="해당없음">해당없음</option>
                            </select>
                        </div>
                        {/* ... 이하 병역정보 name, value, section을 모두 'militaryServiceInfo' 기준으로 맞춥니다 ... */}
                        <div className={styles.inputGroup}> <label>군별</label> <select name="militaryBranch" value={formData.militaryServiceInfo.militaryBranch} onChange={(e) => handleInputChange(e, 'militaryServiceInfo')}> <option value="">선택</option> <option value="육군">육군</option> <option value="해군">해군</option> <option value="공군">공군</option> <option value="해병대">해병대</option> <option value="기타">기타</option> </select> </div>
                        <div className={styles.inputGroup}> <label>계급</label> <select name="militaryRank" value={formData.militaryServiceInfo.militaryRank} onChange={(e) => handleInputChange(e, 'militaryServiceInfo')}> <option value="">선택</option> <option value="이병">이병</option> <option value="일병">일병</option> <option value="상병">상병</option> <option value="병장">병장</option> <option value="하사">하사</option> <option value="기타">기타</option> </select> </div>
                        <div className={styles.inputGroup}> <label>병과</label> <select name="militarySpecialty" value={formData.militaryServiceInfo.militarySpecialty} onChange={(e) => handleInputChange(e, 'militaryServiceInfo')}> <option value="">선택</option> <option value="보병">보병</option> <option value="포병">포병</option> <option value="통신">통신</option> <option value="공병">공병</option> <option value="기타">기타</option> </select> </div>
                        <div className={styles.inputGroup}> <label>면제사유</label> <select name="exemptionReason" value={formData.militaryServiceInfo.exemptionReason} onChange={(e) => handleInputChange(e, 'militaryServiceInfo')}> <option value="">선택</option> <option value="해당없음">해당없음</option> <option value="복무대기">복무대기</option> <option value="생계곤란">생계곤란</option> <option value="질병">질병</option> <option value="기타">기타</option> </select> </div>
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
                            <div className={styles.inputGroup}><label>졸업여부</label><select name="graduationStatus" value={edu.graduationStatus} onChange={(e) => handleListChange(e, 'educationList', index)}><option value="">선택</option><option value="졸업">졸업</option><option value="재학">재학</option><option value="휴학">휴학</option><option value="중퇴">중퇴</option></select></div> {/* [TYPO FIX] 'gradulationStatus' -> 'graduationStatus' */}
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

                {/* [FIXED] 회사정보 - 드롭다운 로직 전체 수정 */}
                <section className={styles.formSection}>
                    <h2 className={styles.sectionTitle}>회사정보</h2>
                    <div className={styles.gridContainer}>
                        {/* 1. '부서명'을 선택 (UI 상태인 uiInfo.departmentName에 저장) */}
                        <div className={styles.inputGroup}>
                            <label>소속부서</label>
                            <select 
                                name="department" 
                                value={formData.uiInfo.departmentName} // value를 uiInfo.departmentName으로
                                onChange={handleDepartmentChange} // 전용 핸들러 사용
                                required // 필수로 선택
                            >
                                <option value="">선택</option>
                                {Object.keys(departmentGroups).map((deptName) => (
                                    <option key={deptName} value={deptName}>{deptName}</option>
                                ))}
                            </select>
                        </div>
                        {/* 2. '팀명'을 선택 (실제 ID인 basicInfo.departmentId에 저장) */}
                        <div className={styles.inputGroup}>
                            <label>소속팀</label>
                            <select
                                name="departmentId" // name을 basicInfo.departmentId와 맞추면 좋음
                                value={formData.basicInfo.departmentId} // value를 basicInfo.departmentId (ID)로
                                onChange={handleTeamChange} // 전용 핸들러 사용
                                disabled={!formData.uiInfo.departmentName} // 부서를 먼저 선택해야 활성화
                                required // 필수로 선택
                            >
                                <option value="">선택</option>
                                {availableTeams.map((team) => (
                                    // [NaN Bug FIX] key와 value에 team.id (숫자)를 사용
                                    <option key={team.id} value={team.id}>{team.teamName}</option>
                                ))}
                            </select>
                        </div>
                        {/* 3. '직급'을 선택 (basicInfo.positionId에 저장) */}
                        <div className={styles.inputGroup}>
                            <label>직급</label>
                            <select 
                                name="positionId" // name을 basicInfo.positionId와 맞추면 좋음
                                value={formData.basicInfo.positionId} // value를 basicInfo.positionId (ID)로
                                onChange={handlePositionChange} // 전용 핸들러 사용
                                required // 필수로 선택
                            >
                                <option value="">선택</option>
                                {positions.map((pos) => (
                                    <option key={pos.positionId} value={pos.positionId}>
                                        {pos.positionName}
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
                
            </form>

            {/* 버튼들은 <form> 밖에 있어야 UI가 안 깨지는 경우 */}
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

        </div>
    );
};

export default PeopleNewPage;