import React, { useState } from 'react';
import { Modal } from '../../../components/common';
import { Input, Select, FormGroup } from '../../../components/common';
import { CERTIFICATE_TYPES } from '../../../models/data/CertificateIssueMOCK.js';
import styles from './CertificateRequestModal.module.css';

const CertificateRequestModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        certificateType: '',
        copies: 1,
        purpose: '',
        deliveryAddress: ''
    });

    const certificateOptions = Object.entries(CERTIFICATE_TYPES).map(([key, value]) => ({
        value: key,
        label: value
    }));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.certificateType) {
            alert('증명서 종류를 선택해주세요.');
            return;
        }
        
        if (formData.copies < 1) {
            alert('부수는 1 이상이어야 합니다.');
            return;
        }

        onSubmit(formData);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="증명서 신청"
        >
            <form onSubmit={handleSubmit} className={styles.form}>
                <FormGroup label="증명서 종류" required>
                    <Select
                        name="certificateType"
                        value={formData.certificateType}
                        onChange={handleChange}
                        options={certificateOptions}
                        placeholder="증명서를 선택하세요"
                        required
                    />
                </FormGroup>

                <FormGroup label="발급 부수" required>
                    <Input
                        type="number"
                        name="copies"
                        value={formData.copies}
                        onChange={handleChange}
                        min="1"
                        max="10"
                        required
                    />
                </FormGroup>

                <FormGroup label="용도">
                    <Input
                        type="text"
                        name="purpose"
                        value={formData.purpose}
                        onChange={handleChange}
                        placeholder="증명서 사용 용도를 입력하세요"
                    />
                </FormGroup>

                <FormGroup label="수령 주소">
                    <Input
                        type="text"
                        name="deliveryAddress"
                        value={formData.deliveryAddress}
                        onChange={handleChange}
                        placeholder="우편 수령 주소를 입력하세요 (선택)"
                    />
                </FormGroup>

                <div className={styles.buttonGroup}>
                    <button 
                        type="button" 
                        onClick={onClose}
                        className={styles.cancelButton}
                    >
                        취소
                    </button>
                    <button 
                        type="submit"
                        className={styles.submitButton}
                    >
                        신청
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default CertificateRequestModal;
