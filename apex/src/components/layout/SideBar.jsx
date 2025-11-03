/* eslint-disable */
import React, { useState, useEffect, useMemo } from "react";
import { NavLink, useLocation, matchPath } from "react-router-dom";
import "./SideBar.css";

/* ─────────────── 메뉴 구조 (전체 역할 버전) ─────────────── */
const MENU_BY_ROLE = {
  임원: [
    {
      label: "인사",
      children: [
        { label: "직원현황 대시보드", to: "/hr/people/dashboard" },
        { label: "인사발령/인사 보고서", to: "/hr/appointments/reports" },
        { label: "평가/성과 분석", to: "/hr/performance/analytics" },
        { label: "조직도 조회", to: "/hr/orgchart" },
        { label: "직원 조회", to: "/hr/people/search" },
      ],
    },
    {
      label: "근태",
      children: [
        { label: "전사 근태현황 대시보드", to: "/attendance/company/dashboard" },
        { label: "근태 리스크 분석", to: "/attendance/risk" },
        { label: "핵심 인력 효율성 분석", to: "/attendance/key-talent/efficiency" },
      ],
    },
    {
      label: "급여",
      children: [
        { label: "총 인건비 및 비용 분석", to: "/payroll/costs/summary" },
        { label: "핵심 인재 보상 및 격차 분석", to: "/payroll/compensation/insights" },
        { label: "법적 보상 지출 보고서", to: "/payroll/legal/reports" },
      ],
    },
  ],

  인사팀: [
    {
      label: "인사",
      children: [
        {
          label: "직원조회",
          children: [
            { label: "조회", to: "/hr/people/search" },
            { label: "신규직원등록", to: "/hr/people/new" },
          ],
        },
        {
          label: "인사발령관리",
          children: [
            { label: "인사 발령 신청", to: "/hr/appointments/apply" },
            { label: "인사 발령 승인/조회", to: "/hr/appointments/approve" },
          ],
        },
        { label: "평가관리", to: "/hr/performance/manage" },
        {
          label: "경력/교육관리",
          children: [
            { label: "경력", to: "/hr/career" },
            { label: "교육과정 등록", to: "/hr/training/create" },
            { label: "교육과정 승인/조회", to: "/hr/training/approvals" },
            { label: "교육 이수 현황/신청", to: "/hr/training/status" },
          ],
        },
        {
          label: "증명서",
          children: [
            { label: "발급 승인/반려", to: "/hr/certificates/issue" },
            { label: "발급 신청/조회", to: "/hr/certificates/request" },
          ],
        },
      ],
    },
    {
      label: "근태",
      children: [
        { label: "근태현황 및 리스크 관리", to: "/attendance/status-risk" },
        { label: "출퇴근 기록 관리", to: "/attendance/records" },
        { label: "연차 및 휴가관리", to: "/attendance/leave" },
      ],
    },
    {
      label: "급여",
      children: [
        { label: "급여정산 및 확정", to: "/payroll/settlement" },
        { label: "연말정산 관리", to: "/payroll/year-end" },
        { label: "퇴직금 정산 및 관리", to: "/payroll/severance" },
        { label: "급여 및 보상기준 설정", to: "/payroll/settings" },
      ],
    },
  ],

  관리자: [
    {
      label: "인사",
      children: [
        {
          label: "인사발령관리",
          children: [
            { label: "인사 발령 신청", to: "/hr/appointments/apply" },
            { label: "인사 발령 승인", to: "/hr/appointments/approve-only" },
            { label: "인사 발령 조회", to: "/hr/appointments/history" },
          ],
        },
        { label: "학력/자격 관리", to: "/hr/education-qualification" },
        { label: "교육 이수 현황", to: "/hr/training/completions" },
        { label: "증명서 신청", to: "/hr/certificates/request" },
        {
          label: "평가/포상 관리",
          children: [
            { label: "평가 관리", to: "/hr/performance/manage" },
            { label: "포상 관리", to: "/hr/rewards/manage" },
          ],
        },
        { label: "부서 인사 정보 조회", to: "/hr/dept/info" },
      ],
    },
    {
      label: "근태",
      children: [
        { label: "연차/휴가 현황", to: "/attendance/leave/status" },
        { label: "근무/휴가 현황", to: "/attendance/work-leave/status" },
        { label: "신청 내역 조회", to: "/attendance/requests" },
        { label: "파견/출장 관리", to: "/attendance/dispatch-travel" },
        { label: "근태 통계", to: "/attendance/stats" },
      ],
    },
    {
      label: "급여",
      children: [
        { label: "급여 명세서", to: "/payroll/payslips" },
        { label: "수당/상여 관리", to: "/payroll/allowances-bonus" },
        { label: "연말정산 현황", to: "/payroll/year-end/status" },
        { label: "퇴직금/정산 현황", to: "/payroll/severance/status" },
        { label: "급여 증명서 관리", to: "/payroll/certificates" },
      ],
    },
  ],

  사원: [
    {
      label: "인사",
      children: [
        {
          label: "인사발령이력",
          children: [
            { label: "인사 발령 신청", to: "/me/hr/appointments/apply" },
            { label: "인사발령 조회", to: "/me/hr/appointments/history" },
          ],
        },
        { label: "학력/자격 관리", to: "/me/hr/education-qualification" },
        { label: "교육 이수 현황", to: "/me/hr/training/completions" },
        { label: "증명서 신청", to: "/me/hr/certificates/request" },
      ],
    },
    {
      label: "근태",
      children: [
        { label: "연차/휴가 현황", to: "/me/attendance/leave/status" },
        { label: "근무/휴가 현황", to: "/me/attendance/work-leave/status" },
        { label: "신청 내역 조회", to: "/me/attendance/requests" },
        { label: "파견/출장 관리", to: "/me/attendance/dispatch-travel" },
        { label: "근태 통계", to: "/me/attendance/stats" },
      ],
    },
    {
      label: "급여",
      children: [
        { label: "급여 명세서", to: "/me/payroll/payslips" },
        { label: "수당/상여 신청", to: "/me/payroll/allowances-bonus/apply" },
        { label: "연말정산", to: "/me/payroll/year-end" },
        { label: "퇴직금 예상 조회", to: "/me/payroll/severance/estimate" },
        { label: "재직 급여 확인서", to: "/me/payroll/employment-income-cert" },
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
export default function SideBar({ role = "임원" }) {
  const location = useLocation();
  const menu = useMemo(() => MENU_BY_ROLE[role] || [], [role]); // 렌더마다 새 객체 방지
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
