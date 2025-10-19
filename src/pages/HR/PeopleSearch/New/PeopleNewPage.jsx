import React, { useState } from 'react';
// ✨ 1. 비밀번호 아이콘 import (이게 빠지면 기능이 사라집니다)
import { FaEye, FaEyeSlash } from "react-icons/fa";
// 이 페이지 전용 스타일
import styles from "./PeopleNewPage.module.css"; 

// ✨ 2. 폼의 "빈" 상태 (이게 []가 아니면 2개가 보일 수 있습니다)
const emptyFormData = {
    // 1. 기본정보
    basicInfo: {
        nameKo: '', nameEn: '', nationality: '내국인', employeeId: '',
        residentNumber: '', phone: '', email: '', joinDate: '',
        address: '', familyFile: null, addressDetail: '',
    },
    // 2. 병역여부
    militaryInfo: {
        status: '', branch: '', rank: '', specialty: '',
        startDate: '', endDate: '', unservedReason: '해당없음',
    },
    // 3. 학력 (반드시 빈 배열 [] 이어야 합니다)
    educationHistory: [],
    // 4. 경력 (반드시 빈 배열 [] 이어야 합니다)
    careerHistory: [],
    // 5. 자격면허 (반드시 빈 배열 [] 이어야 합니다)
    certifications: [],
    // 6. 급여정보
    salaryInfo: {
        bank: '', accountNumber: '', monthlyBase: '',
    },
    // 7. 회사정보
    companyInfo: {
        department: '', team: '', position: '', employmentType: '계약직',
        username: '', extension: '', passwordType: 'auto', password: '',
    },
};

// '추가' 버튼 클릭 시 사용할 빈 템플릿
const emptyEducation = { school: '', degree: '', major: '', admissionDate: '', graduationDate: '', status: '' };
const emptyCareer = { company: '', department: '', position: '', joinDate: '', leaveDate: '', finalSalary: '' };
const emptyCertification = { name: '', issuer: '', score: '', issueDate: '', expiryDate: '' };


const PeopleNewPage = () => {
    
    const [formData, setFormData] = useState(emptyFormData);
    // ✨ 3. 비밀번호 상태 (이게 빠지면 기능이 사라집니다)
    const [showPassword, setShowPassword] = useState(false);

    // --- ✨ 4. 모든 핸들러 함수들 (이게 빠지면 기능이 사라집니다) ---
    
    const handleInputChange = (e, section) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [name]: value
            }
        }));
    };

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
    
    const addListItem = (listName) => {
        let newItem;
        if (listName === 'educationHistory') newItem = emptyEducation;
        else if (listName === 'careerHistory') newItem = emptyCareer;
        else if (listName === 'certifications') newItem = emptyCertification;
        else return;

        setFormData(prev => ({
            ...prev,
            [listName]: [...prev[listName], { ...newItem }]
        }));
    };
    
    const removeListItem = (listName, index) => {
        setFormData(prev => ({
            ...prev,
            [listName]: prev[listName].filter((_, i) => i !== index)
        }));
    };
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                basicInfo: {
                    ...prev.basicInfo,
                    familyFile: file.name 
                }
            }));
        }
    };
    
    const toggleShowPassword = () => {
        setShowPassword(prev => !prev);
    };

    const handleSubmit = (e) => {
        e.preventDefault(); 
        console.log('🧑‍💻 신규 직원 등록 데이터:', formData);
        alert('신규 직원이 등록되었습니다.');
        setFormData(emptyFormData);
    };

    const handleCancel = () => {
        console.log('등록 취소');
        setFormData(emptyFormData);
    };


    // --- 5. JSX 렌더링 ---
    return (
        <div className={styles.pageContainer}>
            
            <div className={styles.titleBar}>
                <h1>신규 직원 등록</h1>
            </div>

            <form className={styles.formContentArea} onSubmit={handleSubmit}>
                
                {/* --- 1. 기본정보 --- */}
                <section className={styles.formSection}>
                    <h2 className={styles.sectionTitle}>기본정보</h2>
                    <div className={styles.gridContainer}>
                        <div className={styles.inputGroup}><label>성명(국문)</label><input type="text" name="nameKo" value={formData.basicInfo.nameKo} onChange={(e) => handleInputChange(e, 'basicInfo')} required /></div>
                        <div className={styles.inputGroup}><label>성명(영문)</label><input type="text" name="nameEn" value={formData.basicInfo.nameEn} onChange={(e) => handleInputChange(e, 'basicInfo')} /></div>
                        <div className={styles.inputGroup}><label>성별(국적)</label><select name="nationality" value={formData.basicInfo.nationality} onChange={(e) => handleInputChange(e, 'basicInfo')}><option value="내국인">내국인</option><option value="외국인">외국인</option></select></div>
                        <div className={styles.inputGroup}><label>사원번호</label><input type="text" name="employeeId" value={formData.basicInfo.employeeId} onChange={(e) => handleInputChange(e, 'basicInfo')} required /></div>
                        <div className={styles.inputGroup}><label>연락처</label><input type="tel" name="phone" value={formData.basicInfo.phone} onChange={(e) => handleInputChange(e, 'basicInfo')} placeholder="010-1234-5678" /></div>
                        <div className={styles.inputGroup}><label>주민등록번호</label><input type="text" name="residentNumber" value={formData.basicInfo.residentNumber} onChange={(e) => handleInputChange(e, 'basicInfo')} placeholder="001010-xxxxxxx" /></div>
                        <div className={styles.inputGroup}><label>입사일자</label><input type="date" name="joinDate" value={formData.basicInfo.joinDate} onChange={(e) => handleInputChange(e, 'basicInfo')} /></div>
                        <div className={styles.inputGroup}><label>이메일</label><input type="email" name="email" value={formData.basicInfo.email} onChange={(e) => handleInputChange(e, 'basicInfo')} /></div>
                        <div className={styles.inputGroup}><label>주소</label><input type="text" name="address" value={formData.basicInfo.address} onChange={(e) => handleInputChange(e, 'basicInfo')} /></div>
                        <div className={styles.inputGroup}><label>상세주소</label><input type="text" name="addressDetail" value={formData.basicInfo.addressDetail} onChange={(e) => handleInputChange(e, 'basicInfo')} /></div>
                        <div className={styles.inputGroup}><label>가족관계증명서</label><div className={styles.fileInputBox}><input type="text" readOnly value={formData.basicInfo.familyFile || ''} placeholder="파일을 선택하세요" /><label className={styles.fileUploadButton}>파일 찾기<input type="file" onChange={handleFileChange} style={{ display: 'none' }} /></label></div></div>
                    </div>
                </section>

                {/* --- 2. 병역여부 (드롭다운) --- */}
                <section className={styles.formSection}>
                    <h2 className={styles.sectionTitle}>병역여부</h2>
                    <div className={styles.gridContainer}>
                        <div className={styles.inputGroup}>
                            <label>병역구분</label>
                            <select name="status" value={formData.militaryInfo.status} onChange={(e) => handleInputChange(e, 'militaryInfo')}>
                                <option value="">선택</option>
                                <option value="군필">군필</option>
                                <option value="미필">미필</option>
                                <option value="면제">면제</option>
                            </select>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>군별</label>
                            <select name="branch" value={formData.militaryInfo.branch} onChange={(e) => handleInputChange(e, 'militaryInfo')}>
                                <option value="">선택</option>
                                <option value="육군">육군</option>
                                <option value="해군">해군</option>
                                <option value="공군">공군</option>
                                <option value="해병대">해병대</option>
                            </select>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>계급</label>
                            <select name="rank" value={formData.militaryInfo.rank} onChange={(e) => handleInputChange(e, 'militaryInfo')}>
                                <option value="">선택</option>
                                <option value="이등병">이등병</option>
                                <option value="일병">일병</option>
                                <option value="상병">상병</option>
                                <option value="병장">병장</option>
                                <option value="하사">하사</option>
                                <option value="중사">중사</option>
                                <option value="상사">상사</option>
                                <option value="소위">소위</option>
                                <option value="중위">중위</option>
                                <option value="대위">대위</option>
                            </select>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>병과</label>
                            <select name="specialty" value={formData.militaryInfo.specialty} onChange={(e) => handleInputChange(e, 'militaryInfo')}>
                                <option value="">선택</option>
                                <option value="보병">보병</option>
                                <option value="포병">포병</option>
                                <option value="공병">공병</option>
                                <option value="통신">통신</option>
                                <option value="의무">의무</option>
                            </select>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>복무시작일</label>
                            <input type="date" name="startDate" value={formData.militaryInfo.startDate} onChange={(e) => handleInputChange(e, 'militaryInfo')} />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>복무종료일</label>
                            <input type="date" name="endDate" value={formData.militaryInfo.endDate} onChange={(e) => handleInputChange(e, 'militaryInfo')} />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>미필여부</label>
                            <select name="unservedReason" value={formData.militaryInfo.unservedReason} onChange={(e) => handleInputChange(e, 'militaryInfo')}>
                                <option value="해당없음">해당없음</option>
                                <option value="입영대기">입영대기</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* --- 3. 학력 --- */}
                <section className={styles.formSection}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>학력</h2>
                        <button type="button" className={styles.addButton} onClick={() => addListItem('educationHistory')}>추가</button>
                    </div>
                    {/* ✨ 5. .map() 기능 (이게 있어야 추가/삭제가 됩니다) */}
                    {formData.educationHistory.map((edu, index) => (
                        <div key={index} className={styles.listGridContainer}>
                            <div className={styles.inputGroup}><label>학교명</label><input type="text" name="school" value={edu.school} onChange={(e) => handleListChange(e, 'educationHistory', index)} /></div>
                            <div className={styles.inputGroup}><label>학위</label><select name="degree" value={edu.degree} onChange={(e) => handleListChange(e, 'educationHistory', index)}><option value="">선택</option><option value="학사">학사</option><option value="석사">석사</option><option value="박사">박사</option><option value="고졸">고졸</option></select></div>
                            <div className={styles.inputGroup}><label>전공</label><input type="text" name="major" value={edu.major} onChange={(e) => handleListChange(e, 'educationHistory', index)} /></div>
                            <div className={styles.inputGroup}><label>입학일자</label><input type="date" name="admissionDate" value={edu.admissionDate} onChange={(e) => handleListChange(e, 'educationHistory', index)} /></div>
                            <div className={styles.inputGroup}><label>졸업일자</label><input type="date" name="graduationDate" value={edu.graduationDate} onChange={(e) => handleListChange(e, 'educationHistory', index)} /></div>
                            <div className={styles.inputGroup}><label>졸업여부</label><select name="status" value={edu.status} onChange={(e) => handleListChange(e, 'educationHistory', index)}><option value="">선택</option><option value="졸업">졸업</option><option value="재학">재학</option><option value="휴학">휴학</option><option value="중퇴">중퇴</option></select></div>
                            <button type="button" className={styles.removeButton} onClick={() => removeListItem('educationHistory', index)}>삭제</button>
                        </div>
                    ))}
                </section>

                {/* --- 4. 경력 --- */}
                <section className={styles.formSection}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>경력</h2>
                        <button type="button" className={styles.addButton} onClick={() => addListItem('careerHistory')}>추가</button>
                    </div>
                    {formData.careerHistory.map((career, index) => (
                        <div key={index} className={styles.listGridContainer}>
                            <div className={styles.inputGroup}><label>근무처</label><input type="text" name="company" value={career.company} onChange={(e) => handleListChange(e, 'careerHistory', index)} /></div>
                            <div className={styles.inputGroup}><label>담당업무</label><input type="text" name="department" value={career.department} onChange={(e) => handleListChange(e, 'careerHistory', index)} /></div>
                            <div className={styles.inputGroup}><label>최종직위</label><input type="text" name="position" value={career.position} onChange={(e) => handleListChange(e, 'careerHistory', index)} /></div>
                            <div className={styles.inputGroup}><label>입사일</label><input type="date" name="joinDate" value={career.joinDate} onChange={(e) => handleListChange(e, 'careerHistory', index)} /></div>
                            <div className={styles.inputGroup}><label>퇴직일</label><input type="date" name="leaveDate" value={career.leaveDate} onChange={(e) => handleListChange(e, 'careerHistory', index)} /></div>
                            <div className={styles.inputGroup}><label>최종연봉</label><input type="text" name="finalSalary" value={career.finalSalary} onChange={(e) => handleListChange(e, 'careerHistory', index)} /></div>
                            <button type="button" className={styles.removeButton} onClick={() => removeListItem('careerHistory', index)}>삭제</button>
                        </div>
                    ))}
                </section>

                {/* --- 5. 자격면허 --- */}
                <section className={styles.formSection}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>자격면허</h2>
                        <button type="button" className={styles.addButton} onClick={() => addListItem('certifications')}>추가</button>
                    </div>
                    {formData.certifications.map((cert, index) => (
                        <div key={index} className={styles.listGridContainer}>
                            <div className={styles.inputGroup}><label>자격증명</label><input type="text" name="name" value={cert.name} onChange={(e) => handleListChange(e, 'certifications', index)} /></div>
                            <div className={styles.inputGroup}><label>발급기관</label><input type="text" name="issuer" value={cert.issuer} onChange={(e) => handleListChange(e, 'certifications', index)} /></div>
                            <div className={styles.inputGroup}><label>점수</label><input type="text" name="score" value={cert.score} onChange={(e) => handleListChange(e, 'certifications', index)} /></div>
                            <div className={styles.inputGroup}><label>취득일</label><input type="date" name="issueDate" value={cert.issueDate} onChange={(e) => handleListChange(e, 'certifications', index)} /></div>
                            <div className={styles.inputGroup}><label>유효일</label><input type="date" name="expiryDate" value={cert.expiryDate} onChange={(e) => handleListChange(e, 'certifications', index)} /></div>
                            <div></div> 
                            <button type="button" className={styles.removeButton} onClick={() => removeListItem('certifications', index)}>삭제</button>
                        </div>
                    ))}
                </section>

                {/* --- 6. 급여정보 --- */}
                <section className={styles.formSection}>
                    <h2 className={styles.sectionTitle}>급여정보</h2>
                    <div className={styles.gridContainer}>
                        <div className={styles.inputGroup}><label>은행명</label><input type="text" name="bank" value={formData.salaryInfo.bank} onChange={(e) => handleInputChange(e, 'salaryInfo')} /></div>
                        <div className={styles.inputGroup}><label>계좌번호</label><input type="text" name="accountNumber" value={formData.salaryInfo.accountNumber} onChange={(e) => handleInputChange(e, 'salaryInfo')} /></div>
                        <div className={styles.inputGroup}><label>월기본급</label><input type="text" name="monthlyBase" value={formData.salaryInfo.monthlyBase} onChange={(e) => handleInputChange(e, 'salaryInfo')} /></div>
                    </div>
                </section>

                {/* --- 7. 회사정보 (드롭다운) --- */}
                <section className={styles.formSection}>
                    <h2 className={styles.sectionTitle}>회사정보</h2>
                    <div className={styles.gridContainer}>
                        <div className={styles.inputGroup}>
                            <label>소속부서</label>
                            <select name="department" value={formData.companyInfo.department} onChange={(e) => handleInputChange(e, 'companyInfo')}>
                                <option value="">선택</option>
                                <option value="경영기획본부">경영기획본부</option>
                                <option value="침해사고대응본부">침해사고대응본부</option>
                                <option value="자율보안본부">자율보안본부</option>
                                <option value="보안연구본부">보안연구본부</option>
                            </select>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>소속팀</label>
                            <select name="team" value={formData.companyInfo.team} onChange={(e) => handleInputChange(e, 'companyInfo')}>
                                <option value="">선택</option>
                                <option value="보안관제팀">보안관제팀</option>
                                <option value="침해사고대응팀">침해사고대응팀</option>
                                <option value="CERT팀">CERT팀</option>
                                <option value="모의해킹">모의해킹팀</option>
                            </select>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>직급</label>
                            <select name="position" value={formData.companyInfo.position} onChange={(e) => handleInputChange(e, 'companyInfo')}>
                                <option value="">선택</option>
                                <option value="사원">사원</option>
                                <option value="대리">대리</option>
                                <option value="과장">과장</option>
                                <option value="차장">차장</option>
                                <option value="부장">부장</option>
                            </select>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>고용형태</label>
                            <select name="employmentType" value={formData.companyInfo.employmentType} onChange={(e) => handleInputChange(e, 'companyInfo')}>
                                <option value="정규직">정규직</option>
                                <option value="계약직">계약직</option>
                                <option value="인턴">인턴</option>
                            </select>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Username</label>
                            <input type="text" name="username" value={formData.companyInfo.username} onChange={(e) => handleInputChange(e, 'companyInfo')} />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>내선번호</label>
                            <input type="text" name="extension" value={formData.companyInfo.extension} onChange={(e) => handleInputChange(e, 'companyInfo')} />
                        </div>
                        
                        
                        {/* ✨ 6. 비밀번호 토글 기능 (이게 빠지면 안됩니다) */}
                        <div className={`${styles.inputGroup} ${styles.spanThree}`}>
                            <label>비밀번호</label>
                            <div className={styles.passwordOptionsContainer}>
                                <div className={styles.radioGroupCustom}>
                                    <label>
                                        <input type="radio" name="passwordType" value="auto" 
                                            checked={formData.companyInfo.passwordType === 'auto'} 
                                            onChange={(e) => handleInputChange(e, 'companyInfo')} 
                                        /> 자동생성
                                    </label>
                                    <label>
                                        <input type="radio" name="passwordType" value="admin" 
                                            checked={formData.companyInfo.passwordType === 'admin'} 
                                            onChange={(e) => handleInputChange(e, 'companyInfo')} 
                                        /> 관리자가 등록
                                    </label>
                                </div>
                                
                                {formData.companyInfo.passwordType === 'admin' && (
                                    <div className={styles.adminPasswordWrapper}>
                                        <div className={styles.passwordInputWrapper}>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                placeholder="********"
                                                value={formData.companyInfo.password}
                                                onChange={(e) => handleInputChange(e, 'companyInfo')}
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
                
            </form> {/* formContentArea 끝 */}

            {/* [레이아웃 4] 하단 액션 버튼 */}
            <div className={styles.actionBar}>
                <button type="button" className={styles.cancelButton} onClick={handleCancel}>
                    취소
                </button>
                <button type="submit" className={styles.saveButton} onClick={handleSubmit}>
                    저장
                </button>
            </div>

        </div> // pageContainer 끝
    );
};

export default PeopleNewPage;