// src/Header.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import Logo from '../../img/logo.svg';
import User from '../../img/user.png';

// App.jsx로부터 로그아웃 함수를 props로 받아와야 합니다.
function Header({ onLogout }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        }
        navigate('/login');
};

    return (
        <header className="header-wrap">
            <div className="header-content">
                {/* 왼쪽: 로고 그룹 */}
                <Link to="/" className="header-logo-group">
                    <img src={Logo} alt="logo" className="logo-image" />
                    <span className="logo-text">APEX</span>
                </Link>
                
                <nav className="header-nav-group">
                    <Link to="/profile" className="user-link">
                        <img src={User} alt="user profile" className="user-icon" />
                    </Link>
                    <button onClick={handleLogout} className="logout-button">
                        Log Out
                    </button>
                </nav>
            </div>
        </header>
    );
}

export default Header;