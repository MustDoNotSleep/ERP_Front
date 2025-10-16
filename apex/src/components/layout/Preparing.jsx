import React from "react";
import "./Preparing.css";
import Ready from "../../img/ready.png";

export default function ComingSoon() {
  return (
    <div className="wip-wrap">
      <section className="wip-card">
        <div className="wip-center">
          <div className="logo-group">
                <img src={Ready} alt="logo" className="logo-image" />
            </div>
          <p className="wip-title">페이지 준비 중</p>
        </div>
      </section>
    </div>
  );
}