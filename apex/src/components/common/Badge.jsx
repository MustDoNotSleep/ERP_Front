import React from 'react';
import PropTypes from 'prop-types';
import styles from './Badge.module.css';

/**
 * Badge 컴포넌트
 */
export const Badge = ({
  variant = 'primary',
  size = 'md',
  children,
  className = ''
}) => {
  const badgeClasses = [
    styles.badge,
    styles[`badge-${variant}`],
    size !== 'md' && styles[`badge-${size}`],
    className
  ].filter(Boolean).join(' ');

  return <span className={badgeClasses}>{children}</span>;
};

Badge.propTypes = {
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'warning',
    'error',
    'info',
    'light'
  ]),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

/**
 * Tag 컴포넌트 (제거 가능한 태그)
 */
export const Tag = ({ children, onRemove, className = '' }) => {
  const tagClasses = [styles.tag, className].filter(Boolean).join(' ');

  return (
    <span className={tagClasses}>
      {children}
      {onRemove && (
        <button
          type="button"
          className={styles['tag-close']}
          onClick={onRemove}
          aria-label="제거"
        >
          ×
        </button>
      )}
    </span>
  );
};

Tag.propTypes = {
  children: PropTypes.node.isRequired,
  onRemove: PropTypes.func,
  className: PropTypes.string
};

/**
 * Divider 컴포넌트
 */
export const Divider = ({ vertical = false, className = '' }) => {
  const dividerClasses = [
    vertical ? styles['divider-vertical'] : styles.divider,
    className
  ].filter(Boolean).join(' ');

  return <div className={dividerClasses} />;
};

Divider.propTypes = {
  vertical: PropTypes.bool,
  className: PropTypes.string
};

/**
 * Status 컴포넌트 (상태 표시)
 */
export const Status = ({ status = 'active', children, className = '' }) => {
  const statusClasses = [
    styles.status,
    styles[`status-${status}`],
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={statusClasses}>
      <span className={styles['status-dot']} />
      {children}
    </span>
  );
};

Status.propTypes = {
  status: PropTypes.oneOf(['active', 'pending', 'inactive', 'error']),
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};
