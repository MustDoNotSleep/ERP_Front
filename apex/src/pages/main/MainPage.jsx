import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Historical from '../../img/historical.png';
import User from '../../img/user.png';
import MyCalendar from '../../components/myCalendar/MyCalendar.jsx';
import './MainPage.css';
import { Link } from 'react-router-dom';

const fetchRecommendedEmployees = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        // cert 팀
        // { id: 1, name: '최사원', reason: '침해 경보 조기 식별·오탐 25% 감소' },
        // { id: 2, name: '윤대리', reason: '신규 위협 5건 탐지, 탐지 스크립트 개발' },
        // { id: 3, name: '홍선임', reason: '악성코드 분석·IOC 공유로 대응속도 2배 향상' },
        //인사팀
        { id: 1, name: '최사원', reason: '원활한 노사 소통 채널 구축 및 갈등 예방 기여' },
        { id: 2, name: '윤대리', reason: '타 부서 협업 및 프로세스 효율화' },
        { id: 3, name: '홍선임', reason: '우수 인재 육성 및 채용 브랜딩 기여' },
      ]);
    }, 1500);
  });
};

function MainPage() {
  // --- 모든 State와 Effect를 MainPage 최상단으로 통합 ---
  const [userInfo, setUserInfo] = useState({ name: '비회원', employmentType: '정보 없음', team: '정보 없음' });

  // 1. 출퇴근 상태 관리 (변수명 컨벤션에 맞게 수정: SetIsOn -> setIsOn)
  const [isOn, setIsOn] = useState(false);

  // 2. 현재 시간 상태 관리
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // 3. 추천 직원 목록 상태 관리 (❗ RecommendationWidget에서 이동)
  const [employees, setEmployees] = useState([]);

  //4. ai 추천 로딩 상태 관리
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);


  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);

        // 🚨 중요: teamName (API key)을 team (state key)으로 매핑하여 저장
        setUserInfo({
          name: user.name || '알 수 없음',
          employmentType: user.employmentType || '직책정보 없음',
          team: user.teamName || '팀 정보 없음', // 👈 API 응답의 teamName 키 사용
        });
      } catch (e) {
        console.error('로컬 스토리지 사용자 정보 파싱 오류:', e);
      }
    } else {
      console.warn('로컬 스토리지에 사용자 정보가 없습니다. (로그인 필요)');
    }
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  
  // 시간 업데이트를 위한 useEffect
  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  // 추천 직원 데이터를 불러오기 위한 useEffect (❗ RecommendationWidget에서 이동)
  // useEffect(() => {
  //   fetchRecommendedEmployees().then(data => {
  //     setEmployees(data);
  //   });
  // }, []);

  // 시간을 포맷팅하는 함수
  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  // ai 포상추천 버튼 클릭 핸들러
  const handleAiRecommandClick = () => {
    setIsLoadingRecommendations(true); //로딩 시작
    setEmployees([]); // 이전 목록 초기화
    
    fetchRecommendedEmployees()
    .then(data => {
      setEmployees(data); //데이터 설정
    })
    .finally(()=> {
      setIsLoadingRecommendations(false); // 로딩 종료
    })
  }

  return (
    <div className="common-wrap">
      <div className="dashboard-container">
        {/* ... user-profile, calendar 위젯 ... */}
        <div className="left-column-wrapper">
          <div className="widget user-profile">
            <img src={User} alt="user profile" className="profile-image" />
            <div className="profile-info">
              <h3>{userInfo.name} 님</h3>
              <div className='user-info'>
                <p>{userInfo.employmentType} </p>
                <p className='user-line'>|</p>
                <p>{userInfo.team}</p>
              </div>
            </div>
            <div className='myinfo-btn'>
              <Link to="/myinfo"><p>MY INFO</p></Link>
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
              <button className='on-btn' onClick={() => {
                setIsOn(true); toast.success(
                  <div style={{ textAlign: 'center', width : '100%' }}>
                    <div>{`[${formatTime(currentTime)}]`}</div>
                    <div>정상적으로 출근 처리되었습니다.</div>
                  </div>
                );
              }}>ON</button>
              <button className='off-btn' onClick={() => {
                setIsOn(false); toast.info(
                  <div style={{ textAlign: 'center', width : '100%' }}>
                    <div>{`[${formatTime(currentTime)}]`}</div>
                    <div>정상적으로 퇴근 처리되었습니다.</div>
                  </div>
                );
              }}>OFF</button>
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

          {/* 목록 영역을 div로 감싸고 조건부 랜더링 적용 */}
          <div className='recommendation-content-area'>
            {isLoadingRecommendations ? (
              <div className='recommandation-loading'>
                AI가 데이터를 분석 중입니다...
              </div>
            ): (
              employees.length > 0 ? (
              //1. 로딩이 끝났고 데이터가 있을 때
              <ul className="recommendation-list">
                {/* 이제 employees state에 정상적으로 접근 가능 */}
                {employees.map(employee => (
                  <li key={employee.id} className="employee-item">
                    <span className="employee-name">{employee.name}</span>
                    <span className="recommendation-reason">{employee.reason}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className='recommandation-placeholder'>
                버튼을 눌러 AI 추천을 받아보세요!
              </div>
            )
            )}
          </div>
          
          <button className="ai-recommend-btn"
          onClick={handleAiRecommandClick} //클릭 핸들러 연결
          disabled={isLoadingRecommendations} // 로딩 중일 때 버튼 비활성화
          >
            {/* 로딩 상태에 따라 버튼 텍스트 변경 */}
            {isLoadingRecommendations ? 'AI 포상 추천' : 'AI 포상 추천'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
