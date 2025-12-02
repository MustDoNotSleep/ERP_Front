import React, { useRef, useState } from 'react';
import styles from './EvaluationSettings.module.css';

const EvaluationSettings = ({ 
    data,
    onChange,
    departments,
    positions,
    onFileSelect // ⭐ 부모에게 파일 전달하는 함수 받기
}) => {
    // 파일명 상태
    const [EvaluationForm1, setEvaluationForm1] = useState('KPI평가 양식을 업로드해주세요.');
    const [EvaluationForm2, setEvaluationForm2] = useState('리더십평가 양식을 업로드해주세요.');

    const EvaluationForm1InputRef = useRef(null);
    const EvaluationForm2InputRef = useRef(null);

    // 파일 선택 핸들러
    const handleFileChange = (e, setFileName) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name); 
            console.log(`선택된 파일: ${file.name}`);
            
            // ⭐ [수정] 파일이 선택되면 부모 컴포넌트로 전달 (주석 해제 및 안전코드 추가)
            if (onFileSelect) {
                onFileSelect(file);
            }
        }
    };

    // input 클릭 트리거
    const handleInputClick = (ref) => {
        ref.current.click(); 
    };

    // 변경 핸들러
    const handleSelectChange = (e) => {
        onChange(e);
    };

    return (
        <div className={styles.formSection}> 
            <h3 className={styles.sectionTitle}>평가 항목 및 대상 설정</h3>
            <div className={styles.contentGrid}> 
                
                {/* 1. 평가 유형 (디자인 유지) */}
                <div className={styles.scoreItem}>
                    <label className={styles.label}>평가유형</label>
                    <span className={styles.scoreType}>성과평가(70%)</span>
                    <span className={styles.scoreType}>역량평가(30%)</span>
                    <button className={styles.addButton}>+</button>
                </div>

                {/* 2. 평가 양식 1 (디자인 유지) */}
                <div className={styles.inputGroup}> 
                    <label className={styles.label}>평가양식</label>
                    <div className={styles.templateGroup}>
                        <input 
                            type="text" 
                            value={EvaluationForm1} 
                            readOnly 
                            className={styles.input}
                            onClick={() => handleInputClick(EvaluationForm1InputRef)} 
                            style={{ cursor: "pointer" }}
                        />
                        <input
                            type="file"
                            ref={EvaluationForm1InputRef} 
                            style={{ display: 'none' }} 
                            onChange={(e) => handleFileChange(e, setEvaluationForm1)} 
                        />
                    </div>
                </div>

                {/* 3. 평가 양식 2 (디자인 유지) */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}></label>
                    <div className={styles.templateGroup}> 
                        <input 
                            type="text" 
                            value={EvaluationForm2}
                            readOnly 
                            className={styles.input} 
                            onClick={() => handleInputClick(EvaluationForm2InputRef)} 
                            style={{ cursor: "pointer" }}
                        />
                        <input
                            type="file"
                            ref={EvaluationForm2InputRef} 
                            style={{ display: 'none' }} 
                            onChange={(e) => handleFileChange(e, setEvaluationForm2)} 
                        />
                    </div>
                </div>
                
                {/* ⭐ 4. 대상 부서 (데이터 매핑 수정) */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>대상부서</label>
                    <select 
                        name="targetDepartmentId" 
                        value={data.targetDepartmentId || ""} 
                        onChange={handleSelectChange} 
                        className={`${styles.input} ${styles.select}`}
                        style={{ color: data.targetDepartmentId ? "#333" : "#888" }}
                    >
                        {/* 안내 문구 (선택 불가) */}
                        <option value="" disabled>부서 선택</option>
                        {/* 전체 옵션 (선택 가능) */}
                        <option value="ALL">전체</option>
                        
                        {departments && departments.map((dept) => {
                            // ⭐ 백엔드 필드명 안전 처리 (id, teamName 등)
                            const id = dept.id || dept.departmentId || dept.deptId;
                            const name = dept.teamName || dept.departmentName || dept.name;
                            return (
                                <option key={id} value={id}>
                                    {name}
                                </option>
                            );
                        })}
                    </select>
                </div>

                {/* ⭐ 5. 직급 범위 (데이터 매핑 수정) */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>직급범위</label>
                    <select 
                        name="targetPositionId" 
                        value={data.targetPositionId || ""} 
                        onChange={handleSelectChange} 
                        className={`${styles.input} ${styles.select}`}
                        style={{ color: data.targetPositionId ? "#333" : "#888" }}
                    >
                        {/* 안내 문구 */}
                        <option value="" disabled>직급 선택</option>
                        {/* 전체 옵션 */}
                        <option value="ALL">전체</option>

                        {positions && positions.map((pos) => {
                            // ⭐ 백엔드 필드명 안전 처리 (id, positionName 등)
                            const id = pos.id || pos.positionId || pos.rankId;
                            const name = pos.positionName || pos.name || pos.rankName;
                            return (
                                <option key={id} value={id}>
                                    {name}
                                </option>
                            );
                        })}
                    </select>
                </div>
                
                {/* 6. 평가 매핑 (디자인 유지) */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>평가매핑</label>
                    <select 
                        name="mappingMethod" 
                        value={data.mappingMethod || "자동지정"} 
                        onChange={handleSelectChange} 
                        className={`${styles.input} ${styles.select}`}
                    >
                        <option value="자동지정">자동지정</option>
                        <option value="수동지정">수동지정</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default EvaluationSettings;