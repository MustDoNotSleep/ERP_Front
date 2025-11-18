import React, { useState } from 'react';
import styles from './TrainingCreate.module.css';
import TrainingCourseInputGrid from '../../../components/HR/career&edu/TrainingInputGrid';
import { createCourse } from '../../../api/course';

const TrainingCreate = () => {
    // 폼 데이터 상태 정의
    const [formData, setFormData] = useState({
        courseName: '',          // 교육명
        completionCriteria: '', // 이수기준
        capacity: '',            // 교육정원
        courseType: '',          // 교육유형 (필수/선택)
        startDate: '',           // 교육기간 시작일
        endDate: '',             // 교육기간 종료일
        goal: '',                // 교육목표 (대형 텍스트 영역)
    });

    // API 요청 로딩 상태
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    // handleSubmit 함수
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 필수 필드 검증
        if (!formData.courseName || !formData.courseType || !formData.startDate || !formData.endDate) {
            alert('교육명, 교육유형, 교육기간은 필수입니다.');
            return;
        }
        
        setIsLoading(true);

        try {
            // 백엔드 API 스펙에 맞게 데이터 변환
            const requestPayload = {
                courseName: formData.courseName,
                completionCriteria: formData.completionCriteria || null,
                capacity: formData.capacity ? parseInt(formData.capacity) : null,
                courseType: formData.courseType,
                startDate: formData.startDate,
                endDate: formData.endDate,
                goal: formData.goal || null,
            };

            console.log('� 교육과정 등록 데이터:', requestPayload);
            
            // createCourse API 호출
            const response = await createCourse(requestPayload);

            console.log('✅ 교육과정 등록 성공:', response);
            alert('교육과정이 성공적으로 등록되었습니다!');
            handleCancel(); // 폼 초기화

        } catch (error) {
            console.error('❌ 교육과정 등록 실패:', error);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || '등록 중 오류가 발생했습니다.';
            alert(errorMessage);

        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        console.log('등록 취소');
        setFormData({ 
            courseName: '', completionCriteria: '', capacity: '', 
            courseType: '', startDate: '', endDate: '', goal: '' 
        });
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit}>
                
                {/* 1. 입력 필드 컴포넌트 */}
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
                    placeholder="교육 목표를 자세히 입력해주세요."
                    disabled={isLoading}
                />
                
                {/* 3. 버튼 영역 */}
                <div className={styles.buttonGroup}>
                    <button 
                        type="button" 
                        onClick={handleCancel} 
                        className={styles.cancelButton}
                        disabled={isLoading}
                    >
                        취소
                    </button>
                    <button 
                        type="submit" 
                        className={styles.submitButton}
                        disabled={isLoading}
                    >
                        {isLoading ? '등록 중...' : '등록'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TrainingCreate;