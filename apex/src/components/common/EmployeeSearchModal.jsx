import React, { useState, useEffect } from 'react';
import styles from './EmployeeSearchModal.module.css';
import { searchEmployees } from '../../api/employee';

const EmployeeSearchModal = ({ isOpen, onClose, onSelectEmployee }) => {
    const [searchType, setSearchType] = useState('name'); // name, id, departmentName
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // 모달이 열릴 때 초기화
    useEffect(() => {
        if (isOpen) {
            setSearchKeyword('');
            setSearchResults([]);
        }
    }, [isOpen]);

    // 검색 실행
    const handleSearch = async () => {
        if (!searchKeyword.trim()) {
            alert('검색어를 입력해주세요.');
            return;
        }

        setLoading(true);
        try {
            // searchEmployees는 (searchParams, page, size) 형태로 호출해야 함
            const searchParams = {
                [searchType]: searchKeyword.trim()
            };
            
            console.log('🔍 직원 검색 요청:', { searchType, searchKeyword, searchParams });
            
            const response = await searchEmployees(searchParams, 0, 100);
            
            console.log('📦 검색 응답:', response);
            
            let results = response.data?.content || response.content || response.data || [];
            
            // 사번 검색일 경우 정확히 일치하는 것만 필터링
            if (searchType === 'id') {
                const searchId = searchKeyword.trim();
                results = results.filter(emp => emp.id?.toString() === searchId);
            }
            
            setSearchResults(Array.isArray(results) ? results : []);
            
            if (results.length === 0) {
                alert('검색 결과가 없습니다.');
            }
        } catch (error) {
            console.error('❌ 직원 검색 실패:', error);
            alert('직원 검색 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 직원 선택
    const handleSelectEmployee = (employee) => {
        onSelectEmployee(employee);
        onClose();
    };

    // Enter 키로 검색
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>직원 검색</h2>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>

                <div className={styles.searchSection}>
                    <select 
                        value={searchType} 
                        onChange={(e) => setSearchType(e.target.value)}
                        className={styles.searchTypeSelect}
                    >
                        <option value="name">이름</option>
                        <option value="id">사번</option>
                        <option value="departmentName">부서</option>
                    </select>

                    <input
                        type="text"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={`${searchType === 'name' ? '이름' : searchType === 'id' ? '사번' : '부서명'}을 입력하세요`}
                        className={styles.searchInput}
                    />

                    <button 
                        onClick={handleSearch} 
                        className={styles.searchButton}
                        disabled={loading}
                    >
                        {loading ? '검색 중...' : '검색'}
                    </button>
                </div>

                <div className={styles.resultsSection}>
                    {searchResults.length > 0 ? (
                        <table className={styles.resultsTable}>
                            <thead>
                                <tr>
                                    <th>사번</th>
                                    <th>이름</th>
                                    <th>부서</th>
                                    <th>직급</th>
                                    <th>선택</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchResults.map((employee) => (
                                    <tr key={employee.id}>
                                        <td>{employee.id}</td>
                                        <td>{employee.name}</td>
                                        <td>{employee.departmentName || '-'}</td>
                                        <td>{employee.positionName || '-'}</td>
                                        <td>
                                            <button
                                                className={styles.selectButton}
                                                onClick={() => handleSelectEmployee(employee)}
                                            >
                                                선택
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className={styles.emptyMessage}>
                            검색 버튼을 눌러 직원을 검색하세요.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployeeSearchModal;
