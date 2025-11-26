import React, { useState, useEffect } from 'react';
import { fetchLeaveBalance } from '../../api/leave';
import { fetchImportantNotices } from '../../api/notice';
import { toast } from 'react-toastify';
import Historical from '../../img/historical.png';
import User from '../../img/user.png';
import MyCalendar from '../../components/myCalendar/MyCalendar.jsx';
import './MainPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { checkIn, checkOut, fetchTodayAttendance } from '../../api/attendance';

// ✅ [수정 1] 실제 API 호출을 위한 axios 인스턴스 import
import api from '../../api/axios'; 

// ✅ [수정 2] 가짜 데이터 함수 삭제 -> 실제 API 호출 함수로 변경
const fetchRecommendedEmployees = async () => {
  try {
    // 백엔드 Controller (/hr/ai/recommend) 호출
    // 파라미터(year, quarter)를 안 보내면 백엔드가 알아서 '오늘 날짜' 기준으로 처리함
    const response = await api.get('/ai/recommend');
    
    // ResponseEntity로 오기 때문에 response.data가 바로 리스트([])임
    return response.data || [];
  } catch (error) {
    console.error("AI 추천 데이터 로드 실패:", error);
    throw error; // 에러를 던져서 버튼 클릭 핸들러에서 잡게 함
  }
};

function MainPage() {
  const navigate = useNavigate();
  
  const [userInfo, setUserInfo] = useState({ 
    name: '비회원', 
    employmentType: '정보 없음', 
    team: '정보 없음',
    employeeId: null 
  });
  
  const [leaveBalance, setLeaveBalance] = useState({
    days: 0,
    hours: 0,
    minutes: 0
  });

  const [isOn, setIsOn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [employees, setEmployees] = useState([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);

  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserInfo({
          name: user.name || '알 수 없음',
          positionName: user.positionName || '직책정보 없음',
          team: user.teamName || '팀 정보 없음',
          employeeId: user.employeeId || null
        });
        
        if (user.employeeId) {
          fetchLeaveBalance(user.employeeId)
            .then(res => {
              if (res.success && res.data) {
                const raw = res.data.remainingAnnualLeave ?? 0;
                const days = Math.floor(raw);
                const hours = Math.round((raw - days) * 8);
                setLeaveBalance({ days, hours, minutes: 0 });
              }
            })
            .catch(err => {
              setLeaveBalance({ days: 0, hours: 0, minutes: 0 });
            });
        }
        
        fetchTodayAttendance()
          .then(res => {
            if (res.success && res.data && res.data.checkInTime && !res.data.checkOutTime) {
              setIsOn(true);
            } else {
              setIsOn(false);
            }
          })
          .catch(() => setIsOn(false));
      } catch (e) {
        console.error('로컬 스토리지 사용자 정보 파싱 오류:', e);
      }
    } else {
      console.warn('로컬 스토리지에 사용자 정보가 없습니다. (로그인 필요)');
    }

    // 중요 공지사항 조회
    fetchImportantNotices()
      .then(res => {
        if (res.success && res.data) {
          setNotices(res.data);
        }
      })
      .catch(err => {
        console.error('공지사항 조회 실패:', err);
      });
  }, []);

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  // ✅ [수정 3] AI 포상추천 버튼 클릭 핸들러 (에러 처리 강화)
  const handleAiRecommandClick = () => {
    setIsLoadingRecommendations(true); 
    setEmployees([]); 
    
    fetchRecommendedEmployees()
    .then(data => {
      setEmployees(data); 
      toast.success("AI가 우수 사원을 추천했습니다!");
    })
    .catch((err) => {
        toast.error("AI 서버 연결에 실패했습니다.");
    })
    .finally(()=> {
      setIsLoadingRecommendations(false); 
    })
  }

  // 나의 위젯 클릭 핸들러
  const handleWidgetClick = (path) => {
    navigate(path);
  };

  // 공지사항 더보기 클릭
  const handleNoticeMoreClick = () => {
    navigate('/notice');
  };

  // 공지사항 클릭 시 상세 페이지로 이동
  const handleNoticeClick = (noticeId) => {
    navigate('/notice', { state: { selectedNoticeId: noticeId } });
  };

  // 날짜 포맷팅 함수
  const formatNoticeDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\. /g, '.').replace(/\.$/, '');
  };

  const handleCheckIn = async () => {
    if (!userInfo.employeeId) {
      toast.error('사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
      return;
    }

    try {
      const response = await checkIn(userInfo.employeeId);
      if (response.success || response.data) {
        setIsOn(true);
        toast.success(
          <div style={{ textAlign: 'center', width: '100%' }}>
            <div>{`[${formatTime(currentTime)}]`}</div>
            <div>{response.message || '정상적으로 출근 처리되었습니다.'}</div>
          </div>
        );
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || '출근 처리에 실패했습니다.';
      if (errorMessage.includes('이미 출근') || errorMessage.includes('already checked in')) {
        toast.warning('이미 출근 처리되었습니다.');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const handleCheckOut = async () => {
    if (!userInfo.employeeId) {
      toast.error('사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
      return;
    }

    try {
      const response = await checkOut(userInfo.employeeId);
      if (response.success || response.data) {
        setIsOn(false);
        toast.info(
          <div style={{ textAlign: 'center', width: '100%' }}>
            <div>{`[${formatTime(currentTime)}]`}</div>
            <div>{response.message || '정상적으로 퇴근 처리되었습니다.'}</div>
          </div>
        );
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || '퇴근 처리에 실패했습니다.';
      if (errorMessage.includes('이미 퇴근') || errorMessage.includes('already checked out')) {
        toast.warning('이미 퇴근 처리되었습니다.');
      } else if (errorMessage.includes('출근 기록') || errorMessage.includes('check-in record')) {
        toast.error('출근 기록이 없습니다. 먼저 출근 처리를 해주세요.');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="common-wrap">
      <div className="dashboard-container">
        {/* 좌측 컬럼 (프로필, 달력) */}
        <div className="left-column-wrapper">
          <div className="widget user-profile">
            <img src={User} alt="user profile" className="profile-image" />
            <div className="profile-info">
              <h3>{userInfo.name} 님</h3>
              <div className='user-info'>
                <p>{userInfo.positionName} </p> 
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

        {/* 출퇴근 위젯 */}
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
              <button className='on-btn' onClick={handleCheckIn} disabled={isOn}>ON</button>
              <button className='off-btn' onClick={handleCheckOut} disabled={!isOn}>OFF</button>
            </div>
          </div>
        </div>
        
        {/* 우수사원 추천 위젯 */}
        <div className="widget recommendation">
          <h3>우수사원 추천 &gt;</h3>

          <div className='recommendation-content-area'>
            {isLoadingRecommendations ? (
              <div className='recommandation-loading'>
                AI가 데이터를 분석 중입니다...<br/>(약 3~5초 소요)
              </div>
            ): (
              employees.length > 0 ? (

              <ul className="recommendation-list">
                {employees.map(employee => (
                  // 백엔드 DTO는 id가 없고 rank를 줍니다. key로 rank 사용
                  <li key={employee.rank} className="employee-item">
                    {/* 이름 옆에 부서명을 같이 보여주면 더 좋습니다 */}
                    <span className="employee-name">
                        [{employee.teamName}] {employee.name}
                    </span>
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
          onClick={handleAiRecommandClick} 
          disabled={isLoadingRecommendations}
          >
            {isLoadingRecommendations ? '분석 중...' : 'AI 포상 추천'}
          </button>
        </div>

        {/* 나의 위젯 */}
        <div className="widget attendance-status">
          <h3>나의 위젯 &gt;</h3>
          <div className='attend-wrap'>
            <div className='attend' onClick={() => handleWidgetClick('/attendance/commute/me')}>
              <span className='attend-txt'>근태 통계</span>
            </div>
            <div className='attend' onClick={() => handleWidgetClick('/attendance/leave/status/me')}>
              <span className='attend-txt'>연차/휴가 현황</span>
            </div>
            <div className='attend' onClick={() => handleWidgetClick('/attendance/leave/application')}>
              <span className='attend-txt'>연차/휴가 신청</span>
            </div>
            <div className='attend' onClick={() => handleWidgetClick('/hr/training/status')}>
              <span className='attend-txt'>교육 신청</span>
            </div>
            <div className='attend' onClick={() => handleWidgetClick('/hr/certificates/request')}>
              <span className='attend-txt'>증명서 발급</span>
            </div>
            <div className='attend' onClick={() => handleWidgetClick('/payroll/payslips')}>
              <span className='attend-txt'>급여명세서 발급</span>
            </div>
            <div className='attend' onClick={() => handleWidgetClick('/payroll/severance/status')}>
              <span className='attend-txt'>나의 예상 퇴직금</span>
            </div>
          </div>
        </div>

        {/* 남은 연차 위젯 */}
        <div className="widget remaining-leave">
          <h3>남은 연차 &gt;</h3>
          <div className="leave-content">
            <div className='remain'>
              <div className='re-txt'>
                <span className='num'>{leaveBalance.days}</span>
                <span className='re-txt'>일</span>
                <span className='num'>{leaveBalance.hours}</span>
                <span className='re-txt'>시간</span>
              </div>
            </div>
            <button className='apply-btn' onClick={() => window.location.href = 'attendance/leave/application'}>
              연차 신청
            </button>
          </div>    
        </div>
        
        {/* 공지사항 위젯 */}
        <div className="widget notice">
          <h3>공지사항 &gt;</h3>
            <ul className="notice-list">
              {notices.length > 0 ? (
                notices.map(notice => (
                  <li key={notice.id} onClick={() => handleNoticeClick(notice.id)}>
                    {formatNoticeDate(notice.createdAt)}&nbsp;&nbsp; {notice.title}
                    {notice.isImportant && <span className="new-badge">[N]</span>}
                  </li>
                ))
              ) : (
                <li style={{ color: '#999' }}>공지사항이 없습니다.</li>
              )}
            </ul>
            <hr className="divider" />
            <button className="more-btn" onClick={handleNoticeMoreClick}>더보기</button>
        </div>
      </div>
    </div>
  );
}

export default MainPage;