import React, { useState } from 'react';
import ApplyInputGrid from '../../../../components/HR/AppointmentApply/ApplyInputGrid';
import styles from './AppointmentApplyPage.module.css';
import { APPOINTMENT_TYPE } from '../../../../models/data/AppointmentApplyMOCK';
import axios from 'axios'; // 1. axios 라이브러리 import

// 2. 알려주신 API 엔드포인트 URL
// (주의: URL 마지막이 'erp-appointmen'이 맞는지 다시 한번 확인해 보세요!)
const API_ENDPOINT_URL = 'https://xtjea0rsb6.execute-api.ap-northeast-2.amazonaws.com/dev/erp-appointment';

const AppointmentApplyPage = () => {
    
    const [formData, setFormData] = useState({
        employeeId: '', name: '', department: '',
        appointmentType: '', startDate: '', endDate: '', reason: '',
    });

    // 3. API 요청 중인지 확인하는 로딩 상태 추가
    const [isLoading, setIsLoading] = useState(false);

    const appointmentTypes = Object.values(APPOINTMENT_TYPE);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 4. handleSubmit 함수를 async (비동기) 함수로 변경
    const handleSubmit = async (e) => {
        e.preventDefault(); // 폼 기본 동작(새로고침) 방지
        setIsLoading(true); // 로딩 상태 시작

        try {
            // 5. API_ENDPOINT_URL로 formData를 POST 방식으로 전송
            const response = await axios.post(API_ENDPOINT_URL, formData);
            
            // 6. 요청 성공 시
            console.log('🧑‍💼 API 요청 성공:', response.data);
            alert('인사발령이 성공적으로 신청되었습니다.');
            handleCancel(); // 폼 초기화

        } catch (error) {
            // 7. 요청 실패 시
            console.error('❌ 인사발령 신청 실패:', error);
            alert('신청 중 오류가 발생했습니다. 관리자에게 문의하세요.');
        
        } finally {
            // 8. 성공/실패 여부와 관계없이 로딩 상태 종료
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        console.log('신청이 취소되었습니다.');
        setFormData({
            employeeId: '', name: '', department: '',
            appointmentType: '', startDate: '', endDate: '', reason: ''
        });
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit}>
                
                <ApplyInputGrid 
                    formData={formData}
                    handleChange={handleChange}
                    appointmentTypes={appointmentTypes}
                />
                
                <div className={styles.reasonSection}>
                    <h3 className={styles.sectionTitle}>발령 사유</h3>
                    <textarea 
                        name="reason" 
                        value={formData.reason} 
                        onChange={handleChange} 
                        className={styles.textarea}
                        placeholder="발령 사유를 자세히 입력해주세요. (예: 프로젝트 인력 충원, 정기 승진 등)"
                        required
                        disabled={isLoading} // 9. 로딩 중일 때 입력 비활성화
                    />
                </div>
                
                <div className={styles.buttonGroup}>
                    <button 
                        type="button" 
                        onClick={handleCancel} 
                        className={styles.cancelButton}
                        disabled={isLoading} // 10. 로딩 중일 때 버튼 비활성화
                    >
                        취소
                    </button>
                    <button 
                        type="submit" 
                        className={styles.submitButton}
                        disabled={isLoading} // 11. 로딩 중일 때 버튼 비활성화
                    >
                        {/* 12. 로딩 상태에 따라 버튼 텍스트 변경 */}
                        {isLoading ? '신청 중...' : '신청'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AppointmentApplyPage;