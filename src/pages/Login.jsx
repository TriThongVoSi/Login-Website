/**
 * Login Page - Trang đăng nhập với giao diện thiên nhiên
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { validatePassword, validateRequired } from '../utils/validate';
import Button from '../components/Button';
import Input from '../components/Input';
import { ROUTES } from '../constants/routes';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading, error, clearError } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Loading state for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else {
        // Default redirect
        navigate(ROUTES.USER_DASHBOARD, { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, navigate, location.state]);

  // Clear auth error when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Handle input changes
  const handleInputChange = (field) => (value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Clear auth error when user changes input
    if (error) {
      clearError();
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Validate username
    if (!validateRequired(formData.username)) {
      newErrors.username = 'Tên đăng nhập không được để trống';
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    // BE không yêu cầu chọn role khi đăng nhập

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await login(formData.username, formData.password);
      navigate(ROUTES.USER_DASHBOARD, { replace: true });
      
    } catch (err) {
      console.error('Login error:', err);
      // Error is handled by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading spinner during auth check
  if (isLoading) {
    return (
      <div className="login">
        <div className="login__loading">
          <div className="login__loading-spinner">
            <svg viewBox="0 0 24 24" fill="none">
              <circle 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="31.416"
                strokeDashoffset="31.416"
              />
            </svg>
          </div>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login">
      <div className="login__background">
        {/* Decorative elements */}
        <div className="login__decoration login__decoration--1"></div>
        <div className="login__decoration login__decoration--2"></div>
        <div className="login__decoration login__decoration--3"></div>
      </div>

      <div className="login__container">
        <div className="login__card">
          <div className="login__header">
            <div className="login__logo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 9 5.16-.74 9-4.45 9-10V7l-10-5z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
            </div>
            <h1 className="login__title">Đăng nhập hệ thống</h1>
            <p className="login__subtitle">
              Chào mừng bạn quay trở lại! Vui lòng đăng nhập để tiếp tục.
            </p>
          </div>

          <form className="login__form" onSubmit={handleSubmit}>
            <Input
              type="text"
              label="Tên đăng nhập"
              placeholder="Nhập tên đăng nhập của bạn"
              value={formData.username}
              onChange={handleInputChange('username')}
              error={errors.username}
              required
            />

            <Input
              type="password"
              label="Mật khẩu"
              placeholder="Nhập mật khẩu của bạn"
              value={formData.password}
              onChange={handleInputChange('password')}
              error={errors.password}
              required
            />

            {/* Role selection is not required */}

            {error && (
              <div className="login__error">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="large"
              loading={isSubmitting}
              disabled={isSubmitting}
              className="login__submit-btn"
            >
              {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </form>

          <div className="login__footer">
            <div className="login__demo-info">
              <h4>Thông tin đăng nhập:</h4>
              <p>Vui lòng dùng tên đăng nhập và mật khẩu do backend cung cấp.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
