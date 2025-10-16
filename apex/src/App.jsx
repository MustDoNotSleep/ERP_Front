// App.jsx
import './App.css';
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './pages/main/MainPage.jsx';
import Login from './pages/login/login.jsx';
import Header from './components/layout/Header.jsx';
import SideBar from './components/layout/SideBar.jsx';
import CareerManagementPage from "./pages/HR/career&education/careerManage/CareerManagementPage.jsx";
import ComingSoon from './components/layout/Preparing.jsx'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userRole = "인사팀"; 
  const handleLogout = () => {
    setIsLoggedIn(false);
    // 추가적인 로그아웃 처리 (예: 로컬 스토리지 토큰 삭제)
  };

  const ProtectedLayout = (
    <div className="layout-container">
      <Header onLogout={handleLogout} /> 
      <SideBar role={userRole} /> 

      {/* 메인 콘텐츠 영역: 사이드바와 헤더가 차지하는 공간 제외 */}
      <main className="main-content">
          <Routes>
              <Route path="/" element={<MainPage />} /> 
              <Route path="/hr/career" element={<CareerManagementPage />} />
              
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