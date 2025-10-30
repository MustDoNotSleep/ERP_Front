import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../img/logo.svg';
import { login } from '../../api/auth';
import './login.css';

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    // 입력 검증
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await login(email, password);

      console.log('로그인 성공:', response);

      // ✅ 로그인 상태 true로 변경
      setIsLoggedIn(true);

      // ✅ 메인 페이지로 이동
      navigate('/');
    } catch (err) {
      console.error('로그인 오류:', err);

      if (err.response) {
        // 서버 응답이 있는 경우
        if (err.response.status === 401) {
          setError('이메일 또는 비밀번호가 올바르지 않습니다.');
        } else if (err.response.status === 500) {
          setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } else {
          setError(err.response.data.message || '로그인에 실패했습니다.');
        }
      } else if (err.request) {
        // 요청은 보냈지만 응답이 없는 경우
        setError('서버와의 통신에 실패했습니다. 네트워크를 확인해주세요.');
      } else {
        // 그 외 에러
        setError('로그인 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Enter 키 입력 시 로그인
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-logo">
        <img src={Logo} alt="logo" />
        <div className="logo-txt">APEX</div>
      </div>

      <div className="apex-email">
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
      </div>

      <div className="password">
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
      </div>

      <div className="stay-login">
        <input type="checkbox" id="login-check" />
        <label htmlFor="login-check">
          <span>Stay Logged In</span>
        </label>
      </div>

      <button 
        className="login-btn" 
        onClick={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? '로그인 중...' : 'LOGIN'}
      </button>

      <div className="other-wrap">
        <div className="left-line"></div>
        <p>Other</p>
        <div className="right-line"></div>
      </div>

      <div className="find-pw">비밀번호 찾기 &gt;</div>

      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

export default Login;