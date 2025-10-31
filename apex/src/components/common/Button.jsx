import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.module.css';

/**
 * 통일된 Button 컴포넌트
 * 
 * @param {object} props
 * @param {string} props.variant - 버튼 스타일 (primary, secondary, outline, ghost, light, success, warning, danger)
 * @param {string} props.size - 버튼 크기 (sm, md, lg)
 * @param {boolean} props.block - 전체 너비 여부
 * @param {boolean} props.disabled - 비활성화 여부
 * @param {boolean} props.loading - 로딩 상태
 * @param {boolean} props.icon - 아이콘 전용 버튼 여부
 * @param {function} props.onClick - 클릭 이벤트 핸들러
 * @param {string} props.type - 버튼 타입 (button, submit, reset)
 * @param {string} props.className - 추가 CSS 클래스
 * @param {React.ReactNode} props.children - 버튼 내용
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  block = false,
  disabled = false,
  loading = false,
  icon = false,
  onClick,
  type = 'button',
  className = '',
  children,
  ...rest
}) => {
  const buttonClasses = [
    styles.btn,
    styles[`btn-${variant}`],
    styles[`btn-${size}`],
    block && styles['btn-block'],
    icon && styles['btn-icon'],
    loading && styles['btn-loading'],
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...rest}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'outline',
    'ghost',
    'light',
    'success',
    'warning',
    'danger'
  ]),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  block: PropTypes.bool,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  icon: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

export default Button;
