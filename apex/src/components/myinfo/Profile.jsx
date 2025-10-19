import React, {useState, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import User from '../../img/user.png'

function Profile() {
 // 1. 사진 변경을 위한 상태 및 참조
    const [imagePreview, setImagePreview] = useState(User); 
    const fileInputRef = useRef(null);
    
    // ... (cardRef, navigate, password states...)

    /**
    * 1. '사진 변경' 버튼 클릭 시, 숨겨진 file input을 클릭
    */
    const handlePhotoClick = () => {
        fileInputRef.current.click();
    };

    // [추가] 1-1. 파일이 실제로 선택되었을 때 실행
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // 선택된 파일을 URL로 변환하여 미리보기 상태 업데이트
        setImagePreview(URL.createObjectURL(file));
        // (실제 기능) 여기서 file 객체를 서버로 업로드하는 로직을 추가
      }
    };

    const navigate = useNavigate();
    // 비밀번호 상태 관리
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // 오류 메시지 상태 관리
    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    //성공 메시지 상태
    const [successMessage, setSuccessMessage] = useState('');

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
    const handleSubmitPasswordChange = () => {
        // 1. 먼저 유효성 검사를 수동으로 한 번 더 실행
        const isNewValid = validateNewPassword(newPassword);
        const isConfirmValid = validateConfirmPassword(confirmPassword);

        // 2. 오류가 있거나, 새 비밀번호가 입력되지 않았으면 중단
        if (!newPassword || !isNewValid || !isConfirmValid) {
        // (필요시) '비밀번호를 입력하세요' 같은 추가 오류 처리
            return; 
        }
        // 3. (가상) API 통신 성공!
        console.log("API: 비밀번호 변경 성공");

        // 4. 성공 상태 업데이트
        setSuccessMessage('비밀번호가 변경되었습니다.');
        
        // 5. 기존 오류 및 입력 필드 초기화
        setNewPassword('');
        setConfirmPassword('');
        setNewPasswordError('');
        setConfirmPasswordError('');

        // 6. 3초 뒤에 성공 메시지 자동으로 지우기
        setTimeout(() => {
        setSuccessMessage('');
        }, 3000);
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
                        <button className='change-photo' onClick={handlePhotoClick}>사진 변경</button>
                        <input type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept='image/*'
                        style={{display:'none'}}
                         />
                    </div>
                    <div className='form-fields-area'>
                        <div className='form-field'>
                            <label htmlFor="name" className='form-txt'>이름</label>
                            <input type="text" id='name' value='정관리' readOnly />
                        </div>
                        <div className='form-field'>
                            <label htmlFor="birthdate" className='form-txt'>생년월일</label>
                            <input type="text" id='birthdate' value='19xx.xx.xx' readOnly />
                        </div>
                        <div className='form-field'>
                            <label htmlFor="department" className='form-txt'>부서</label>
                            <input type="text" id='department' value='침해사고대응본부' readOnly />
                        </div>
                        <div className='form-field'>
                            <label htmlFor="employeeId" className='form-txt'>사원번호</label>
                            <input type="text" id='employeeId' value='1234567' readOnly />
                        </div>
                        <div className='form-field'>
                            <label htmlFor="team" className='form-txt'>소속</label>
                            <input type="text" id='team' value='CERT 팀' readOnly />
                        </div>
                        <div className='form-field'>
                            <label htmlFor="extension" className='form-txt'>내선번호</label>
                            <input type="text" id='extention' value='123-4567' readOnly />
                        </div>
                        <div className='form-field'>
                            <label htmlFor="email" className='form-txt'>이메일</label>
                            <input type="text" id='email' value='rhksfl01@apex.com' readOnly />
                        </div>
                        <div className='form-field'>
                            <label htmlFor="phone" className='form-txt'>전화번호</label>
                            <input type="text" id='phone' value='010-1234-1234' readOnly />
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
                            <input type="password" id='current-pw' value="********" readOnly/>
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