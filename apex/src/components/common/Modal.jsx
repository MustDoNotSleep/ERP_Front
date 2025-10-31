import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import styles from './Modal.module.css';

/**
 * Modal 컴포넌트
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  footer,
  children,
  className = ''
}) => {
  // ESC 키로 닫기
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalClasses = [
    styles['modal-container'],
    styles[`modal-${size}`],
    className
  ].filter(Boolean).join(' ');

  const modalContent = (
    <div className={styles['modal-overlay']} onClick={onClose}>
      <div className={modalClasses} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles['modal-header']}>
          <h2 className={styles['modal-title']}>{title}</h2>
          <button
            type="button"
            className={styles['modal-close']}
            onClick={onClose}
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div className={styles['modal-body']}>{children}</div>

        {/* Modal Footer */}
        {footer && <div className={styles['modal-footer']}>{footer}</div>}
      </div>
    </div>
  );

  // Portal을 사용하여 body에 직접 렌더링
  return ReactDOM.createPortal(modalContent, document.body);
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  footer: PropTypes.node,
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default Modal;
