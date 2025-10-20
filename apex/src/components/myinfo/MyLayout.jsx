/* eslint-disable */
import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./MyLayout.css"; // 또는 import "./SideBar.css";

const MY_INFO_MENU = {
  label: "MY INFO",
  path: "/myinfo",
  children: [
    { label: "내 인사 정보", to: "/myinfo", end: true },
    { label: "인사 카드", to: "/myinfo/hrcard", end: false },
  ],
};

function isPathActive(pathname, sectionPath) {
  return pathname.startsWith(sectionPath);
}

export default function MyLayout() {
  const location = useLocation();
  const isActiveSection = isPathActive(location.pathname, MY_INFO_MENU.path);
  const [isOpen, setIsOpen] = useState(isActiveSection);

  useEffect(() => {
    if (isActiveSection) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [isActiveSection, location.pathname]);

  return (
    <aside className="SideBar-wrap">
      <div className="SideBar-scroll">
        <div className="sb-section">
          <button
            className={`sb-section-btn ${isActiveSection ? "active" : ""}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
          >
            {MY_INFO_MENU.label}
            <svg
              className={`chev ${isOpen ? "open" : ""}`}
              width="16" height="16" viewBox="0 0 24 24" aria-hidden
            >
              <path
                d="M8 10l4 4 4-4"
                fill="none" stroke="currentColor" strokeWidth="2"
              />
            </svg>
          </button>

          {/* 하위 메뉴 리스트 */}
          {isOpen && (
            <ul className="sb-level sb-level-0">
              {MY_INFO_MENU.children.map((item, idx) => (
                <li className="sb-item" key={idx}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    // [수정] 'sb-link'를 'sb-sub-btn leaf'로 변경
                    className={({ isActive }) =>
                      `sb-sub-btn leaf ${isActive ? "active" : ""}`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
}