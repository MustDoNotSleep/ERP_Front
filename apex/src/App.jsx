// App.jsx

import "./App.css";
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainPage from "./pages/main/MainPage.jsx";
import Login from "./pages/login/login.jsx";
import Header from "./components/layout/Header.jsx";
import SideBar from "./components/layout/SideBar.jsx";
import CareerManagementPage from "./pages/HR/career&education/careerManage/CareerManagementPage.jsx";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    const userRole = "인사팀"; 

    const handleLogout = () => {
        setIsLoggedIn(false);
    };
    const ProtectedLayout = (
        <div className="layout-container">
            <Header onLogout={handleLogout} /> 
            <SideBar role={userRole} /> 

            <main className="main-content">
                <Routes>
                    <Route path="/" element={<MainPage />} /> 
                    <Route path="/hr/career" element={<CareerManagementPage />} />
                    
                    {/* TODO: 여기에 다른 모든 보호된 경로들을 <Route>로 추가하세요! */}

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

                {/* 2. 보호된 영역: 로그인 상태에 따라 ProtectedLayout 전체를 렌더링하거나 로그인 페이지로 보냅니다. */}
                <Route
                    path="/*" // 모든 나머지 경로를 잡습니다.
                    element={isLoggedIn ? ProtectedLayout : <Navigate to="/login" />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;