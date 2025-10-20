import React, { useState } from 'react';
import ApplyInputGrid from '../../../../components/HR/AppointmentApply/ApplyInputGrid';
import styles from './AppointmentApplyPage.module.css';
import { APPOINTMENT_TYPE } from '../../../../models/data/AppointmentApplyMOCK';

const AppointmentApplyPage = () => {
    
    const [formData, setFormData] = useState({
        employeeId: '', name: '', department: '',
        appointmentType: '', startDate: '', endDate: '', reason: '',
    });

    const appointmentTypes = Object.values(APPOINTMENT_TYPE);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('🧑‍💼 인사발령 신청 데이터:', formData);
        alert('인사발령이 성공적으로 신청되었습니다.');
        handleCancel();
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
                    />
                </div>
                
                <div className={styles.buttonGroup}>
                    <button type="button" onClick={handleCancel} className={styles.cancelButton}>
                        취소
                    </button>
                    <button type="submit" className={styles.submitButton}>
                        신청
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AppointmentApplyPage;