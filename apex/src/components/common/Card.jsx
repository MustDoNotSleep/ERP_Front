import React from 'react';
import PropTypes from 'prop-types';
import styles from './Card.module.css';

/**
 * Card 컴포넌트
 */
export const Card = ({
  header,
  footer,
  variant = 'default',
  className = '',
  children
}) => {
  const cardClasses = [
    styles.card,
    variant === 'elevated' && styles['card-elevated'],
    variant === 'bordered' && styles['card-bordered'],
    variant === 'flat' && styles['card-flat'],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses}>
      {header && <div className={styles['card-header']}>{header}</div>}
      <div className={styles['card-body']}>{children}</div>
      {footer && <div className={styles['card-footer']}>{footer}</div>}
    </div>
  );
};

Card.propTypes = {
  header: PropTypes.node,
  footer: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'elevated', 'bordered', 'flat']),
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

/**
 * CardTitle 컴포넌트
 */
export const CardTitle = ({ children, className = '' }) => {
  return <h3 className={`${styles['card-title']} ${className}`}>{children}</h3>;
};

CardTitle.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

/**
 * FilterCard 컴포넌트 (검색 필터용)
 */
export const FilterCard = ({
  title,
  description,
  onSearch,
  onReset,
  children,
  className = ''
}) => {
  const cardClasses = [
    styles['filter-card'],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses}>
      {title && <div className={styles['filter-title']}>{title}</div>}
      {description && <div className={styles['filter-description']}>{description}</div>}
      <div className={styles['filter-content']}>
        {children}
        <div className={styles['filter-actions']}>
          {onReset && (
            <button
              type="button"
              className="btn btn-light btn-md"
              onClick={onReset}
            >
              초기화
            </button>
          )}
          {onSearch && (
            <button
              type="button"
              className="btn btn-primary btn-md"
              onClick={onSearch}
            >
              검색
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

FilterCard.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  onSearch: PropTypes.func,
  onReset: PropTypes.func,
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

/**
 * FilterGroup 컴포넌트 (레이블 + 입력 필드)
 */
export const FilterGroup = ({ label, children, className = '' }) => {
  const groupClasses = [
    styles['filter-group'],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={groupClasses}>
      {label && <label className={styles['filter-label']}>{label}</label>}
      {children}
    </div>
  );
};

FilterGroup.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};
