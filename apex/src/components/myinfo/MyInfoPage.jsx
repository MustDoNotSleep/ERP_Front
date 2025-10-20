import React from "react";
import { Outlet } from "react-router-dom";
import MyLayout from './MyLayout';
import './MyInfoPage.css';

function MyInfoPage () {
    return (
        <div className="my-info-layout-contianer">
            <MyLayout/> {/* 왼쪽 사이드바 */}
            <div className="my-info-content-area">
                <Outlet/> {/*오른쪽 콘텐츠*/}
            </div>
        </div>
    )
}
export default MyInfoPage;
