import React from 'react';
import './style/MainPage.css'; // 분리된 CSS 파일을 불러옵니다.

function MainPage() {
  return (
    // style 속성 대신 className을 사용합니다.
    <div className="main-wrap">
      <div className="main-content-box">
        
        <div className="placeholder-content">
        </div>
      </div>
    </div>
  );
}

export default MainPage;