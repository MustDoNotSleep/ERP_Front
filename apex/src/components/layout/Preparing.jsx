import React from "react";
import "./Preparing.css";
import Logo from "../../img/logo.svg";

export default function ComingSoon() {
  return (
    <div className="wip-wrap">
      <section className="wip-card">
        <div className="wip-center">
          <div className="logo-group">
                <img src={Logo} alt="logo" className="logo-image" />
                <span className="logo-text">APEX</span>
            </div>
          <p className="wip-title">페이지 준비 중</p>
        </div>
      </section>
    </div>
  );
}