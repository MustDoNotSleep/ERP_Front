import React, { useState, useEffect } from 'react';
import Historical from './img/historical.png';
import User from './img/user.png';
import MyCalendar from './components/MyCalendar.jsx';
import './style/MainPage.css';
//import { Link } from 'react-router-dom';

const fetchRecommendedEmployees = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: '최사원', reason: '침해 경보 조기 식별·오탐 25% 감소' },
        { id: 2, name: '윤대리', reason: '신규 위협 5건 탐지, 탐지 스크립트 개발' },
        { id: 3, name: '홍선임', reason: '악성코드 분석·IOC 공유로 대응속도 2배 향상' },
      ]);
    }, 500);
  });
};

function MainPage() {
  // --- 모든 State와 Effect를 MainPage 최상단으로 통합 ---

  // 1. 출퇴근 상태 관리 (변수명 컨벤션에 맞게 수정: SetIsOn -> setIsOn)
  const [isOn, setIsOn] = useState(false);

  // 2. 현재 시간 상태 관리
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // 3. 추천 직원 목록 상태 관리 (❗ RecommendationWidget에서 이동)
  const [employees, setEmployees] = useState([]);

  // 시간 업데이트를 위한 useEffect
  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  // 추천 직원 데이터를 불러오기 위한 useEffect (❗ RecommendationWidget에서 이동)
  useEffect(() => {
    fetchRecommendedEmployees().then(data => {
      setEmployees(data);
    });
  }, []);

  // 시간을 포맷팅하는 함수
  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="common-wrap">
      <div className="dashboard-container">
        {/* ... user-profile, calendar 위젯 ... */}
        <div className="left-column-wrapper">
          <div className="widget user-profile">
            <img src={User} alt="user profile" className="profile-image" />
            <div className="profile-info">
              <h3>정관리 님</h3>
              <div className='user-info'>
                <p>부장</p>
                <p className='user-line'>|</p>
                <p>CERT 팀</p>
              </div>
            </div>
            <div className='myinfo-btn'>
              <button>MY INFO</button>
            </div>
          </div>
          <div className="widget calendar">
            <MyCalendar />
          </div>
        </div>

        <div className="widget clock">
          <h3>출퇴근 &gt;</h3>
          <div className='clock-cont'>
            <div className={`status-icon ${isOn ? 'on' : 'off'}`}>
              <img src={Historical} alt="historical" />
              <span>{isOn ? 'ON' : 'OFF'}</span>
            </div>
            <div className="clock-time">
              {formatTime(currentTime)}
            </div>
            <div className='onoff-btn'>
              {/* ❗ setIsOn으로 수정 */}
              <button className='on-btn' onClick={() => setIsOn(true)}>ON</button>
              <button className='off-btn' onClick={() => setIsOn(false)}>OFF</button>
            </div>
          </div>
        </div>
        
        <div className="widget approval">
          <h3>결재 문서 &gt;</h3>
          <div className='document-wrap'>
            <div className='approv'>
              <span>대기 문서</span>
              <h2>3</h2>
            </div>
            <div className='approv'>
              <span>예정 문서</span>
              <h2>4</h2>
            </div>
            <div className='approv'>
              <span>공유 문서</span>
              <h2>1</h2>
            </div>
            <div className='approv'>
              <span>수신 문서</span>
              <h2>2</h2>
            </div>  
          </div>
        </div>

        <div className="widget attendance-status">
          <h3>근태 현황 &gt;</h3>
          <div className='attend-wrap'>
            <div className='attend'>
              <span className='attend-txt'>연차/휴가</span>
              <span>3</span>
            </div>
            <div className='attend'>
              <span className='attend-txt'>지각/조퇴</span>
              <span>0</span>
            </div>
            <div className='attend'>
              <span className='attend-txt'>부재</span>
              <span>2</span>
            </div>
            <div className='attend'>
              <span className='attend-txt'>시간외 근무</span>
              <span>1</span>
            </div>
            <div className='attend'>
              <span className='attend-txt'>근무 계획</span>
              <span>2</span>
            </div>
            <div className='attend'>
              <span className='attend-txt'>근무 결과</span>
              <span>1</span>
            </div>
          </div>
        </div>

        <div className="widget remaining-leave">
          <h3>남은 연차 &gt;</h3>
          <div className="leave-content">
            <div className='remain'>
              <div className='re-txt'>
                <span className='num'>10</span>
                <span className='re-txt'>일</span>
                <span className='num'>6</span>
                <span className='re-txt'>시간</span>
                <span className='num'>30</span>
                <span className='re-txt'>분</span>
              </div>
            </div>
            <button className='apply-btn'>연차 신청</button>
          </div>    
        </div>
        
        <div className="widget notice">
          <h3>공지사항 &gt;</h3>
            <ul className="notice-list">
              <li>
                2025.09.30&nbsp;&nbsp; 긴급 서버 점검 안내 <span className="new-badge">[N]</span>
              </li>
              <li>
                2025.10.03&nbsp;&nbsp; 추석 연휴 기간 안내
              </li>
              <li>
                2025.10.03&nbsp;&nbsp; AI 기능 도입 예정 안내
              </li>
            </ul>
            <hr className="divider" />
            <button className="more-btn">더보기</button>
        </div>

        <div className="widget recommendation">
          <h3>우수사원 추천 &gt;</h3>
          <ul className="recommendation-list">
            {/* 이제 employees state에 정상적으로 접근 가능 */}
            {employees.map(employee => (
              <li key={employee.id} className="employee-item">
                <span className="employee-name">{employee.name}</span>
                <span className="recommendation-reason">{employee.reason}</span>
              </li>
            ))}
          </ul>
          <button className="ai-recommend-btn">AI 포상추천</button>
        </div>
      </div>
    </div>
  );
}

export default MainPage;