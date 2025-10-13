import React from 'react';
import './style/Login.css';
import { useNavigate } from 'react-router-dom';
import Logo from './img/logo.svg';

function Login({ setIsLoggedIn }) {
    const navigate = useNavigate();

    const handleLogin = () => {
        // 실제 아이디/비밀번호 확인 로직
        setIsLoggedIn(true);
        navigate('/');
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
            <input type="text" placeholder="username@apex.com"/>
        </div>
        <div className="password">
            <input type="password" placeholder="password"/>
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