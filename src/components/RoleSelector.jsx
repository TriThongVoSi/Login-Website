/**
 * RoleSelector component - Chọn quyền đăng nhập (Admin/User)
 */

import React from 'react';
import './RoleSelector.css';

const RoleSelector = ({ 
  value,
  onChange,
  disabled = false,
  error,
  label = "Chọn quyền đăng nhập",
  required = false
}) => {
  const roles = [
    {
      value: 'admin',
      label: 'Quản trị viên',
      description: 'Quyền quản lý toàn bộ hệ thống',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="8.5" cy="7" r="4"/>
          <polyline points="17,11 19,13 23,9"/>
        </svg>
      )
    },
    {
      value: 'user',
      label: 'Người dùng',
      description: 'Quyền sử dụng cơ bản',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      )
    }
  ];

  const handleRoleChange = (roleValue) => {
    if (!disabled) {
      onChange(roleValue);
    }
  };

  const containerClass = [
    'role-selector',
    disabled ? 'role-selector--disabled' : '',
    error ? 'role-selector--error' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClass}>
      {label && (
        <div className="role-selector__label">
          {label}
          {required && <span className="role-selector__required">*</span>}
        </div>
      )}
      
      <div className="role-selector__options">
        {roles.map((role) => (
          <div
            key={role.value}
            className={`role-option ${value === role.value ? 'role-option--selected' : ''}`}
            onClick={() => handleRoleChange(role.value)}
          >
            <div className="role-option__radio">
              <input
                type="radio"
                name="role"
                value={role.value}
                checked={value === role.value}
                onChange={() => handleRoleChange(role.value)}
                disabled={disabled}
                className="role-option__input"
              />
              <div className="role-option__radio-custom">
                <div className="role-option__radio-dot"></div>
              </div>
            </div>
            
            <div className="role-option__content">
              <div className="role-option__header">
                <div className="role-option__icon">
                  {role.icon}
                </div>
                <div className="role-option__title">
                  {role.label}
                </div>
              </div>
              <div className="role-option__description">
                {role.description}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {error && (
        <div className="role-selector__error">
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
};

export default RoleSelector;
