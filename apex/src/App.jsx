// App.jsx

import './App.css';
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './pages/main/MainPage.jsx';
import Login from './pages/login/login.jsx';
import Header from './components/layout/Header.jsx';
import SideBar from './components/layout/SideBar.jsx';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleLogout = () => {
    setIsLoggedIn(false);
    // 추가적인 로그아웃 처리 (예: 로컬 스토리지 토큰 삭제)
  };

  return (
    <BrowserRouter>
      {/* 1. 로그인 상태일 때만 Header를 보여줍니다. */}
      {isLoggedIn && <Header />}
      {isLoggedIn && <SideBar />}
      {isLoggedIn && <Header onLogout={handleLogout} />}

      {/* 2. Routes(페이지 내용)를 main 태그로 감싸서 관리합니다. */}
      <main className="main-content">
        <Routes>
          <Route 
            path="/login" 
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            path="/"
            // 3. PrivateRoute 컴포넌트 대신 직접 조건을 확인합니다.
            //    로그인 상태이면 MainPage를, 아니면 /login으로 보냅니다.
            element={isLoggedIn ? <MainPage /> : <Navigate to="/login" />}
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;