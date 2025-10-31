import React from 'react';
import PropTypes from 'prop-types';
import styles from './Input.module.css';

/**
 * Input 컴포넌트
 */
export const Input = ({
  type = 'text',
  size = 'md',
  error = false,
  success = false,
  disabled = false,
  placeholder = '',
  value,
  onChange,
  className = '',
  ...rest
}) => {
  const inputClasses = [
    styles.input,
    styles[`input-${size}`],
    error && styles['input-error'],
    success && styles['input-success'],
    className
  ].filter(Boolean).join(' ');

  return (
    <input
      type={type}
      className={inputClasses}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      {...rest}
    />
  );
};

Input.propTypes = {
  type: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  error: PropTypes.bool,
  success: PropTypes.bool,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  className: PropTypes.string
};

/**
 * Select 컴포넌트
 */
export const Select = ({
  size = 'md',
  disabled = false,
  value,
  onChange,
  options = [],
  placeholder = '선택하세요',
  className = '',
  ...rest
}) => {
  const selectClasses = [
    styles.select,
    styles[`select-${size}`],
    className
  ].filter(Boolean).join(' ');

  return (
    <select
      className={selectClasses}
      value={value}
      onChange={onChange}
      disabled={disabled}
      {...rest}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

Select.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired
    })
  ),
  placeholder: PropTypes.string,
  className: PropTypes.string
};

/**
 * Textarea 컴포넌트
 */
export const Textarea = ({
  disabled = false,
  placeholder = '',
  value,
  onChange,
  rows = 4,
  className = '',
  ...rest
}) => {
  const textareaClasses = [
    styles.textarea,
    className
  ].filter(Boolean).join(' ');

  return (
    <textarea
      className={textareaClasses}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      rows={rows}
      {...rest}
    />
  );
};

Textarea.propTypes = {
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  rows: PropTypes.number,
  className: PropTypes.string
};

/**
 * FormGroup 컴포넌트 (Label + Input/Select 조합)
 */
export const FormGroup = ({
  label,
  required = false,
  error = '',
  helpText = '',
  children,
  className = ''
}) => {
  const groupClasses = [
    styles.formGroup,
    className
  ].filter(Boolean).join(' ');

  const labelClasses = [
    styles.label,
    required && styles['label-required']
  ].filter(Boolean).join(' ');

  return (
    <div className={groupClasses}>
      {label && <label className={labelClasses}>{label}</label>}
      {children}
      {error && <span className={styles.errorText}>{error}</span>}
      {!error && helpText && <span className={styles.helpText}>{helpText}</span>}
    </div>
  );
};

FormGroup.propTypes = {
  label: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.string,
  helpText: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};
