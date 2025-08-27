/**
 * Input component tái sử dụng với thiết kế thiên nhiên
 */

import React, { useState, forwardRef } from 'react';
import './Input.css';

const Input = forwardRef(({ 
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  disabled = false,
  required = false,
  className = '',
  icon,
  size = 'medium',
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;
  
  const containerClass = [
    'input-container',
    `input-container--${size}`,
    isFocused ? 'input-container--focused' : '',
    error ? 'input-container--error' : '',
    disabled ? 'input-container--disabled' : '',
    value ? 'input-container--has-value' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClass}>
      {label && (
        <label className="input__label">
          {label}
          {required && <span className="input__required">*</span>}
        </label>
      )}
      
      <div className="input__wrapper">
        {icon && !value && (
          <div className="input__icon input__icon--left">
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          type={inputType}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`input__field ${icon && !value ? 'input__field--with-icon' : ''}`}
          {...props}
        />
        
        {type === 'password' && (
          <button
            type="button"
            className="input__icon input__icon--right input__password-toggle"
            onClick={togglePasswordVisibility}
            disabled={disabled}
            tabIndex={-1}
          >
            {showPassword ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        )}
      </div>
      
      {error && (
        <div className="input__error">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
