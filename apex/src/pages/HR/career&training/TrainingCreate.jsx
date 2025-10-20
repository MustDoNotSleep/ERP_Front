import React, { useState } from 'react';
import styles from './TrainingCreate.module.css';
import TrainingCourseInputGrid from '../../../components/HR/career&edu/TrainingInputGrid';

const TrainingCreate = () => {
    // 폼 데이터 상태 정의
    const [formData, setFormData] = useState({
        courseName: '',      // 교육명
        completionCriteria: '', // 이수기준
        capacity: '',           // 교육정원
        courseType: '',         // 교육유형 (필수/선택)
        startDate: '',          // 교육기간 시작일
        endDate: '',            // 교육기간 종료일
        goal: '',               // 교육목표 (대형 텍스트 영역)
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('🐥 교육과정 등록 데이터:', formData);
        // TODO: 백엔드 API (POST) 호출 로직
        alert('교육과정이 등록되었습니다! 삐약!');
        // 폼 초기화 로직...
    };

    const handleCancel = () => {
        console.log('등록 취소');
        // 초기화 또는 페이지 이동 로직
        setFormData({ 
            courseName: '', completionCriteria: '', capacity: '', 
            courseType: '', startDate: '', endDate: '', goal: '' 
        });
    };

    return (
         <div className={styles.container}>
            <form onSubmit={handleSubmit}>
                
                {/* 1. ✨ 분리된 입력 필드 컴포넌트를 사용 */}
                <TrainingCourseInputGrid 
                    formData={formData}
                    handleChange={handleChange}
                />
                
                {/* 2. 교육 목표 텍스트 영역 */}
                <h3 className={styles.sectionTitle}>교육목표</h3>
                <textarea 
                    name="goal" 
                    value={formData.goal} 
                    onChange={handleChange} 
                    className={styles.textarea} 
                    rows="8"
                    required
                />
                
                {/* 3. 버튼 영역 */}
                <div className={styles.buttonGroup}>
                    <button type="button" onClick={handleCancel} className={styles.cancelButton}>
                        취소
                    </button>
                    <button type="submit" className={styles.submitButton}>
                        등록
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TrainingCreate;