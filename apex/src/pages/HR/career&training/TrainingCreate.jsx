import React, { useState } from 'react';
import styles from './TrainingCreate.module.css';
import TrainingCourseInputGrid from '../../../components/HR/career&edu/TrainingInputGrid';
import axios from 'axios'; // 1. axios import

// 2. 알려주신 API 엔드포인트 URL
const API_URL = 'https://xtjea0rsb6.execute-api.ap-northeast-2.amazonaws.com/dev/erp-education';

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

    // 3. API 요청 로딩 상태 추가
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    // 4. (핵심) handleSubmit 함수 수정
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // 로딩 시작

        try {
            // 5. API로 formData를 POST 방식으로 전송
            const response = await axios.post(API_URL, formData);

            console.log('🐥 교육과정 등록 성공:', response.data);
            alert('교육과정이 등록되었습니다! 삐약!');
            handleCancel(); // 성공 시 폼 초기화

        } catch (error) {
            // 6. API 요청 실패 시
            console.error('❌ 교육과정 등록 실패:', error);
            alert('등록 중 오류가 발생했습니다. 관리자에게 문의하세요.');

        } finally {
            // 7. 성공/실패와 관계없이 로딩 종료
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
                    required
                    disabled={isLoading} // 8. 로딩 중 비활성화
                />
                
                {/* 3. 버튼 영역 */}
                <div className={styles.buttonGroup}>
                    <button 
                        type="button" 
                        onClick={handleCancel} 
                        className={styles.cancelButton}
                        disabled={isLoading} // 9. 로딩 중 비활성화
                    >
                        취소
                    </button>
                    <button 
                        type="submit" 
                        className={styles.submitButton}
                        disabled={isLoading} // 10. 로딩 중 비활성화
                    >
                        {/* 11. 로딩 상태에 따라 텍스트 변경 */}
                        {isLoading ? '등록 중...' : '등록'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TrainingCreate;