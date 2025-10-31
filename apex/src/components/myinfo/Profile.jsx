import React, {useState, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import User from '../../img/user.png'
import { fetchEmployeeProfile, updateEmployeePassword } from '../../api/employee.js';

function Profile() {
    const [userInfo, setUserInfo] = useState({
        name: '로딩 중...',
        employeeId: '---',
        positionName: '---', // 직책
        teamName: '---', // 팀
        departmentName: '---', // 부서
        birthDate: 'YYYY.MM.DD',
        internalNumber: '---', // 내선번호
        phoneNumber: '---',
        email: '---',
    });

    const getEmployeeId = () => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                // employeeId 키는 로그인 응답의 user 객체 안에 있다고 가정합니다.
                return JSON.parse(storedUser).employeeId; 
            }
        } catch (e) {
            console.error("Employee ID 로드 실패:", e);
        }
        return null;
    };

    // 🛠️ API GET 호출 함수
    const fetchUserProfile = async () => {
        const employeeId = getEmployeeId();
        if (!employeeId) {
            console.error("로그인된 사용자 ID를 찾을 수 없습니다.");
            setUserInfo(prev => ({ ...prev, name: '로그인 정보 없음' }));
            return;
        }

        try {
            const response = await fetchEmployeeProfile(employeeId);
            
            // API 응답 구조: { success, message, data: { id, name, email, ... } }
            const data = response.data || response;
            
            console.log('📋 프로필 데이터:', data); // 디버깅용
            
            setUserInfo({
                name: data.name || '정보 없음',
                employeeId: data.id || data.employeeId || '---',
                positionName: data.positionName || '사원', 
                teamName: data.teamName || data.departmentName || '팀 정보 없음',
                departmentName: data.departmentName || '부서 정보 없음',
                birthDate: data.birthDate || 'YYYY.MM.DD',
                internalNumber: data.internalNumber || '---',
                phoneNumber: data.phone || data.phoneNumber || '---',
                email: data.email || '---',
            });

        } catch (error) {
            console.error("사용자 프로필 로드 실패:", error);
            setUserInfo(prev => ({ ...prev, name: '데이터 로드 실패' }));
        }
    };
 // 1. 사진 변경을 위한 상태 및 참조
    const [imagePreview, setImagePreview] = useState(User); 
    const fileInputRef = useRef(null);
    
    useEffect(() => {
        fetchUserProfile();
    }, []);
    const handlePhotoClick = () => { fileInputRef.current.click(); };
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setImagePreview(URL.createObjectURL(file));
      }
    };


    const navigate = useNavigate();
    // 비밀번호 상태 관리
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // 오류 메시지 상태 관리
    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    //성공 메시지 상태
    const [successMessage, setSuccessMessage] = useState('');

    const handleCurrentPasswordChange = (e) => {
        setCurrentPassword(e.target.value);
    };

    //새 비밀번호 유효성검사 함수
    const validateNewPassword = (password) => {
        // 8자 이상, 영문, 숫자, 특수문자 포함 정규식
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        
        if (!password) {
        setNewPasswordError('');
        return false;
        }
        if (!passwordRegex.test(password)) {
        setNewPasswordError('8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.');
        return false;
        }
        setNewPasswordError(''); // 유효성 통과
        return true;
    };

    // --- 새 비밀번호 확인 유효성 검사 함수 ---
    const validateConfirmPassword = (confirm) => {
        if (!confirm) {
            setConfirmPasswordError('');
            return false;
        }
        if (newPassword !== confirm) {
        setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
        return false;
        }
        setConfirmPasswordError(''); // 유효성 통과
        return true;
    };

    // --- 새 비밀번호 입력이 변경될 때마다 실행 ---
    const handleNewPasswordChange = (e) => {
        const { value } = e.target;
        setNewPassword(value);
        validateNewPassword(value);
        // 새 비밀번호가 바뀌면, 확인 비밀번호도 다시 검사해야 함
        if(confirmPassword) {
            validateConfirmPassword(confirmPassword);
        }
    };   

    // --- 새 비밀번호 확인 입력이 변경될 때마다 실행 ---
    const handleConfirmPasswordChange = (e) => {
        const { value } = e.target;
        setConfirmPassword(value);
        validateConfirmPassword(value);
    };

    //비밀번호 변경 버튼 클릭 핸들러
    const handleSubmitPasswordChange = async () => { 
        // 1. 먼저 유효성 검사를 수동으로 한 번 더 실행
        const isNewValid = validateNewPassword(newPassword);
        const isConfirmValid = validateConfirmPassword(confirmPassword);

        // 2. 오류가 있거나, 새 비밀번호가 입력되지 않았으면 중단
        if (!currentPassword || !newPassword || !isNewValid || !isConfirmValid) {
            setNewPasswordError('모든 비밀번호 필드를 올바르게 입력해주세요.');
            return; 
        }
        
        // 3. employeeId 가져오기
        const employeeId = getEmployeeId();
        if (!employeeId) {
            setNewPasswordError('사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
            return;
        }
        
        try {
            // ✅ 수정: employeeId, currentPassword, newPassword 모두 전달
            await updateEmployeePassword(employeeId, currentPassword, newPassword);

            // 4. 성공 시 처리
            alert("비밀번호가 변경되었습니다!");
            
            // 5. 필드 초기화
            setCurrentPassword(''); // 현재 비밀번호 필드 초기화
            setNewPassword('');
            setConfirmPassword('');
            setNewPasswordError('');
            setConfirmPasswordError('');
            
        } catch (err) {
            // 🚨 API에서 오류 응답 (예: 현재 비밀번호가 틀림)이 오면 여기에서 처리합니다.
            console.error('비밀번호 변경 오류:', err);
            const errorMessage = err.response?.data?.message || '비밀번호 변경에 실패했습니다. (현재 비밀번호 불일치 등)';
            setNewPasswordError(errorMessage);
            setSuccessMessage('');
        }
        // 6. 3초 뒤에 성공 메시지 자동으로 지우기
        setTimeout(() => {
        setSuccessMessage('');
        }, 5000);
    };

    //다음에 변경하기 버튼 클릭 핸들러
    const handleCancel = () => {
        navigate('/');
    };

    return (
        <div className="profile-container">
            <div className='basic-info-wrap'>
                <h1>기본 정보</h1>
                <div className='info-cont'>
                    <div className='profile-area'>
                        <div className='profile-icon'>
                            <img src={User} alt="user" />
                        </div>
                        {/* [수정] 이미지를 상태(imagePreview)에서 불러옴 */}
                        {/* <img src={imagePreview} alt="user" />  <- 나중에 이걸로 바꾸기*/}
                        {/* <button className='change-photo' onClick={handlePhotoClick}>사진 변경</button>
                        <input type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept='image/*'
                        style={{display:'none'}}
                         /> */}
                    </div>
                    <div className='form-fields-area'>
                        <div className='form-field'>
                            <label htmlFor="name" className='form-txt'>이름</label>
                            <input type="text" id='name' value={userInfo.name} readOnly />
                        </div>
                        <div className='form-field'>
                            <label htmlFor="birthDate" className='form-txt'>생년월일</label>
                            <input type="text" id='birthDate' value={userInfo.birthDate ? userInfo.birthDate.split('T')[0] : ''} readOnly />
                        </div>
                        <div className='form-field'>
                            <label htmlFor="departmentName" className='form-txt'>부서</label>
                            <input type="text" id='departmentName' value={userInfo.departmentName} readOnly />
                        </div>
                        <div className='form-field'>
                            <label htmlFor="employeeId" className='form-txt'>사원번호</label>
                            <input type="text" id='employeeId' value={userInfo.employeeId} readOnly />
                        </div>
                        <div className='form-field'>
                            <label htmlFor="teamName" className='form-txt'>소속</label>
                            <input type="text" id='teamName' value={userInfo.teamName} readOnly />
                        </div>
                        <div className='form-field'>
                            <label htmlFor="internalNumber" className='form-txt'>내선번호</label>
                            <input type="text" id='internalNumber' value={userInfo.internalNumber} readOnly />
                        </div>
                        <div className='form-field'>
                            <label htmlFor="email" className='form-txt'>이메일</label>
                            <input type="text" id='email' value={userInfo.email} readOnly />
                        </div>
                        <div className='form-field'>
                            <label htmlFor="phone" className='form-txt'>전화번호</label>
                            <input type="text" id='phone' value={userInfo.phoneNumber} readOnly />
                        </div>
                    </div>
                </div>
            </div>

            <div className='profile-btn'>
                <button>취소</button>
                <button>저장</button>
            </div>

            <div className='ch-pw-wrap'>
                <h1>비밀번호 변경</h1>
                <div className='ch-pw-cont'>
                    <div className='pw-form-area'>
                        <div className='pw-field-group'>
                            <label htmlFor="current-pw">현재 비밀번호</label>
                            <input type="password" id='current-pw' value={currentPassword} onChange={handleCurrentPasswordChange}/>
                        </div>
                        <div className='pw-field-group'>
                            {/* 새 비밀번호 */}
                            <label htmlFor="new-pw">새 비밀번호</label>
                            <input type="password" id='new-pw' 
                                value={newPassword} onChange={handleNewPasswordChange}
                                //오류가 있으면 'error' 클래스 추가
                                className={newPasswordError ? 'error' : ''}
                            />
                            {/* 오류 메시지가 있으면 표시 */}
                            {newPasswordError && <p className='pw-error-message'>{newPasswordError}</p>}
                        </div>
                        {/* 비밀번호 확인 */}
                        <div className='pw-field-group'>
                            <label htmlFor="confirm-pw">새 비밀번호 확인</label>
                            <input type="password" id='confirm-pw'
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                // 오류가 있으면 error 클래스 추가
                                className={confirmPasswordError ? 'error' : ''}
                            />
                            {/* 오류 메시지가 있으면 표시 */}
                            {confirmPasswordError && <p className='pw-error-message'>{confirmPasswordError}</p>}
                        </div>
                    </div>
                    <div className='pw-action-area'>
                        <p className='pw-info-txt'>
                            회원님의 개인정보를 안전하게 보호하고, 개인정보 도용으로 인한<br/>피해를 예방하기 위해 90일 이상 비밀번호를 변경하지 않을 경우<br/>비밀번호 변경을 권장하고 있습니다.
                        </p>
                        <button className='pw-btn' onClick={handleSubmitPasswordChange}>비밀번호 변경</button>
                        <button className='pw-btn' onClick={handleCancel}>다음에 변경하기</button>
                        {/* 성공 메시지 조건부 랜더링 */}
                        {successMessage && <p className='pw-success-msg'>{successMessage}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;