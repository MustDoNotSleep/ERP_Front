import React, { useRef, useState } from 'react';
import styles from './EvaluationSettings.module.css';

const DUMMY_OPTIONS = [
    { value: '전체', label: '전체' },
    { value: '인사팀', label: '인사팀' },
];

const EvaluationSettings = ({ data, onChange }) => {
    const [EvaluationForm1, setEvaluationForm1] = useState('[file1]을 업도르 해주세요');
    const [EvaluationForm2, setEvaluationForm2] = useState('[file2]을 업도르 해주세요');

    const EvaluationForm1InputRef = useRef(null);
    const EvaluationForm2InputRef = useRef(null);

    const handleFileChange = (e, setFileName) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name); // 파일 이름을 state에 저장하여 화면에 표시
            console.log(`선택된 파일: ${file.name}`);
        }
    };

    const handleInputClick = (ref) => {
        ref.current.click(); 
    };

    const handleSelectChange = (e) => {
        onChange(e);
    };

    return (
        <div className={styles.formSection}> 
            <h3 className={styles.sectionTitle}>평가 항목 및 대상 설정</h3>
            <div className={styles.contentGrid}> 
                
                {/* 평가 유형 (스코어 분배) */}
                <div className={styles.scoreItem}>
                    <label className={styles.label}>평가유형</label>
                    <span className={styles.scoreType}>성과평가(70%)</span>
                    <span className={styles.scoreType}>역량평가(30%)</span>
                    <button className={styles.addButton}>+</button>
                </div>

                {/* 평가 양식 1 */}
                <div className={styles.inputGroup}> 
                    <label className={styles.label}>평가양식</label>
                    <div className={styles.templateGroup}>
                        
                        {/* 1A. 사용자에게 보여지는 읽기 전용 인풋 (클릭 트리거) */}
                        <input 
                            type="text" 
                            value={EvaluationForm1} // ✨ 파일 이름 표시
                            readOnly 
                            className={styles.input}
                            onClick={() => handleInputClick(EvaluationForm1InputRef)} // ✨ 클릭 이벤트 추가
                        />
                        
                        {/* 1B. 실제 파일 선택 input (숨겨짐) */}
                        <input
                            type="file"
                            ref={EvaluationForm1InputRef} // ✨ Ref 연결
                            style={{ display: 'none' }} // 숨김
                            onChange={(e) => handleFileChange(e, setEvaluationForm1)} // ✨ 파일 변경 핸들러
                        />
                    </div>
                </div>

                {/* 평가 양식 2 */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}></label>
                    <div className={styles.templateGroup}> 
                        <input 
                            type="text" 
                            value={EvaluationForm2}
                            readOnly 
                            className={styles.input} 
                            onClick={() => handleInputClick(EvaluationForm2InputRef)} // ✨ 클릭 이벤트 추가
                        />
                        <input
                            type="file"
                            ref={EvaluationForm2InputRef} // ✨ Ref 연결
                            style={{ display: 'none' }} 
                            onChange={(e) => handleFileChange(e, setEvaluationForm2)} // ✨ 파일 변경 핸들러
                        />
                    </div>
                </div>
                
                {/* 대상 부서 */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>대상부서</label>
                    <select name="targetDept" value={data.targetDept} onChange={handleSelectChange} className={`${styles.input} ${styles.select}`}>
                        {DUMMY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </div>

                {/* 직급 범위 */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>직급범위</label>
                    <select name="targetPosition" value={data.targetPosition} onChange={handleSelectChange} className={`${styles.input} ${styles.select}`}>
                        <option>사원</option>
                        <option>대리</option>
                    </select>
                </div>
                
                {/* 평가 매핑 */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>평가매핑</label>
                    <select name="mappingType" value={data.mappingType} onChange={handleSelectChange} className={`${styles.input} ${styles.select}`}>
                        <option>자동지정</option>
                        <option>수동지정</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default EvaluationSettings;