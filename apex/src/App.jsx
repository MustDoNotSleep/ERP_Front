// App.jsx
import './App.css';
import React, { useState, useEffect } from 'react';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import MainPage from './pages/main/MainPage.jsx';
import Login from './pages/login/login.jsx';
import Header from './components/layout/Header.jsx';
import SideBar from './components/layout/SideBar.jsx';
import CareerManagementPage from "./pages/HR/career&training/CareerManagementPage.jsx";
import ComingSoon from './components/layout/Preparing.jsx'
import TrainingCreate from './pages/HR/career&training/TrainingCreate.jsx';
import TrainingApprovalPage from './pages/HR/career&training/TrainingApprovalPage.jsx';
import CertificateIssuePage from './pages/HR/certificates/CertificateIssuePage.jsx';
import PerformanceManagementPage from './pages/HR/performance/PerformanceManagementPage.jsx';
import MyInfoPage from './components/myinfo/MyInfoPage.jsx';
import Profile from './components/myinfo/Profile.jsx';
import HrCard from './components/myinfo/HrCard.jsx';
import PeopleSearchPage from './pages/HR/PeopleSearch/Search/PeopleSearchPage.jsx';
import PeopleNewPage from './pages/HR/PeopleSearch/New/PeopleNewPage.jsx';
import AppointmentApplyPage from './pages/HR/appointments/Apply/AppointmentApplyPage.jsx';
import AppointmentApprovePage from './pages/HR/appointments/Approve/AppointmentApprovePage.jsx';
import { isAuthenticated, logout } from './api/auth';

function App() {
  // localStorage에 토큰이 있으면 로그인 상태로 초기화
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const hasToken = isAuthenticated();
    console.log('🔍 App 초기화 - 토큰 존재 여부:', hasToken);
    return hasToken;
  });
  
  const userRole = "인사팀"; 
  
  // 컴포넌트 마운트 시 토큰 확인
  useEffect(() => {
    const hasToken = isAuthenticated();
    console.log('🔍 App useEffect - 토큰 확인:', hasToken);
    setIsLoggedIn(hasToken);
  }, []);
  
  const handleLogout = () => {
    console.log('🚪 로그아웃 처리');
    logout(); // localStorage 토큰 삭제
    setIsLoggedIn(false);
  };

  const ProtectedLayout = (
    <div className="layout-container">
      <Header onLogout={handleLogout} /> 
      <SideBar role={userRole} /> 

      {/* 메인 콘텐츠 영역: 사이드바와 헤더가 차지하는 공간 제외 */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<MainPage />} /> 

          {/* 인사부분 */}  
          <Route path="/hr">
            <Route path="career" element={<CareerManagementPage />} />
            <Route path="training/create" element={<TrainingCreate />} />
            <Route path="training/approvals" element={<TrainingApprovalPage/>}/>
            <Route path="certificates" element={<CertificateIssuePage/>}/>
            <Route path="performance/manage" element={<PerformanceManagementPage/>}/>
            <Route path="people/search" element={<PeopleSearchPage />} />
            <Route path="people/new" element={<PeopleNewPage />} />
            <Route path="appointments/apply" element={<AppointmentApplyPage />} />
            <Route path="appointments/approve" element={<AppointmentApprovePage />} />
            
          </Route>

          {/* 근태부분 */}  
          <Route path="/attendance">
            {/* <Route path="career" element={<CareerManagementPage />} />
            <Route path="education/regist" element={<CareerManagementPage />} /> */}
          </Route>

          {/* 급여부분 */}  
          <Route path="/payroll">
            {/* <Route path="career" element={<CareerManagementPage />} />
            <Route path="education/regist" element={<CareerManagementPage />} /> */}
          </Route>
          
          {/* myinfo 폴더의 파일 사용 */}
          <Route path = "/myinfo" element={<MyInfoPage />}>
              <Route index element = {<Profile />} />
              <Route path ="hrcard" element= {<HrCard />} />
          </Route>


          {/* 와일드카드 경로 (ComingSoon 컴포넌트로 처리) */}
          <Route path="/hr/*" element={<ComingSoon title="인사 페이지 준비중" />} />
          <Route path="/attendance/*" element={<ComingSoon title="근태 페이지 준비중" />} />
          <Route path="/payroll/*" element={<ComingSoon title="급여 페이지 준비중" />} />
          <Route path="/me/*" element={<ComingSoon title="내 정보 페이지 준비중" />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
    );

  return (
    <BrowserRouter>
        <Routes>
            {/* 1. 로그인 페이지 (보호되지 않음) */}
            <Route 
                path="/login" 
                element={<Login setIsLoggedIn={setIsLoggedIn} />}
            />

            {/* 2. 보호된 영역: 로그인 상태에 따라 ProtectedLayout 전체를 렌더링 */}
            <Route
                path="/*"
                element={isLoggedIn ? ProtectedLayout : <Navigate to="/login" />}
            />
        </Routes>
    </BrowserRouter>
    );
}

export default App;