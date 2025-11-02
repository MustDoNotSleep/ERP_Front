import React, { useState, useEffect } from 'react';
import ApplyInputGrid from '../../../../components/HR/AppointmentApply/ApplyInputGrid';
import styles from './AppointmentApplyPage.module.css';
import { APPOINTMENT_TYPE } from '../../../../models/data/AppointmentApplyMOCK';
import { createAppointmentRequest } from '../../../../api/appointment';
import { fetchUniqueDepartmentNames } from '../../../../api/department';
import { fetchUniquePositionNames } from '../../../../api/position';

const AppointmentApplyPage = () => {
    
    const [formData, setFormData] = useState({
        targetEmployeeId: '', // 대상 직원 ID
        appointmentType: '', // 발령 유형
        effectiveDate: '', // 발령 일자
        newDepartmentName: '', // 새 부서명 (선택사항)
        newPositionName: '', // 새 직급명 (선택사항)
        reason: '', // 발령 사유
    });

    // API에서 가져온 데이터 (중복 제거된 이름 목록)
    const [departmentNames, setDepartmentNames] = useState([]);
    const [positionNames, setPositionNames] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // API 요청 중인지 확인하는 로딩 상태 추가
    const [isLoading, setIsLoading] = useState(false);

    const appointmentTypes = Object.values(APPOINTMENT_TYPE);

    // 컴포넌트 마운트 시 부서명/직급명 데이터 로드
    useEffect(() => {
        const loadData = async () => {
            try {
                const [deptNames, posNames] = await Promise.all([
                    fetchUniqueDepartmentNames(),
                    fetchUniquePositionNames(),
                ]);

                // API 응답에서 데이터 추출
                const deptList = deptNames.data || deptNames;
                const posList = posNames.data || posNames;

                setDepartmentNames(Array.isArray(deptList) ? deptList : []);
                setPositionNames(Array.isArray(posList) ? posList : []);
                
                console.log('📦 부서명 목록:', deptList);
                console.log('📦 직급명 목록:', posList);
            } catch (error) {
                console.error('❌ 부서명/직급명 데이터 로드 실패:', error);
                alert('부서 및 직급 정보를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // handleSubmit 함수
    const handleSubmit = async (e) => {
        e.preventDefault(); // 폼 기본 동작(새로고침) 방지
        
        // 필수 필드 검증
        if (!formData.targetEmployeeId || !formData.appointmentType || !formData.effectiveDate) {
            alert('대상 직원, 발령 유형, 발령 일자는 필수입니다.');
            return;
        }
        
        setIsLoading(true); // 로딩 상태 시작

        try {
            // 백엔드 API 스펙에 맞게 데이터 변환
            const requestPayload = {
                targetEmployeeId: parseInt(formData.targetEmployeeId),
                appointmentType: formData.appointmentType,
                effectiveDate: formData.effectiveDate,
                newDepartmentName: formData.newDepartmentName || null,
                newPositionName: formData.newPositionName || null,
                reason: formData.reason || '',
            };

            console.log('📋 인사발령 신청 데이터:', requestPayload);
            
            // createAppointmentRequest API 호출
            const response = await createAppointmentRequest(requestPayload);
            
            // 요청 성공 시
            console.log('✅ 인사발령 신청 성공:', response);
            alert('인사발령이 성공적으로 신청되었습니다.');
            handleCancel(); // 폼 초기화

        } catch (error) {
            // 요청 실패 시
            console.error('❌ 인사발령 신청 실패:', error);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || '신청 중 오류가 발생했습니다.';
            alert(errorMessage);
        
        } finally {
            // 성공/실패 여부와 관계없이 로딩 상태 종료
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        console.log('신청이 취소되었습니다.');
        setFormData({
            targetEmployeeId: '',
            appointmentType: '',
            effectiveDate: '',
            newDepartmentName: '',
            newPositionName: '',
            reason: ''
        });
    };

    if (loading) {
        return <div className={styles.container}>데이터 로딩 중...</div>;
    }

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit}>
                
                <ApplyInputGrid 
                    formData={formData}
                    handleChange={handleChange}
                    appointmentTypes={appointmentTypes}
                    departmentNames={departmentNames}
                    positionNames={positionNames}
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
                        disabled={isLoading} // 로딩 중일 때 입력 비활성화
                    />
                </div>
                
                <div className={styles.buttonGroup}>
                    <button 
                        type="button" 
                        onClick={handleCancel} 
                        className={styles.cancelButton}
                        disabled={isLoading} // 로딩 중일 때 버튼 비활성화
                    >
                        취소
                    </button>
                    <button 
                        type="submit" 
                        className={styles.submitButton}
                        disabled={isLoading} // 로딩 중일 때 버튼 비활성화
                    >
                        {/* 로딩 상태에 따라 버튼 텍스트 변경 */}
                        {isLoading ? '신청 중...' : '신청'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AppointmentApplyPage;