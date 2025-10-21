import React, { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import Logo from '../../img/logo.svg';
import api from '../../api/axios';

function Login({ setIsLoggedIn }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleLogin = async () => {
    try {
      const response = await api.post(
        'https://xtjea0rsb6.execute-api.ap-northeast-2.amazonaws.com/dev/login',
        { email, password },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const { token, user } = response.data;

      if (!token) {
        setError('서버에서 토큰을 받지 못했습니다.');
        return;
      }

      const userToStore = {
        employeeId: user.employeeId,
        name: user.name,
        employmentType: '사원', // 임시 설정
        teamName: user.teamName,
        //... 기타 필요한 정보
      };

      // ✅ 토큰 및 유저 정보 저장
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userToStore));

      // ✅ 로그인 상태 true로 변경
      setIsLoggedIn(true);

      // ✅ 에러 초기화 후 메인 페이지로 이동
      setError('');
      navigate('/');
    } catch (err) {
      console.error('로그인 오류:', err);

      if (err.response) {
        setError(err.response.data.error || '로그인 실패');
      } else {
        setError('서버와의 통신에 실패했습니다.');
      }
    }
  };

  return (
    <div className="login-wrap">
        <div className="login-logo">
            <img src={Logo} alt="logo"/>
            <div className="logo-txt">
                APEX
            </div>
        </div>
        <div className="apex-email">
            <input 
                type="text" 
                placeholder="ex) username@apex.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
        </div>
        <div className="password">
            <input 
                type="password" 
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
            />
        </div>
        <div className="stay-login">
            <input type="checkbox" id="login-check"/>
            <label htmlFor="login-check"><span>Stay Logged In</span></label>
        </div>

        <button className="login-btn" onClick={handleLogin}>
            LOGIN
        </button>
        
        <div className="other-wrap">
            <div className="left-line"></div><p>Other</p><div className="right-line"></div>
        </div>
        <div className="find-pw">비밀번호 찾기 &gt;</div>
    </div>
  );
}

export default Login;