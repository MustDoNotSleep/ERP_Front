/* eslint-disable */
import React, { useState, useEffect, useMemo } from "react";
import { NavLink, useLocation, matchPath } from "react-router-dom";
import { getCurrentUser } from "../../api/auth";
import "./SideBar.css";

/* ─────────────── 메뉴 구조 (전체 역할 버전) ─────────────── */
const MENU_BY_ROLE = {
  인사팀: [
    {
      label: "인사",
      children: [
        {
          label: "직원 조회",
          children: [
            { label: "직원 조회", to: "/hr/people/search" },
            { label: "신규직원 등록", to: "/hr/people/new" },          
          ],
        },
        {
          label: "인사발령",
          children: [
            { label: "인사 발령 신청", to: "/hr/appointments/apply" }, 
            { label: "인사 발령 관리", to: "/hr/appointments/approve" },
          ],
        },
        { 
          label: "평가/포상 관리", 
          children: [
            {label: "평가 관리", to: "/hr/performance/manage" },
            {label: "포상 관리", to: "/hr/rewards/manage" },
          ],
        },
        {
          label: "경력/교육 관리",
          children: [
            { label: "경력 관리", to: "/hr/career" },
            { label: "교육과정 등록", to: "/hr/training/create" },
            { label: "교육과정 승인/조회", to: "/hr/training/approvals" },
            {label: "교육 이수 현황", to: "/hr/training/status" },
          ],
        },
        {
          label: "교육 신청", to: "/hr/training/my" },
        { 
          label: "증명서 관리", 
          children: [
            {label: "증명서 신청", to: "/hr/certificates/request"},
            {label: "증명서 승인", to: "/hr/certificates/issue"},
          ],
        },
        { 
          label: "근무 평가", to: "/hr/work-evaluation"

        },
      ],
    },
    {
      label: "근태",
      children: [
        { label: "근태 통계", to: "/attendance/commute/me" },
        { label: "출퇴근 기록 관리 (전)", to: "/attendance/manage", audience : "manager" },
        { 
          label: "연차 및 휴가신청", 
          children: [
            {label: "연차/휴가 신청", to: "/attendance/leave/application"},
            {label: "연차/휴가 현황", to: "/attendance/leave/status/me"},
          ],
        },
        {label: "연차 관리 (전)", to: "/attendance/leave/manage", audience : "manager"},
        { label: "파견 관리 (전)", to: "/attendance/dispatch-travel" , audience : "manager"}, // 관리자용
        { label: "근태 통계 관리 (전)", to: "/attendance/stats", audience : "manager" }, // 관리자용
      ],
    },
    {
      label: "급여",
      children: [
        { 
          label: "급여 관리",
          children: [
            { label: "급여 정산 및 확정 (전)", to: "/payroll/certificates"}, // 관리자용
            { label: "급여 명세서", to: "/payroll/payslips"}, // 사원용
          ],
        },
        {
          label: "수당/상여 관리 (전)", to: "/payroll/allowances-bonus"
        },
        { 
          label: "퇴직금 관리",
          children: [
            { label : "퇴직자 관리", to: "/payroll/retirement/manage"}, // 관리자용
            { label : "퇴직금 정산 관리", to: "/payroll/severance"},
            { label : "나의 예상 퇴직금 정산", to: "/payroll/severance/status"},
          ],
        },
      ],
    },
  ],

  관리자:[
    {
      label: "인사",
      children: [
        {
          label: "직원 조회",
          children: [
            { label: "직원 조회", to: "/hr/people/search" },
            { label: "신규직원 등록", to: "/hr/people/new" },          
          ],
        },
        {
          label: "인사발령",
          children: [
            { label: "인사 발령 신청", to: "/hr/appointments/apply" }, 
            { label: "인사 발령 관리", to: "/hr/appointments/approve" },
          ],
        },
        { 
          label: "평가/포상 관리", 
          children: [
            {label: "평가 관리", to: "/hr/performance/manage" },
            {label: "포상 관리", to: "/hr/rewards/manage" },
          ],
        },
        {
          label: "경력/교육 관리",
          children: [
            { label: "경력 관리", to: "/hr/career" },
            { label: "교육과정 등록", to: "/hr/training/create" },
            { label: "교육과정 승인/조회", to: "/hr/training/approvals" },
            {label: "교육 이수 현황", to: "/hr/training/status" },
          ],
        },
        {
          label: "교육 신청", to: "/hr/training/my" },
        { 
          label: "증명서 관리", 
          children: [
            {label: "증명서 신청", to: "/hr/certificates/request"},
            {label: "증명서 승인", to: "/hr/certificates/issue"},
          ],
        },
        { 
          label: "근무 평가", to: "/hr/work-evaluation"

        },
      ],
    },
    {
      label: "근태",
      children: [
        { label: "근태 통계", to: "/attendance/commute/me" },
        { label: "출퇴근 기록 관리 (전)", to: "/attendance/manage", audience : "manager" },
        { 
          label: "연차 및 휴가신청", 
          children: [
            {label: "연차/휴가 신청", to: "/attendance/leave/application"},
            {label: "연차/휴가 현황", to: "/attendance/leave/status/me"},
          ],
        },
        {label: "연차 관리 (전)", to: "/attendance/leave/manage", audience : "manager"},
        { label: "파견 관리 (전)", to: "/attendance/dispatch-travel" , audience : "manager"}, // 관리자용
        { label: "근태 통계 관리 (전)", to: "/attendance/stats", audience : "manager" }, // 관리자용
      ],
    },
    {
      label: "급여",
      children: [
        { 
          label: "급여 관리",
          children: [
            { label: "급여 정산 및 확정 (전)", to: "/payroll/certificates"}, // 관리자용
            { label: "급여 명세서", to: "/payroll/payslips"}, // 사원용
          ],
        },
        {
          label: "수당/상여 관리 (전)", to: "/payroll/allowances-bonus"
        },
        { 
          label: "퇴직금 관리",
          children: [
            { label : "퇴직자 관리", to: "/payroll/retirement/manage"}, // 관리자용
            { label : "퇴직금 정산 관리", to: "/payroll/severance"},
            { label : "나의 예상 퇴직금 정산", to: "/payroll/severance/status"},
          ],
        },
      ],
    },
  ],

  사원: [
    {
      label: "인사",
      children: [
        {
          label: "교육 신청", to: "/hr/training/my" },
        { 
          label: "증명서 신청", to: "/hr/certificates/request", 
        },
        {
          label: "인사 발령 신청", to: "/hr/appointments/apply",
        },
      ],
    },
    {
      label: "근태",
      children: [
        { label: "근태 통계", to: "/attendance/commute/me" },
        { 
          label: "연차 및 휴가신청", 
          children: [
            {label: "연차/휴가 신청", to: "/attendance/leave/application"},
            {label: "연차/휴가 현황", to: "/attendance/leave/status/me"},
          ],
        },
      ],
    },
    {
      label: "급여",
      children: [
        { 
          label: "급여 명세서", to: "/payroll/payslips",
        },
        { 
          label : "나의 예상 퇴직금 정산", to: "/payroll/severance/status"
        },
      ],
    },
  ],
};


/* ─────────────── 경로 매칭: 홈은 정확 일치, 그 외는 부분 일치 ─────────────── */
function pathMatchesItem(pathname, item) {
  if (item.to) {
    if (item.to === "/") return !!matchPath({ path: "/", end: true }, pathname);
    return !!matchPath({ path: item.to, end: false }, pathname);
  }
  if (item.children) return item.children.some((c) => pathMatchesItem(pathname, c));
  return false;
}

/* ─────────────── 중분류 리스트 ─────────────── */
function NestedList({ items, depth = 0 }) {
  const location = useLocation();
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    if (location.pathname === "/") { // 홈에선 흔적 리셋
      setOpenIndex(null);
      return;
    }
    const i = items.findIndex((it) => pathMatchesItem(location.pathname, it));
    if (i !== -1) setOpenIndex(i);
  }, [location.pathname, items]);

  return (
    <ul className={`sb-level sb-level-${depth}`}>
      {items.map((it, idx) => {
        const hasChildren = Array.isArray(it.children) && it.children.length > 0;
        const isOpen = openIndex === idx;
        const isActivePath = pathMatchesItem(location.pathname, it);

        // depth=0: 모두 "중분류"
        if (depth === 0) {
          if (hasChildren) {
            return (
              <li className="sb-item has-children" key={idx}>
                <button
                  className={`sb-sub-btn ${isOpen || isActivePath ? "active" : ""}`}
                  onClick={() => setOpenIndex(isOpen ? null : idx)}  // 하나만 열림
                  aria-expanded={isOpen}
                >
                  <span>{it.label}</span>
                  <svg className={`chev ${isOpen ? "open" : ""}`} width="14" height="14" viewBox="0 0 24 24" aria-hidden>
                    <path d="M8 10l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </button>
                {isOpen && <NestedList items={it.children} depth={1} />}
              </li>
            );
          }
          // 중분류지만 하위 없음 → NavLink로 이동하되 중분류 스타일 유지
          return (
            <li className="sb-item" key={idx}>
              <NavLink
                to={it.to || "#"}
                end
                className={({ isActive }) => `sb-sub-btn leaf ${isActive ? "active" : ""}`}
              >
                {it.label}
              </NavLink>
            </li>
          );
        }

        // depth>=1: 전부 "하위(leaf)" — 배경 없음, 글자만
        return (
          <li className="sb-item" key={idx}>
            <NavLink
              to={it.to || "#"}
              end
              className={({ isActive }) => `sb-link ${isActive ? "active" : ""}`}
            >
              {it.label}
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
}

/* ─────────────── 사이드바 ─────────────── */
export default function SideBar() {
  const location = useLocation();
  
  // 토큰에서 role 가져오기
  const currentUser = getCurrentUser();
  const rawRole = currentUser?.role || "사원";
  
  // 백엔드 role을 메뉴 키로 매핑
  const roleMapping = {
    'ROLE_ADMIN': '관리자',
    'ROLE_HR': '인사팀',
    'ROLE_HR_MANAGER': '인사팀',
    'ROLE_MANAGER': '관리자',
    'ROLE_USER': '사원',
    'ROLE_EMPLOYEE': '사원',
    '관리자': '관리자',
    '인사팀': '인사팀',
    '사원': '사원'
  };
  
  const userRole = roleMapping[rawRole] || '사원';
  
  console.log('🔍 사이드바 - 현재 사용자:', currentUser);
  console.log('🔍 사이드바 - 원본 역할:', rawRole);
  console.log('🔍 사이드바 - 매핑된 역할:', userRole);
  
  const menu = useMemo(() => {
    const selectedMenu = MENU_BY_ROLE[userRole] || MENU_BY_ROLE["사원"];
    console.log('🔍 사이드바 - 선택된 메뉴:', userRole, selectedMenu);
    return selectedMenu;
  }, [userRole]); // userRole 변경 시에만 재계산
  
  const [openSection, setOpenSection] = useState(null);

  useEffect(() => {
    if (location.pathname === "/") {        // 홈에서는 흔적 초기화
      setOpenSection(null);
      return;
    }
    const matchedSection = menu.find((s) => pathMatchesItem(location.pathname, s));
    if (matchedSection) setOpenSection(matchedSection.label);
  }, [location.pathname, menu]);

  return (
    <aside className="SideBar-wrap">
      <div className="SideBar-scroll">
        {menu.map((section, idx) => {
          const isOpen = openSection === section.label;
          const isActive = pathMatchesItem(location.pathname, section);
          return (
            <div className="sb-section" key={idx}>
              <button
                className={`sb-section-btn ${isOpen || isActive ? "active" : ""}`}
                onClick={() => setOpenSection(isOpen ? null : section.label)} // 하나만 열림
                aria-expanded={isOpen}
              >
                {section.label}
                <svg
                  className={`chev ${isOpen ? "open" : ""}`}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    d="M8 10l4 4 4-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </button>
              {isOpen && <NestedList items={section.children} depth={0} />}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
