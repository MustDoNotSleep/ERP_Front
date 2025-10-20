import React, {useState, useRef} from 'react';
import './HrCard.css';
import User from '../../img/user.png'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function HrCard() {
    // 1. 사진 변경을 위한 상태 및 참조
    const [imagePreview, setImagePreview] = useState(User); // 이미지 미리보기 URL
    const fileInputRef = useRef(null); // 숨겨진 file input에 대한 참조

    // 2. PDF 저장을 위한 참조
    const cardRef = useRef(null); // PDF로 변환할 전체 컴포넌트 영역

    /**
     * 1. '사진 변경' 버튼 클릭 시, 숨겨진 file input을 클릭
     */
    const handlePhotoClick = () => {
        fileInputRef.current.click();
    };

    /**
     * 1-1. 파일이 실제로 선택되었을 때 실행
     */
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
        // 선택된 파일을 URL로 변환하여 미리보기 상태 업데이트
        setImagePreview(URL.createObjectURL(file));
        // (실제 기능) 여기서 file 객체를 서버로 업로드하는 로직을 추가
        }
    };

    /**
     * 2. '프린트' 버튼 클릭 시
     */
    const handlePrint = () => {
        // CSS로 인쇄 영역을 제어한 후, 브라우저 인쇄 기능 호출
        window.print();
    };

    /**
     * 3. '파일 내보내기' (PDF) 버튼 클릭 시
     */
    const handleExportPDF = () => {
        // 1. PDF로 만들 영역(cardRef.current)을 canvas로 캡처
        html2canvas(cardRef.current).then((canvas) => {
        // 2. 캡처한 canvas 이미지 데이터(URL)를 가져옴
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF({
            orientation: 'p', // p: portrait (세로), l: landscape (가로)
            unit: 'mm',       // 단위
            format: 'a4',     // 용지 크기
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        // 이미지의 가로/세로 비율
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 0; // 맨 위에 붙임

        // 3. PDF에 이미지를 추가
        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        
        // 4. PDF 파일 저장
        pdf.save('인사카드-정관리.pdf');
        });
    };
  return (
    <div className="hr-card-container">

      {/* =================================
          1. 인사 카드 (기본 정보)
      ================================= */}
      <section className="hr-section">
        <h2>인사 카드</h2>
        
        <div className="hr-basic-info-content">
          {/* 1-1. 왼쪽: 프로필 사진 */}
          <div className="hr-photo-area">
            <div className="hr-photo-placeholder">
                {/* [수정] 이미지를 상태(imagePreview)에서 불러옴 */}
                {/* <img src={imagePreview} alt="user" />  <- 나중에 이걸로 바꾸기*/}
                <img src={User} alt="user" />
            </div>
            <button className='change-photo' onClick={handlePhotoClick}>사진 변경</button>
            <input type="file" ref={fileInputRef}
                onChange={handleFileChange} accept='image/*'
                style={{display:'none'}}
            />
          </div>

          {/* 1-2. 오른쪽: 정보 그리드 + 프린트 버튼 */}
          <div className="hr-info-right-area">
            {/* 정보 그리드 */}
            <div className="hr-info-grid">
              {/* --- 1행 --- */}
              <div className="hr-field">
                <label>이름</label>
                <input type="text" value="정관리" readOnly />
              </div>
              <div className="hr-field">
                <label>생년월일</label>
                <input type="text" value="19xx.xx.xx" readOnly />
              </div>
              {/* --- 2행 --- */}
                <div className="hr-field">
                    <label>부서</label>
                    <input type="text" value="침해사고대응본부" readOnly />
              </div>
              <div className="hr-field">
                <label>사원번호</label>
                <input type="text" value="1234567" readOnly />
              </div>
              {/* --- 3행 --- */}
              <div className="hr-field">
                <label>소속</label>
                <input type="text" value="CERT 팀" readOnly />
              </div>
              <div className="hr-field">
                <label>내선번호</label>
                <input type="text" value="123-4567" readOnly />
              </div>
              {/* --- 4행 --- */}
              <div className="hr-field">
                <label>이메일</label>
                <input type="text" value="rhksfl01@apex.com" readOnly />
              </div>
              <div className="hr-field">
                <label>전화번호</label>
                <input type="text" value="010-1234-1234" readOnly />
              </div>
              {/* --- 5행 --- */}
              <div className="hr-field">
                <label>은행명</label>
                <input type="text" value="하나은행" readOnly />
              </div>
              <div className="hr-field">
                <label>계좌번호</label>
                <input type="text" value="212-123456-12345" readOnly />
              </div>
            </div>

            {/* 프린트 버튼 영역 */}
            <div className="hr-print-area">
              <button className="hr-btn" onClick={handlePrint}>프린트</button>
              <button className="hr-btn" onClick={handleExportPDF}>파일 내보내기</button>
            </div>
          </div>
        </div>
      </section>

      {/* =================================
          2. 학력
      ================================= */}
      <section className="hr-section">
        <h3>학력</h3>
        <table className="hr-table">
          <thead>
            <tr>
              <th>학교명</th>
              <th>학위</th>
              <th>전공</th>
              <th>입학일</th>
              <th>졸업일</th>
              <th>졸업 구분</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>명지전문대학교</td>
              <td>학사</td>
              <td>정보통신</td>
              <td>2000.03.02</td>
              <td>2001.02.27</td>
              <td>졸업</td>
            </tr>
            <tr>
              <td>명지전문대학교</td>
              <td>전문학사</td>
              <td>소프트웨어개발</td>
              <td>1997.03.04</td>
              <td>2000.02.27</td>
              <td>졸업</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* =================================
          3. 병역여부
      ================================= */}
      <section className="hr-section">
        <h3>병역여부</h3>
        <table className="hr-table">
          <thead>
            <tr>
              <th>병역 구분</th>
              <th>군별</th>
              <th>복무 시작일</th>
              <th>복무 종료일</th>
              <th>계급</th>
              <th>병과</th>
              <th>미필사유</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>해당사항없음</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* =================================
          4. 경력
      ================================= */}
      <section className="hr-section">
        <h3>경력</h3>
        <table className="hr-table">
          <thead>
            <tr>
              <th>근무처</th>
              <th>입사일</th>
              <th>퇴직일</th>
              <th>담당업무</th>
              <th>최종직위</th>
              <th>최종연봉</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>넥스트보안테크(주)</td>
              <td>2000.3.20</td>
              <td>2005.03.19</td>
              <td>백엔드 개발</td>
              <td>대리</td>
              <td>1,500만원</td>
            </tr>
            <tr>
              <td>에이펙스금융보안(주)</td>
              <td>2005.3.20</td>
              <td>-</td>
              <td>CERT</td>
              <td>부장</td>
              <td>1억원</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* =================================
          5. 자격면허
      ================================= */}
      <section className="hr-section">
        <h3>자격면허</h3>
        <table className="hr-table">
          <thead>
            <tr>
              <th>자격증명</th>
              <th>발급기관</th>
              <th>취득일</th>
              <th>유효일</th>
              <th>점수</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>정보보안기사</td>
              <td>한국인터넷진흥원</td>
              <td>2005/09/20</td>
              <td>갱신</td>
              <td>-</td>
            </tr>
            <tr>
              <td>정보처리기사</td>
              <td>한국산업인력공단</td>
              <td>2005/01/18</td>
              <td>갱신</td>
              <td>-</td>
            </tr>
            <tr>
              <td>TOEIC</td>
              <td>한국 TOEIC 위원회</td>
              <td>2009/01/20</td>
              <td>2011/01/20</td>
              <td>900</td>
            </tr>
            <tr>
              <td>HSK 3급</td>
              <td>한국산업인력공단</td>
              <td>2010/06/30</td>
              <td>2013/06/30</td>
              <td>270</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* =================================
          6. 교육 훈련
      ================================= */}
      <section className="hr-section">
        <h3>교육 훈련</h3>
        <table className="hr-table">
          <thead>
            <tr>
              <th>교육기간</th>
              <th>교육명</th>
              <th>교육기관</th>
              <th>교육구분</th>
              <th>이수 여부</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>YYYY/MM/DD~YYYY/MM/DD</td>
              <td>보안사고대응실무</td>
              <td>Apex</td>
              <td>내부교육</td>
              <td>이수 완료</td>
            </tr>
            <tr>
              <td>YYYY/MM/DD~YYYY/MM/DD</td>
              <td>보안사고대응실무</td>
              <td>Apex</td>
              <td>내부교육</td>
              <td>이수 완료 (B+)</td>
            </tr>
            <tr>
              <td>YYYY/MM/DD~YYYY/MM/DD</td>
              <td>ISMS-P</td>
              <td>KISA</td>
              <td>외부교육</td>
              <td>이수 완료 (A)</td>
            </tr>
            <tr>
              <td>YYYY/MM/DD~YYYY/MM/DD</td>
              <td>ISMS-P</td>
              <td>KISA</td>
              <td>외부교육</td>
              <td>미이수</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default HrCard;