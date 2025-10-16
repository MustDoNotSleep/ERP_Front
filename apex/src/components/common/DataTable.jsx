// src/components/common/DataTable.jsx (재사용 가능한 이름으로 변경)

import React from 'react';
import styles from './DataTable.module.css'; // 범용적인 스타일 파일 사용

const DataTable = ({ headers, data, onRowClick, renderRow }) => {
    return (
        <div className={styles.tableContainer}>
            <table className={styles.genericTable}>
                <thead>
                    <tr>
                        {/* 외부에서 받은 헤더를 맵핑 */}
                        {headers.map((header, index) => (
                            <th key={index} className={styles.tableHeader}>
                                {header.label || header} 
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {/* 외부에서 받은 데이터를 맵핑 */}
                    {data.map((item, index) => (
                        <tr 
                            key={index} 
                            className={index % 2 === 0 ? styles.rowEven : styles.rowOdd}
                            onClick={() => onRowClick && onRowClick(item)} // 행 클릭 이벤트 추가
                        >
                            {/* 핵심: 각 행의 내용을 외부에서 정의한 함수로 렌더링 */}
                            {renderRow(item)} 
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;